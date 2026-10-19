"use client";

import { useState } from "react";

export type MediaBandData = {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  caption?: string;
};

export function MediaBand({ videoUrl, posterUrl, title, caption }: MediaBandData) {
  // `hover` = mouse sobre o vídeo / toque → o texto some e o vídeo fica livre.
  const [hover, setHover] = useState(false);

  return (
    <div
      data-reveal
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setHover((v) => !v)}
      className="group relative mt-14 flex aspect-[4/5] cursor-pointer items-end overflow-hidden rounded-[8px] bg-mist text-ink sm:aspect-[16/9] lg:aspect-[16/7]"
    >
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
          src={videoUrl}
          poster={posterUrl || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <span className="absolute bottom-5 left-6 text-[12px] uppercase tracking-[0.18em] text-pewter">
          Espaço para vídeo
        </span>
      )}

      {/* Degradê só na base: a imagem continua visível e o texto tem fundo escuro firme */}
      <div
        aria-hidden
        style={{ opacity: hover ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-500"
      />

      {(title || caption) && (
        <div
          style={{ opacity: hover ? 0 : 1, transform: hover ? "translateY(8px)" : "none" }}
          className="relative z-10 w-full p-6 text-paper transition-[opacity,transform] duration-500 md:p-10 lg:max-w-[52%]"
        >
          {title && (
            <p className="inline-block rounded-[80px] bg-ember px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper">
              {title}
            </p>
          )}
          {caption && (
            <p className="mt-4 text-[clamp(1.25rem,2.4vw,2rem)] font-normal leading-snug text-paper [text-shadow:0_1px_14px_rgba(0,0,0,0.55)]">
              {caption}
            </p>
          )}
          <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-paper/80">
            Passe o mouse ou toque para ver o vídeo
          </p>
        </div>
      )}
    </div>
  );
}
