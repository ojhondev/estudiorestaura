import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectGrid } from "@/components/projetos/ProjectGrid";
import { getProjects } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Restauro, conservação e arquitetura em patrimônio histórico e cultural — acervo de projetos do Estúdio Restaura.",
};

export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        label="Acervo"
        title="Projetos"
        intro="Intervenções de restauro, planos de conservação preventiva e arquitetura nova que dialoga com a preexistência."
        imageLabel="Espaço para imagem — projeto em destaque"
      />
      <ProjectGrid projects={projects} />
    </>
  );
}
