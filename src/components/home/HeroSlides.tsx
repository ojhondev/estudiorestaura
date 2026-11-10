"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { reducedMotion } from "@/lib/anim";

export type Slide = { src: string; position?: string };

/**
 * Fotos do topo da home passando em fade. Só entram fotos horizontais (paisagem), que
 * preenchem a tela sem esticar em qualquer proporção: `object-cover` apenas recorta as
 * laterais/topo, e o `position` de cada foto escolhe o ponto que não pode ficar de fora.
 * Só renderiza a foto atual e a próxima (as demais carregam conforme a vez chega).
 */
export function HeroSlides({ slides, ms = 6000 }: { slides: Slide[]; ms?: number }) {
  const [i, setI] = useState(0);
  const [reached, setReached] = useState(1); // quantas já podem estar no DOM (atual + próxima)

  useEffect(() => {
    if (slides.length < 2 || reducedMotion()) return;
    const id = window.setInterval(() => {
      setI((n) => {
        const next = (n + 1) % slides.length;
        setReached((r) => Math.max(r, Math.min(slides.length, next + 2)));
        return next;
      });
    }, ms);
    return () => window.clearInterval(id);
  }, [slides.length, ms]);

  return (
    <div aria-hidden className="absolute inset-0 scale-[1.12]" data-parallax="0.1">
      {slides.map((s, k) =>
        k < reached || k === i ? (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: k === i ? 1 : 0 }}
          >
            <Image
              src={s.src}
              alt=""
              fill
              priority={k === 0}
              sizes="100vw"
              quality={90}
              className="object-cover transition-transform ease-linear"
              style={{
                objectPosition: s.position ?? "50% 50%",
                transform: k === i ? "scale(1.08)" : "scale(1)",
                transitionDuration: k === i ? `${ms + 2500}ms` : "0ms",
              }}
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
