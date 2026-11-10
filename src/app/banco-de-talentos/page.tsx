import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { TalentForm } from "@/components/talentos/TalentForm";

export const metadata: Metadata = {
  title: "Banco de Talentos",
  description:
    "Cadastre seu perfil no Banco de Talentos do Estúdio Restaura: arquitetos, conservadores, restauradores, mestres de ofício e profissionais de apoio.",
};

export default function BancoDeTalentosPage() {
  return (
    <>
      <PageHero
        slot="talentos"
        label="Pessoas"
        title="Banco de Talentos"
        intro="Conte quem você é, o que sabe fazer e como gosta de trabalhar. Guardamos seu perfil e chamamos quando surgir um projeto com a sua cara."
        imageLabel="Espaço para imagem — equipe em obra"
      />

      <section className="shell grid gap-12 py-[clamp(3.5rem,8vw,6rem)] lg:grid-cols-[0.8fr_1.6fr] lg:gap-20">
        <aside data-reveal className="self-start lg:sticky lg:top-28">
          <p className="label">Como funciona</p>
          <ol className="mt-5 space-y-5 text-[15px] leading-relaxed text-ink/80">
            <li>
              <span className="label block">01</span>
              Você preenche o formulário e envia o currículo em PDF ou Word (até 2 MB).
            </li>
            <li>
              <span className="label block">02</span>
              A equipe analisa o perfil e guarda no banco, organizado por área, regime e disponibilidade.
            </li>
            <li>
              <span className="label block">03</span>
              Quando abrir um projeto ou uma vaga que combine com você, entramos em contato.
            </li>
          </ol>
          <p className="mt-8 text-[13px] leading-relaxed text-pewter">
            Seus dados são usados somente para processos seletivos do Estúdio Restaura e ficam acessíveis apenas à equipe
            responsável. Você pode pedir a exclusão a qualquer momento pelo e-mail contato@estudiorestaura.com.br.
          </p>
        </aside>

        <TalentForm />
      </section>
    </>
  );
}
