import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export const metadata: Metadata = {
  title: "Sobre o Estúdio",
  description:
    "O Estúdio Restaura reúne arquitetos, conservadores e restauradores dedicados ao patrimônio histórico e cultural.",
};

const NUMBERS = [
  ["18", "anos de atuação"],
  ["120+", "edifícios estudados"],
  ["9", "estados"],
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

export default function SobrePage() {
  return (
    <>
      <PageIntro kicker="Quem somos" title="Sobre o Estúdio">
        O Estúdio Restaura é um escritório especializado em arquitetura,
        conservação e restauro de patrimônio histórico e cultural. Fundado por
        profissionais experientes da área, desenvolve projetos de intervenção
        arquitetônica, planos de conservação preventiva e laudos técnicos
        detalhados para preservar a memória e a autenticidade de edificações
        antigas e obras de arte.
      </PageIntro>

      <section className="shell mt-16 md:mt-24" data-reveal="wipe">
        <ImagePlaceholder ratio="16 / 7" />
      </section>

      <section className="shell mt-20 grid gap-8 border-y border-line py-12 sm:grid-cols-2 lg:grid-cols-4">
        {NUMBERS.map(([n, label]) => (
          <div key={label} data-reveal>
            <p className="display text-[clamp(2.5rem,6vw,4.5rem)]">{n}</p>
            <p className="mt-1 text-[13px] text-muted">{label}</p>
          </div>
        ))}
      </section>

      <section className="shell mt-20 grid gap-10 md:mt-28 md:grid-cols-[0.8fr_1.2fr]">
        <h2 className="section-title text-[clamp(1.6rem,3.4vw,2.6rem)]">
          Como trabalhamos
        </h2>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} data-reveal>
              <h3 className="text-[15px] font-medium">{v.title}</h3>
              <p className="mt-2 text-[15px] text-ink-soft">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell mt-20 md:mt-28">
        <h2 data-reveal className="section-title text-[clamp(1.6rem,3.4vw,2.6rem)]">
          Equipe
        </h2>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map(([name, role]) => (
            <div key={name} data-reveal>
              <ImagePlaceholder ratio="3 / 4" />
              <p className="mt-4 text-[15px]">{name}</p>
              <p className="text-[13px] text-muted">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
