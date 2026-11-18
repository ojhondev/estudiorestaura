"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildStrokes, fitCam, GROUND, GROUP_WINDOWS, project, TARGETS } from "@/lib/cathedral";

/**
 * "O escritório": a tela fica parada enquanto o usuário rola. O texto vai se revelando palavra por palavra,
 * uma catedral é desenhada em croqui (perspectiva, traço de lápis) e anotações à mão — rascunho de um
 * projeto de restauro e decoração interna — vão sendo escritas ao lado, com setas para cada parte.
 * Tudo é atualizado direto no DOM (sem re-render) a cada quadro de rolagem.
 */

type NoteDef = { key: keyof typeof TARGETS; lines: string[]; side: "l" | "r"; x: number; y: number };

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const INK = "#1d1d1d";
const PENCIL = "#c7452d";

const LAYOUTS = {
  desktop: {
    vb: [1100, 740] as const,
    box: { w: 640, h: 680, cx: 560, cy: 385 },
    fs: 27,
    notes: [
      { key: "torre", lines: ["restauro da cantaria", "e da cobertura"], side: "l", x: 345, y: 70 },
      { key: "coluna", lines: ["colunas", "e capitéis"], side: "l", x: 330, y: 330 },
      { key: "parede", lines: ["prospecção", "estratigráfica"], side: "l", x: 335, y: 480 },
      { key: "portico", lines: ["portais e", "esquadrias"], side: "l", x: 370, y: 640 },
      { key: "cupula", lines: ["pinturas murais", "e douração"], side: "r", x: 805, y: 110 },
      { key: "rosacea", lines: ["restauro dos", "vitrais"], side: "r", x: 870, y: 270 },
      { key: "nave", lines: ["projeto", "luminotécnico"], side: "r", x: 890, y: 410 },
      { key: "altar", lines: ["altar-mor e", "decoração interna"], side: "r", x: 860, y: 560 },
    ] as NoteDef[],
  },
  mobile: {
    vb: [600, 660] as const,
    box: { w: 340, h: 540, cx: 318, cy: 345 },
    fs: 30,
    notes: [
      { key: "cupula", lines: ["pinturas", "murais"], side: "r", x: 440, y: 110 },
      { key: "rosacea", lines: ["vitrais"], side: "l", x: 135, y: 300 },
      { key: "nave", lines: ["iluminação"], side: "r", x: 490, y: 400 },
      { key: "coluna", lines: ["colunas"], side: "l", x: 135, y: 450 },
      { key: "altar", lines: ["altar-mor"], side: "r", x: 495, y: 570 },
    ] as NoteDef[],
  },
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function OfficeScroll({ text, label = "O escritório" }: { text: string; label?: string }) {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const noteBox = useRef<Record<string, { x: number; y: number; w: number; h: number }>>({});

  const [mobile, setMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [measured, setMeasured] = useState(0);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  const L = mobile ? LAYOUTS.mobile : LAYOUTS.desktop;
  const cam = useMemo(() => fitCam(L.box), [L]);
  const strokes = useMemo(() => buildStrokes(cam), [cam]);

  // sombreado do chão: riscos curtos, mais densos perto do centro
  const hatch = useMemo(() => {
    const rand = seeded(5);
    const c = GROUND.map((g) => project(g, cam));
    const xs = c.map((p) => p[0]);
    const ys = c.map((p) => p[1]);
    const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const out: { x: number; y: number; l: number; d: number }[] = [];
    let guard = 0;
    while (out.length < (mobile ? 90 : 150) && guard++ < 6000) {
      const x = x0 + rand() * (x1 - x0);
      const y = y0 + rand() * (y1 - y0);
      const r = Math.hypot((x - cx) / ((x1 - x0) / 2), (y - cy) / ((y1 - y0) / 2));
      if (r > 0.98 || rand() < r * r * 0.8) continue;
      out.push({ x, y, l: 9 + rand() * 11, d: r });
    }
    return out;
  }, [cam, mobile]);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // mede as anotações (precisa da fonte carregada) para a "escrita" e o sublinhado
  useEffect(() => {
    const root = svg.current;
    if (!root) return;
    let dead = false;
    const measure = () => {
      if (dead) return;
      L.notes.forEach((n) => {
        const t = root.querySelector<SVGTextElement>(`[data-note="${n.key}"]`);
        if (!t) return;
        const b = t.getBBox();
        noteBox.current[n.key] = { x: b.x, y: b.y, w: b.width, h: b.height };
      });
      setMeasured((m) => m + 1);
    };
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    (fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(measure));
    return () => {
      dead = true;
    };
  }, [L]);

  // desenho + rolagem
  useEffect(() => {
    const root = svg.current;
    const wr = wrap.current;
    const st = stage.current;
    if (!root || !wr || !st) return;

    const S = Array.from(root.querySelectorAll<SVGPathElement>("[data-s]"));
    const H = Array.from(root.querySelectorAll<SVGPathElement>("[data-h]"));
    const extras = root.querySelector<SVGGElement>("[data-extras]");

    // setas: geometria fixa (câmera fixa), calculada uma vez
    const noteEls = L.notes.map((n) => {
      const el = {
        n,
        arrow: root.querySelector<SVGPathElement>(`[data-arrow="${n.key}"]`)!,
        clip: root.querySelector<SVGRectElement>(`[data-clip="${n.key}"]`)!,
        text: root.querySelector<SVGTextElement>(`[data-note="${n.key}"]`)!,
        squig: root.querySelector<SVGPathElement>(`[data-squig="${n.key}"]`)!,
        dot: root.querySelector<SVGCircleElement>(`[data-dot="${n.key}"]`)!,
        start: Math.min(0.82, GROUP_WINDOWS[TARGETS[n.key].g]![0] + 0.07),
      };
      const [hx, hy] = project(TARGETS[n.key].p, cam);
      const fs = L.fs;
      const lineH = fs;
      const tail: [number, number] = [n.side === "l" ? n.x + 12 : n.x - 12, n.y + ((n.lines.length - 1) * lineH) / 2 - fs * 0.3];
      const dx = hx - tail[0];
      const dy = hy - tail[1];
      const len = Math.hypot(dx, dy) || 1;
      const curve = len * 0.2 * (n.side === "l" ? 1 : -1);
      const cx = (tail[0] + hx) / 2 - (dy / len) * curve;
      const cy = (tail[1] + hy) / 2 + (dx / len) * curve;
      const ang = Math.atan2(hy - cy, hx - cx);
      const ex = hx - Math.cos(ang) * 5;
      const ey = hy - Math.sin(ang) * 5;
      const h1 = [ex - Math.cos(ang - 0.5) * 11, ey - Math.sin(ang - 0.5) * 11];
      const h2 = [ex - Math.cos(ang + 0.5) * 11, ey - Math.sin(ang + 0.5) * 11];
      el.arrow.setAttribute(
        "d",
        `M${tail[0].toFixed(1)} ${tail[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}M${h1[0].toFixed(1)} ${h1[1].toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${h2[0].toFixed(1)} ${h2[1].toFixed(1)}`,
      );
      el.dot.setAttribute("cx", hx.toFixed(1));
      el.dot.setAttribute("cy", hy.toFixed(1));
      const bb = noteBox.current[n.key];
      if (bb) {
        el.clip.setAttribute("x", String(bb.x - 4));
        el.clip.setAttribute("y", String(bb.y - 4));
        el.clip.setAttribute("height", String(bb.h + 8));
        const y = bb.y + bb.h + 1;
        const w = bb.w * 0.78;
        const x = n.side === "l" ? bb.x + bb.w - w : bb.x;
        const seg = w / 8;
        let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
        for (let k = 0; k < 8; k++) d += `q${(seg / 2).toFixed(1)} ${k % 2 ? 3 : -3} ${seg.toFixed(1)} 0`;
        el.squig.setAttribute("d", d);
      }
      return el;
    });

    // fim real da animação: último traço, última anotação (e o carimbo, no desktop)
    const pEnd = Math.max(0.85, ...noteEls.map((e) => e.start + 0.13), extras ? 0.96 : 0) + 0.05; // +0.05: breve pausa com tudo desenhado, depois a página segue
    const hint = root.parentElement?.querySelector<HTMLElement>("[data-hint]");

    const apply = (p: number) => {
      if (hint) hint.style.opacity = String(1 - clamp((p - 0.015) / 0.04));
      // texto: cada palavra acende em sequência
      const nW = wordsRef.current.length;
      wordsRef.current.forEach((w, i) => {
        if (!w) return;
        const a = clamp((p - (0.03 + (i / nW) * 0.52)) / 0.05);
        w.style.opacity = String(0.2 + 0.8 * a);
      });

      // sombreado do chão
      const hp = clamp(p / 0.16);
      H.forEach((el, i) => {
        const h = hatch[i];
        if (h) el.style.strokeDashoffset = String(1 - clamp(hp * 1.6 - h.d * 0.6));
      });

      // catedral: por grupos de construção; dentro do grupo, de baixo para cima
      strokes.forEach((s, i) => {
        const el = S[i];
        if (!el) return;
        const [ws, we] = GROUP_WINDOWS[s.g]!;
        const t0 = ws + (s.k / s.n) * (we - ws) * 0.7;
        const f = clamp((p - t0) / ((we - ws) * 0.38 + 0.015));
        el.style.strokeDashoffset = String(1 - f);
        el.style.opacity = f > 0 ? "1" : "0";
      });

      // anotações: seta, escrita e sublinhado
      noteEls.forEach(({ n, arrow, clip, text, squig, dot, start }) => {
        const a1 = clamp((p - start) / 0.05);
        const a2 = clamp((p - start - 0.03) / 0.07);
        const a3 = clamp((p - start - 0.09) / 0.04);
        arrow.style.strokeDashoffset = String(1 - a1);
        dot.style.opacity = String(a1);
        const bb = noteBox.current[n.key];
        if (bb) {
          clip.setAttribute("width", String((bb.w + 8) * a2));
          squig.style.strokeDashoffset = String(1 - a3);
        }
        text.style.opacity = a2 > 0 ? "1" : "0";
      });

      if (extras) extras.style.opacity = String(clamp((p - 0.86) / 0.1));
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = wr.getBoundingClientRect();
        const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) * 16 || 72;
        const travel = Math.max(1, rect.height - st.offsetHeight);
        apply(clamp((navH - rect.top) / travel) * pEnd);
      });
    };

    if (reduce) apply(1);
    else {
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // measured: refaz quando as medidas das anotações ficam prontas
  }, [strokes, cam, hatch, L, reduce, measured]);

  return (
    <section
      ref={wrap}
      aria-label={label}
      style={reduce ? undefined : { height: `calc(100svh - var(--nav-h) + ${mobile ? 300 : 380}svh)` }}
      className="relative"
    >
      <div
        ref={stage}
        className="shell sticky top-[var(--nav-h)] flex h-[calc(100svh-var(--nav-h))] flex-col overflow-hidden md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-6"
      >
        <div className="pt-6 md:py-0">
          <p className="label">{label}</p>
          <p className="lora mt-4 hyphens-auto text-[clamp(1.02rem,4.2vw,1.2rem)] leading-[1.5] text-ink md:mt-6 md:text-justify md:text-[clamp(1.15rem,1.7vw,1.65rem)] md:leading-[1.52]">
            {words.map((w, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                style={{ opacity: reduce ? 1 : 0.2, transition: "opacity 0.25s linear" }}
              >
                {w}{" "}
              </span>
            ))}
          </p>
        </div>

        {!reduce && (
          <div
            data-hint
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center md:hidden"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full bg-char px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-paper shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]">
              Role para baixo
              <svg viewBox="0 0 20 20" className="hint-bounce size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 4v11M5 11l5 5 5-5" />
              </svg>
            </span>
          </div>
        )}

        <svg
          ref={svg}
          viewBox={`0 0 ${L.vb[0]} ${L.vb[1]}`}
          className="min-h-0 w-full flex-1 md:h-full md:flex-none"
          fill="none"
          aria-hidden
        >
          {/* sombreado do chão */}
          <g stroke={INK} strokeWidth={0.9} strokeLinecap="round" opacity={0.26}>
            {hatch.map((h, i) => (
              <path
                key={i}
                data-h
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                d={`M${h.x.toFixed(1)} ${h.y.toFixed(1)}l${(h.l * 0.8).toFixed(1)} ${(-h.l * 0.55).toFixed(1)}`}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* catedral em croqui */}
          <g strokeLinejoin="round" strokeLinecap="round">
            {strokes.map((s, i) => (
              <path
                key={i}
                data-s
                d={s.d}
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1}
                stroke={s.g === 0 ? PENCIL : INK}
                strokeWidth={s.w === 2 ? 1.5 : s.w === 1 ? 1 : 0.65}
                strokeOpacity={s.g === 0 ? 0.45 : s.w === 0 ? 0.6 : 0.88}
                style={{ opacity: 0 }}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          {/* anotações à mão */}
          <defs>
            {L.notes.map((n) => (
              <clipPath key={n.key} id={`clip-${n.key}`}>
                <rect data-clip={n.key} x={0} y={0} width={0} height={0} />
              </clipPath>
            ))}
          </defs>
          <g stroke={PENCIL} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4}>
            {L.notes.map((n) => (
              <g key={n.key}>
                <path data-arrow={n.key} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} opacity={0.8} vectorEffect="non-scaling-stroke" />
                <circle data-dot={n.key} r={3.2} fill={PENCIL} stroke="none" style={{ opacity: 0 }} />
                <path data-squig={n.key} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} opacity={0.55} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
                <g clipPath={`url(#clip-${n.key})`}>
                  <text
                    data-note={n.key}
                    x={n.x}
                    y={n.y}
                    textAnchor={n.side === "l" ? "end" : "start"}
                    fontSize={L.fs}
                    fill={PENCIL}
                    stroke="none"
                    transform={`rotate(${n.side === "l" ? -2.5 : 2} ${n.x} ${n.y})`}
                    style={{ fontFamily: "var(--font-hand), 'Segoe Print', cursive", fontWeight: 600, opacity: reduce ? 1 : 0 }}
                  >
                    {n.lines.map((ln, i) => (
                      <tspan key={i} x={n.x} dy={i ? L.fs : 0}>
                        {ln}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            ))}
          </g>

          {/* carimbo de prancha e escala (só no desktop) */}
          {!mobile && (
            <g data-extras style={{ opacity: reduce ? 1 : 0 }} stroke={INK} strokeWidth={1} strokeLinecap="round">
              <g opacity={0.55}>
                <path d="M110 690h150M110 684v12M160 686v8M210 686v8M260 684v12" vectorEffect="non-scaling-stroke" />
              </g>
              <text x={110} y={676} fontSize={20} fill={INK} stroke="none" opacity={0.6} style={{ fontFamily: "var(--font-hand), cursive" }}>
                esc. 1:100
              </text>
              <g opacity={0.5}>
                <path d="M880 656h190v58h-190zM880 684h190" vectorEffect="non-scaling-stroke" />
              </g>
              <text x={890} y={676} fontSize={19} fill={INK} stroke="none" opacity={0.7} style={{ fontFamily: "var(--font-hand), cursive" }}>
                prancha 01 · restauro
              </text>
              <text x={890} y={703} fontSize={19} fill={PENCIL} stroke="none" opacity={0.85} style={{ fontFamily: "var(--font-hand), cursive" }}>
                + decoração interna
              </text>
            </g>
          )}
        </svg>
      </div>
    </section>
  );
}
