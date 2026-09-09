"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { nav, projects } from "@/lib/content";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const open = menuOpen || searchOpen;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInput.current?.focus(), 160);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.slice(0, 4);
    return projects.filter((p) =>
      [p.title, p.category, p.location, p.summary]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const solid = scrolled || menuOpen || searchOpen || !isHome;
  const showLogo = !isHome || scrolled || menuOpen || searchOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          solid
            ? "border-b border-line bg-paper/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell flex h-14 items-center justify-between md:h-16">
          <div className="flex items-center gap-6 md:gap-9">
            <Link
              href="/"
              aria-label="Estúdio Restaura — início"
              className={`shrink-0 transition-opacity duration-300 ${
                showLogo ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <Logo className="h-4 w-auto md:h-[18px]" />
            </Link>

            <nav className="hidden items-center gap-6 text-[13px] md:flex">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`border-b pb-px transition-colors hover:text-terracotta ${
                      active
                        ? "border-current text-terracotta"
                        : "border-transparent"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-5 text-[13px] md:gap-7">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              className={`border-b pb-px transition-colors hover:text-terracotta ${
                searchOpen ? "border-current text-terracotta" : "border-transparent"
              }`}
              aria-expanded={searchOpen}
            >
              Pesquise
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="flex h-8 w-6 items-center justify-center md:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              <span className="relative block h-[9px] w-5">
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? "top-1 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? "-rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-opacity duration-200 ${
                    menuOpen ? "top-1 opacity-0" : "top-2"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Search panel */}
        <div
          className={`grid overflow-hidden bg-paper transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            searchOpen
              ? "grid-rows-[1fr] border-b border-line opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <div className="shell py-8 md:py-12">
              <label className="block">
                <span className="text-[12px] uppercase tracking-[0.28em] text-muted">
                  O que você procura?
                </span>
                <input
                  ref={searchInput}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Restauro, conservação, um projeto…"
                  className="section-title mt-3 w-full border-b border-line-strong bg-transparent pb-3 text-[clamp(1.5rem,3.5vw,2.75rem)] outline-none placeholder:text-muted"
                />
              </label>

              <p className="mt-6 text-[12px] uppercase tracking-[0.28em] text-muted">
                {query.trim() ? `${results.length} projeto(s)` : "Em destaque"}
              </p>

              <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                {results.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projetos/${p.slug}`}
                    className="group block"
                  >
                    <ImagePlaceholder ratio="4 / 3" />
                    <p className="mt-3 text-[15px] group-hover:text-terracotta">
                      {p.title}
                    </p>
                    <p className="text-[13px] text-muted">{p.category}</p>
                  </Link>
                ))}
                {results.length === 0 && (
                  <p className="text-muted">Nada encontrado. Tente outra palavra.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full menu overlay (mobile) */}
      <div
        className={`fixed inset-0 top-0 flex flex-col bg-paper transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shell flex h-14 items-center justify-between">
          <Logo className="h-4 w-auto" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="text-[13px] uppercase tracking-[0.28em]"
          >
            Fechar
          </button>
        </div>
        <nav className="shell flex flex-1 flex-col justify-center">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-4 border-t border-line py-4"
            >
              <span className="text-[12px] text-muted">0{i + 1}</span>
              <span className="display text-[clamp(2.25rem,11vw,3.5rem)] transition-colors group-hover:text-terracotta">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
        <div className="shell border-t border-line py-6 text-[13px] text-muted">
          <p>contato@estudiorestaura.com.br</p>
          <p>+55 11 4000-0000</p>
        </div>
      </div>
    </header>
  );
}
