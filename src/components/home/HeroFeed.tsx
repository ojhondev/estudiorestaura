"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, reducedMotion, useIso } from "@/lib/anim";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Arrow } from "@/components/ui";
import { projects } from "@/lib/content";

const items = projects.slice(0, 4);

export function HeroFeed() {
  const [i, setI] = useState(0);
  const card = useRef<HTMLAnchorElement>(null);

  useIso(() => {
    if (reducedMotion()) return;
    let idx = 0;
    const id = window.setInterval(() => {
      const el = card.current;
      if (!el) return;
      gsap
        .timeline()
        .to(el, { yPercent: -8, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
        .add(() => {
          idx = (idx + 1) % items.length;
          setI(idx);
        })
        .set(el, { yPercent: 8 })
        .to(el, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const p = items[i];

  return (
    <div className="relative flex w-full max-w-[24rem] flex-col gap-3 self-end sm:max-w-[26rem]">
      <Link
        ref={card}
        href={`/projetos/${p.slug}`}
        className="group flex gap-4 rounded-[8px] bg-char/85 p-3 text-paper backdrop-blur-md"
      >
        <div className="w-[42%] shrink-0 overflow-hidden rounded-[6px]">
          <ImagePlaceholder
            variant="bleed"
            ratio="4 / 3"
            className="h-full bg-slate/40 text-paper/25"
            label="Projeto"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-1 pr-1">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-mist/60">
              {p.category}
            </p>
            <p className="mt-1 text-[14px] leading-tight">{p.title}</p>
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-mist/70">
              {p.summary}
            </p>
          </div>
          <Arrow className="mt-2 h-3.5 w-3.5 self-end transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>

      <div className="flex gap-2">
        <Link
          href="/sobre"
          className="flex-1 rounded-[80px] bg-char/85 px-4 py-2 text-center text-[12px] text-paper backdrop-blur-md transition-colors hover:bg-char"
        >
          Sobre o estúdio
        </Link>
        <Link
          href="/contato"
          className="flex-1 rounded-[80px] bg-ember px-4 py-2 text-center text-[12px] text-paper transition-opacity hover:opacity-90"
        >
          Contato
        </Link>
      </div>
    </div>
  );
}
