"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  motionQuery,
  ScrollTrigger,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

function Lettered({
  text,
  className = "",
  vertical = false,
}: {
  text: string;
  className?: string;
  vertical?: boolean;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          className="letter-mask"
          style={vertical ? { verticalAlign: "top" } : undefined}
          aria-hidden
        >
          <span className="lettered">{c}</span>
        </span>
      ))}
    </span>
  );
}

const BLOCKS = [
  {
    kicker: "Projetos de arquitetura",
    body: "O Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.",
    href: "/servicos",
  },
  {
    kicker: "Conservação preventiva",
    body: "O Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.",
    href: "/servicos",
  },
];

export function RestauroSection() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia(root.current ?? undefined);

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(".rs-scribble path", { strokeDashoffset: 0 });
    });

    mm.add(motionQuery(), () => {
      // Headline lettering
      gsap
        .timeline({
          scrollTrigger: { trigger: ".rs-hero", start: "top 80%" },
        })
        .to(".rs-hero", { opacity: 1, duration: 0.2 })
        .from(
          ".rs-hero .lettered",
          { yPercent: 118, duration: 1.1, ease: "expo.out", stagger: 0.045 },
          0,
        )
        .from(
          ".rs-sub",
          { yPercent: 60, opacity: 0, duration: 0.8, ease: "expo.out" },
          0.25,
        );

      // Vertical lettering on the right edge
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top 55%" },
        })
        .to(".rs-vertical", { opacity: 1, duration: 0.2 })
        .from(
          ".rs-vertical .lettered",
          { yPercent: 118, duration: 1, ease: "expo.out", stagger: 0.05 },
          0,
        );

      // Scribble draw-on, tied to scroll through the section
      const paths = gsap.utils.toArray<SVGPathElement>(".rs-scribble path");
      gsap.set(paths, { strokeDashoffset: 1 });
      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 65%",
          scrub: 0.6,
        },
      });
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative mt-28 overflow-hidden bg-blush py-[clamp(3.5rem,9vw,8rem)] text-ink md:mt-40"
    >
      {/* Scribble overlay */}
      <svg
        className="rs-scribble pointer-events-none absolute inset-0 h-full w-full opacity-[0.4] mix-blend-multiply"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          d="M40 120 C 260 40, 300 260, 520 180 S 820 20, 1010 140 S 1180 360, 980 420 S 560 360, 470 520 S 720 700, 1010 620"
          fill="none"
          stroke="var(--color-terracotta)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          d="M120 700 C 300 620, 420 780, 640 690 S 980 760, 1120 640"
          fill="none"
          stroke="var(--color-terracotta)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      {/* Vertical lettering on the right edge */}
      <div
        data-anim
        className="rs-vertical pointer-events-none absolute right-[1vw] top-0 hidden h-full items-center lg:flex"
      >
        <Lettered
          vertical
          text="restauro"
          className="display block text-[clamp(4rem,15vh,13rem)] leading-none [writing-mode:vertical-rl]"
        />
      </div>

      <div data-anim className="rs-hero shell relative">
        <Lettered
          text="restauro"
          className="display block text-[clamp(3rem,15.5vw,13rem)]"
        />
        <p className="rs-sub mt-2 font-display text-[clamp(1.4rem,4.6vw,3.2rem)] font-bold tracking-[-0.02em]">
          além da obra.
        </p>
      </div>

      <div className="shell relative mt-14 grid gap-x-10 gap-y-16 md:mt-20 lg:grid-cols-2 lg:pr-[8vw]">
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            data-reveal="up"
            className={`grid gap-6 sm:grid-cols-2 sm:items-center ${
              i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative">
              <ImagePlaceholder ratio="3 / 4" tone="blush" />
              {i === 1 && (
                <div className="absolute -bottom-8 -left-8 hidden w-2/3 sm:block">
                  <ImagePlaceholder ratio="4 / 3" tone="blush" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display text-base font-bold">{b.kicker}</h3>
              <p className="mt-3 max-w-xs text-ink-soft">{b.body}</p>
              <Link
                href={b.href}
                className="mt-5 inline-block rounded-full border border-ink px-6 py-2.5 text-sm transition-colors hover:bg-ink hover:text-blush"
              >
                Saber mais
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
