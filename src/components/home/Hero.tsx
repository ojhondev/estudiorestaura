"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { Logo } from "@/components/Logo";
import { SplitWords } from "@/components/Split";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const LEAD =
  "O Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.";
const REST =
  "Fundado por profissionais experientes da área, o estúdio desenvolve projetos de intervenção arquitetônica, planos de conservação preventiva e laudos técnicos detalhados para preservar a memória e a autenticidade de edificações antigas e obras de arte.";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-anim]"), { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.set("[data-anim]", { autoAlpha: 1 })
        .from(".hero-logo", { yPercent: 6, autoAlpha: 0, duration: 1.2 })
        .from(
          ".hero-rule",
          { scaleX: 0, transformOrigin: "left", duration: 1 },
          "-=0.8",
        )
        .from(
          ".hero-p .sw",
          { yPercent: 110, duration: 0.9, stagger: 0.012 },
          "-=0.7",
        )
        .from(".hero-img", { autoAlpha: 0, yPercent: 4, duration: 1.2 }, "-=0.5");
    }, el);

    // Failsafe: if the animation stalls, force the content visible.
    const failsafe = window.setTimeout(() => {
      el.querySelectorAll<HTMLElement>("[data-anim]").forEach((n) => {
        n.style.opacity = "1";
        n.style.visibility = "visible";
      });
      el.querySelectorAll<HTMLElement>(".mask > span").forEach((n) => {
        n.style.transform = "none";
      });
    }, 3000);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root}>
      <section className="shell pt-24 md:pt-32">
        <span data-anim className="hero-logo block w-full max-w-[68rem]">
          <Logo priority className="h-auto w-full" />
        </span>

        <hr className="hero-rule rule mt-10 md:mt-14" />

        <p
          data-anim
          className="hero-p mt-8 max-w-[62rem] text-[clamp(1.15rem,2.2vw,1.9rem)] leading-[1.45] md:mt-10"
        >
          <SplitWords text={LEAD} className="text-ink" />
          <SplitWords text={REST} className="text-muted" />
        </p>
        <div data-anim className="hero-img mt-14 md:mt-20">
          <ImagePlaceholder ratio="16 / 7" />
        </div>
      </section>
    </div>
  );
}
