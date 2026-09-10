import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/ui";
import { getJob } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return {};
  return {
    title: `${job.title} — Vagas`,
    description: job.body[0] ?? "Vaga no Estúdio Restaura.",
  };
}

export default async function VagaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const subject = encodeURIComponent(`Candidatura — ${job.title}`);

  return (
    <article className="shell max-w-3xl pt-[clamp(7rem,16vh,11rem)]">
      <Link href="/trabalhe-conosco" className="text-arrow text-[13px] text-smoke">
        <span className="rotate-180">
          <Arrow />
        </span>
        Trabalhe conosco
      </Link>

      <h1 data-reveal className="display mt-6 text-[clamp(2rem,6vw,4rem)]">
        {job.title}
      </h1>
      <p className="mt-4 text-[13px] uppercase tracking-[0.16em] text-smoke">
        {job.area} · {job.type} · {job.location}
      </p>

      <div className="mt-10 space-y-5 text-[16px] leading-[1.7] text-ink/85">
        {job.body.map((para, i) => (
          <p key={i} data-reveal>
            {para}
          </p>
        ))}
      </div>

      {job.requirements.length > 0 && (
        <div className="mt-10">
          <p className="label">Requisitos</p>
          <ul className="mt-4 space-y-3 text-[15px] text-ink/80">
            {job.requirements.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-ink/40" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 border-t border-mist pt-8">
        <a
          href={`mailto:contato@estudiorestaura.com.br?subject=${subject}`}
          className="inline-flex rounded-[80px] bg-char px-6 py-3 text-[13px] font-medium text-paper transition-opacity hover:opacity-90"
        >
          Candidatar-se
        </a>
      </div>
    </article>
  );
}
