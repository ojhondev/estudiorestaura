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

export const useIso =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function reducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (window.localStorage.getItem("er:force-motion") === "1") return false;
  } catch {
    /* ignore */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
