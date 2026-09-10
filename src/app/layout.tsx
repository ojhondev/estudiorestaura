import type { Metadata } from "next";
import { Montserrat, Lora } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CookieBar } from "@/components/CookieBar";
import { AdminGate } from "@/components/AdminGate";
import { QuotePopup } from "@/components/QuotePopup";
import { BackToTop } from "@/components/BackToTop";
import { HeaderLogo } from "@/components/HeaderLogo";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://estudiorestaura.vercel.app"),
  title: {
    default: "Estúdio Restaura — arquitetura, conservação e restauro",
    template: "%s · Estúdio Restaura",
  },
  description:
    "Estúdio Restaura é um escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural.",
  openGraph: {
    title: "Estúdio Restaura",
    description:
      "Arquitetura, conservação e restauro de patrimônio histórico e cultural.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <SmoothScroll />
        <AdminGate>
          <SiteNav />
          <HeaderLogo />
        </AdminGate>
        <main className="flex-1">{children}</main>
        <AdminGate>
          <SiteFooter />
          <CookieBar />
          <QuotePopup />
          <BackToTop />
        </AdminGate>
        <Reveal />
      </body>
    </html>
  );
}
