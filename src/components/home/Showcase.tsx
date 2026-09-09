"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  motionQuery,
  ScrollTrigger,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { projects } from "@/lib/content";

export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const panels = projects.slice(0, 4);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const mq =
      motionQuery() === "all"
        ? "(min-width: 768px)"
        : `(min-width: 768px) and ${motionQuery()}`;

    mm.add(mq, () => {
      const distance = () =>
        Math.max(
          0,
          (track.current?.scrollWidth ?? 0) - (pin.current?.offsetWidth ?? 0),
        );

      const st = ScrollTrigger.create({
        trigger: pin.current,
        start: "top top+=80",
        end: () => `+=${distance()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(track.current, { x: -distance() * self.progress });
        },
        onRefresh: (self) => {
          gsap.set(track.current, { x: -distance() * self.progress });
        },
      });

      return () => st.kill();
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      mm.revert();
    };
  }, []);

  return (
    <section ref={section} className="mt-28 md:mt-40">
      <h2
        data-reveal="up"
        className="shell font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium tracking-[-0.02em]"
      >
        Conheça alguns destaques
      </h2>

      <div
        ref={pin}
        className="showcase-pin mt-10 md:mt-14 md:h-[calc(100vh-80px)]"
      >
        <div
          ref={track}
          className="showcase-track flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,5vw,4.5rem)] pb-4 [scrollbar-width:none] md:h-full md:snap-none md:pb-0 md:pr-0"
        >
          {panels.map((p) => (
            <article
              key={p.slug}
              className="showcase-panel relative h-[64vh] w-[82vw] shrink-0 snap-start overflow-hidden sm:w-[62vw] md:h-full md:w-[54vw] md:mr-[4vw] lg:w-[44vw]"
            >
              <ImagePlaceholder fill tone="ink" />
              <div className="absolute bottom-0 left-0 max-w-[22rem] bg-peach p-6">
                <h3 className="font-display text-lg font-bold tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {p.summary}
                </p>
                <Link
                  href={`/projetos/${p.slug}`}
                  className="mt-3 inline-block text-sm text-terracotta hover:underline"
                >
                  Ver projeto →
                </Link>
              </div>
            </article>
          ))}

          <article className="showcase-panel relative flex h-[64vh] w-[70vw] shrink-0 snap-start flex-col justify-center sm:w-[40vw] md:h-full md:w-[32vw]">
            <p className="font-display text-2xl tracking-[-0.02em]">
              Mais projetos no acervo completo.
            </p>
            <Link
              href="/projetos"
              className="mt-5 inline-block w-fit rounded-full border border-ink px-7 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
            >
              Ver todos os projetos
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
