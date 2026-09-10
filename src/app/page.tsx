import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { Arrow, TextArrow } from "@/components/ui";
import { projects, services } from "@/lib/content";

export default function HomePage() {
  const featured = projects.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Brand statement */}
      <section className="container grid gap-10 py-[clamp(4rem,10vw,7rem)] md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div>
          <p data-reveal="fade" className="label">
            O escritório
          </p>
          <h2
            data-reveal
            className="h-lg mt-4 text-[clamp(2.25rem,6vw,3.875rem)]"
          >
            Restauro
            <br />
            além da obra.
          </h2>
        </div>
        <p
          data-reveal
          className="lora max-w-[36rem] self-end text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.6] text-pewter"
        >
          Fundado por profissionais experientes da área, o Estúdio Restaura
          desenvolve projetos de intervenção arquitetônica, planos de conservação
          preventiva e laudos técnicos detalhados. Cada trabalho começa por uma
          leitura atenta do que já existe — e devolve legibilidade às camadas do
          tempo sem apagá-las.
        </p>
      </section>

      {/* What we do — numbered list */}
      <section className="container grid gap-12 py-[clamp(3rem,7vw,5rem)] md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p data-reveal="fade" className="label">
            Áreas de atuação
          </p>
          <h2 data-reveal className="h mt-4 text-[clamp(1.75rem,4vw,2.25rem)]">
            O que fazemos
          </h2>
          <TextArrow href="/servicos" className="mt-6" data-reveal>
            Todos os serviços
          </TextArrow>
        </div>
        <ul>
          {services.slice(0, 4).map((s) => (
            <li
              key={s.number}
              data-reveal
              className="grid grid-cols-[3rem_1fr] items-baseline gap-2 border-t border-mist py-6"
            >
              <span className="text-[12px] text-smoke">{s.number}</span>
              <div>
                <p className="text-[clamp(1.05rem,2vw,1.25rem)]">{s.title}</p>
                <p className="mt-1 max-w-md text-[14px] text-pewter">
                  {s.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Full-bleed photo band */}
      <section className="bleed relative my-[clamp(3rem,7vw,5rem)] flex min-h-[70vh] items-end overflow-hidden">
        <ImagePlaceholder
          fill
          variant="bleed"
          label="Espaço para imagem — obra / detalhe construtivo"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/70 to-transparent"
        />
        <div className="relative container py-[clamp(2.5rem,7vw,4.5rem)]">
          <p data-reveal="fade" className="label text-mist/70">
            Patrimônio
          </p>
          <p
            data-reveal
            className="h-lg mt-3 max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] text-paper"
          >
            O que foi bem feito merece durar mais uma vez.
          </p>
        </div>
      </section>

      {/* Two-column feature cards */}
      <section className="container grid gap-4 py-[clamp(3rem,7vw,5rem)] md:grid-cols-2">
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
          <div className="flex items-end justify-between">
            <TextArrow href="/projetos">Ver projetos</TextArrow>
            <span aria-hidden className="text-[2.5rem] font-light text-ink/15">
              ⌐
            </span>
          </div>
        </div>

        <div
          data-reveal
          className="relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[8px] p-8 text-paper md:p-10"
        >
          <ImagePlaceholder fill variant="bleed" label="Espaço para imagem" />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-midnight/45"
          />
          <div className="relative">
            <p className="label text-mist/70">Novos projetos</p>
            <h3 className="h mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)]">
              Fale com o estúdio
            </h3>
          </div>
          <TextArrow href="/contato" className="relative">
            Iniciar uma conversa
          </TextArrow>
        </div>
      </section>

      {/* Selected projects */}
      <section className="container py-[clamp(3rem,7vw,5rem)]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p data-reveal="fade" className="label">
              Selecionados
            </p>
            <h2 data-reveal className="h mt-4 text-[clamp(1.75rem,4vw,2.25rem)]">
              Trabalhos recentes
            </h2>
          </div>
          <Link
            href="/projetos"
            data-reveal
            className="text-arrow hidden shrink-0 sm:inline-flex"
          >
            Todos os projetos <Arrow />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link key={p.slug} href={`/projetos/${p.slug}`} data-reveal className="group">
              <ImagePlaceholder ratio="4 / 3" />
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="text-[16px] transition-colors group-hover:text-ember">
                  {p.title}
                </h3>
                <span className="shrink-0 text-[13px] text-smoke">{p.year}</span>
              </div>
              <p className="mt-1 text-[13px] text-pewter">
                {p.category} · {p.location}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
