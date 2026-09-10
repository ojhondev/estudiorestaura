import { Hero } from "@/components/home/Hero";
import { WhatWeDo } from "@/components/home/WhatWeDo";
import { BrazilMap } from "@/components/home/BrazilMap";
import { Criteria } from "@/components/home/Criteria";
import { WorkCards } from "@/components/home/WorkCards";
import { Numbers } from "@/components/home/Numbers";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { TextArrow } from "@/components/ui";

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="page-flow">
        {/* Brand statement */}
        <section className="shell grid gap-10 py-[clamp(5rem,12vw,9rem)] lg:grid-cols-[0.4fr_1fr]">
          <p data-reveal="fade" className="label">
            O escritório
          </p>
          <p
            data-reveal
            className="lora measure text-[clamp(1.3rem,2.4vw,2rem)] leading-[1.5] text-ink"
          >
            Somos um time de arquitetos, conservadores e restauradores com um
            interesse em comum: devolver vida a edifícios e acervos sem apagar as
            camadas do tempo. Cada projeto começa por uma leitura atenta do que já
            existe.
          </p>
        </section>

        <WhatWeDo />
        <BrazilMap />
        <Criteria />
        <WorkCards />
        <Numbers />

        {/* Feature cards */}
        <section className="shell grid gap-4 py-[clamp(4.5rem,10vw,8rem)] lg:grid-cols-2">
          <div
            data-reveal
            className="flex min-h-[24rem] flex-col justify-between rounded-[8px] bg-mist p-9 md:p-12"
          >
            <div>
              <p className="label">Acervo</p>
              <h3 className="h mt-4 text-[clamp(2rem,4vw,3rem)]">
                Conheça os projetos
              </h3>
            </div>
            <TextArrow href="/projetos">Ver projetos</TextArrow>
          </div>

          <div
            data-reveal
            className="relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[8px] p-9 text-paper md:p-12"
          >
            <ImagePlaceholder fill variant="bleed" label="Espaço para imagem" />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-midnight/45" />
            <div className="relative">
              <p className="label text-paper/70">O estúdio</p>
              <h3 className="h mt-4 text-[clamp(2rem,4vw,3rem)]">
                Quem está por trás
              </h3>
            </div>
            <TextArrow href="/sobre" className="relative">
              Sobre o estúdio
            </TextArrow>
          </div>
        </section>
      </div>
    </>
  );
}
