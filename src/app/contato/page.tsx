import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/contato/ContactForm";
import { getSectionImages } from "@/lib/cms";
import { WHATSAPP } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Estúdio Restaura sobre projetos de arquitetura, conservação e restauro de patrimônio.",
};

export const dynamic = "force-dynamic";

const INFO = [
  ["E-mail", "contato@estudiorestaura.com.br", "mailto:contato@estudiorestaura.com.br"],
  ["Telefone / WhatsApp", WHATSAPP.display, WHATSAPP.href],
] as const;

export default async function ContatoPage() {
  const sections = await getSectionImages();
  return (
    <>
      <PageHero
        slot="contato"
        label="Vamos conversar"
        title="Contato"
        intro="Conte sobre o edifício, o acervo ou o projeto. Respondemos em até dois dias úteis."
        imageLabel="Espaço para imagem — recepção do estúdio"
        imageUrl={sections["pagehero.contato"] || undefined}
      />

      <div className="shell grid gap-14 py-[clamp(4rem,9vw,6rem)] md:grid-cols-[1.2fr_0.8fr]">
        <ContactForm />

        <aside className="flex flex-col gap-8" data-reveal>
          {INFO.map(([label, value, href]) => (
            <div key={label}>
              <h2 className="label">{label}</h2>
              {href ? (
                <a href={href} className="mt-2 block text-[16px] hover:text-ember">
                  {value}
                </a>
              ) : (
                <p className="mt-2 text-[16px] text-pewter">{value}</p>
              )}
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
