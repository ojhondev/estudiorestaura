"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { topoLines } from "@/lib/topo";

/**
 * Mapa topográfico que se desenha sozinho quando a seção entra na tela:
 * cada curva de nível é traçada de ponta a ponta, uma cota depois da outra.
 * Decorativo (aria-hidden); com "reduzir movimento" aparece já desenhado.
 */
export function TopoDraw({
  seed = 11,
  levels = 11,
  className = "",
}: {
  seed?: number;
  levels?: number;
  className?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [ready, setReady] = useState(false);
  const [portrait, setPortrait] = useState(false);

  // celular em pé: tela alta, então o mapa também é alto (senão o corte "slice" estoura a escala)
  const W = portrait ? 900 : 1600;
  const H = portrait ? 1700 : 900;
  const lines = useMemo(
    () => (ready ? topoLines({ w: W, h: H, levels: portrait ? levels + 2 : levels, seed, cols: portrait ? 38 : 54 }) : []),
    [ready, W, H, portrait, levels, seed],
  );

  useEffect(() => {
    setPortrait(window.innerWidth < 768);
    setReady(true);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(rm);
    const el = ref.current;
    if (!el || rm || !("IntersectionObserver" in window)) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          // dois frames: garante que o estado "apagado" foi pintado antes de transitar
          requestAnimationFrame(() => requestAnimationFrame(() => setDrawn(true)));
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 16%, #000 84%, transparent 100%)",
      }}
    >
      {ready &&
        lines.map((ln, i) => {
          const index = ln.level % 4 === 0; // curva mestra, mais marcada
          return (
            <path
              key={i}
              d={ln.d}
              pathLength={1}
              fill="none"
              stroke="#c7452d"
              strokeOpacity={index ? 0.55 : 0.3}
              strokeWidth={index ? 1.8 : 1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                transition: reduce
                  ? "none"
                  : `stroke-dashoffset ${2.6 + (i % 5) * 0.35}s cubic-bezier(0.5, 0, 0.2, 1) ${ln.level * 0.22 + (i % 3) * 0.12}s`,
              }}
            />
          );
        })}
    </svg>
  );
}
