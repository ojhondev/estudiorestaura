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

      {/* Brand statement */}
      <section className="container grid gap-10 py-[clamp(4rem,10vw,8rem)] md:grid-cols-[0.5fr_1fr]">
        <p data-reveal="fade" className="label">
          O escritório
        </p>
        <p
          data-reveal
          className="lora max-w-[42rem] text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.55] text-pewter"
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
      <section className="container grid gap-4 py-[clamp(4rem,9vw,7rem)] md:grid-cols-2">
        <div
          data-reveal
          className="flex min-h-[22rem] flex-col justify-between rounded-[8px] bg-mist p-8 md:p-10"
        >
          <div>
            <p className="label">Acervo</p>
            <h3 className="h mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Conheça os projetos
            </h3>
          </div>
          <TextArrow href="/projetos">Ver projetos</TextArrow>
        </div>

        <div
          data-reveal
          className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[8px] p-8 text-paper md:p-10"
        >
          <ImagePlaceholder fill variant="bleed" label="Espaço para imagem" />
          <span aria-hidden className="pointer-events-none absolute inset-0 bg-midnight/45" />
          <div className="relative">
            <p className="label text-mist/70">O estúdio</p>
            <h3 className="h mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Quem está por trás
            </h3>
          </div>
          <TextArrow href="/sobre" className="relative">
            Sobre o estúdio
          </TextArrow>
        </div>
      </section>
    </>
  );
}
