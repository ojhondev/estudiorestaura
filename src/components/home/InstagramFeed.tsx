import { Arrow } from "@/components/ui";
import { InstagramIcon } from "@/components/InstagramIcon";
import { StoryCarousel } from "@/components/home/StoryCarousel";
import { INSTAGRAM } from "@/lib/content";
import { getInstagramPosts } from "@/lib/instagram";

const TEMAS = ["Bastidores de obra", "Descobertas sob a tinta", "Antes e depois"];

/** Últimos posts do Instagram em slide, na proporção de story (9:16). Fontes: ver `lib/instagram.ts`. */
export async function InstagramFeed() {
  const posts = await getInstagramPosts();

  return (
    <section className="shell grid items-center gap-12 py-[clamp(4.5rem,10vw,8rem)] lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <div className="max-w-[38rem]">
        <p data-reveal="fade" className="label inline-flex items-center gap-2">
          <InstagramIcon className="h-4 w-4" /> Instagram · @{INSTAGRAM.handle}
        </p>
        <h2 data-reveal className="display mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)]">
          Acompanhe o restauro de perto.
        </h2>
        <p data-reveal className="lora mt-7 text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.65] text-pewter">
          Cada camada de tinta removida conta uma história. No Instagram mostramos o que não cabe no portfólio: o andaime, a descoberta, o antes e o depois.
        </p>

        <ul data-reveal className="mt-7 flex flex-wrap gap-2.5">
          {TEMAS.map((t) => (
            <li key={t} className="rounded-[80px] border border-mist px-4 py-1.5 text-[12.5px] text-ink">
              {t}
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer" className="btn-fill">
            <InstagramIcon className="h-4 w-4" /> Seguir @{INSTAGRAM.handle}
          </a>
          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer" className="text-arrow text-[14px]">
            Ver tudo no Instagram <Arrow />
          </a>
        </div>
      </div>

      <div data-reveal className="min-w-0">
        <StoryCarousel posts={posts} />
      </div>
    </section>
  );
}
