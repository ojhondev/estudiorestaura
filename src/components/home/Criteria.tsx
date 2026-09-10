"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { criteria } from "@/lib/content";

export function Criteria() {
  const [open, setOpen] = useState(0);

  return (
    <section className="container py-[clamp(4rem,9vw,7rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-3 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Critérios
          </p>
          <h2 data-reveal="clip" className="h-lg mt-3 text-[clamp(2.25rem,6vw,3.875rem)]">
            O que buscamos
          </h2>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
        <div
          data-reveal
          className="relative aspect-[4/5] overflow-hidden rounded-[8px] md:sticky md:top-24 md:aspect-[4/5]"
        >
          {criteria.map((c, i) => (
            <div
              key={c.title}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === open ? 1 : 0 }}
            >
              <ImagePlaceholder fill label={`Espaço para imagem — ${c.title.toLowerCase()}`} />
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
                onClick={() => setOpen(i)}
                aria-expanded={i === open}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-[clamp(1.05rem,2.2vw,1.4rem)] font-light">
                  {c.title}
                </span>
                <span
                  className={`text-[18px] text-smoke transition-transform duration-300 ${
                    i === open ? "rotate-45 text-ember" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div className="acc-content">
                <div>
                  <p className="max-w-md pb-6 text-[14px] text-pewter">{c.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
