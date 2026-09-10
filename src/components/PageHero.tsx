import type { ReactNode } from "react";
import { ImageBox } from "@/components/ImageBox";
import { photo } from "@/lib/photos";

export function PageHero({
  label,
  title,
  intro,
  imageLabel = "Espaço para imagem",
  imageUrl,
}: {
  label: string;
  title: string;
  intro?: ReactNode;
  imageLabel?: string;
  imageUrl?: string;
}) {
  return (
    <section className="bleed relative flex min-h-[72vh] items-end overflow-hidden">
      <ImageBox
        fill
        variant="bleed"
        src={imageUrl ?? photo(`pagehero:${title}`)}
        alt=""
        label={imageLabel}
        sizes="100vw"
        priority
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/75 via-midnight/20 to-midnight/40"
      />
      <div className="relative shell pb-[clamp(2.5rem,7vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] text-paper">
        <p data-reveal="fade" className="label text-mist/70">
          {label}
        </p>
        <h1
          data-reveal
          className="display mt-4 text-[clamp(2.75rem,10vw,7.5rem)]"
        >
          {title}
        </h1>
        {intro && (
          <p
            data-reveal
            className="mt-6 max-w-[38rem] text-[15px] leading-[1.6] text-paper/85"
          >
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
