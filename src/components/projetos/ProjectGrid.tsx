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
    <section className="shell">
      <div className="flex flex-wrap gap-2 border-y border-line py-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === f
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-terracotta"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/projetos/${p.slug}`} className="group block">
            <ImagePlaceholder ratio="4 / 5" />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-lg tracking-[-0.01em] group-hover:text-terracotta">
                {p.title}
              </h2>
              <span className="shrink-0 text-sm text-muted">{p.year}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {p.category} · {p.location}
            </p>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="mt-12 text-muted">Nenhum projeto nesta categoria ainda.</p>
      )}
    </section>
  );
}
