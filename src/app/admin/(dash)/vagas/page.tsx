import Link from "next/link";
import { allJobs } from "../../data";

export default async function VagasAdmin() {
  const rows = await allJobs();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-light tracking-tight">Vagas</h1>
        <Link
          href="/admin/vagas/nova"
          className="rounded-[80px] bg-char px-4 py-2 text-[13px] font-medium text-paper"
        >
          Nova vaga
        </Link>
      </div>

      <div className="mt-6 divide-y divide-mist rounded-[8px] border border-mist bg-paper">
        {rows.length === 0 && (
          <p className="px-4 py-6 text-[14px] text-pewter">
            Nenhuma vaga cadastrada. O site está usando as vagas padrão.
          </p>
        )}
        {rows.map((j) => (
          <Link
            key={j.id}
            href={`/admin/vagas/${j.id}`}
            className="flex items-center gap-4 px-4 py-3 hover:bg-mist/50"
          >
            <span className="flex-1 text-[14px] font-medium">{j.title}</span>
            <span className="hidden text-[12px] text-smoke sm:block">
              {j.area} · {j.location}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] ${
                j.published ? "bg-pine/15 text-pine" : "bg-smoke/15 text-smoke"
              }`}
            >
              {j.published ? "aberta" : "fechada"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
