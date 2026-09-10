import { Logo } from "@/components/Logo";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

export function Hero() {
  return (
    <section className="bleed relative flex min-h-[100svh] flex-col justify-between overflow-hidden">
      <ImagePlaceholder
        fill
        variant="bleed"
        label="Espaço para imagem — fachada / edifício histórico"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-midnight/30"
      />

      <div className="relative container pt-[clamp(6rem,16vh,9rem)]">
        <p
          data-reveal="fade"
          className="max-w-[26rem] text-[15px] leading-[1.55] text-paper/90"
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
