import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageBox } from "@/components/ImageBox";
import { Arrow } from "@/components/ui";
import { getPost, getPosts } from "@/lib/cms";

export const dynamic = "force-dynamic";

const fmt = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const all = await getPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const next = all[(idx + 1) % all.length];

  return (
    <article>
      <section className="shell max-w-3xl pt-[clamp(7rem,16vh,11rem)]">
        <Link href="/blog" className="text-arrow text-[13px] text-smoke">
          <span className="rotate-180">
            <Arrow />
          </span>
          Blog
        </Link>
        <p className="mt-6 text-[12px] uppercase tracking-[0.16em] text-smoke">
          {post.tag} · {fmt(post.publishedAt)}
        </p>
        <h1 data-reveal className="display mt-3 text-[clamp(2rem,6vw,4rem)]">
          {post.title}
        </h1>
        <p className="lora mt-6 text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-pewter">
          {post.excerpt}
        </p>
      </section>

      {post.coverUrl && (
        <div className="shell mt-10">
          <ImageBox src={post.coverUrl} alt={post.title} ratio="16 / 9" />
        </div>
      )}

      <div className="shell max-w-3xl space-y-5 py-[clamp(3rem,7vw,5rem)] text-[16px] leading-[1.7] text-ink/85">
        {post.body.map((para, i) => (
          <p key={i} data-reveal>
            {para}
          </p>
        ))}
      </div>

      <section className="bleed border-t border-mist">
        <div className="shell flex flex-col gap-3 py-14">
          <p className="label">Próximo texto</p>
          <Link
            href={`/blog/${next.slug}`}
            className="group inline-flex items-baseline gap-4"
          >
            <span className="h text-[clamp(1.5rem,4vw,3rem)] transition-colors group-hover:text-ember">
              {next.title}
            </span>
            <Arrow className="h-5 w-5 self-center text-ember" />
          </Link>
        </div>
      </section>
    </article>
  );
}
