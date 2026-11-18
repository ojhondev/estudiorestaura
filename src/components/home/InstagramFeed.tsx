import { Arrow } from "@/components/ui";
import { InstagramIcon } from "@/components/InstagramIcon";
import { INSTAGRAM } from "@/lib/content";

/**
 * Últimos posts do Instagram. Usa o embed oficial do perfil: a lista se atualiza
 * sozinha a cada novo post, sem token, cron ou rota no servidor — o navegador do
 * visitante carrega direto do Instagram (nenhum custo de CPU na Vercel).
 */
export function InstagramFeed() {
  return (
    <section className="shell grid items-center gap-10 py-[clamp(4.5rem,10vw,8rem)] lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div>
        <p data-reveal="fade" className="label inline-flex items-center gap-2">
          <InstagramIcon className="h-4 w-4" /> Instagram
        </p>
        <h2 data-reveal className="display mt-5 text-[clamp(2rem,4.4vw,3.4rem)]">
          Acompanhe o restauro de perto.
        </h2>
        <p data-reveal className="lora mt-6 max-w-[34rem] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.6] text-pewter">
          Bastidores de obra, descobertas sob camadas de tinta e o antes e depois dos nossos projetos. Os posts mais recentes aparecem aqui, sempre atualizados.
        </p>
        <div data-reveal className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer" className="btn-fill">
            <InstagramIcon className="h-4 w-4" /> Seguir @{INSTAGRAM.handle}
          </a>
          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer" className="text-arrow text-[14px]">
            Ver tudo no Instagram <Arrow />
          </a>
        </div>
      </div>

      <div data-reveal className="overflow-hidden rounded-[10px] border border-mist bg-paper shadow-[0_30px_70px_-40px_rgba(0,0,0,0.45)]">
        <iframe
          src={INSTAGRAM.embed}
          title={`Últimos posts de @${INSTAGRAM.handle} no Instagram`}
          loading="lazy"
          scrolling="yes"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          className="block h-[clamp(30rem,62vw,40rem)] w-full border-0"
        />
      </div>
    </section>
  );
}
