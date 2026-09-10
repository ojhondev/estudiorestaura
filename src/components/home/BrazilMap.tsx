"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, reducedMotion, useIso } from "@/lib/anim";
import { ImageBox } from "@/components/ImageBox";
import { BR_STATES, BR_VIEWBOX } from "@/lib/brazil-map";
import { mapLocations } from "@/lib/content";
import { photo } from "@/lib/photos";

const NAMES: Record<string, string> = Object.fromEntries(
  BR_STATES.map((s) => [s.uf, s.name]),
);

export function BrazilMap({ images = {} }: { images?: Record<string, string> }) {
  const activeUFs = useMemo(() => Object.keys(mapLocations), []);
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState(activeUFs[0]);
  const current = hover ?? pinned;
  const loc = mapLocations[current];

  const section = useRef<HTMLElement>(null);
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
      {/* Per-state photo backgrounds */}
      {activeUFs.map((uf) => (
        <div
          key={uf}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: hover === uf ? 1 : 0 }}
        >
          <ImageBox
            fill
            variant="bleed"
            src={images[`brazil.${uf}`] || photo(`brazil:${uf}`)}
            alt={`Obras em ${NAMES[uf] ?? uf}`}
            className="bg-iron"
            label={`Espaço para imagem — obras em ${NAMES[uf] ?? uf}`}
          />
        </div>
      ))}
      {/* Contrast overlay (not too dark) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-colors duration-500"
        style={{
          background: hover ? "rgba(40,10,4,0.7)" : "rgba(124,32,17,1)",
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
                    onMouseEnter={() => state && setHover(s.uf)}
                    onClick={() => state && setPinned(s.uf)}
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
              <p className="mt-5 text-[13px] uppercase tracking-[0.18em] text-paper/60">
                {loc.status === "atuacao"
                  ? "Atuação em andamento"
                  : "Prospecção de novos projetos"}
              </p>
              <p className="measure mt-3 text-[16px] leading-relaxed text-paper/85">
                {loc.note}
              </p>
              <p className="mt-4 text-[13px] text-paper/45">
                Passe o mouse pelos estados para ver as obras.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeUFs.map((code) => (
                <button
                  key={code}
                  type="button"
                  onMouseEnter={() => setHover(code)}
                  onFocus={() => setHover(code)}
                  onClick={() => setPinned(code)}
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
          </div>
        </div>
      </div>
    </section>
  );
}
