import Image from "next/image";
import { Logo } from "@/components/Logo";
import { HeroFeed } from "@/components/home/HeroFeed";
import heroImg from "../../../public/hero.jpg";

export function Hero() {
  return (
    <section className="bleed relative flex min-h-[100svh] flex-col overflow-hidden bg-midnight">
      <Image
        src={heroImg}
        alt=""
        fill
        priority
        sizes="100vw"
        data-parallax="0.12"
        className="scale-110 object-cover"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/30 to-midnight/65"
      />

      <div className="relative container grid flex-1 grid-rows-[auto_1fr_auto] pt-[clamp(6rem,15vh,8.5rem)] pb-[clamp(2.5rem,7vh,4rem)]">
        <p
          data-reveal
          data-reveal-delay="0.15"
          className="max-w-[27rem] text-[15px] leading-[1.55] text-paper/90"
        >
          Escritório especializado em arquitetura, conservação e restauro de
          patrimônio histórico e cultural. Intervenção mínima, reversibilidade e
          documentação rigorosa de cada etapa.
        </p>

        <div className="row-start-3 flex flex-col items-end gap-10 sm:flex-row sm:items-end sm:justify-between">
          <Logo
            priority
            variant="light"
            data-reveal="clip"
            className="h-auto w-[clamp(16rem,58vw,50rem)] self-start sm:self-end"
          />
          <div data-reveal data-reveal-delay="0.3" className="w-full sm:w-auto">
            <HeroFeed />
          </div>
        </div>
      </div>

      <span
        aria-hidden
        data-reveal="fade"
        className="absolute bottom-[clamp(2.5rem,7vh,4rem)] left-1/2 h-px w-[min(92%,1120px)] -translate-x-1/2 bg-paper/15"
      />
    </section>
  );
}
