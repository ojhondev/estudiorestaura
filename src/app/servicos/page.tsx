import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { TextArrow } from "@/components/ui";
import { services } from "@/lib/content";
import { getSectionImages } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Intervenção arquitetônica, conservação preventiva, restauro de bens integrados, laudos técnicos, projetos de arquitetura e consultoria de patrimônio.",
};

export const dynamic = "force-dynamic";

export default async function ServicosPage() {
  const sections = await getSectionImages();
  return (
    <>
      <PageHero
        label="O que fazemos"
        title="Serviços"
        intro="Do diagnóstico técnico ao acompanhamento de obra. Trabalhamos com intervenção mínima, reversibilidade e documentação rigorosa de cada etapa."
        imageLabel="Espaço para imagem — canteiro de obra"
        imageUrl={sections["pagehero.servicos"] || undefined}
      />

      <div className="shell py-[clamp(3rem,7vw,5rem)]">
        {services.map((s, i) => (
          <article
            key={s.number}
            data-reveal
            className="grid gap-8 border-t border-mist py-14 md:grid-cols-[3rem_1fr_1fr] md:gap-12"
          >
            <span className="text-[13px] text-ember">{s.number}</span>

            <div className="md:pr-8">
              <h2 className="h text-[clamp(1.5rem,3vw,2rem)]">{s.title}</h2>
              <p className="mt-4 max-w-md text-[15px] text-pewter">
                {s.description}
              </p>
              <ul className="mt-5 space-y-2 text-[14px] text-pewter">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-ember" />
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

      <section className="bleed relative flex min-h-[60vh] items-center overflow-hidden">
        <ImagePlaceholder fill variant="bleed" label="Espaço para imagem" />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-midnight/55"
        />
        <div className="relative shell py-16 text-paper">
          <h2 className="h-lg max-w-3xl text-[clamp(2rem,5vw,3.5rem)]">
            Tem um edifício com história?
          </h2>
          <TextArrow href="/contato" className="mt-8 text-[15px]">
            Fale com o estúdio
          </TextArrow>
        </div>
      </section>
    </>
  );
}
