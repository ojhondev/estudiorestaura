"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Arrow } from "@/components/ui";
import { nav } from "@/lib/content";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        className="fixed right-[clamp(1rem,4vw,2rem)] top-[clamp(1rem,4vw,1.75rem)] z-[60] flex items-center gap-3 rounded-[1584px] border border-mist bg-paper px-4 py-2.5 text-ink shadow-[0_12px_36px_-12px_rgba(0,0,0,0.28)]"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.22em]">
          {open ? "Fechar" : "Estúdio Restaura"}
        </span>
        <span className="relative block h-[9px] w-4">
          <span
            className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
              open ? "top-1 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1 block h-px w-full bg-ink transition-all duration-300 ${
              open ? "-rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 block h-px w-full bg-ink transition-all duration-200 ${
              open ? "top-1 opacity-0" : "top-2"
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-50 bg-paper text-ink transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="shell flex items-center justify-between pt-[clamp(1.25rem,4vw,2rem)]">
            <Link href="/" aria-label="Início">
              <Logo className="h-4 w-auto md:h-5" />
            </Link>
          </div>

          <nav className="shell grid flex-1 content-center gap-4 py-16 sm:grid-cols-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-stretch gap-4 rounded-[8px] border border-mist bg-[#faf9f7] p-3 transition-colors hover:border-ember hover:bg-mist"
              >
                <div className="w-2/5 shrink-0 overflow-hidden rounded-[6px]">
                  <ImagePlaceholder
                    ratio="4 / 3"
                    className="h-full"
                    label="Imagem"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1 pr-2">
                  <div>
                    <p className="text-[15px]">{item.label}</p>
                    <p className="mt-1 text-[12px] leading-snug text-pewter">
                      {item.desc}
                    </p>
                  </div>
                  <Arrow className="h-3.5 w-3.5 self-end text-ink transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </nav>

          <div className="shell flex flex-col gap-3 pb-[clamp(1.5rem,5vw,2.5rem)] text-[13px] text-smoke sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <a
                href="mailto:contato@estudiorestaura.com.br"
                className="hover:text-ember"
              >
                contato@estudiorestaura.com.br
              </a>
              <a href="tel:+551140000000" className="hover:text-ember">
                +55 11 4000-0000
              </a>
              <span>São Paulo · Brasil</span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-[80px] border border-mist px-3.5 py-1.5 text-[12px] font-medium text-ink hover:border-ember"
            >
              Entrar no painel
              <Arrow className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
