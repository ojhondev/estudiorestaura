import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Arrow } from "@/components/ui";
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
      <section className="bleed relative flex min-h-[78vh] items-end overflow-hidden">
        <ImagePlaceholder fill variant="bleed" label="Espaço para imagem — projeto" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/80 to-midnight/20"
        />
        <div className="relative container pb-[clamp(2.5rem,7vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] text-paper">
          <Link
            href="/projetos"
            className="text-arrow text-[13px] text-paper/80"
          >
            <span className="rotate-180">
              <Arrow />
            </span>
            Projetos
          </Link>
          <h1
            data-reveal
            className="display mt-5 max-w-5xl text-[clamp(2.25rem,8vw,6rem)]"
          >
            {project.title}
          </h1>
        </div>
      </section>

      <div className="container grid gap-10 py-[clamp(3rem,7vw,5rem)] md:grid-cols-[1fr_1.4fr] md:gap-16">
        <dl className="grid grid-cols-2 gap-6 self-start md:grid-cols-1">
          {meta.map(([k, v]) => (
            <div key={k} className="border-t border-mist pt-3">
              <dt className="label">{k}</dt>
              <dd className="mt-1 text-[15px]">{v}</dd>
            </div>
          ))}
        </dl>
        <div>
          <p data-reveal className="lora text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.6] text-pewter">
            {project.summary}
          </p>
          <div className="mt-8 space-y-5 text-[15px] leading-[1.65] text-ink/80">
            {project.description.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="container grid gap-6 pb-[clamp(3rem,7vw,5rem)] sm:grid-cols-2">
        {Array.from({ length: project.gallery }).map((_, i) => (
          <ImagePlaceholder
            key={i}
            ratio={i % 3 === 0 ? "16 / 10" : "4 / 3"}
            className={i % 3 === 0 ? "sm:col-span-2" : ""}
            data-reveal="fade"
          />
        ))}
      </div>

      <section className="bleed border-t border-mist">
        <div className="container flex flex-col gap-3 py-14">
          <p className="label">Próximo projeto</p>
          <Link
            href={`/projetos/${next.slug}`}
            className="group inline-flex items-baseline gap-4"
          >
            <span className="h text-[clamp(1.75rem,5vw,3.5rem)] transition-colors group-hover:text-ember">
              {next.title}
            </span>
            <Arrow className="h-5 w-5 self-center text-ember" />
          </Link>
        </div>
      </section>
    </article>
  );
}
