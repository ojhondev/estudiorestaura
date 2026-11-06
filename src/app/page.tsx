import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { BrazilMap } from "@/components/home/BrazilMap";
import { Criteria } from "@/components/home/Criteria";
import { WorkCards } from "@/components/home/WorkCards";
import { Numbers } from "@/components/home/Numbers";
import { ImageBox } from "@/components/ImageBox";
import Link from "next/link";
import { Arrow } from "@/components/ui";
import { getProjects, getSectionImages, getSetting } from "@/lib/cms";
import { FEATURE_FOTOS } from "@/lib/photos";

export default async function HomePage() {
  const [hero, statement, mediaBand, projects, sections] = await Promise.all([
    getSetting("home.hero"),
    getSetting("home.statement"),
    getSetting("home.mediaBand"),
    getProjects(),
    getSectionImages(),
  ]);

  // Projetos agrupados por estado (UF) para o mapa da home
  const byState: Record<string, { slug: string; title: string; category: string; coverUrl: string | null }[]> = {};
  for (const p of projects) {
    if (!p.state) continue;
    (byState[p.state] ??= []).push({ slug: p.slug, title: p.title, category: p.category, coverUrl: p.coverUrl });
  }

  const feed = projects.slice(0, 4).map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    summary: p.summary,
    coverUrl: p.coverUrl,
  }));

  return (
    <>
      <Hero intro={hero.intro} imageUrl={hero.imageUrl || undefined} feed={feed} />

      <div className="page-flow">
        <span id="header-logo-anchor" aria-hidden className="block" />
        {/* Brand statement */}
        <section className="shell grid gap-10 py-[clamp(5rem,12vw,9rem)] lg:grid-cols-[0.4fr_1fr]">
          <p data-reveal="fade" className="label">
            O escritório
          </p>
          <p
            data-reveal
            className="lora measure hyphens-auto text-justify text-[clamp(1.3rem,2.4vw,2rem)] leading-[1.5] text-ink"
          >
            {statement.text}
          </p>
        </section>

        {/* Faixa em movimento */}
        <div aria-hidden className="ticker py-5">
          <div className="ticker-track">
            {[0, 1].map((k) => (
              <span key={k} className="display flex shrink-0 items-center gap-8 pr-8 text-[clamp(1.5rem,3.4vw,2.6rem)] text-ink/85">
                {["Restauro", "Conservação", "Patrimônio histórico", "Arquitetura", "Laudos técnicos", "Douração", "Pintura mural", "Projetos"].map((t) => (
                  <span key={t} className="flex items-center gap-8">
                    {t}
                    <span className="size-2 rounded-full bg-ember" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <WhatWeDo images={sections} />
        <BrazilMap
          images={sections}
          projectsByState={byState}
        />
        <Criteria images={sections} />
        <WorkCards media={mediaBand} />
        <Numbers />

        {/* Cartões grandes: o cartão inteiro é o link */}
        <section className="shell grid gap-4 py-[clamp(4.5rem,10vw,8rem)] lg:grid-cols-2">
          {[
            { href: "/projetos", kicker: "Acervo", title: "Conheça os projetos", cta: "Ver projetos", src: sections["home.conhecaProjetos"] || FEATURE_FOTOS.conheca, alt: "Projetos do Estúdio Restaura" },
            { href: "/sobre", kicker: "O estúdio", title: "Quem está por trás", cta: "Sobre o estúdio", src: sections["home.quemPorTras"] || FEATURE_FOTOS.quem, alt: "Equipe do Estúdio Restaura" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              data-reveal
              aria-label={`${c.kicker}: ${c.title}`}
              className="feature-card group relative flex aspect-square flex-col justify-between overflow-hidden rounded-[8px] p-9 text-paper outline-offset-4 md:p-12"
            >
              <span className="feature-card-img absolute inset-0 block">
                <ImageBox fill variant="bleed" src={c.src} alt={c.alt} label="Espaço para imagem" />
              </span>
              <span aria-hidden className="pointer-events-none absolute inset-0 bg-midnight/45 transition-colors duration-500 group-hover:bg-midnight/25" />
              <div className="relative">
                <p className="label">{c.kicker}</p>
                <h3 className="h mt-4 text-[clamp(2rem,4vw,3rem)]">{c.title}</h3>
              </div>
              <span className="text-arrow relative">
                {c.cta}
                <Arrow />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </>
  );
}
