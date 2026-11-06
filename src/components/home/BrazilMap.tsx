"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap, reducedMotion, useIso } from "@/lib/anim";
import { useAutoplay } from "@/lib/autoplay";
import { ImageBox } from "@/components/ImageBox";
import { BR_STATES, BR_VIEWBOX } from "@/lib/brazil-map";
import { mapLocations } from "@/lib/content";
import { ESTADO_FOTOS } from "@/lib/estados";
import { Arrow } from "@/components/ui";

const NAMES: Record<string, string> = Object.fromEntries(
  BR_STATES.map((s) => [s.uf, s.name]),
);

type MapProject = {
  slug: string;
  title: string;
  category: string;
  coverUrl?: string | null;
};

export function BrazilMap({
  images = {},
  projectsByState = {},
}: {
  images?: Record<string, string>;
  projectsByState?: Record<string, MapProject[]>;
}) {
  const activeUFs = useMemo(() => Object.keys(mapLocations), []);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState(activeUFs[0]);
  const [clicked, setClicked] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [auto, setAuto] = useState(true); // alterna sozinho até o usuário interagir
  const bg = hover ?? clicked;
  const current = hover ?? pinned;
  const loc = mapLocations[current];

  // Passa as fotos do estado em foco (a cada ~3,6 s).
  useEffect(() => {
    setSlide(0);
    if (!bg || reducedMotion()) return;
    const id = window.setInterval(() => setSlide((n) => n + 1), 3600);
    return () => window.clearInterval(id);
  }, [bg]);

  function pick(uf: string) {
    setAuto(false);
    setPinned(uf);
    setClicked((c) => (c === uf ? null : uf));
  }

  const section = useRef<HTMLElement>(null);

  // Começa em São Paulo e passa pelos estados a cada 3 s enquanto o mapa está na tela.
  useEffect(() => {
    if (auto && !clicked && !hover) {
      setPinned(activeUFs[0]);
      setClicked(activeUFs[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useAutoplay(
    section,
    () => {
      const next =
        activeUFs[(activeUFs.indexOf(clicked ?? activeUFs[0]) + 1) % activeUFs.length];
      setPinned(next);
      setClicked(next);
    },
    { ms: 3000, active: auto },
  );
  const mapWrap = useRef<HTMLDivElement>(null);
  const moveX = useRef<((v: number) => void) | null>(null);
  const moveY = useRef<((v: number) => void) | null>(null);

  useIso(() => {
    if (reducedMotion() || !mapWrap.current) return;
    moveX.current = gsap.quickTo(mapWrap.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    moveY.current = gsap.quickTo(mapWrap.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  function onMove(e: React.MouseEvent) {
    const r = section.current?.getBoundingClientRect();
    if (!r) return;
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    moveX.current?.(dx * -34);
    moveY.current?.(dy * -24);
  }

  return (
    <section
      ref={section}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setHover(null);
        moveX.current?.(0);
        moveY.current?.(0);
      }}
      className="bleed relative overflow-hidden bg-[#7c2011] text-paper"
    >
      {/* Fotos do estado em foco, passando em fade */}
      {activeUFs.map((uf) => {
        const fotos = ESTADO_FOTOS[uf]?.fotos ?? [];
        return fotos.map((src, i) => (
          <div
            key={uf + i}
            aria-hidden
            className="absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: bg === uf && slide % fotos.length === i ? 1 : 0 }}
          >
            <ImageBox
              fill
              variant="bleed"
              src={images[`brazil.${uf}.${i}`] || src}
              alt={`Obras em ${ESTADO_FOTOS[uf]?.city ?? NAMES[uf] ?? uf}`}
              quality={92}
              sizes="100vw"
              position="50% 40%"
              className="bg-iron"
              label={`Espaço para imagem — obras em ${NAMES[uf] ?? uf}`}
            />
          </div>
        ));
      })}
      {/* Contrast overlay (not too dark) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-500"
        style={{
          background: bg ? "rgba(40,10,4,0.62)" : "rgba(124,32,17,1)",
        }}
      />

      <div className="relative shell py-[clamp(4.5rem,10vw,8rem)]">
        <div className="flex items-start gap-6">
          <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-paper/25" />
          <div>
            <p data-reveal="fade" className="label">
              Presença
            </p>
            <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
              Onde já atuamos no Brasil
            </h2>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div ref={mapWrap} data-reveal className="will-change-transform">
            <svg
              viewBox={BR_VIEWBOX}
              className="h-auto w-full max-w-[42rem] lg:max-w-none"
              role="img"
              aria-label="Mapa do Brasil com os estados de atuação"
            >
              {BR_STATES.map((s) => {
                const state = mapLocations[s.uf];
                const isOn = s.uf === current;
                const fill = !state
                  ? "rgba(255,255,255,0.1)"
                  : state.status === "atuacao"
                    ? isOn
                      ? "#ffffff"
                      : "rgba(255,255,255,0.78)"
                    : isOn
                      ? "var(--color-midnight)"
                      : "rgba(7,7,7,0.5)";
                return (
                  <path
                    key={s.uf}
                    d={s.d}
                    fill={fill}
                    stroke="rgba(7,7,7,0.8)"
                    strokeWidth={1}
                    className={
                      state
                        ? "cursor-pointer transition-[fill] duration-300"
                        : "transition-[fill] duration-300"
                    }
                    onMouseEnter={() => {
                      if (state) {
                        setAuto(false);
                        setHover(s.uf);
                      }
                    }}
                    onClick={() => state && pick(s.uf)}
                  />
                );
              })}
            </svg>
          </div>

          <div data-reveal className="flex flex-col justify-between gap-8">
            <div>
              <span className="display block text-[clamp(4rem,12vw,9rem)] leading-none">
                {current}
              </span>
              <p className="mt-2 text-[clamp(1.25rem,2.4vw,1.75rem)] font-light">
                {NAMES[current] ?? current}
              </p>
              {ESTADO_FOTOS[current] && (
                <p className="mt-1 text-[14px] text-paper/70">
                  Obras em {ESTADO_FOTOS[current].city}
                </p>
              )}
              <p className="mt-5 text-[13px] uppercase tracking-[0.18em] text-paper/60">
                {loc.status === "atuacao"
                  ? "Atuação em andamento"
                  : "Prospecção de novos projetos"}
              </p>
              <p className="measure mt-3 text-[16px] leading-relaxed text-paper/85">
                {loc.note}
              </p>
              <p className="mt-4 text-[13px] text-paper/45">
                Passe o mouse ou toque nos estados para ver as obras.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeUFs.map((code) => (
                <button
                  key={code}
                  type="button"
                  onMouseEnter={() => {
                    setAuto(false);
                    setHover(code);
                  }}
                  onFocus={() => setHover(code)}
                  onClick={() => pick(code)}
                  className={`rounded-[80px] px-3.5 py-1.5 text-[13px] transition-colors ${
                    code === current
                      ? "bg-paper text-ink"
                      : "bg-white/10 text-paper/70 hover:bg-white/20"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {(projectsByState[current]?.length ?? 0) > 0 && (
              <div className="rounded-[8px] bg-white/10 p-4 backdrop-blur-sm">
                <p className="label">
                  Projetos em {NAMES[current] ?? current}
                </p>
                <ul className="mt-3 space-y-3">
                  {(projectsByState[current] ?? []).slice(0, 4).map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/projetos/${p.slug}`}
                        className="group flex items-center gap-3"
                      >
                        <span className="block w-20 shrink-0">
                          <ImageBox
                            src={p.coverUrl}
                            alt={p.title}
                            ratio="4 / 3"
                            label="Projeto"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[11px] uppercase tracking-[0.16em] text-paper/60">
                            {p.category}
                          </span>
                          <span className="block truncate text-[15px] group-hover:underline">
                            {p.title}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/projetos" className="text-arrow mt-4 text-[13px]">
                  Ver todos os projetos <Arrow />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
