"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  prefersReducedMotion,
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
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const ctx = gsap.context(() => {
      const distance = () =>
        Math.max(
          0,
          (track.current?.scrollWidth ?? 0) - (pin.current?.clientWidth ?? 0),
        );

      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top+=64",
          end: () => "+=" + distance(),
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, section);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="mt-28 md:mt-40">
      <h2
        data-reveal
        className="section-title shell text-[clamp(1.75rem,4.5vw,3.25rem)]"
      >
        Conheça alguns destaques
      </h2>

      <div
        ref={pin}
        className="showcase-pin mt-10 md:mt-16 md:h-[calc(100vh-64px)]"
      >
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,4.5vw,5rem)] pb-4 [scrollbar-width:none] md:h-full md:snap-none md:pb-0 md:pr-0"
        >
          {panels.map((p, i) => (
            <article
              key={p.slug}
              className="showcase-panel relative flex h-[68vh] w-[86vw] shrink-0 snap-start flex-col sm:w-[64vw] md:h-full md:w-[52vw] md:pr-[4vw] lg:w-[42vw]"
            >
              <div className="relative flex-1 overflow-hidden">
                <ImagePlaceholder fill tone="ink" />
                <span className="absolute left-0 top-0 bg-paper px-3 py-1.5 text-[12px] tracking-[0.2em] text-ink">
                  0{i + 1}
                </span>
              </div>
              <div className="bg-peach p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[16px] font-medium">{p.title}</h3>
                  <span className="shrink-0 text-[13px] text-ink-soft">
                    {p.year}
                  </span>
                </div>
                <p className="mt-2 max-w-md text-[13px] leading-relaxed text-ink-soft">
                  {p.summary}
                </p>
                <Link
                  href={`/projetos/${p.slug}`}
                  className="ulink mt-3 text-[13px]"
                >
                  Ver projeto
                </Link>
              </div>
            </article>
          ))}

          <article className="showcase-panel flex h-[68vh] w-[72vw] shrink-0 snap-start flex-col justify-center sm:w-[44vw] md:h-full md:w-[30vw]">
            <p className="section-title text-[clamp(1.5rem,2.6vw,2.25rem)]">
              O acervo completo continua na página de Projetos.
            </p>
            <Link href="/projetos" className="ulink mt-6 text-[14px]">
              Ver todos os projetos
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
