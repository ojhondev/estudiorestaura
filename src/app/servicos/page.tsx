import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Intervenção arquitetônica, conservação preventiva, restauro de bens integrados, laudos técnicos, projetos de arquitetura e consultoria de patrimônio.",
};

export default function ServicosPage() {
  return (
    <>
      <PageIntro kicker="O que fazemos" title="Serviços">
        Do diagnóstico técnico ao acompanhamento de obra. Trabalhamos com
        intervenção mínima, reversibilidade e documentação rigorosa de cada
        etapa.
      </PageIntro>

      <div className="shell mt-20 md:mt-28">
        {services.map((s, i) => (
          <article
            key={s.number}
            data-reveal
            className="grid gap-8 border-t border-line py-12 md:grid-cols-[3rem_1fr_1fr] md:gap-12 md:py-16"
          >
            <span className="text-[13px] text-terracotta">{s.number}</span>

            <div className="md:pr-8">
              <h2 className="section-title text-[clamp(1.4rem,2.8vw,2.1rem)]">
                {s.title}
              </h2>
              <p className="mt-4 max-w-md text-[15px] text-ink-soft">
                {s.description}
              </p>
              <ul className="mt-5 space-y-2 text-[14px] text-ink-soft">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-terracotta" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className={i % 2 === 1 ? "md:pt-8" : ""}>
              <ImagePlaceholder ratio="4 / 3" />
            </div>
          </article>
        ))}
      </div>

      <section className="shell mt-24 border-t border-line pt-14" data-reveal>
        <h2 className="display text-[clamp(2rem,7vw,4.5rem)]">
          Tem um edifício com história?
        </h2>
        <Link href="/contato" className="ulink mt-8 text-[15px]">
          Fale com o estúdio
        </Link>
      </section>
    </>
  );
}
