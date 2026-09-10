"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Elements with `data-reveal` fade + rise as they enter the viewport
 * (`data-reveal="fade"` skips the rise). IntersectionObserver + a CSS
 * transition — no animation-loop dependency — with a failsafe so nothing
 * stays hidden. Re-runs on route change.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"),
    );
    if (!items.length) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((el) => io.observe(el));

    const failsafe = window.setTimeout(() => {
      items.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 1.15) {
          el.classList.add("in");
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
