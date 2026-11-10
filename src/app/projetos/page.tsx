import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectGrid } from "@/components/projetos/ProjectGrid";
import { getProjects, getSectionImages } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Restauro, conservação e arquitetura em patrimônio histórico e cultural — acervo de projetos do Estúdio Restaura.",
};

export const dynamic = "force-dynamic";

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const ufParam = typeof sp.uf === "string" ? sp.uf.toUpperCase().slice(0, 2) : "";
  const [projects, sections] = await Promise.all([
    getProjects(),
    getSectionImages(),
  ]);

  return (
    <>
      <PageHero
        slot="projetos"
        label="Acervo"
        title="Projetos"
        intro="Intervenções de restauro, planos de conservação preventiva e arquitetura nova que dialoga com a preexistência."
        imageLabel="Espaço para imagem — projeto em destaque"
        imageUrl={sections["pagehero.projetos"] || undefined}
      />
      <ProjectGrid projects={projects} uf={/^[A-Z]{2}$/.test(ufParam) ? ufParam : ""} />
    </>
  );
}
