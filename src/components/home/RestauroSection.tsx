"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  useIsoLayoutEffect,
} from "@/lib/gsap";
import { SplitLetters } from "@/components/Split";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

// Loose hand-drawn scribble — a chain of cursive loops across the spread.
const SCRIBBLE =
  "M88.3 379.7C97.9 378 128.3 374 145.9 369.6C163.5 365.2 179.7 360.8 193.6 353.4C207.5 346 218.2 334.9 229.6 325.2C241 315.5 253.6 306.8 261.8 295C270 283.3 275.2 267.9 278.8 254.7C282.4 241.5 284.9 228.5 283.7 215.8C282.5 203.1 276.4 188.9 271.6 178.4C266.8 167.9 263 161.2 254.9 153C246.8 144.8 233.8 133.4 223.2 129.5C212.6 125.6 202.3 128.5 191.5 129.4C180.7 130.3 168.8 130.4 158.3 135.1C147.9 139.8 137.6 149.1 128.8 157.8C120.1 166.6 111.2 175.6 105.8 187.6C100.4 199.6 97.9 215.8 96.6 230.1C95.3 244.4 94.5 259.1 98 273.5C101.5 287.9 110.2 302.3 117.8 316.3C125.4 330.3 131.9 344.9 143.5 357.6C155.1 370.3 171.9 383.4 187.5 392.4C203.1 401.4 220.5 410.9 237 411.5C253.5 412.1 267.6 398.9 286.3 395.8C305 392.7 329 396.3 349.2 392.9C369.4 389.5 390.4 381.4 407.3 375.6C424.2 369.8 437.6 366.8 450.5 358.1C463.4 349.4 476.7 334.2 484.8 323.5C492.9 312.8 495.6 304 499.4 293.8C503.2 283.6 509.1 272.3 507.8 262.1C506.5 252 498 241.4 491.3 232.9C484.6 224.4 478.3 216.9 467.8 211.3C457.4 205.7 441.9 202.3 428.6 199.5C415.4 196.7 402.5 194.1 388.3 194.5C374.1 194.9 356 198.7 343.2 202.2C330.4 205.7 322.1 209.1 311.6 215.6C301.1 222.1 286.6 231.1 280.1 241.3C273.6 251.5 274 264.5 272.5 276.8C271 289.1 267.8 303.2 270.9 315.1C274 327 282.7 337.6 291.1 348C299.5 358.4 309.1 367.8 321.5 377.2C333.9 386.6 348.8 396.7 365.7 404.7C382.6 412.7 403.5 414.2 423.1 425.4C442.7 436.6 462.5 465.7 483.3 471.8C504.1 477.9 528.5 467.1 548.1 462.1C567.7 457.1 583.7 449.9 600.7 441.9C617.7 433.9 636.6 426 650.1 413.9C663.6 401.8 672.3 384 681.5 369.5C690.7 355 701.5 342 705.2 326.7C708.9 311.4 705.9 292.1 703.5 277.9C701.1 263.7 697 253.6 690.8 241.3C684.5 229 676.9 213.5 666 204.2C655.1 194.8 638.5 188.8 625.5 185.2C612.5 181.6 601.6 182 587.8 182.6C574 183.2 556.5 184.1 542.7 188.9C529 193.7 516.2 202.7 505.3 211.4C494.4 220.1 484.3 228.7 477.3 240.9C470.3 253.1 465.4 268.8 463.3 284.6C461.2 300.4 460.9 319.7 464.5 335.9C468.1 352.1 475.8 366.3 485.1 381.7C494.4 397.1 506.1 415.2 520.1 428.1C534.1 441.1 551.7 451 569.2 459.4C586.7 467.8 605.8 478 624.9 478.2C644 478.4 665 463.9 683.8 460.3C702.6 456.7 720.7 461 737.9 456.6C755.1 452.3 772.2 441.9 787.1 434.2C802 426.5 815.5 420.2 827.2 410.4C838.9 400.6 849.3 386.7 857.4 375.2C865.5 363.7 872.1 353.4 876 341.3C879.9 329.3 881.6 314.7 880.9 302.9C880.2 291.1 876.6 281 871.7 270.5C866.8 260 860.6 247.7 851.3 239.7C842 231.7 827.8 225.7 815.9 222.6C804 219.5 791.8 220.4 780.2 221C768.6 221.6 756.7 222.4 746.1 226.1C735.5 229.8 724.6 235.3 716.7 242.9C708.8 250.5 704.4 261.8 698.8 271.9C693.2 282 684.4 292.8 683.2 303.8C682 314.8 687.9 325.8 691.4 338C694.9 350.2 696.1 365.2 704 377.1C711.9 389 726.2 399.6 739 409.5C751.8 419.4 766.4 428.4 780.6 436.6C794.8 444.8 807.7 451.3 824.4 458.8C841.1 466.3 863.5 479.2 880.6 481.6C897.7 484 912.5 478.3 927 473.4C941.5 468.5 954.2 461.5 967.8 452.5C981.4 443.5 998.1 430.9 1008.8 419.4C1019.5 407.8 1025.4 396.8 1031.8 383.2C1038.2 369.6 1043.9 353.1 1047.3 337.9C1050.7 322.7 1052.5 306.1 1052.4 292.1C1052.3 278.1 1050.4 265.6 1046.6 253.9C1042.8 242.2 1036.6 230.4 1029.6 221.9C1022.6 213.4 1012.8 207.3 1004.4 202.7C996 198.1 988.2 194.7 979.4 194.3C970.6 193.9 959.8 196 951.6 200.4C943.4 204.8 935.6 212.7 930.2 220.8C924.8 228.9 922.4 238 919 249.2C915.6 260.4 910.5 274.6 910 287.9C909.5 301.2 912.5 314.9 916 329.1C919.5 343.4 924.8 359.4 931 373.4C937.2 387.3 943.8 400.9 953.3 412.8C962.8 424.7 974.7 435.8 988.2 444.6C1001.7 453.5 1018.8 462.8 1034.1 465.9C1049.4 469 1072.3 463.7 1079.9 463.3";

const BLOCKS = [
  {
    kicker: "Projetos de arquitetura",
    body: "Intervenções de restauro e ampliações contemporâneas que dialogam com a preexistência, sempre com estruturas reversíveis e materialidade honesta.",
    href: "/servicos",
  },
  {
    kicker: "Conservação preventiva",
    body: "Planos que antecipam a deterioração — monitoramento ambiental, inspeções periódicas e protocolos de manutenção que reduzem grandes intervenções.",
    href: "/servicos",
  },
];

export function RestauroSection() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-anim]"), { autoAlpha: 1 });
      gsap.set(el.querySelectorAll(".mask > span"), { yPercent: 0 });
      gsap.set(el.querySelector(".rs-scribble path"), { strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set([".rs-h", ".rs-sub", ".rs-vert"], { autoAlpha: 1 });
      // Pre-hide the letters (before first paint) so the reveal never flashes.
      gsap.set([".rs-h .sl", ".rs-sub .sl", ".rs-vert .sl"], { yPercent: 118 });

      gsap.to(".rs-h .sl", {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ".rs-h", start: "top 82%" },
      });
      gsap.to(".rs-sub .sl", {
        yPercent: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.03,
        scrollTrigger: { trigger: ".rs-sub", start: "top 90%" },
      });
      gsap.to(".rs-vert .sl", {
        yPercent: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: el, start: "top 62%" },
      });

      // Scribble drawn on as the spread scrolls through
      const path = el.querySelector<SVGPathElement>(".rs-scribble path");
      if (path) {
        gsap.fromTo(
          path,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 15%",
              scrub: 0.8,
            },
          },
        );
      }
    }, el);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative mt-28 overflow-hidden bg-blush py-[clamp(4rem,10vw,9rem)] text-ink md:mt-40"
    >
      {/* Scribble overlay */}
      <svg
        className="rs-scribble pointer-events-none absolute inset-0 h-full w-full mix-blend-multiply"
        viewBox="0 0 1200 560"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={SCRIBBLE}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          fill="none"
          stroke="var(--color-terracotta)"
          strokeOpacity={0.38}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>

      {/* Vertical lettering on the right edge */}
      <div
        data-anim
        className="rs-vert pointer-events-none absolute right-[1.5vw] top-0 hidden h-full items-center lg:flex"
      >
        <SplitLetters
          vertical
          text="restauro"
          className="display block text-[clamp(4rem,15vh,12rem)] opacity-80"
        />
      </div>

      <div className="shell relative">
        <SplitLetters
          text="restauro"
          className="rs-h display block text-[clamp(3rem,15.5vw,13rem)]"
        />
        <p className="rs-sub mt-3 text-[clamp(1.4rem,4.5vw,3rem)] font-medium tracking-[-0.03em]">
          <SplitLetters text="além da obra." />
        </p>
      </div>

      <div className="shell relative mt-16 grid gap-x-12 gap-y-16 md:mt-24 lg:grid-cols-2 lg:pr-[9vw]">
        {BLOCKS.map((b, i) => (
          <div
            key={i}
            data-reveal
            className={`grid gap-6 sm:grid-cols-2 sm:items-end ${
              i === 1 ? "sm:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="relative">
              <ImagePlaceholder ratio="3 / 4" tone="blush" />
              {i === 1 && (
                <div className="absolute -bottom-10 -left-10 hidden w-2/3 sm:block">
                  <ImagePlaceholder ratio="4 / 3" tone="blush" />
                </div>
              )}
            </div>
            <div className="sm:pb-2">
              <h3 className="text-[15px] font-medium">{b.kicker}</h3>
              <p className="mt-3 max-w-xs text-[15px] text-ink-soft">{b.body}</p>
              <Link href={b.href} className="ulink mt-5 text-[14px]">
                Saber mais
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
