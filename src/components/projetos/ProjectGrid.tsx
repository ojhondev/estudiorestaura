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
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-4 text-[13px]">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`border-b pb-px transition-colors hover:text-terracotta ${
              filter === f ? "border-current text-terracotta" : "border-transparent"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-muted">
          {String(list.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.slug} href={`/projetos/${p.slug}`} className="group block">
            <ImagePlaceholder ratio="4 / 5" />
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h2 className="text-[16px] transition-colors group-hover:text-terracotta">
                {p.title}
              </h2>
              <span className="shrink-0 text-[13px] text-muted">{p.year}</span>
            </div>
            <p className="mt-1 text-[13px] text-muted">
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
