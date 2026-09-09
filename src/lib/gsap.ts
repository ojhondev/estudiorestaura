import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).gsap = gsap;
    (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
  }
}

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Whether motion should be suppressed. Normally follows the OS setting; a
 * `localStorage["er:force-motion"] = "1"` override forces animations on so the
 * effects can be previewed where the browser reports `reduce`.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (window.localStorage.getItem("er:force-motion") === "1") return false;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
