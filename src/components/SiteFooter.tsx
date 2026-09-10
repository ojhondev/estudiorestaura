import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Arrow } from "@/components/ui";
import { nav } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bleed bg-midnight text-paper">
      {/* Partnership CTA */}
      <div className="container grid gap-8 border-b border-white/10 py-16 md:grid-cols-2 md:items-end md:py-24">
        <div>
          <p className="label text-mist/60">Parcerias</p>
          <h2 className="h-lg mt-4 text-[clamp(2rem,5vw,3.5rem)]">
            Aberto a colaborar.
          </h2>
        </div>
        <Link href="/contato" className="text-arrow text-[15px] md:justify-self-end">
          Vamos conversar <Arrow />
        </Link>
      </div>

      <div className="container grid gap-14 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="light" className="h-7 w-auto" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-mist/70">
            Arquitetura, conservação e restauro de patrimônio histórico e
            cultural. Preservamos a memória e a autenticidade de edificações
            antigas e obras de arte.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="label text-smoke">Navegação</span>
          <Link href="/" className="text-arrow text-[14px]">
            Início <Arrow />
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-arrow text-[14px]">
              {item.label} <Arrow />
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-[14px]">
          <span className="label text-smoke">Contato</span>
          <a href="mailto:contato@estudiorestaura.com.br" className="hover:text-ember">
            contato@estudiorestaura.com.br
          </a>
          <a href="tel:+551140000000" className="hover:text-ember">
            +55 11 4000-0000
          </a>
          <p className="text-mist/60">
            Rua do Patrimônio, 100
            <br />
            São Paulo · SP
          </p>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden border-t border-white/10 pt-8">
        <p
          aria-hidden
          className="display whitespace-nowrap px-[2vw] text-center text-[clamp(3.5rem,19vw,15rem)] leading-none text-paper"
        >
          estúdio restaura
        </p>
      </div>

      <div className="container flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] text-smoke sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} Estúdio Restaura. Todos os direitos
          reservados.
        </p>
        <p>Arquitetura · Conservação · Restauro</p>
      </div>
    </footer>
  );
}
