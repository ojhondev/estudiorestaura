import type { Metadata } from "next";
import { Montserrat, Lora, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CookieBar } from "@/components/CookieBar";
import { AdminGate } from "@/components/AdminGate";
import { QuotePopup } from "@/components/QuotePopup";
import { BackToTop } from "@/components/BackToTop";
import { ImageGuard } from "@/components/ImageGuard";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

/** Letra de rascunho: anotações à mão da seção "O escritório". */
const hand = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  preload: false, // só aparece na seção "O escritório", bem abaixo da dobra
});

export const metadata: Metadata = {
  metadataBase: new URL("https://estudiorestaura.com.br"),
  title: {
    default: "Estúdio Restaura — arquitetura, conservação e restauro",
    template: "%s · Estúdio Restaura",
  },
  description:
    "Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.",
  alternates: { canonical: "./" },
  openGraph: {
    title: "Estúdio Restaura",
    description:
      "Arquitetura, conservação e restauro de patrimônio histórico e cultural.",
    type: "website",
    locale: "pt_BR",
    siteName: "Estúdio Restaura",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Estúdio Restaura" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${lora.variable} ${plex.variable} ${hand.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <JsonLd data={[organizationLd, websiteLd]} />
        <SmoothScroll />
        <AdminGate>
          <SiteNav />
        </AdminGate>
        <main className="flex-1">{children}</main>
        <AdminGate>
          <SiteFooter />
          <CookieBar />
          <QuotePopup />
          <BackToTop />
          <ImageGuard />
        </AdminGate>
        <Reveal />
        <SiteAnalytics />
      </body>
    </html>
  );
}
