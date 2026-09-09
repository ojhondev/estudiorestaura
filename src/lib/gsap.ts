import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).gsap = gsap;
    (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
  }
}

/** useLayoutEffect on the client, useEffect on the server (no SSR warning). */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * matchMedia query that gates motion. Normally the OS setting, but a
 * `localStorage["er:force-motion"] = "1"` override forces animations on
 * (used to preview motion where the browser reports reduce). */
export function motionQuery(): string {
  try {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("er:force-motion") === "1"
    ) {
      return "all";
    }
  } catch {
    /* ignore */
  }
  return "(prefers-reduced-motion: no-preference)";
}

export { gsap, ScrollTrigger };
