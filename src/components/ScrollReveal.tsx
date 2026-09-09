"use client";

import { usePathname } from "next/navigation";
import {
  gsap,
  motionQuery,
  ScrollTrigger,
  useIsoLayoutEffect,
} from "@/lib/gsap";

/**
 * Global, declarative scroll reveal. Any element with `data-reveal="up" | "fade"`
 * fades in when it enters the viewport. `data-reveal-delay` (seconds) offsets it.
 * Respects prefers-reduced-motion. Re-initialises on route change.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const mm = gsap.matchMedia();

    const motion = motionQuery();

    mm.add(
      {
        motion: motion === "all" ? "all" : "(prefers-reduced-motion: no-preference)",
        reduced:
          motion === "all"
            ? "(prefers-reduced-motion: reduce) and (max-width: 1px)"
            : "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");

        if (ctx.conditions?.reduced) {
          gsap.set(items, { opacity: 1, y: 0 });
          return;
        }

        items.forEach((item) => {
          const y = item.dataset.reveal === "up" ? 34 : 0;
          gsap.set(item, { opacity: 0, y });
          ScrollTrigger.create({
            trigger: item,
            start: "top 88%",
            once: true,
            onEnter: () =>
              gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.95,
                ease: "expo.out",
                delay: parseFloat(item.dataset.revealDelay || "0"),
              }),
          });
        });

        ScrollTrigger.refresh();
      },
    );

    return () => mm.revert();
  }, [pathname]);

  return null;
}
