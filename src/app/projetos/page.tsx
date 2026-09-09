import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ProjectGrid } from "@/components/projetos/ProjectGrid";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Restauro, conservação e arquitetura em patrimônio histórico e cultural — acervo de projetos do Estúdio Restaura.",
};

export default function ProjetosPage() {
  return (
    <>
      <PageIntro kicker="Acervo" title="Projetos">
        Cada projeto começa por uma leitura atenta do que já existe. Intervenções
        de restauro, planos de conservação preventiva e arquitetura nova que
        dialoga com a preexistência.
      </PageIntro>

      <div className="mt-16 md:mt-24">
        <ProjectGrid projects={projects} />
      </div>
    </>
  );
}
