"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";
import { MediaBand, type MediaBandData } from "@/components/home/MediaBand";
import { workAreas } from "@/lib/content";

/** Paleta da marca: terracota e preto da logo + um tom claro neutro. */
const TONES = {
  terra: {
    card: "bg-ember text-paper",
    body: "text-paper/90",
    sub: "text-paper/85",
    chip: "bg-white/15",
    line: "border-white/25",
    link: "text-paper/70 hover:text-paper",
    mark: "text-paper/70",
  },
  preto: {
    card: "bg-[#181818] text-paper",
    body: "text-paper/90",
    sub: "text-paper/80",
    chip: "bg-white/12",
    line: "border-white/20",
    link: "text-paper/65 hover:text-paper",
    mark: "text-ember",
  },
  claro: {
    card: "bg-mist text-ink",
    body: "text-ink/85",
    sub: "text-ink/75",
    chip: "bg-ink/10",
    line: "border-ink/20",
    link: "text-ink/60 hover:text-ink",
    mark: "text-ember",
  },
} as const;

function Mark({ variant, tone }: { variant: string; tone: string }) {
  const p = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 140 110"
      className={`card-mark mark-draw h-28 w-40 md:h-36 md:w-52 ${tone}`}
      aria-hidden
    >
      {variant === "terra" && (
        <>
          <rect x="6" y="12" width="60" height="40" {...p} />
          <rect x="76" y="12" width="58" height="22" {...p} />
          <rect x="76" y="44" width="58" height="52" {...p} />
          <rect x="6" y="62" width="60" height="34" {...p} />
        </>
      )}
      {variant === "preto" && (
        <>
          <path d="M12 96 L70 14 L128 96" {...p} />
          <path d="M34 96 L70 44 L106 96" {...p} />
          <line x1="12" y1="96" x2="128" y2="96" {...p} />
        </>
      )}
      {variant === "claro" && (
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

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-3">
        {workAreas.map((w, i) => {
          const isOpen = open === i;
          const t = TONES[w.tone];
          return (
            <article
              key={w.index}
              data-reveal
              data-open={isOpen ? "true" : "false"}
              className={`card-dark flex flex-col ${t.card}`}
            >
              <span className={`w-fit rounded-[80px] ${t.chip} px-3.5 py-1.5 text-[12px] font-medium uppercase tracking-[0.16em]`}>
                {w.index}
              </span>
              <h3 className="h mt-6 text-[clamp(1.9rem,3.6vw,2.75rem)]">
                {w.title}
              </h3>
              <p className={`mt-3 text-[14px] ${t.sub}`}>
                {w.tags.join("  ·  ")}
              </p>
              <p className={`measure mt-5 text-[16px] leading-relaxed ${t.body}`}>
                {w.body}
              </p>

              {w.details?.length ? (
                <div className="acc-content" aria-hidden={!isOpen}>
                  <div>
                    <ul className={`mt-5 space-y-2.5 border-t ${t.line} pt-5 text-[15px] ${t.body}`}>
                      {w.details.map((d) => (
                        <li key={d} className="flex gap-3">
                          <span className="mt-3 h-px w-4 shrink-0 bg-paper/60" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
  
                ) : null}

              <div className="mt-6 flex items-end justify-between gap-4">
                {w.details?.length ? (
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
                ) : (
                  <span />
                )}
                <Mark variant={w.tone} tone={t.mark} />
              </div>

              <Link
                href="/servicos"
                className={`mt-4 text-[13px] ${t.link} underline-offset-4 hover:underline`}
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
