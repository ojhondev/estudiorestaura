import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Arrow } from "@/components/ui";
import { nav, WHATSAPP } from "@/lib/content";
import { Credito } from "@/components/Credito";
import "@/components/credito.css";

export function SiteFooter() {
  return (
    <footer className="bleed bg-ember text-paper">
      {/* Partnership CTA */}
      <div className="shell grid gap-8 border-b border-white/15 py-16 md:grid-cols-2 md:items-end md:py-24">
        <div>
          <p className="label">Parcerias</p>
          <h2 className="h-lg mt-4 text-[clamp(2rem,5vw,3.5rem)]">
            Aberto a colaborar.
          </h2>
        </div>
        <Link href="/contato" className="text-arrow text-[15px] md:justify-self-end">
          Vamos conversar <Arrow />
        </Link>
      </div>

      <div className="shell grid gap-14 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="light" className="h-7 w-auto" />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-paper/75">
            Arquitetura, conservação e restauro de patrimônio histórico e
            cultural. Preservamos a memória e a autenticidade de edificações
            antigas e obras de arte.
          </p>
        </div>

        <nav className="flex flex-col gap-3">
          <span className="label">Navegação</span>
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
          <span className="label">Contato</span>
          <a href="mailto:contato@estudiorestaura.com.br" className="hover:text-midnight">
            contato@estudiorestaura.com.br
          </a>
          <a href={WHATSAPP.href} target="_blank" rel="noreferrer" className="hover:text-midnight">
            {WHATSAPP.display}
          </a>
        </div>
      </div>

      {/* Giant scrolling wordmark */}
      <div className="marquee border-t border-white/15 py-8">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="px-[0.15em] text-[clamp(4rem,15vw,13rem)] font-bold leading-none tracking-[-0.03em] text-paper"
            >
              estúdio restaura&nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-white/15 py-6 text-[12px] text-paper/60 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Estúdio Restaura. Todos os direitos
          reservados.
        </p>
        <p>Arquitetura · Conservação · Restauro</p>
        <Credito site="Estúdio Restaura" />
      </div>
    </footer>
  );
}
