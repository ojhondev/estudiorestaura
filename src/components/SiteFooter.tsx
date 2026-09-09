import Link from "next/link";
import { Logo } from "@/components/Logo";
import { nav } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-paper">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Logo className="h-8 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-soft">
            Arquitetura, conservação e restauro de patrimônio histórico e
            cultural. Preservamos a memória e a autenticidade de edificações
            antigas e obras de arte.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-muted">
            Navegação
          </span>
          <Link href="/" className="text-sm hover:text-terracotta">
            Início
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm hover:text-terracotta"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <span className="font-display text-xs uppercase tracking-[0.3em] text-muted">
            Contato
          </span>
          <a
            href="mailto:contato@estudiorestaura.com.br"
            className="text-sm hover:text-terracotta"
          >
            contato@estudiorestaura.com.br
          </a>
          <a href="tel:+551140000000" className="text-sm hover:text-terracotta">
            +55 11 4000-0000
          </a>
          <p className="text-sm text-ink-soft">
            Rua do Patrimônio, 100
            <br />
            São Paulo · SP
          </p>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Estúdio Restaura. Todos os direitos reservados.</p>
        <p>Restauro além da obra.</p>
      </div>
    </footer>
  );
}
