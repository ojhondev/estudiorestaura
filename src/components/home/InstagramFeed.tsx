import { Arrow } from "@/components/ui";
import { InstagramIcon } from "@/components/InstagramIcon";
import { TopoDraw } from "@/components/home/TopoDraw";
import { INSTAGRAM } from "@/lib/content";

const TEMAS = ["Bastidores de obra", "Descobertas sob a tinta", "Antes e depois"];

/**
 * Últimos posts do Instagram. Usa o embed oficial do perfil: a lista se atualiza
 * sozinha a cada novo post, sem token, cron ou rota no servidor — o navegador do
 * visitante carrega direto do Instagram (nenhum custo de CPU na Vercel).
 * Ao fundo, um mapa topográfico que se desenha sozinho (curvas de nível).
 */
export function InstagramFeed() {
  return (
    <section className="relative overflow-hidden" style={{ overflowX: "clip" }}>
      <TopoDraw className="pointer-events-none absolute inset-0 h-full w-full" seed={11} />

      <div className="shell relative grid items-center gap-14 py-[clamp(5rem,11vw,9rem)] lg:grid-cols-[1fr_auto] lg:gap-24">
        <div className="max-w-[40rem]">
          <p data-reveal="fade" className="label inline-flex items-center gap-2">
            <InstagramIcon className="h-4 w-4" /> Instagram · @{INSTAGRAM.handle}
          </p>
          <h2 data-reveal className="display mt-5 text-[clamp(2.2rem,5vw,3.9rem)]">
            Acompanhe o restauro de perto.
          </h2>
          <p data-reveal className="lora mt-7 text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.65] text-pewter">
            Cada camada de tinta removida conta uma história. No Instagram mostramos o que não cabe no portfólio: o andaime, a descoberta, o antes e o depois.
          </p>

          <ul data-reveal className="mt-7 flex flex-wrap gap-2.5">
            {TEMAS.map((t) => (
              <li key={t} className="rounded-[80px] border border-ember/30 bg-paper/80 px-4 py-1.5 text-[12.5px] text-ink backdrop-blur-sm">
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

        {/* Celular com o feed ao vivo */}
        <div data-reveal className="relative mx-auto w-[min(21rem,100%)] lg:mx-0">
          <span aria-hidden className="absolute -inset-x-5 inset-y-10 -z-0 rounded-[2.6rem] bg-ember/[0.09]" />
          <span
            aria-hidden
            className="absolute -left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-medium uppercase tracking-[0.34em] text-ember/70 lg:block"
          >
            Ao vivo do Instagram
          </span>

          <div className="relative rounded-[2.5rem] bg-char p-[9px] shadow-[0_50px_90px_-35px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)_inset]">
            <div className="relative overflow-hidden rounded-[2.05rem] bg-paper">
              <span aria-hidden className="absolute left-1/2 top-2.5 z-10 h-[1.15rem] w-20 -translate-x-1/2 rounded-full bg-char" />
              <div className="flex items-center justify-between px-6 pb-1 pt-[0.7rem] text-[11px] font-medium text-ink/80" aria-hidden>
                <span>9:41</span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-ink/70" />
                  <span className="size-1.5 rounded-full bg-ink/70" />
                  <span className="size-1.5 rounded-full bg-ink/30" />
                </span>
              </div>
              {/* O embed mostra o cabeçalho do perfil + 6 posts (3×2): a altura acompanha a largura */}
              <div style={{ containerType: "inline-size" }}>
                <iframe
                  src={INSTAGRAM.embed}
                  title={`Últimos posts de @${INSTAGRAM.handle} no Instagram`}
                  loading="lazy"
                  scrolling="no"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  className="block w-full border-0 bg-paper"
                  style={{ height: "calc(128px + 66.7cqw)" }}
                />
              </div>
              <a
                href={INSTAGRAM.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 border-t border-mist px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:text-ember"
              >
                <span className="inline-flex items-center gap-2">
                  <InstagramIcon className="h-4 w-4" /> Ver perfil completo
                </span>
                <Arrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
