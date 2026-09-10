import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getSectionImages } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Sobre o Estúdio",
  description:
    "O Estúdio Restaura reúne arquitetos, conservadores e restauradores dedicados ao patrimônio histórico e cultural.",
};

export const dynamic = "force-dynamic";

const NUMBERS = [
  ["8", "anos de atuação"],
  ["20+", "projetos de restauro"],
  ["3", "estados de atuação"],
  ["4", "áreas integradas"],
];

const VALUES = [
  {
    title: "Intervenção mínima",
    body: "Conservar mais do que substituir. Cada camada removida é uma decisão irreversível — e por isso é sempre a última opção.",
  },
  {
    title: "Reversibilidade",
    body: "As adições contemporâneas se apoiam em estruturas autônomas, que podem ser retiradas sem deixar marca no bem histórico.",
  },
  {
    title: "Documentação",
    body: "Tudo é registrado: mapas de danos, ensaios, fichas por elemento. O projeto entrega também um arquivo para a manutenção futura.",
  },
  {
    title: "Distinguibilidade",
    body: "O novo não imita o antigo. A leitura das épocas permanece clara para quem visita o edifício.",
  },
];

const TEAM = [
  ["Helena Restaura", "Arquiteta · sócia-fundadora"],
  ["Marcos Vidal", "Conservador-restaurador"],
  ["Ana Sartori", "Arquiteta de patrimônio"],
  ["Tomás Rocha", "Engenheiro de estruturas históricas"],
];

export default async function SobrePage() {
  const sections = await getSectionImages();
  return (
    <>
      <PageHero
        label="Quem somos"
        title="Sobre o Estúdio"
        imageLabel="Espaço para imagem — equipe / atelier"
        imageUrl={sections["pagehero.sobre"] || undefined}
      />

      <section className="shell grid gap-10 py-[clamp(4rem,9vw,6rem)] md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <p data-reveal="fade" className="label">
          Manifesto
        </p>
        <p data-reveal className="lora text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.55] text-pewter">
          O Estúdio Restaura é um escritório especializado em arquitetura,
          conservação e restauro de patrimônio histórico e cultural. Fundado por
          profissionais experientes da área, preserva a memória e a autenticidade
          de edificações antigas e obras de arte — devolvendo legibilidade às
          camadas do tempo sem apagá-las.
        </p>
      </section>

      <section className="bleed border-y border-mist">
        <div className="shell grid gap-8 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {NUMBERS.map(([n, label]) => (
            <div key={label} data-reveal>
              <p className="display text-[clamp(2.5rem,6vw,4.5rem)]">{n}</p>
              <p className="mt-2 text-[13px] text-smoke">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell grid gap-10 py-[clamp(4rem,9vw,6rem)] md:grid-cols-[0.8fr_1.2fr]">
        <h2 data-reveal className="h text-[clamp(1.75rem,3.5vw,2.5rem)]">
          Como trabalhamos
        </h2>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} data-reveal>
              <h3 className="text-[16px]">{v.title}</h3>
              <p className="mt-2 text-[15px] text-pewter">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell py-[clamp(3rem,7vw,5rem)]">
        <h2 data-reveal className="h text-[clamp(1.75rem,3.5vw,2.5rem)]">
          Equipe
        </h2>
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(([name, role]) => (
            <div key={name} data-reveal>
              <ImagePlaceholder ratio="3 / 4" />
              <p className="mt-4 text-[15px]">{name}</p>
              <p className="text-[13px] text-smoke">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
