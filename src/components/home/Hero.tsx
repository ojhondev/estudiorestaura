"use client";

import { useRef } from "react";
import { gsap, motionQuery, useIsoLayoutEffect } from "@/lib/gsap";
import { Logo } from "@/components/Logo";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const LEAD =
  "O Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.";
const REST =
  "Fundado por profissionais experientes da área, o estúdio desenvolve projetos de intervenção arquitetônica, planos de conservação preventiva e laudos técnicos detalhados para preservar a memória e a autenticidade de edificações antigas e obras de arte.";

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current ?? undefined);

    mm.add(motionQuery(), () => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out", duration: 1 },
      });

      tl.to("[data-anim]", {
        opacity: 1,
        duration: 0.9,
        stagger: 0.16,
        ease: "power2.out",
      })
        .from(".hero-logo", { yPercent: 8, scale: 0.97, duration: 1.2 }, 0)
        .from(
          ".hero-word",
          { yPercent: 45, autoAlpha: 0, duration: 0.6, stagger: 0.014 },
          0.35,
        )
        .from(".hero-image", { yPercent: 6, duration: 1.1 }, 0.6);
    });

    // reduced motion: styles fall back to the CSS media query (visible).
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} className="shell pt-28 md:pt-36">
      <span data-anim className="hero-logo block w-full max-w-[76rem]">
        <Logo priority className="h-auto w-full" />
      </span>

      <p
        data-anim
        className="mt-10 max-w-[74rem] text-[clamp(1.05rem,1.9vw,1.6rem)] leading-[1.5] md:mt-14"
      >
        <span className="font-medium text-ink">
          {LEAD.split(" ").map((w, i) => (
            <span
              key={i}
              className="hero-word inline-block whitespace-pre"
            >{`${w} `}</span>
          ))}
        </span>
        <span className="text-muted">
          {REST.split(" ").map((w, i) => (
            <span
              key={i}
              className="hero-word inline-block whitespace-pre"
            >{`${w} `}</span>
          ))}
        </span>
      </p>

      <div data-anim className="hero-image mt-12 md:mt-16">
        <ImagePlaceholder ratio="16 / 7" label="Espaço para imagem" />
      </div>
    </section>
  );
}
