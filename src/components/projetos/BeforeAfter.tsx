"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type Pair = { before: string; after: string; caption: string };

/** Comparador antes/depois: arraste (ou use as setas do teclado) para revelar. */
function Compare({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <figure data-reveal>
      <div
        ref={box}
        className="relative aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-[8px] bg-mist"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          move(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && move(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        <Image src={pair.after} alt="Depois" fill sizes="(min-width: 1024px) 50vw, 100vw" quality={85} className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={pair.before} alt="Antes" fill sizes="(min-width: 1024px) 50vw, 100vw" quality={85} className="object-cover" />
        </div>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
          Antes
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-white">
          Depois
        </span>
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[13px] text-ink shadow-lg">
            ⇄
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="Comparar antes e depois"
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          style={{ pointerEvents: "none" }}
        />
      </div>
      {pair.caption && <figcaption className="mt-2 text-[13px] text-pewter">{pair.caption}</figcaption>}
    </figure>
  );
}

export function BeforeAfter({ pairs }: { pairs: Pair[] }) {
  if (!pairs.length) return null;
  return (
    <section className="shell pb-[clamp(3rem,7vw,5rem)]">
      <p data-reveal="fade" className="label">
        Antes e depois
      </p>
      <h2 data-reveal className="h mt-3 text-[clamp(1.5rem,3vw,2.25rem)]">
        O que o restauro devolveu
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {pairs.map((p, i) => (
          <Compare key={i} pair={p} />
        ))}
      </div>
    </section>
  );
}
