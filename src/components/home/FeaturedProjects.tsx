import Link from "next/link";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { projects } from "@/lib/content";

export function FeaturedProjects() {
  const featured = projects.slice(0, 2);

  return (
    <section className="shell mt-28 md:mt-40">
      <div className="flex items-end justify-between gap-6">
        <h2
          data-reveal
          className="section-title text-[clamp(1.75rem,4.5vw,3.25rem)]"
        >
          Projetos em destaque
        </h2>
        <Link
          href="/projetos"
          data-reveal
          className="ulink mb-1 hidden shrink-0 text-[14px] sm:block"
        >
          Ver todos os projetos
        </Link>
      </div>

      <div className="mt-12 grid gap-x-10 gap-y-14 md:mt-16 md:grid-cols-2">
        {featured.map((p) => (
          <Link
            key={p.slug}
            href={`/projetos/${p.slug}`}
            data-reveal
            className="group block"
          >
            <ImagePlaceholder ratio="4 / 3" />
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="text-[18px] transition-colors group-hover:text-terracotta">
                {p.title}
              </h3>
              <span className="shrink-0 text-[14px] text-muted">{p.year}</span>
            </div>
            <p className="mt-1 text-[14px] text-muted">
              {p.category} · {p.location}
            </p>
          </Link>
        ))}
      </div>

      <Link
        href="/projetos"
        data-reveal
        className="ulink mt-10 inline-block text-[14px] sm:hidden"
      >
        Ver todos os projetos
      </Link>
    </section>
  );
}
