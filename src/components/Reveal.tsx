"use client";

import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion, useIso } from "@/lib/anim";

/**
 * Global scroll animation:
 *  - [data-reveal]         fade + rise
 *  - [data-reveal="clip"]  clip-path wipe (headings)
 *  - [data-reveal="fade"]  fade only
 *  - [data-parallax="0.2"] gentle parallax on scroll
 * Reduced motion / failsafe: everything ends visible.
 */
export function Reveal() {
  const pathname = usePathname();

  useIso(() => {
    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");

    if (reducedMotion()) {
      gsap.set(reveals, { autoAlpha: 1, y: 0, clipPath: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      reveals.forEach((el) => {
        const kind = el.dataset.reveal;
        if (kind === "clip") {
          gsap.fromTo(
            el,
            { clipPath: "inset(0 0 100% 0)", y: 20 },
            {
              clipPath: "inset(0 0 0% 0)",
              y: 0,
              duration: 1.1,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            },
          );
        } else {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: kind === "fade" ? 0 : 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
              delay: parseFloat(el.dataset.revealDelay || "0"),
              scrollTrigger: { trigger: el, start: "top 90%" },
            },
          );
        }
      });

      parallax.forEach((el) => {
        const amt = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { yPercent: -amt * 50 },
          {
            yPercent: amt * 50,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    // Failsafe.
    const t = window.setTimeout(() => {
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          gsap.set(el, { autoAlpha: 1, y: 0, clipPath: "none" });
        }
      });
    }, 2600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
