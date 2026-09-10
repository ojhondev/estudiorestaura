import Image from "next/image";
import { Logo } from "@/components/Logo";
import heroImg from "../../../public/hero.jpg";

export function Hero() {
  return (
    <section className="bleed relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-midnight">
      <Image
        src={heroImg}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/25 to-midnight/60"
      />

      <div className="relative container pt-[clamp(6rem,16vh,9rem)]">
        <p
          data-reveal="fade"
          className="max-w-[27rem] text-[15px] leading-[1.55] text-paper/90"
        >
          Escritório especializado em arquitetura, conservação e restauro de
          patrimônio histórico e cultural. Intervenção mínima, reversibilidade e
          documentação rigorosa de cada etapa.
        </p>
      </div>

      <div className="relative container pb-[clamp(2.5rem,8vh,4.5rem)]">
        <Logo
          priority
          variant="light"
          className="h-auto w-[clamp(17rem,62vw,54rem)]"
        />
      </div>
    </section>
  );
}
