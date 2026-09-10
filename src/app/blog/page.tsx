import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { ImageBox } from "@/components/ImageBox";
import { getPosts, getSectionImages } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Textos do Estúdio Restaura sobre método, ética do restauro, conservação preventiva e as camadas do tempo.",
};

export const dynamic = "force-dynamic";

const fmt = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default async function BlogPage() {
  const [posts, sections] = await Promise.all([getPosts(), getSectionImages()]);

  return (
    <>
      <PageHero
        label="Jornal"
        title="Blog"
        intro="Notas sobre o ofício: método, decisões técnicas e a ética de intervir no que já existe."
        imageLabel="Espaço para imagem — editorial"
        imageUrl={sections["pagehero.blog"] || undefined}
      />

      <section className="shell grid gap-x-6 gap-y-14 py-[clamp(3rem,7vw,5rem)] sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <ImageBox
              src={p.coverUrl}
              alt={p.title}
              ratio="4 / 3"
              label="Espaço para imagem"
            />
            <p className="mt-4 text-[12px] uppercase tracking-[0.16em] text-smoke">
              {p.tag} · {fmt(p.publishedAt)}
            </p>
            <h2 className="mt-1.5 text-[18px] font-light leading-snug transition-colors group-hover:text-ember">
              {p.title}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-pewter">
              {p.excerpt}
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
