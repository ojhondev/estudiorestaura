"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";
import { metrics } from "@/lib/content";

const align = ["items-start", "items-center", "items-end"];

export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useIso(() => {
    if (!root.current) return;
    const nodes = gsap.utils.toArray<HTMLElement>("[data-count]", root.current);

    if (reducedMotion()) return;

    // start at zero so the roll is visible
    nodes.forEach((el) => {
      const suffix = (el.dataset.count || "").replace(/[\d]/g, "");
      el.textContent = "0" + suffix;
    });

    const ctx = gsap.context(() => {
      nodes.forEach((el) => {
        const raw = el.dataset.count || "0";
        const target = parseInt(raw.replace(/\D/g, ""), 10);
        const suffix = raw.replace(/[\d]/g, "");
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: "top 82%" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("pt-BR") + suffix;
          },
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
            Indicadores
          </p>
          <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            Em números
          </h2>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-12 md:mt-24 md:gap-0">
        {metrics.map(([value, label], i) => (
          <div key={label} className={`flex flex-col ${align[i % 3]}`}>
            <div data-reveal>
              <span
                data-count={value}
                className="display block text-[clamp(4.5rem,22vw,16rem)] leading-[0.8] tabular-nums"
              >
                {value}
              </span>
              <span className="mt-3 block text-[15px] text-smoke">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <p data-reveal className="measure mt-16 text-[16px] text-pewter">
        Projetos, laudos e edifícios acompanhados desde a fundação do estúdio.
      </p>
    </section>
  );
}
