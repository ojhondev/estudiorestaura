import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBox } from "@/components/ImageBox";
import { ProjectGallery } from "@/components/projetos/ProjectGallery";
import { BeforeAfter } from "@/components/projetos/BeforeAfter";
import { isAuthed } from "@/lib/auth";
import { Arrow } from "@/components/ui";
import { getProject, getProjects } from "@/lib/cms";
import { imageDims } from "@/lib/imgdims";
import { parseBlocks, RichBody } from "@/lib/richtext";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, breadcrumbLd, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug, { drafts: await isAuthed() });
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
      images: project.coverUrl ? [{ url: project.coverUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", images: project.coverUrl ? [project.coverUrl] : undefined },
    robots: project.published ? undefined : { index: false, follow: false },
  };
}

export default async function ProjetoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = await isAuthed();
  const project = await getProject(slug, { drafts: admin });
  if (!project) notFound();

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = index >= 0 ? projects[(index + 1) % projects.length] : projects[0];

  // proporção real das fotos: nada é recortado nem ampliado além da resolução original
  const dims = await imageDims([
    project.coverUrl,
    ...project.galleryUrls,
    ...project.beforeAfter.flatMap((p) => [p.before, p.after]),
    ...project.sections.flatMap((s) => s.images.map((i) => i.src)),
  ]);
  const cd = project.coverUrl ? dims[project.coverUrl] : undefined;
  // capa em tela cheia só se tiver resolução para isso; senão, hero dividido (texto + foto)
  const fullBleed = !project.coverUrl || !cd || (cd.w >= 1500 && cd.w / cd.h >= 1.25);

  // ficha técnica: sempre Local / Ano / Categoria / Equipe
  const meta: [string, string | string[]][] = [
    ["Local", project.location || [project.city, project.state].filter(Boolean).join(" · ")],
    ["Ano", project.year],
    ["Categoria", project.category],
    ["Equipe", project.team],
  ];
  const lede = project.description[0] ?? project.summary;
  const rest = project.description.slice(1);

  const altBase = [project.title, project.client, project.location].filter(Boolean).join(" — ");
  const allImages = [project.coverUrl, ...project.galleryUrls].filter((u): u is string => !!u).slice(0, 12);
  const projectLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: `${SITE_URL}/projetos/${project.slug}`,
    inLanguage: "pt-BR",
    dateCreated: project.year || undefined,
    genre: project.category,
    locationCreated: project.city
      ? { "@type": "Place", name: project.city, address: { "@type": "PostalAddress", addressLocality: project.city, addressRegion: project.state, addressCountry: "BR" } }
      : undefined,
    image: allImages.map(absoluteUrl),
    creator: { "@id": `${SITE_URL}/#organization` },
    contributor: project.team.map((m) => ({ "@type": "Person", name: m.split(" — ")[0], jobTitle: m.split(" — ")[1] })),
    ...(project.credit ? { copyrightHolder: { "@id": `${SITE_URL}/#organization` }, creditText: project.credit } : {}),
  };

  return (
    <article>
      <JsonLd
        data={[
          projectLd,
          breadcrumbLd([
            ["Projetos", "/projetos"],
            [project.title, `/projetos/${project.slug}`],
          ]),
        ]}
      />
      {!project.published && (
        <div className="fixed inset-x-0 top-0 z-[90] bg-ember px-4 py-2 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-paper">
          Rascunho — só você (logado) está vendo esta página
        </div>
      )}
      {fullBleed ? (
        <section className="bleed relative flex min-h-[78vh] items-end overflow-hidden">
          <ImageBox
            src={project.coverUrl}
            alt={altBase}
            fill
            variant="bleed"
            label="Espaço para imagem — projeto"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/80 to-midnight/20"
          />
          <div className="relative shell pb-[clamp(2.5rem,7vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] text-paper">
            <Link href="/projetos" className="text-arrow text-[13px] text-paper/80">
              <span className="rotate-180">
                <Arrow />
              </span>
              Projetos
            </Link>
            {project.client && <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.18em] text-paper/80">{project.client}</p>}
            <h1
              data-reveal
              className="display mt-3 max-w-5xl text-[clamp(2.25rem,8vw,6rem)]"
            >
              {project.title}
            </h1>
          </div>
        </section>
      ) : (
        <section className="bleed relative overflow-hidden bg-midnight text-paper">
          <div className="shell grid items-center gap-10 pb-[clamp(2.5rem,6vw,4rem)] pt-[clamp(7rem,14vh,10rem)] md:grid-cols-[1.1fr_1fr] md:gap-14">
            <div>
              <Link href="/projetos" className="text-arrow text-[13px] text-paper/80">
                <span className="rotate-180">
                  <Arrow />
                </span>
                Projetos
              </Link>
              {project.client && <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.18em] text-paper/80">{project.client}</p>}
              <h1 data-reveal className="display mt-3 max-w-3xl text-[clamp(2.25rem,6vw,4.75rem)]">
                {project.title}
              </h1>
            </div>
            {project.coverUrl && cd && (
              <div className="mx-auto w-full" style={{ maxWidth: Math.min(Math.round(cd.w * 1.3), 760) }}>
                <Image
                  src={project.coverUrl}
                  alt={altBase}
                  width={cd.w}
                  height={cd.h}
                  priority
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="h-auto max-h-[75vh] w-full rounded-[8px] object-contain"
                />
              </div>
            )}
          </div>
        </section>
      )}

      <div className="shell grid gap-10 py-[clamp(3rem,7vw,5rem)] md:grid-cols-[1fr_1.4fr] md:gap-16">
        <dl className="grid grid-cols-2 gap-6 self-start md:grid-cols-1">
          {meta
            .filter(([, v]) => (Array.isArray(v) ? v.length : v))
            .map(([k, v]) => (
              <div key={k} className={`border-t border-mist pt-3 ${k === "Equipe" ? "col-span-2 md:col-span-1" : ""}`}>
                <dt className="label">{k}</dt>
                {Array.isArray(v) ? (
                  <dd className="mt-1 space-y-1.5 text-[14.5px] leading-snug">
                    {v.map((m) => {
                      const [nome, funcao] = m.split(" — ");
                      return (
                        <p key={m}>
                          {nome}
                          {funcao && <span className="block text-[12.5px] text-smoke">{funcao}</span>}
                        </p>
                      );
                    })}
                  </dd>
                ) : (
                  <dd className="mt-1 text-[15px]">
                    {v}
                    {k === "Ano" && project.status ? (
                      <span className="ml-2 rounded-full bg-ember/10 px-2.5 py-0.5 text-[12px] font-medium text-ember">{project.status}</span>
                    ) : null}
                  </dd>
                )}
              </div>
            ))}
          {project.credit && (
            <div className="col-span-2 border-t border-mist pt-3 md:col-span-1">
              <dt className="label">Fotografia</dt>
              <dd className="mt-1 text-[14.5px]">{project.credit}</dd>
            </div>
          )}
        </dl>
        <div>
          <p
            data-reveal
            className="lora text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.6] text-pewter"
          >
            {lede}
          </p>
          <div className="mt-8 space-y-5 text-[15px] leading-[1.65] text-ink/80">
            {rest.map((p, i) => (
              <p key={i} data-reveal>
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      {project.sections.map((s, i) => (
        <section key={i} className="border-t border-mist">
          <div className="shell mx-auto max-w-[68rem] pt-[clamp(2.5rem,6vw,4rem)]">
            <p data-reveal="fade" className="label">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 data-reveal className="h mt-3 text-[clamp(1.6rem,3.4vw,2.5rem)]">
              {s.title}
            </h2>
            {s.body.length > 0 && (
              <div className="mt-6 max-w-[48rem]">
                <RichBody blocks={parseBlocks(s.body)} />
              </div>
            )}
          </div>
          {s.images.length > 0 && (
            <div className="mt-8">
              <ProjectGallery
                count={s.images.length}
                images={s.images.map((x) => x.src)}
                captions={s.images.map((x) => x.caption)}
                title={`${project.title} — ${s.title}`}
                dims={dims}
                compact
              />
            </div>
          )}
        </section>
      ))}

      <BeforeAfter pairs={project.beforeAfter} dims={dims} />

      {project.galleryUrls.length > 0 && (
        <ProjectGallery
          count={project.gallery}
          images={project.galleryUrls}
          title={altBase}
          dims={dims}
        />
      )}

      {next && next.slug !== project.slug && (
        <section className="bleed border-t border-mist">
        <div className="shell flex flex-col gap-3 py-14">
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
    
      )}
    </article>
  );
}
