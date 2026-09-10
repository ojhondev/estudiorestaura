"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/anim";

/** Lenis smooth scroll, driven by GSAP's ticker and wired to ScrollTrigger. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // Reset scroll on route change.
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
