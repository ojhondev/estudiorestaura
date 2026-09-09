import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ContactForm } from "@/components/contato/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Estúdio Restaura sobre projetos de arquitetura, conservação e restauro de patrimônio.",
};

const INFO = [
  ["E-mail", "contato@estudiorestaura.com.br", "mailto:contato@estudiorestaura.com.br"],
  ["Telefone", "+55 11 4000-0000", "tel:+551140000000"],
  ["Estúdio", "Rua do Patrimônio, 100 — Vila Buarque, São Paulo · SP", null],
  ["Atendimento", "Segunda a sexta, 9h às 18h", null],
] as const;

export default function ContatoPage() {
  return (
    <>
      <PageIntro kicker="Vamos conversar" title="Contato">
        Conte sobre o edifício, o acervo ou o projeto. Respondemos em até dois
        dias úteis.
      </PageIntro>

      <div className="shell mt-16 grid gap-14 md:mt-24 md:grid-cols-[1.2fr_0.8fr]">
        <ContactForm />

        <aside className="flex flex-col gap-8" data-reveal>
          {INFO.map(([label, value, href]) => (
            <div key={label}>
              <h2 className="text-[12px] uppercase tracking-[0.3em] text-muted">
                {label}
              </h2>
              {href ? (
                <a href={href} className="ulink mt-2 text-[16px]">
                  {value}
                </a>
              ) : (
                <p className="mt-2 text-[16px] text-ink-soft">{value}</p>
              )}
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
