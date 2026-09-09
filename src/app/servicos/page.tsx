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
        {services.map((s) => (
          <article
            key={s.number}
            data-reveal="up"
            className="grid gap-8 border-t border-line py-12 md:grid-cols-[auto_1fr_1fr] md:gap-12 md:py-16"
          >
            <span className="font-display text-sm text-terracotta">
              {s.number}
            </span>

            <div>
              <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] tracking-[-0.02em]">
                {s.title}
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">{s.description}</p>
              <ul className="mt-5 space-y-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex gap-3 text-sm text-ink-soft before:mt-2 before:h-px before:w-4 before:shrink-0 before:bg-terracotta before:content-['']"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ImagePlaceholder ratio="4 / 3" />
            </div>
          </article>
        ))}
      </div>

      <section className="shell mt-24 border-t border-line pt-12" data-reveal="up">
        <h2 className="display text-[clamp(2rem,6vw,4rem)]">
          Tem um edifício com história?
        </h2>
        <Link
          href="/contato"
          className="mt-6 inline-block rounded-full bg-terracotta px-8 py-3.5 text-sm text-paper transition-opacity hover:opacity-90"
        >
          Fale com o estúdio
        </Link>
      </section>
    </>
  );
}
