"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";
import { Arrow } from "@/components/ui";
import { MediaBand, type MediaBandData } from "@/components/home/MediaBand";
import { workAreas } from "@/lib/content";

const toneClass: Record<string, string> = {
  pine: "bg-pine",
  tide: "bg-tide",
  ember: "bg-ember",
};

function Mark({ variant }: { variant: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 140 110"
      className="card-mark mark-draw h-28 w-40 text-paper/60 md:h-36 md:w-52"
      aria-hidden
    >
      {variant === "pine" && (
        <>
          <rect x="6" y="12" width="60" height="40" {...p} />
          <rect x="76" y="12" width="58" height="22" {...p} />
          <rect x="76" y="44" width="58" height="52" {...p} />
          <rect x="6" y="62" width="60" height="34" {...p} />
        </>
      )}
      {variant === "tide" && (
        <>
          <path d="M12 96 L70 14 L128 96" {...p} />
          <path d="M34 96 L70 44 L106 96" {...p} />
          <line x1="12" y1="96" x2="128" y2="96" {...p} />
        </>
      )}
      {variant === "ember" && (
        <>
          <circle cx="70" cy="55" r="42" {...p} />
          <circle cx="70" cy="55" r="22" {...p} />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={70}
                y1={55}
                x2={Number((70 + Math.cos(r) * 42).toFixed(2))}
                y2={Number((55 + Math.sin(r) * 42).toFixed(2))}
                {...p}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}

export function WorkCards({ media }: { media?: MediaBandData }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useIso(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGElement>(".mark-draw").forEach((svg) => {
        const shapes = svg.querySelectorAll("path, rect, circle, line");
        shapes.forEach((sh) => {
          const len = (sh as SVGGeometryElement).getTotalLength?.() || 200;
          gsap.set(sh, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(shapes, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: svg, start: "top 88%" },
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="shell py-[clamp(4.5rem,10vw,8rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Três frentes
          </p>
          <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            Nosso trabalho
          </h2>
        </div>
      </div>

      {/* Media band — vídeo do estúdio na mídia */}
      <MediaBand {...media} />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {workAreas.map((w, i) => {
          const isOpen = open === i;
          return (
            <article
              key={w.index}
              data-reveal
              className={`card-dark ${isOpen ? "is-open" : ""} flex min-h-[clamp(24rem,32vw,30rem)] flex-col justify-between ${toneClass[w.tone]}`}
            >
              <div>
                <span className="rounded-[80px] bg-white/12 px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.16em]">
                  {w.index}
                </span>
                <h3 className="h mt-6 text-[clamp(1.9rem,3.6vw,2.75rem)]">
                  {w.title}
                </h3>
                <p className="mt-3 text-[14px] text-paper/85">
                  {w.tags.join("  ·  ")}
                </p>
                <p className="measure mt-5 text-[16px] leading-relaxed text-paper/90">
                  {w.body}
                </p>

                <div className="acc-content mt-1">
                  <div>
                    <ul className="space-y-2.5 pt-4 text-[14px] text-paper/80">
                      {w.details.map((d) => (
                        <li key={d} className="flex gap-3">
                          <span className="mt-2.5 h-px w-4 shrink-0 bg-paper/50" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="text-arrow text-[14px]"
                >
                  {isOpen ? "Menos detalhes" : "Mais detalhes"}
                  <span
                    className={`text-[20px] leading-none transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <Mark variant={w.tone} />
              </div>

              <Link
                href="/servicos"
                className="mt-4 text-[13px] text-paper/60 underline-offset-4 hover:text-paper hover:underline"
              >
                Ver na página de serviços
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
