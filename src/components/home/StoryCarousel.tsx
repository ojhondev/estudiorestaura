"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { InstagramIcon } from "@/components/InstagramIcon";
import type { IgPost } from "@/lib/instagram";

const SLIDE_MS = 5500;

/**
 * Slide de posts em proporção de story (9:16): o card ativo fica centralizado, as barrinhas no topo
 * mostram o tempo de cada post (como nos stories) e avançam sozinhas; pausa ao passar o mouse/tocar.
 */
export function StoryCarousel({ posts }: { posts: IgPost[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const lockUntil = useRef(0);
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);

  const n = posts.length;
  const paused = hover || !visible || reduce;

  const goTo = useCallback(
    (i: number) => {
      const k = ((i % n) + n) % n;
      const el = cards.current[k];
      const tr = track.current;
      if (!el || !tr) return;
      lockUntil.current = Date.now() + 800;
      setIdx(k);
      tr.scrollTo({ left: el.offsetLeft - (tr.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
    },
    [n],
  );

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // arrastar com o dedo/mouse: descobre qual card está no centro
  useEffect(() => {
    const tr = track.current;
    if (!tr) return;
    let raf = 0;
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = tr.scrollLeft + tr.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        cards.current.forEach((c, i) => {
          if (!c) return;
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setIdx(best);
      });
    };
    tr.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      tr.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrap}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => window.setTimeout(() => setHover(false), 2500)}
      className="relative"
    >
      {/* barrinhas de tempo, estilo story */}
      <div className="mx-auto flex w-[min(21rem,86vw)] gap-1.5" aria-hidden>
        {posts.map((p, i) => (
          <button
            key={p.id}
            type="button"
            tabIndex={-1}
            onClick={() => goTo(i)}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-ink/15"
          >
            <span
              key={i === idx ? `on-${idx}` : `off-${i}`}
              className="absolute inset-y-0 left-0 block rounded-full bg-ember"
              style={
                i < idx || (i === idx && reduce)
                  ? { width: "100%" }
                  : i === idx
                    ? {
                        width: "0%",
                        animation: `story-fill ${SLIDE_MS}ms linear forwards`,
                        animationPlayState: paused ? "paused" : "running",
                      }
                    : { width: "0%" }
              }
              onAnimationEnd={() => i === idx && goTo(idx + 1)}
            />
          </button>
        ))}
      </div>

      <div className="relative">
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[9%] bg-gradient-to-r from-paper to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[9%] bg-gradient-to-l from-paper to-transparent" />
      <div
        ref={track}
        role="region"
        aria-roledescription="carrossel"
        aria-label="Últimos posts do Instagram"
        className="relative mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: "calc(50% - min(10.5rem, 43vw))" }}
      >
        {posts.map((p, i) => {
          const active = i === idx;
          return (
            <article
              key={p.id}
              ref={(el) => {
                cards.current[i] = el;
              }}
              aria-label={`Post ${i + 1} de ${n}`}
              className={`relative aspect-[9/16] w-[min(21rem,86vw)] shrink-0 snap-center overflow-hidden rounded-[22px] bg-char shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] transition-[transform,opacity] duration-500 will-change-transform ${
                active ? "scale-100 opacity-100" : "scale-[0.92] opacity-60"
              }`}
            >
              {/* fundo: miniatura de ~14 px esticada (desfoque de graça, sem filtro caro) */}
              {p.bg && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.bg} alt="" aria-hidden decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.caption ? p.caption.slice(0, 120) : "Post do Estúdio Restaura no Instagram"}
                width={540}
                height={960}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain"
              />
              {p.kind === "video" && (
                <span aria-hidden className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-midnight/55 text-paper">
                  <svg viewBox="0 0 20 20" className="ml-0.5 size-3.5" fill="currentColor"><path d="M6 4.2v11.6a.6.6 0 0 0 .9.5l9.2-5.8a.6.6 0 0 0 0-1L6.9 3.7a.6.6 0 0 0-.9.5Z" /></svg>
                </span>
              )}
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-midnight/80 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                {p.caption && <p className="line-clamp-2 text-[13.5px] leading-snug text-paper/95">{p.caption}</p>}
                <p className="mt-2 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-paper/90">
                  <InstagramIcon className="h-3.5 w-3.5" /> Ver no Instagram
                </p>
              </div>
              {/* a camada transparente deixa o arrastar funcionar e leva ao post no Instagram */}
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Abrir o post ${i + 1} no Instagram`}
                className="absolute inset-0 z-10"
                onClick={(e) => {
                  if (!active) {
                    e.preventDefault();
                    goTo(i);
                  }
                }}
              />
            </article>
          );
        })}
      </div>

      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(idx - 1)}
          aria-label="Post anterior"
          className="flex size-11 items-center justify-center rounded-full border border-mist bg-paper text-ink transition-colors hover:border-ember hover:text-ember"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12.5 4.5 7 10l5.5 5.5" />
          </svg>
        </button>
        <span className="min-w-[4.5rem] text-center text-[12px] tabular-nums tracking-[0.18em] text-smoke">
          {String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => goTo(idx + 1)}
          aria-label="Próximo post"
          className="flex size-11 items-center justify-center rounded-full border border-mist bg-paper text-ink transition-colors hover:border-ember hover:text-ember"
        >
          <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m7.5 4.5 5.5 5.5-5.5 5.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
