import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Arrow } from "@/components/ui";
import { getJobs, getSectionImages, getSetting } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Trabalhe conosco",
  description:
    "Vagas abertas no Estúdio Restaura e como é fazer parte de um time de arquitetos, conservadores e restauradores.",
};

export const dynamic = "force-dynamic";

export default async function TrabalheConoscoPage() {
  const [careers, jobs, sections] = await Promise.all([
    getSetting("careers.intro"),
    getJobs(),
    getSectionImages(),
  ]);

  return (
    <>
      <PageHero
        slot="trabalhe"
        label="Pessoas"
        title="Trabalhe conosco"
        intro={careers.text}
        imageLabel="Espaço para imagem — equipe em obra"
        imageUrl={sections["pagehero.trabalhe"] || undefined}
      />

      <section className="shell py-[clamp(3rem,7vw,5rem)]">
        <div className="flex items-start gap-6">
          <span aria-hidden className="mt-4 h-px w-16 shrink-0 bg-ink/25" />
          <div>
            <p className="label">Vagas</p>
            <h2 data-reveal="clip" className="h-lg mt-3 text-[clamp(2rem,6vw,4rem)]">
              {jobs.length > 0
                ? "Posições abertas"
                : "Nenhuma vaga aberta no momento"}
            </h2>
          </div>
        </div>

        <div className="mt-12 divide-y divide-mist border-y border-mist">
          {jobs.map((j) => (
            <Link
              key={j.slug}
              href={`/vagas/${j.slug}`}
              data-reveal
              className="group grid gap-2 py-7 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <h3 className="text-[clamp(1.25rem,2.6vw,1.75rem)] font-light transition-colors group-hover:text-ember">
                  {j.title}
                </h3>
                <p className="mt-1 text-[13px] text-pewter">
                  {j.area} · {j.type} · {j.location}
                </p>
              </div>
              <span className="text-arrow text-[13px] sm:justify-self-end">
                Ver vaga <Arrow />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-[8px] bg-mist p-8 md:p-12">
          <p className="label">Banco de Talentos</p>
          <h3 className="h mt-3 text-[clamp(1.5rem,3vw,2.25rem)]">Não encontrou uma vaga para você?</h3>
          <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink/80">
            Cadastre seu perfil e currículo no nosso Banco de Talentos. Quando surgir um projeto ou uma vaga compatível, chamamos você.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/banco-de-talentos" className="btn-fill">
              Entrar no Banco de Talentos <Arrow className="h-4 w-4" />
            </Link>
            <a href="mailto:contato@estudiorestaura.com.br?subject=Candidatura%20espont%C3%A2nea" className="text-arrow text-[14px]">
              Ou envie por e-mail <Arrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
