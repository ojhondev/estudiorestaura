"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";

type Dims = Record<string, { w: number; h: number }>;

/**
 * Galeria do projeto. Cada foto aparece na proporção real (sem recortar) e nunca é
 * ampliada muito além da resolução original — foto pequena fica menor, não borrada.
 */
export function ProjectGallery({
  count,
  title,
  images = [],
  dims = {},
}: {
  count: number;
  title: string;
  images?: string[];
  dims?: Dims;
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
  const dim = (i: number) => (images[i] ? dims[images[i]] : undefined) ?? { w: 1600, h: 1200 };

  return (
    <>
      <div className="shell pb-[clamp(3rem,7vw,5rem)]">
        <div className="columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3">
          {items.map((_, i) => {
            const d = dim(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpen(i)}
                data-reveal="fade"
                data-reveal-delay={(i % 3) * 0.06}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[8px] md:mb-6"
              >
                <div
                  className="mx-auto transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  style={{ maxWidth: Math.max(260, Math.round(d.w * 1.3)) }}
                >
                  {images[i] ? (
                    <Image
                      src={images[i]}
                      alt={`${title} — imagem ${i + 1}`}
                      width={d.w}
                      height={d.h}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-auto w-full rounded-[8px]"
                    />
                  ) : (
                    <ImageBox ratio="4 / 3" label={`${title} — imagem ${i + 1}`} />
                  )}
                </div>
                <span className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-paper/0 text-ink opacity-0 transition-all duration-300 group-hover:bg-paper group-hover:opacity-100">
                  <Arrow className="h-4 w-4 -rotate-45" />
                </span>
              </button>
            );
          })}
        </div>
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
            {items.map((_, i) => {
              const d = dim(i);
              return (
                <div
                  key={i}
                  className="absolute inset-x-4 inset-y-0 flex items-center justify-center transition-opacity duration-500"
                  style={{ opacity: i === open ? 1 : 0, pointerEvents: i === open ? "auto" : "none" }}
                >
                  {images[i] ? (
                    // só carrega a foto ativa e as vizinhas; a ampliação nunca passa de ~1,6x o original
                    Math.abs(i - open) <= 1 || count <= 3 ? (
                      <Image
                        src={images[i]}
                        alt={`${title} — imagem ${i + 1}`}
                        width={d.w}
                        height={d.h}
                        sizes="100vw"
                        className="h-auto max-h-[calc(100vh-11rem)] w-auto max-w-full rounded-[4px] object-contain"
                        style={{ maxWidth: Math.round(d.w * 1.6) }}
                      />
                    ) : null
                  ) : (
                    <div className="w-full max-w-5xl">
                      <ImageBox ratio="16 / 10" variant="bleed" className="bg-iron" label={`${title} — imagem ${i + 1}`} />
                    </div>
                  )}
                </div>
              );
            })}

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
