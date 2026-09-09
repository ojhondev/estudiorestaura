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
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close overlays on route change.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Esc closes, body scroll lock while an overlay is open.
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
      const t = setTimeout(() => searchInput.current?.focus(), 120);
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

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          solid
            ? "bg-paper/85 backdrop-blur-md border-b border-line"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              aria-label="Estúdio Restaura — início"
              className={`transition-opacity duration-300 ${
                isHome && !scrolled && !menuOpen && !searchOpen
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
              }`}
            >
              <Logo className="h-5 w-auto md:h-6" />
            </Link>

            <nav className="hidden items-center gap-7 md:flex">
              {nav.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm tracking-[0.01em] transition-colors hover:text-terracotta ${
                      active ? "text-terracotta" : "text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => {
                setSearchOpen((v) => !v);
                setMenuOpen(false);
              }}
              className="group relative text-sm text-ink"
              aria-expanded={searchOpen}
            >
              Pesquise
              <span
                className={`absolute -bottom-1 left-0 h-px bg-terracotta transition-all duration-300 ${
                  searchOpen ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                setMenuOpen((v) => !v);
                setSearchOpen(false);
              }}
              className="flex h-9 w-9 items-center justify-center"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              <span className="relative block h-3 w-6">
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 block h-px w-full bg-ink transition-opacity duration-200 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-300 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Search panel */}
        <div
          className={`overflow-hidden border-line bg-paper transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            searchOpen
              ? "max-h-[80vh] border-b opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="shell py-8 md:py-12">
            <label className="block">
              <span className="font-display text-xs uppercase tracking-[0.3em] text-muted">
                O que você procura?
              </span>
              <input
                ref={searchInput}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Restauro, conservação, um projeto…"
                className="mt-3 w-full border-b border-ink bg-transparent pb-3 font-display text-2xl outline-none placeholder:text-muted md:text-4xl"
              />
            </label>

            <p className="mt-6 font-display text-xs uppercase tracking-[0.3em] text-muted">
              {query.trim() ? `${results.length} projeto(s)` : "Em destaque"}
            </p>

            <div className="mt-4 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/projetos/${p.slug}`}
                  className="group block"
                >
                  <ImagePlaceholder ratio="4 / 3" />
                  <p className="mt-3 font-display text-base leading-tight group-hover:text-terracotta">
                    {p.title}
                  </p>
                  <p className="text-sm text-muted">{p.category}</p>
                </Link>
              ))}
              {results.length === 0 && (
                <p className="text-muted">
                  Nada encontrado. Tente outra palavra.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full menu overlay */}
      <div
        className={`fixed inset-0 top-0 flex flex-col bg-paper transition-opacity duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shell flex h-16 items-center justify-between md:h-20">
          <Logo className="h-5 w-auto md:h-6" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
            className="font-display text-sm uppercase tracking-[0.3em] hover:text-terracotta"
          >
            Fechar
          </button>
        </div>

        <nav className="shell flex flex-1 flex-col justify-center">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-4 border-t border-line py-4 md:py-6"
            >
              <span className="font-display text-xs text-muted">
                0{i + 1}
              </span>
              <span className="display text-[clamp(2.25rem,8vw,5.5rem)] transition-colors group-hover:text-terracotta">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="shell flex flex-col gap-1 border-t border-line py-8 text-sm text-muted sm:flex-row sm:justify-between">
          <p>contato@estudiorestaura.com.br</p>
          <p>+55 11 4000-0000</p>
          <p>São Paulo · Brasil</p>
        </div>
      </div>
    </header>
  );
}
