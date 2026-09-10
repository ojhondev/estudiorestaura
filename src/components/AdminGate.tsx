"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the marketing chrome (nav / footer / cookie bar) on /admin routes. */
export function AdminGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <>{children}</>;
}
