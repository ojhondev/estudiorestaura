import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ScrollReveal } from "@/components/ScrollReveal";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
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
    <html lang="pt-BR" className={`${archivo.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <noscript>
          <style>{`[data-reveal],[data-anim]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
