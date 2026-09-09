import Link from "next/link";
import { Logo } from "@/components/Logo";
import { nav } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-line md:mt-44">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr] md:py-24">
        <div>
          <Logo className="h-6 w-auto" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Arquitetura, conservação e restauro de patrimônio histórico e
            cultural. Preservamos a memória e a autenticidade de edificações
            antigas e obras de arte.
          </p>
        </div>

        <nav className="flex flex-col gap-2.5 text-[14px]">
          <span className="mb-1 text-[12px] uppercase tracking-[0.28em] text-muted">
            Navegação
          </span>
          <Link href="/" className="ulink w-fit border-transparent hover:border-current">
            Início
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="ulink w-fit border-transparent hover:border-current"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5 text-[14px]">
          <span className="mb-1 text-[12px] uppercase tracking-[0.28em] text-muted">
            Contato
          </span>
          <a
            href="mailto:contato@estudiorestaura.com.br"
            className="ulink w-fit border-transparent hover:border-current"
          >
            contato@estudiorestaura.com.br
          </a>
          <a
            href="tel:+551140000000"
            className="ulink w-fit border-transparent hover:border-current"
          >
            +55 11 4000-0000
          </a>
          <p className="text-ink-soft">
            Rua do Patrimônio, 100
            <br />
            São Paulo · SP
          </p>
        </div>
      </div>

      <div className="shell flex flex-col gap-2 border-t border-line py-6 text-[12px] text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Estúdio Restaura. Todos os direitos
          reservados.
        </p>
        <p>Restauro além da obra.</p>
      </div>
    </footer>
  );
}
