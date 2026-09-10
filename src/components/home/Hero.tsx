import Image from "next/image";
import { Logo } from "@/components/Logo";
import { HeroFeed, type FeedItem } from "@/components/home/HeroFeed";
import heroImg from "../../../public/hero.jpg";

export function Hero({
  intro,
  imageUrl,
  feed,
}: {
  intro: string;
  imageUrl?: string;
  feed: FeedItem[];
}) {
  return (
    <section className="hero-sticky bleed relative flex h-[100svh] flex-col overflow-hidden bg-midnight">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          data-parallax="0.1"
          className="scale-[1.12] object-cover"
        />
      ) : (
        <Image
          src={heroImg}
          alt=""
          fill
          priority
          sizes="100vw"
          data-parallax="0.1"
          className="scale-[1.12] object-cover"
        />
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-midnight/92 via-midnight/35 to-midnight/60"
      />

      <div className="relative shell grid flex-1 grid-rows-[auto_1fr_auto] pt-[clamp(6rem,15vh,8.5rem)] pb-[clamp(2.5rem,7vh,4rem)]">
        <p
          data-reveal
          data-reveal-delay="0.15"
          className="measure-sm text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-paper"
        >
          {intro}
        </p>

        <div className="row-start-3 flex flex-col items-end gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Logo
            priority
            variant="light"
            data-reveal="clip"
            className="h-auto w-[clamp(17rem,64vw,58rem)] self-start lg:self-end"
          />
          <div data-reveal data-reveal-delay="0.3" className="w-full lg:w-auto">
            <HeroFeed items={feed} />
          </div>
        </div>
      </div>
    </section>
  );
}
