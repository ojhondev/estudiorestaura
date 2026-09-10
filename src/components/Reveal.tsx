"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/anim";

/**
 * Reveal on scroll.
 *  - `[data-reveal]`         → fade + rise   (IntersectionObserver + CSS)
 *  - `[data-reveal="clip"]`  → clip-path wipe
 *  - `[data-reveal="fade"]`  → fade only
 *  - `[data-parallax="0.2"]` → gentle scroll parallax (GSAP; degrades to none)
 *
 * The visibility layer is pure IO + CSS — no animation-loop dependency — so it
 * behaves identically on mobile. GSAP only drives the optional parallax.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"),
    );
    const reduce = reducedMotion();

    if (items.length && (reduce || !("IntersectionObserver" in window))) {
      items.forEach((el) => el.classList.add("in"));
    } else if (items.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const d = parseFloat(el.dataset.revealDelay || "0");
            if (d) el.style.transitionDelay = `${d}s`;
            el.classList.add("in");
            io.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      items.forEach((el) => io.observe(el));

      // Backup: plain scroll check, in case IO never delivers (some mobile
      // webviews). Removes itself once everything is revealed.
      const check = () => {
        let remaining = false;
        items.forEach((el) => {
          if (el.classList.contains("in")) return;
          if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
            el.classList.add("in");
          } else {
            remaining = true;
          }
        });
        if (!remaining) window.removeEventListener("scroll", check);
      };
      window.addEventListener("scroll", check, { passive: true });

      const failsafe = window.setTimeout(() => {
        items.forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 1.4) {
            el.classList.add("in");
          }
        });
      }, 2600);

      cleanups.push(() => {
        io.disconnect();
        window.removeEventListener("scroll", check);
        window.clearTimeout(failsafe);
      });
    }

    if (!reduce) {
      const parallax = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      if (parallax.length) {
        const ctx = gsap.context(() => {
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
        requestAnimationFrame(() => ScrollTrigger.refresh());
        cleanups.push(() => ctx.revert());
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [pathname]);

  return null;
}
