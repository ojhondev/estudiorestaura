"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";
import { doList } from "@/lib/content";
import { photo } from "@/lib/photos";

export function WhatWeDo({ images = {} }: { images?: Record<string, string> }) {
  const [active, setActive] = useState(0);

  return (
    <section className="shell py-[clamp(4.5rem,10vw,8rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            O método
          </p>
          <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            O que fazemos
          </h2>
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div data-reveal>
          {doList.map((s, idx) => {
            const on = idx === active;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setActive(idx)}
                aria-pressed={on}
                className="grid w-full grid-cols-[3.5rem_1fr] items-start gap-3 border-t border-mist py-8 text-left transition-colors"
              >
                <span
                  className={`text-[14px] transition-colors ${
                    on ? "text-ember" : "text-smoke"
                  }`}
                >
                  {s.number}
                </span>
                <span>
                  <span
                    className={`flex items-center gap-3 text-[clamp(1.4rem,2.8vw,2rem)] font-light transition-opacity ${
                      on ? "opacity-100" : "opacity-45"
                    }`}
                  >
                    {s.title}
                    <Arrow
                      className={`h-4 w-4 text-ember transition-all duration-300 ${
                        on ? "translate-x-1 opacity-100" : "opacity-0"
                      }`}
                    />
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                      on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="measure block text-[15px] text-pewter">
                        {s.body}
                      </span>
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
          <Link href="/servicos" className="text-arrow mt-10 border-t-0 pt-2">
            Todos os serviços <Arrow />
          </Link>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] lg:sticky lg:top-24 lg:aspect-auto lg:h-[clamp(24rem,44vw,38rem)]">
          {doList.map((s, idx) => (
            <div
              key={s.number}
              className="absolute inset-0 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: idx === active ? 1 : 0,
                transform: idx === active ? "scale(1)" : "scale(1.06)",
              }}
            >
              <ImageBox
                fill
                src={images[`whatwedo.${s.number}`] || photo(`whatwedo:${s.number}`)}
                alt={s.title}
                label={`Espaço para imagem — ${s.title.toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
