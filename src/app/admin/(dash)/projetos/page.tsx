import Link from "next/link";
import { allProjects } from "../../data";

export default async function ProjetosAdmin() {
  const rows = await allProjects();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-light tracking-tight">Projetos</h1>
        <Link
          href="/admin/projetos/novo"
          className="rounded-[80px] bg-char px-4 py-2 text-[13px] font-medium text-paper"
        >
          Novo projeto
        </Link>
      </div>

      <div className="mt-6 divide-y divide-mist rounded-[8px] border border-mist bg-paper">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-[14px] text-pewter">
            Nenhum projeto cadastrado. O site está usando o acervo padrão.
          </p>
        )}
        {rows.map((p) => (
          <Link
            key={p.id}
            href={`/admin/projetos/${p.id}`}
            className="flex items-center gap-4 px-4 py-3 hover:bg-mist/50"
          >
            <span className="flex-1 text-[14px] font-medium">{p.title}</span>
            <span className="hidden text-[12px] text-smoke sm:block">
              {p.category} · {p.year}
            </span>
            {p.featured && (
              <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[11px] text-ember">
                destaque
              </span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                p.published
                  ? "bg-pine/15 text-pine"
                  : "bg-smoke/15 text-smoke"
              }`}
            >
              {p.published ? "publicado" : "rascunho"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
