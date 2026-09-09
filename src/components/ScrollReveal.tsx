"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Global scroll reveal. Any element with `data-reveal` fades + rises into place
 * as it enters the viewport. Driven by IntersectionObserver + a CSS transition
 * (no animation-loop dependency), with a failsafe so nothing is ever stuck
 * hidden. `data-reveal="wipe"` skips the rise. Re-runs on route change.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    if (!items.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((el) => io.observe(el));

    // Failsafe: reveal anything at/near the viewport that the observer somehow
    // hasn't caught. The observer keeps running for the rest.
    const failsafe = window.setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.15) {
          el.classList.add("is-in");
        }
      });
    }, 2400);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [pathname]);

  return null;
}
