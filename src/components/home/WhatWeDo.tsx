"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { doList } from "@/lib/content";

export function WhatWeDo() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useIso(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-do-item]");
      items.forEach((el, idx) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(idx),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="container py-[clamp(4rem,9vw,7rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-3 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            O método
          </p>
          <h2 data-reveal="clip" className="h-lg mt-3 text-[clamp(2.25rem,6vw,3.875rem)]">
            O que fazemos
          </h2>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          {doList.map((s, idx) => (
            <div
              key={s.number}
              data-do-item
              className="grid grid-cols-[3rem_1fr] items-baseline gap-2 border-t border-mist py-8 transition-opacity duration-500"
              style={{ opacity: idx === active ? 1 : 0.45 }}
            >
              <span className="text-[12px] text-smoke">{s.number}</span>
              <div>
                <h3 className="text-[clamp(1.25rem,2.4vw,1.6rem)] font-light">
                  {s.title}
                </h3>
                <p className="mt-2 max-w-md text-[14px] text-pewter">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] md:sticky md:top-24 md:aspect-auto md:h-[26rem]">
          {doList.map((s, idx) => (
            <div
              key={s.number}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: idx === active ? 1 : 0 }}
            >
              <ImagePlaceholder
                fill
                label={`Espaço para imagem — ${s.title.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
