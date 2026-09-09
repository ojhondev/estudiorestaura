import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/contato/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Estúdio Restaura sobre projetos de arquitetura, conservação e restauro de patrimônio.",
};

export default function ContatoPage() {
  return (
    <>
      <PageIntro kicker="Vamos conversar" title="Contato">
        Conte sobre o edifício, o acervo ou o projeto. Respondemos em até dois
        dias úteis.
      </PageIntro>

      <div className="shell mt-16 grid gap-14 md:mt-24 md:grid-cols-[1.2fr_0.8fr]">
        <ContactForm />

        <aside className="space-y-8" data-reveal="up" data-reveal-delay="0.1">
          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.3em] text-muted">
              E-mail
            </h2>
            <a
              href="mailto:contato@estudiorestaura.com.br"
              className="mt-2 block text-lg hover:text-terracotta"
            >
              contato@estudiorestaura.com.br
            </a>
          </div>
          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.3em] text-muted">
              Telefone
            </h2>
            <a
              href="tel:+551140000000"
              className="mt-2 block text-lg hover:text-terracotta"
            >
              +55 11 4000-0000
            </a>
          </div>
          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.3em] text-muted">
              Estúdio
            </h2>
            <p className="mt-2 text-lg text-ink-soft">
              Rua do Patrimônio, 100
              <br />
              Vila Buarque · São Paulo · SP
            </p>
          </div>
          <div>
            <h2 className="font-display text-xs uppercase tracking-[0.3em] text-muted">
              Atendimento
            </h2>
            <p className="mt-2 text-lg text-ink-soft">Seg a Sex · 9h às 18h</p>
          </div>
        </aside>
      </div>
    </>
  );
}
