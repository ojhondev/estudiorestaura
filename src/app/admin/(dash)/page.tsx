import Link from "next/link";
import { allJobs, allPosts, allProjects, dbReady } from "../data";

export default async function AdminHome() {
  const [projects, posts, jobs] = await Promise.all([
    allProjects(),
    allPosts(),
    allJobs(),
  ]);

  const cards = [
    {
      href: "/admin/projetos",
      label: "Projetos",
      count: projects.length,
      sub: `${projects.filter((p) => p.published).length} publicados`,
    },
    {
      href: "/admin/blog",
      label: "Blog",
      count: posts.length,
      sub: `${posts.filter((p) => p.published).length} publicados`,
    },
    {
      href: "/admin/vagas",
      label: "Vagas",
      count: jobs.length,
      sub: `${jobs.filter((j) => j.published).length} abertas`,
    },
    {
      href: "/admin/conteudo",
      label: "Conteúdo",
      count: "—",
      sub: "textos e imagens das seções",
    },
  ];

  return (
    <div>
      <h1 className="text-[26px] font-light tracking-tight">Painel</h1>
      <p className="mt-1 text-[14px] text-pewter">
        Administre projetos, blog, vagas e o conteúdo das seções do site.
      </p>

      {!dbReady && (
        <p className="mt-5 rounded-[8px] border border-coral/40 bg-coral/10 px-4 py-3 text-[13px] text-coral">
          Banco de dados não configurado (DATABASE_URL ausente). O site usa o
          conteúdo padrão e as edições não serão salvas.
        </p>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-[8px] border border-mist bg-paper p-5 transition-colors hover:border-ember"
          >
            <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
              {c.label}
            </span>
            <p className="mt-2 text-[32px] font-light leading-none">{c.count}</p>
            <p className="mt-2 text-[12px] text-pewter">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
