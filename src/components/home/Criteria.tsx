"use client";

import { useRef, useState } from "react";
import { ImageBox } from "@/components/ImageBox";
import { criteria } from "@/lib/content";
import { useAutoplay } from "@/lib/autoplay";
import { CRITERIA_FOTOS } from "@/lib/photos";

export function Criteria({ images = {} }: { images?: Record<string, string> }) {
  const [open, setOpen] = useState(0);
  const [auto, setAuto] = useState(true); // abre sozinho até o usuário clicar
  const root = useRef<HTMLElement>(null);
  useAutoplay(root, () => setOpen((o) => (o + 1) % criteria.length), { ms: 3000, active: auto });

  return (
    <section ref={root} className="shell py-[clamp(4.5rem,10vw,8rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Critérios
          </p>
          <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            O que buscamos
          </h2>
        </div>
      </div>

      <div className="mt-12 grid gap-0 lg:mt-16 lg:grid-cols-2 lg:gap-20">
        <div
          data-reveal
          className="relative hidden aspect-[4/5] overflow-hidden rounded-[8px] lg:sticky lg:top-24 lg:block lg:aspect-auto lg:h-[clamp(28rem,44vw,42rem)]"
        >
          {criteria.map((c, i) => (
            <div
              key={c.title}
              className="absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: i === open ? 1 : 0,
                transform: i === open ? "scale(1)" : "scale(1.06)",
              }}
            >
              <ImageBox
                fill
                src={images[`criteria.${i}`] || CRITERIA_FOTOS[i]}
                alt={c.title}
                label={`Espaço para imagem — ${c.title.toLowerCase()}`}
              />
            </div>
          ))}
        </div>

        <div data-reveal>
          {criteria.map((c, i) => (
            <div
              key={c.title}
              className={`acc-item border-t border-mist ${i === open ? "is-open" : ""}`}
            >
              <button
                type="button"
                onClick={() => {
                  setAuto(false);
                  setOpen(i);
                }}
                aria-expanded={i === open}
                className="flex w-full items-center justify-between gap-5 py-7 text-left"
              >
                <span
                  className={`text-[clamp(1.2rem,2.6vw,1.7rem)] font-light transition-opacity ${
                    i === open ? "opacity-100" : "opacity-55"
                  }`}
                >
                  {c.title}
                </span>
                <span
                  className={`shrink-0 text-[22px] text-smoke transition-transform duration-300 ${
                    i === open ? "rotate-45 text-ember" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div className="acc-content">
                <div>
                  <p className="measure pb-5 text-[16px] leading-relaxed text-pewter lg:pb-7">
                    {c.body}
                  </p>
                  {/* celular: a imagem abre junto, dentro do mesmo bloco */}
                  <div className="pb-7 lg:hidden">
                    <ImageBox
                      src={images[`criteria.${i}`] || CRITERIA_FOTOS[i]}
                      alt={c.title}
                      ratio="4 / 3"
                      sizes="(min-width: 640px) 80vw, 100vw"
                      label={`Espaço para imagem — ${c.title.toLowerCase()}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
