"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Pair = { before: string; after: string; caption: string };

/**
 * Comparador antes/depois. Funciona clicando, **segurando e arrastando** (mouse e
 * toque) e pelo teclado (setas). O arraste usa ouvintes na janela, então
 * continua mesmo que o ponteiro saia da imagem.
 */
function Compare({ pair }: { pair: Pair }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const move = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r || !r.width) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => move(e.clientX);
    const stop = () => setDragging(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.style.userSelect = prev;
    };
  }, [dragging, move]);

  return (
    <figure data-reveal>
      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Comparar antes e depois"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        className={`relative aspect-[4/3] w-full select-none overflow-hidden rounded-[8px] bg-mist ${dragging ? "cursor-grabbing" : "cursor-ew-resize"}`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={(e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          e.preventDefault();
          setDragging(true);
          move(e.clientX);
        }}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
        }}
      >
        <Image
          src={pair.after}
          alt="Depois"
          fill
          draggable={false}
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={85}
          className="pointer-events-none object-cover"
        />
        <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image
            src={pair.before}
            alt="Antes"
            fill
            draggable={false}
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={85}
            className="pointer-events-none object-cover"
          />
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
          <span
            className={`absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[13px] text-ink shadow-lg ${dragging ? "scale-110" : ""}`}
          >
            ⇄
          </span>
        </div>
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
