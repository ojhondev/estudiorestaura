import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Início" },
  { href: "/admin/projetos", label: "Projetos" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/vagas", label: "Vagas" },
  { href: "/admin/secoes", label: "Seções" },
  { href: "/admin/conteudo", label: "Conteúdo" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthed())) redirect("/admin/login");
  return (
    <div className="min-h-screen bg-[#f4f3f1] text-ink">
      <header className="sticky top-0 z-40 border-b border-mist bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
          <Link href="/admin" className="text-[13px] font-semibold tracking-tight">
            Estúdio Restaura
            <span className="ml-2 font-normal text-smoke">painel</span>
          </Link>
          <nav className="hidden gap-1 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-[6px] px-3 py-1.5 text-[13px] text-pewter hover:bg-mist hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-[12px] text-smoke hover:text-ink"
            >
              ver site ↗
            </Link>
            <form action={logout}>
              <button className="rounded-[6px] border border-mist px-3 py-1.5 text-[12px] hover:bg-mist">
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-mist px-4 py-2 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-[6px] px-3 py-1.5 text-[13px] text-pewter"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
