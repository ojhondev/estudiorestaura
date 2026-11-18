"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ImageBox } from "@/components/ImageBox";
import { InstagramIcon } from "@/components/InstagramIcon";
import { Arrow } from "@/components/ui";
import { INSTAGRAM, nav, WHATSAPP } from "@/lib/content";
import { NAV_FOTOS } from "@/lib/photos";

/**
 * Barra de menu tradicional, fixa no topo: não se esconde ao rolar.
 * Em telas largas mostra os links; em telas estreitas vira botão "Menu",
 * que abre o painel em tela cheia (com as imagens abstratas).
 */
export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] border-b bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled || open ? "border-mist shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]" : "border-transparent"
        }`}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="Início — Estúdio Restaura" className="flex shrink-0 items-center">
            <Logo priority className="h-[26px] w-auto sm:h-[32px]" />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active(item.href) ? "page" : undefined}
                className={`relative whitespace-nowrap rounded-[80px] px-2.5 py-2 text-[13px] font-medium tracking-[0.01em] transition-colors hover:text-ember xl:px-3.5 ${
                  active(item.href) ? "text-ember" : "text-ink"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-2.5 -bottom-px xl:inset-x-3.5 h-px origin-left bg-ember transition-transform duration-300 ${
                    active(item.href) ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={INSTAGRAM.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Instagram @${INSTAGRAM.handle}`}
              className="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-mist hover:text-ember"
            >
              <InstagramIcon />
            </a>
            <a
              href={WHATSAPP.href}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 whitespace-nowrap rounded-[80px] bg-ember px-4 py-2.5 text-[12px] xl:px-5 font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 sm:inline-flex"
            >
              Fale conosco
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              className="flex items-center gap-3 rounded-[1584px] border border-mist px-4 py-2.5 text-ink transition-colors hover:border-ember lg:hidden"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.22em]">{open ? "Fechar" : "Menu"}</span>
              <span className="relative block h-[9px] w-4">
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${open ? "top-1 rotate-45" : "top-0"}`}
                />
                <span className={`absolute left-0 top-1 block h-px w-full bg-ink transition-all duration-300 ${open ? "-rotate-45" : ""}`} />
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-200 ${open ? "top-1 opacity-0" : "top-2"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Painel em tela cheia (telas estreitas) */}
      <div
        className={`fixed inset-0 z-50 overflow-x-hidden bg-paper text-ink transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible pointer-events-auto opacity-100" : "invisible pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full min-w-0 flex-col overflow-y-auto overflow-x-hidden pt-[var(--nav-h)]">
          <nav className="shell grid flex-1 grid-cols-[minmax(0,1fr)] content-center gap-4 py-10 sm:grid-cols-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-w-0 items-stretch gap-4 rounded-[8px] border border-mist bg-[#faf9f7] p-3 transition-colors hover:border-ember hover:bg-mist"
              >
                <div className="w-2/5 shrink-0 overflow-hidden rounded-[6px]">
                  <ImageBox src={NAV_FOTOS[item.href]} alt="" ratio="4 / 3" className="h-full" label="Imagem" />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1 pr-2">
                  <div>
                    <p className="text-[15px]">{item.label}</p>
                    <p className="mt-1 text-[12px] leading-snug text-pewter">{item.desc}</p>
                  </div>
                  <Arrow className="h-3.5 w-3.5 self-end text-ink transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </nav>

          <div className="shell flex flex-col gap-4 pb-[clamp(1.5rem,5vw,2.5rem)] text-[13px] text-smoke">
            <a
              href={WHATSAPP.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-[80px] bg-ember px-5 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-paper sm:hidden"
            >
              Fale conosco
            </a>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <a href="mailto:contato@estudiorestaura.com.br" className="hover:text-ember">
                  contato@estudiorestaura.com.br
                </a>
                <a href={WHATSAPP.href} target="_blank" rel="noreferrer" className="hover:text-ember">
                  {WHATSAPP.display}
                </a>
                <a href={INSTAGRAM.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-ember">
                  <InstagramIcon className="h-4 w-4" /> @{INSTAGRAM.handle}
                </a>
              </div>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 self-start rounded-[80px] border border-mist px-3.5 py-1.5 text-[12px] font-medium text-ink hover:border-ember"
              >
                Entrar no painel
                <Arrow className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
