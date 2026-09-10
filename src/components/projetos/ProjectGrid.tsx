"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import type { Project } from "@/lib/content";

const FILTERS = [
  "Todos",
  "Arquitetura",
  "Conservação",
  "Restauro",
  "Interiores",
] as const;

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");

  const list = useMemo(
    () =>
      filter === "Todos"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects],
  );

  return (
    <section className="shell py-[clamp(3rem,7vw,5rem)]">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-[1584px] px-4 py-1.5 text-[13px] transition-colors ${
              filter === f
                ? "bg-char text-paper"
                : "bg-mist text-pewter hover:text-ink"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/projetos/${p.slug}`} className="group">
            <ImagePlaceholder ratio="4 / 5" />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h2 className="text-[16px] transition-colors group-hover:text-ember">
                {p.title}
              </h2>
              <span className="shrink-0 text-[13px] text-smoke">{p.year}</span>
            </div>
            <p className="mt-1 text-[13px] text-pewter">
              {p.category} · {p.location}
            </p>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-12 text-pewter">Nenhum projeto nesta categoria ainda.</p>
      )}
    </section>
  );
}
