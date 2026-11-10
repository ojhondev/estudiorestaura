import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";
import { getPost, getPosts } from "@/lib/cms";
import { isAuthed } from "@/lib/auth";
import { WHATSAPP } from "@/lib/content";
import { faqOf, parseBlocks, plain, RichBody, tocOf, wordCount } from "@/lib/richtext";

export const dynamic = "force-dynamic";

const SITE = "https://estudiorestaura.com.br";

const fmt = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const abs = (u: string | null) => (u ? (u.startsWith("http") ? u : `${SITE}${u}`) : undefined);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, { drafts: await isAuthed() });
  if (!post) return {};
  const url = `${SITE}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    robots: post.published === false ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      siteName: "Estúdio Restaura",
      locale: "pt_BR",
      images: post.coverUrl ? [{ url: abs(post.coverUrl)! }] : undefined,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const admin = await isAuthed();
  const post = await getPost(slug, { drafts: admin });
  if (!post) notFound();

  const all = await getPosts();
  const others = all.filter((p) => p.slug !== post.slug);
  const related = [...others.filter((p) => p.tag === post.tag), ...others.filter((p) => p.tag !== post.tag)].slice(0, 3);
  const idx = all.findIndex((p) => p.slug === post.slug);
  const next = all.length ? all[(idx + 1) % all.length] : undefined;

  const blocks = parseBlocks(post.body);
  const toc = tocOf(blocks);
  const faq = faqOf(blocks);
  const minutes = Math.max(1, Math.round(wordCount(blocks) / 190));
  const url = `${SITE}/blog/${post.slug}`;

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: abs(post.coverUrl),
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      inLanguage: "pt-BR",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Estúdio Restaura", url: SITE },
      publisher: { "@type": "Organization", name: "Estúdio Restaura", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/icon.png` } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    ...(faq.length >= 2
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: plain(f.q), acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${url}`)}`;

  return (
    <article>
      {ld.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}

      {post.published === false && (
        <div className="fixed inset-x-0 top-0 z-[90] bg-ember px-4 py-2 text-center text-[12px] font-medium uppercase tracking-[0.16em] text-paper">
          Rascunho — só você (logado) está vendo esta página
        </div>
      )}

      <header className="shell max-w-[68rem] pt-[clamp(7rem,16vh,10rem)]">
        <nav aria-label="Você está em" className="flex flex-wrap items-center gap-2 text-[13px] text-smoke">
          <Link href="/" className="hover:text-ember">
            Início
          </Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="hover:text-ember">
            Blog
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{post.tag}</span>
        </nav>
        <p className="mt-6 text-[12px] uppercase tracking-[0.16em] text-smoke">
          {post.tag} · {fmt(post.publishedAt)} · {minutes} min de leitura
        </p>
        <h1 data-reveal className="display mt-3 text-[clamp(2rem,5.4vw,3.75rem)]">
          {post.title}
        </h1>
        <p className="lora mt-6 max-w-[48rem] text-[clamp(1.1rem,1.8vw,1.35rem)] leading-[1.55] text-pewter">{post.excerpt}</p>
        <p className="mt-6 text-[13px] text-smoke">Por equipe técnica do Estúdio Restaura — arquitetura, conservação e restauro de patrimônio histórico.</p>
      </header>

      <div className="shell mt-10 grid max-w-[68rem] gap-12 pb-[clamp(3rem,7vw,5rem)] lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-14">
        <div className="min-w-0">
          {post.coverUrl && (
            <ImageBox
              src={post.coverUrl}
              alt={post.title}
              ratio="16 / 9"
              sizes="(min-width: 1024px) 720px, 100vw"
              className="mb-10 max-h-[26rem]"
            />
          )}

          <RichBody blocks={blocks} />

          <aside className="mt-14 rounded-[8px] bg-mist p-7 md:p-9">
            <p className="label">Fale com o estúdio</p>
            <h2 className="h mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)]">Sua igreja ou instituição precisa de restauro em São Paulo ou Minas Gerais?</h2>
            <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink/80">
              Fazemos o diagnóstico, o projeto e a execução do restauro — de pinturas murais e altares à estrutura e à cobertura. Conte o que você tem em mãos e
              orientamos o melhor caminho, inclusive sobre aprovações e leis de incentivo.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
              <a href={WHATSAPP.href} target="_blank" rel="noreferrer" className="btn-fill">
                Falar no WhatsApp <Arrow className="h-4 w-4" />
              </a>
              <Link href="/contato" className="text-arrow text-[14px]">
                Pedir um orçamento <Arrow />
              </Link>
            </div>
          </aside>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            {toc.length > 1 && (
              <nav aria-label="Neste artigo">
                <p className="label">Neste artigo</p>
                <ol className="mt-4 space-y-3 border-l border-mist pl-4 text-[13.5px] leading-snug">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-pewter transition-colors hover:text-ember">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="space-y-3 text-[13px]">
              <p className="label">Compartilhar</p>
              <a href={waShare} target="_blank" rel="noreferrer" className="text-arrow">
                WhatsApp <Arrow />
              </a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="bleed border-t border-mist">
          <div className="shell py-[clamp(3rem,7vw,5rem)]">
            <p className="label">Continue lendo</p>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
                  <ImageBox src={p.coverUrl} alt={p.title} ratio="16 / 10" sizes="(min-width: 1024px) 33vw, 100vw" label="Espaço para imagem" />
                  <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-smoke">{p.tag}</p>
                  <h3 className="mt-1.5 text-[17px] font-light leading-snug transition-colors group-hover:text-ember">{p.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {next && next.slug !== post.slug && (
        <section className="bleed border-t border-mist">
          <div className="shell flex flex-col gap-3 py-14">
            <p className="label">Próximo texto</p>
            <Link href={`/blog/${next.slug}`} className="group inline-flex items-baseline gap-4">
              <span className="h text-[clamp(1.5rem,4vw,3rem)] transition-colors group-hover:text-ember">{next.title}</span>
              <Arrow className="h-5 w-5 self-center text-ember" />
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
