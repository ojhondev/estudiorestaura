import Link from "next/link";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { projects } from "@/lib/content";

export function FeaturedProjects() {
  const featured = projects.slice(0, 2);

  return (
    <section className="shell mt-28 md:mt-40">
      <h2
        data-reveal="up"
        className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium tracking-[-0.02em]"
      >
        Projetos em destaque
      </h2>

      <div className="mt-10 grid gap-x-8 gap-y-12 md:mt-14 md:grid-cols-2">
        {featured.map((p, i) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            data-reveal="up"
            data-reveal-delay={i * 0.08}
            className="group block"
          >
            <ImagePlaceholder ratio="4 / 3" />
            <h3 className="mt-5 font-display text-xl tracking-[-0.01em] group-hover:text-terracotta">
              {p.title}
            </h3>
            <p className="mt-2 max-w-md text-ink-soft">{p.summary}</p>
            <span className="mt-3 inline-block text-sm text-muted transition-colors group-hover:text-terracotta">
              {p.location} · {p.year}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-14 flex justify-center" data-reveal="fade">
        <Link
          href="/projetos"
          className="rounded-full border border-ink px-8 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
        >
          Ver todos os projetos
        </Link>
      </div>
    </section>
  );
}
