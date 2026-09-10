"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";
import { metrics } from "@/lib/content";

const align = ["justify-start", "justify-center", "justify-end"];

export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    if (reducedMotion() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count || "0";
        const target = parseInt(raw.replace(/\D/g, ""), 10);
        const suffix = raw.replace(/[\d]/g, "");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent =
              Math.round(obj.v).toLocaleString("pt-BR") + suffix;
          },
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="container py-[clamp(4rem,9vw,7rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-3 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Indicadores
          </p>
          <h2 data-reveal="clip" className="h-lg mt-3 text-[clamp(2.25rem,6vw,3.875rem)]">
            Em números
          </h2>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 md:mt-24 md:gap-2">
        {metrics.map(([value, label], i) => (
          <div key={label} className={`flex ${align[i % 3]}`}>
            <div data-reveal className="max-w-[70vw]">
              <span
                data-count={value}
                className="display block text-[clamp(3.5rem,15vw,10.5rem)] leading-[0.85]"
              >
                {value}
              </span>
              <span className="mt-2 block text-[13px] text-smoke">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <p data-reveal className="mt-16 max-w-md text-[14px] text-pewter">
        Números de projetos, laudos e edifícios acompanhados desde a fundação do
        estúdio.
      </p>
    </section>
  );
}
