"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { metrics } from "@/lib/content";
import { photos } from "@/lib/photos";

const align = ["items-start", "items-center", "items-end"];

const parse = (raw: string) => ({
  target: parseInt(raw.replace(/\D/g, ""), 10) || 0,
  suffix: raw.replace(/\d/g, ""),
});

/** Conta de 0 até o valor quando o número entra na tela (easeOutExpo, sem biblioteca). */
function CountUp({ value }: { value: string }) {
  const { target, suffix } = parse(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target); // SSR e quem prefere menos movimento veem o valor final

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    let started = false;
    const run = () => {
      started = true;
      const t0 = performance.now();
      const dur = 2200;
      timer = window.setInterval(() => {
        const p = Math.min(1, (performance.now() - t0) / dur);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setN(Math.round(target * eased));
        if (p === 1) window.clearInterval(timer);
      }, 32);
    };
    // começa do zero e conta quando aparece
    const zero = window.setTimeout(() => setN(0), 0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    const failsafe = window.setTimeout(() => {
      if (!started) run();
      io.disconnect();
    }, 6000);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(zero);
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, [target]);

  return (
    <span ref={ref}>
      {n.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

export function Numbers() {
  // linha em destaque (hover no computador, toque no celular)
  const [active, setActive] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <section className="shell py-[clamp(4.5rem,10vw,8rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Indicadores
          </p>
          <h2 data-reveal="clip" className="h-lg mt-4 text-[clamp(2.5rem,7vw,5rem)]">
            Em números
          </h2>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-12 md:mt-24 md:gap-0">
        {metrics.map(([value, label], i) => {
          const imgs = photos(`numbers:${label}`, 3);
          const on = active === i;
          return (
            <div
              key={label}
              className={`flex flex-col ${align[i % 3]}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
              }}
              onClick={() => setActive(on ? null : i)}
            >
              <div data-reveal className="relative cursor-pointer">
                <span
                  className={`display block text-[clamp(4.5rem,22vw,16rem)] leading-[0.8] tabular-nums transition-colors duration-500 ${on ? "text-ember" : ""}`}
                >
                  <CountUp value={value} />
                </span>
                <span className="mt-3 block text-[15px] text-smoke">{label}</span>
                <span className="mt-1 block text-[12px] uppercase tracking-[0.16em] text-ember md:hidden">
                  {on ? "Toque para fechar" : "Toque para ver imagens"}
                </span>

                {/* Computador: imagens que acompanham o mouse */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
                  style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
                >
                  <div className="relative -ml-40 -mt-48 h-[22rem] w-[22rem]">
                    {imgs.map((src, k) => (
                      <span
                        key={src}
                        className="absolute overflow-hidden rounded-[8px] bg-mist shadow-xl transition-all duration-500 ease-out"
                        style={{
                          width: k === 0 ? "15rem" : "11rem",
                          height: k === 0 ? "19rem" : "14rem",
                          left: k === 0 ? "2rem" : k === 1 ? "-5rem" : "9.5rem",
                          top: k === 0 ? "1rem" : k === 1 ? "9rem" : "-3rem",
                          opacity: on ? 1 : 0,
                          transform: on ? `rotate(${[-3, 5, -6][k]}deg) scale(1)` : "rotate(0deg) scale(0.7)",
                          transitionDelay: on ? `${k * 70}ms` : "0ms",
                          zIndex: 3 - k,
                        }}
                      >
                        <Image src={src} alt="" fill sizes="240px" className="object-cover" />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Celular: faixa de imagens abaixo do número */}
                <div
                  className={`grid grid-cols-3 gap-2 overflow-hidden transition-all duration-500 md:hidden ${on ? "mt-4 max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  {imgs.map((src) => (
                    <span key={src} className="relative block aspect-[3/4] overflow-hidden rounded-[8px] bg-mist">
                      <Image src={src} alt="" fill sizes="30vw" className="object-cover" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p data-reveal className="measure mt-16 text-[16px] text-pewter">
        Projetos, laudos e edifícios acompanhados desde a fundação do estúdio.
      </p>
    </section>
  );
}
