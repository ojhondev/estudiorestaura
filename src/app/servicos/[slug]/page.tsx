import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBox } from "@/components/ImageBox";
import { JsonLd } from "@/components/JsonLd";
import { Arrow, TextArrow } from "@/components/ui";
import { getPosts, getProjects } from "@/lib/cms";
import { WHATSAPP } from "@/lib/content";
import { absoluteUrl, breadcrumbLd, faqLd, SITE_URL } from "@/lib/seo";
import { getServicePage, servicePages } from "@/lib/services";

export const revalidate = 3600;

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getServicePage(slug);
  if (!s) return {};
  return {
    title: s.h1,
    description: s.metaDescription,
    alternates: { canonical: `/servicos/${s.slug}` },
    openGraph: {
      title: s.h1,
      description: s.metaDescription,
      type: "website",
      images: [{ url: s.photo }],
    },
    twitter: { card: "summary_large_image", images: [s.photo] },
  };
}

export default async function ServicoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getServicePage(slug);
  if (!s) notFound();

  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const matched = projects.filter((p) => s.projectMatch.test(`${p.title} ${p.category} ${p.client}`));
  const related = [...matched, ...projects.filter((p) => p.featured && !matched.includes(p))].slice(0, 3);
  const relatedPosts = s.posts.map((ps) => posts.find((p) => p.slug === ps)).filter((p) => !!p).slice(0, 4);
  const others = servicePages.filter((x) => x.slug !== s.slug);

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.h1,
    serviceType: s.title,
    description: s.metaDescription,
    url: `${SITE_URL}/servicos/${s.slug}`,
    image: absoluteUrl(s.photo),
    areaServed: { "@type": "Country", name: "Brasil" },
    provider: { "@id": `${SITE_URL}/#organization` },
  };

  return (
    <>
      <JsonLd
        data={[
          serviceLd,
          faqLd(s.faq),
          breadcrumbLd([
            ["Serviços", "/servicos"],
            [s.title, `/servicos/${s.slug}`],
          ]),
        ]}
      />

      <section className="bleed relative flex min-h-[68vh] items-end overflow-hidden">
        <ImageBox fill variant="bleed" src={s.photo} alt={s.h1} sizes="100vw" priority />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/25 to-midnight/45" />
        <div className="relative shell pb-[clamp(2.5rem,7vw,4.5rem)] pt-[clamp(7rem,14vh,10rem)] text-paper">
          <Link href="/servicos" className="text-arrow text-[13px] text-paper/80">
            <span className="rotate-180">
              <Arrow />
            </span>
            Serviços
          </Link>
          <p className="label mt-6">Serviço {s.number}</p>
          <h1 className="display mt-3 max-w-5xl text-[clamp(2.1rem,6vw,4.75rem)]">{s.h1}</h1>
        </div>
      </section>

      <div className="shell grid gap-12 py-[clamp(3rem,7vw,5rem)] lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <p className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.65] text-ink">{s.intro}</p>

          <h2 className="h mt-14 text-[clamp(1.5rem,3vw,2rem)]">Como trabalhamos</h2>
          <ol className="mt-6 space-y-6">
            {s.steps.map((st, i) => (
              <li key={st.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-mist pt-5">
                <span className="text-[13px] text-ember">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[16px] font-semibold">{st.title}</h3>
                  <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-pewter">{st.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="self-start lg:sticky lg:top-28">
          <p className="label">O que inclui</p>
          <ul className="mt-4 space-y-3 text-[15px] text-pewter">
            {s.bullets.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-3 h-px w-4 shrink-0 bg-ember" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-[8px] bg-mist p-6">
            <p className="text-[15px] font-medium">Quer conversar sobre o seu caso?</p>
            <p className="mt-2 text-[14px] leading-relaxed text-pewter">Conte o que você tem em mãos e respondemos com os próximos passos.</p>
            <div className="mt-5 flex flex-col gap-3">
              <TextArrow href="/contato" className="text-[14px]">
                Fale com o estúdio
              </TextArrow>
              <a href={WHATSAPP.href} target="_blank" rel="noreferrer" className="text-[14px] text-pewter underline underline-offset-4 hover:text-ember">
                WhatsApp {WHATSAPP.display}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <section className="border-t border-mist">
        <div className="shell py-[clamp(3rem,7vw,5rem)]">
          <h2 className="h text-[clamp(1.5rem,3vw,2rem)]">Perguntas frequentes</h2>
          <div className="mt-8 max-w-3xl divide-y divide-mist border-y border-mist">
            {s.faq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[16px] font-medium">
                  {f.q}
                  <span aria-hidden className="mt-1 text-ember transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-pewter">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-mist">
          <div className="shell py-[clamp(3rem,7vw,5rem)]">
            <h2 className="h text-[clamp(1.5rem,3vw,2rem)]">Projetos relacionados</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/projetos/${p.slug}`} className="group">
                  <ImageBox src={p.coverUrl} alt={`${p.title} — ${p.client}`} ratio="4 / 5" sizes="(min-width: 1024px) 30vw, 100vw" />
                  <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-smoke">{[p.client, p.location].filter(Boolean).join(" · ")}</p>
                  <h3 className="mt-1 text-[17px] font-medium leading-snug group-hover:text-ember">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedPosts.length > 0 && (
        <section className="border-t border-mist">
          <div className="shell py-[clamp(3rem,7vw,5rem)]">
            <h2 className="h text-[clamp(1.5rem,3vw,2rem)]">Para ler mais</h2>
            <ul className="mt-6 grid gap-x-12 gap-y-4 md:grid-cols-2">
              {relatedPosts.map((p) => (
                <li key={p!.slug} className="border-t border-mist pt-4">
                  <Link href={`/blog/${p!.slug}`} className="text-[16px] font-medium hover:text-ember">
                    {p!.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-[14px] text-pewter">{p!.excerpt}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="border-t border-mist">
        <div className="shell py-[clamp(3rem,7vw,5rem)]">
          <p className="label">Outros serviços</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/servicos/${o.slug}`} className="inline-block rounded-[80px] border border-mist px-4 py-2 text-[13px] transition-colors hover:border-smoke hover:text-ember">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
