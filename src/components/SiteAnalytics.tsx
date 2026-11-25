"use client";

import { Analytics } from "@vercel/analytics/next";

/** Medição de visitas (Vercel Web Analytics, sem cookies). Ignora o painel /admin. */
export function SiteAnalytics() {
  return <Analytics beforeSend={(event) => (new URL(event.url).pathname.startsWith("/admin") ? null : event)} />;
}
