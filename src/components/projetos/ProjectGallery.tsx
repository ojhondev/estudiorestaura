"use client";

import { useEffect, useState } from "react";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";

export function ProjectGallery({
  count,
  title,
  images = [],
}: {
  count: number;
  title: string;
  images?: string[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  count = images.length || count;

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % count);
      if (e.key === "ArrowLeft") setOpen((i) => ((i ?? 0) - 1 + count) % count);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, count]);

  const items = Array.from({ length: count });

  return (
    <>
      <div className="shell grid gap-4 pb-[clamp(3rem,7vw,5rem)] sm:grid-cols-2 md:gap-6">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            data-reveal="fade"
            data-reveal-delay={(i % 3) * 0.06}
            className={`group relative overflow-hidden rounded-[8px] ${
              i % 3 === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <div
              data-parallax="0.06"
              className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            >
              <ImageBox
                src={images[i]}
                alt={`${title} — imagem ${i + 1}`}
                ratio={i % 3 === 0 ? "16 / 9" : "4 / 3"}
                label={`${title} — imagem ${i + 1}`}
              />
            </div>
            <span className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/0 text-ink opacity-0 transition-all duration-300 group-hover:bg-paper group-hover:opacity-100">
              <Arrow className="h-4 w-4 -rotate-45" />
            </span>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-midnight/97 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div className="shell flex items-center justify-between py-5 text-paper">
            <span className="text-[13px] text-paper/60">
              {String(open + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="text-[12px] uppercase tracking-[0.22em] hover:text-ember"
            >
              Fechar
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((_, i) => (
              <div
                key={i}
                className="absolute inset-x-4 inset-y-0 flex items-center justify-center transition-opacity duration-500"
                style={{ opacity: i === open ? 1 : 0, pointerEvents: i === open ? "auto" : "none" }}
              >
                <div className="w-full max-w-5xl">
                  <ImageBox
                    src={images[i]}
                    alt={`${title} — imagem ${i + 1}`}
                    ratio="16 / 10"
                    variant="bleed"
                    className="bg-iron"
                    label={`${title} — imagem ${i + 1}`}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setOpen((i) => ((i ?? 0) - 1 + count) % count)}
              aria-label="Anterior"
              className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/60"
            >
              <Arrow className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => setOpen((i) => ((i ?? 0) + 1) % count)}
              aria-label="Próxima"
              className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-paper transition-colors hover:border-white/60"
            >
              <Arrow className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
