"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, reducedMotion, useIso } from "@/lib/anim";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";

export type FeedItem = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  coverUrl?: string | null;
};

export function HeroFeed({ items }: { items: FeedItem[] }) {
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
    <div className="relative flex w-full max-w-[27rem] flex-col gap-3 self-end sm:max-w-[30rem]">
      <Link
        ref={card}
        href={`/projetos/${p.slug}`}
        className="group flex gap-4 rounded-[8px] bg-paper/95 p-3.5 text-ink shadow-[0_18px_50px_-20px_rgba(0,0,0,0.4)] backdrop-blur-md"
      >
        <div className="w-[42%] shrink-0 overflow-hidden rounded-[6px]">
          <ImageBox
            src={p.coverUrl}
            alt={p.title}
            variant="bleed"
            ratio="4 / 3"
            className="h-full bg-mist text-pewter"
            label="Projeto"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between py-1 pr-1">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-smoke">
              {p.category}
            </p>
            <p className="mt-1.5 text-[15px] font-light leading-tight">
              {p.title}
            </p>
            <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-pewter">
              {p.summary}
            </p>
          </div>
          <Arrow className="mt-3 h-4 w-4 self-end text-ink transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>

      <div className="flex gap-2">
        <Link
          href="/sobre"
          className="flex-1 rounded-[80px] bg-paper/95 px-4 py-2.5 text-center text-[13px] text-ink backdrop-blur-md transition-colors hover:bg-paper"
        >
          Sobre o estúdio
        </Link>
        <Link
          href="/contato"
          className="flex-1 rounded-[80px] bg-ember px-4 py-2.5 text-center text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
        >
          Contato
        </Link>
      </div>
    </div>
  );
}
