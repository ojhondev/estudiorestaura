/**
 * Posts exibidos no slide do Instagram (home).
 *
 * Duas fontes, nesta ordem:
 *  1. Feed JSON do Behold (serviço autorizado pelo Instagram) — se INSTAGRAM_FEED_URL estiver definida
 *     (ex.: https://feeds.behold.so/XXXX). Atualiza sozinho: o Next só relê o feed a cada hora.
 *  2. Lista local abaixo (só reels): capas já salvas em /public/instagram (WebP leve, ~25–75 KB cada).
 *     Carrega na hora, sem iframes nem scripts do Instagram. É estática: posts novos entram quando forem
 *     acrescentados aqui (capa 540 px de largura em /public/instagram/<código>.webp + miniatura
 *     <código>-bg.webp de 14 px usada como fundo desfocado).
 */

export type IgPost = {
  id: string;
  href: string;
  image: string;
  /** Miniatura minúscula (fundo desfocado do card). Sem ela, usa fundo escuro. */
  bg?: string;
  caption?: string;
  kind?: "image" | "video" | "carousel";
};

const local = (code: string): IgPost => ({
  id: code,
  href: `https://www.instagram.com/reel/${code}/`,
  image: `/instagram/${code}.webp`,
  bg: `/instagram/${code}-bg.webp`,
  kind: "video",
});

/** Só reels, na ordem da aba Reels do perfil (mais novo primeiro). */
export const IG_LOCAL: IgPost[] = [
  "DfnCp-fBs-x",
  "DfSEKl1BvdN",
  "DfKrZpkB_7H",
  "DfDEUSKB_oY",
  "De-s73gBkLO",
  "De4yiQwBWG2",
  "De4S59IBqEs",
  "DezGso7heIV",
  "DekeFqdBC9n",
  "DefPPRXBTa9",
  "DeckHfDB1vz",
  "DeSscijB0aL",
].map(local);

type BeholdPost = {
  id?: string;
  permalink?: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: { large?: { mediaUrl?: string }; medium?: { mediaUrl?: string } };
  prunedCaption?: string;
  caption?: string;
};

export async function getInstagramPosts(): Promise<IgPost[]> {
  const url = process.env.INSTAGRAM_FEED_URL;
  if (url) {
    try {
      const res = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const json = (await res.json()) as { posts?: BeholdPost[] };
        const posts = (json.posts ?? [])
          .filter((p) => p.mediaType === "VIDEO") // só reels
          .map((p): IgPost | null => {
            const image = p.sizes?.medium?.mediaUrl ?? p.sizes?.large?.mediaUrl ?? p.thumbnailUrl ?? (p.mediaType === "IMAGE" ? p.mediaUrl : undefined);
            if (!image || !p.permalink) return null;
            return {
              id: p.id ?? p.permalink,
              href: p.permalink,
              image,
              caption: p.prunedCaption ?? p.caption,
              kind: "video",
            };
          })
          .filter((p): p is IgPost => !!p)
          .slice(0, 12);
        if (posts.length) return posts;
      }
    } catch {
      /* cai para a lista local */
    }
  }
  return IG_LOCAL;
}
