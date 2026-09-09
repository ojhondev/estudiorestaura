import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getProject, projects } from "@/lib/content";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary };
}

export default async function ProjetoPage({
  params,
}: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  const meta = [
    ["Local", project.location],
    ["Ano", project.year],
    ["Categoria", project.category],
    ["Área", project.area],
  ];

  return (
    <article>
      <header className="shell pt-28 md:pt-40">
        <Link
          href="/projetos"
          className="text-[12px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-terracotta"
        >
          ← Projetos
        </Link>
        <h1
          data-reveal
          className="display mt-5 max-w-5xl text-[clamp(2.5rem,7vw,6rem)]"
        >
          {project.title}
        </h1>
        <p
          data-reveal
          className="mt-6 max-w-2xl text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.5] text-ink-soft"
        >
          {project.summary}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8 sm:grid-cols-4">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] uppercase tracking-[0.2em] text-muted">
                {k}
              </dt>
              <dd className="mt-1 text-[14px]">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="shell mt-12 md:mt-16" data-reveal="wipe">
        <ImagePlaceholder ratio="16 / 9" />
      </div>

      <div className="shell mt-14 grid gap-10 md:mt-20 md:grid-cols-[0.9fr_1.1fr]">
        <h2 className="section-title text-[clamp(1.4rem,2.6vw,2rem)]">
          Sobre a intervenção
        </h2>
        <div className="space-y-5 text-[1.05rem] leading-[1.65] text-ink-soft">
          {project.description.map((p, i) => (
            <p key={i} data-reveal>
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="shell mt-16 grid gap-6 sm:grid-cols-2 md:mt-24">
        {Array.from({ length: project.gallery }).map((_, i) => (
          <ImagePlaceholder
            key={i}
            ratio={i % 3 === 0 ? "16 / 10" : "4 / 3"}
            className={i % 3 === 0 ? "sm:col-span-2" : ""}
            data-reveal="wipe"
          />
        ))}
      </div>

      <div className="shell mt-24 border-t border-line pt-10">
        <p className="text-[12px] uppercase tracking-[0.3em] text-muted">
          Próximo projeto
        </p>
        <Link
          href={`/projetos/${next.slug}`}
          className="group mt-3 inline-flex items-baseline gap-4"
        >
          <span className="display text-[clamp(2rem,6vw,4.5rem)] transition-colors group-hover:text-terracotta">
            {next.title}
          </span>
          <span className="text-terracotta">→</span>
        </Link>
      </div>
    </article>
  );
}
