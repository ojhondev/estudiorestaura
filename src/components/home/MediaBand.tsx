"use client";

import { useState } from "react";

export type MediaBandData = {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
  caption?: string;
};

export function MediaBand({ videoUrl, posterUrl, title, caption }: MediaBandData) {
  const [show, setShow] = useState(false);

  return (
    <div
      data-reveal
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow((v) => !v)}
      className="group relative mt-14 flex aspect-[16/10] cursor-pointer items-center justify-center overflow-hidden rounded-[8px] bg-mist text-ink sm:aspect-[16/8] lg:aspect-[16/7]"
    >
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
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

      {/* hover / tap overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-black/70 p-6 text-paper transition-opacity duration-500 md:p-10 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      >
        {title && (
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-paper/70">
            {title}
          </p>
        )}
        {caption && (
          <p className="mt-2 max-w-[46ch] text-[clamp(1.1rem,2.2vw,1.75rem)] font-light leading-snug">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
