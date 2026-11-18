/**
 * Posts exibidos no slide do Instagram (home).
 *
 * Duas fontes, nesta ordem:
 *  1. Feed JSON do Behold (serviço oficial/autorizado pelo Instagram) — se a variável de ambiente
 *     INSTAGRAM_FEED_URL estiver definida (ex.: https://feeds.behold.so/XXXX). Atualiza sozinho,
 *     sem cron: o Next só relê o feed a cada hora. Dá imagens nítidas em formato story.
 *  2. Lista fixa de códigos de posts, exibidos pelo embed oficial de cada post (instagram.com/p/<código>/embed).
 *     Funciona sem conta nenhuma, mas é estática: posts novos só entram quando o código for acrescentado aqui.
 */

export type IgPost = {
  id: string;
  href: string;
  /** Imagem nítida (fonte Behold). Sem ela, o slide usa o embed oficial do post. */
  image?: string;
  /** Código do post (fonte fixa) — usado no embed oficial. */
  code?: string;
  caption?: string;
  kind?: "image" | "video" | "carousel";
};

/** Posts recentes do @estudiorestaura (mais novo primeiro). Acrescente os novos no topo. */
export const IG_CODES = [
  "DfnCp-fBs-x",
  "DfawnTVFsza",
  "Dfawe0WBHU4",
  "Dfawe0phsUc",
  "Dfawe0zBWwC",
  "Dfawe0OBLkP",
  "Dfawe2NB_V6",
  "Dfawe3ZBHlU",
  "DfKrZpkB_7H",
  "DfDEUSKB_oY",
];

const fromCodes = (): IgPost[] =>
  IG_CODES.map((code) => ({ id: code, code, href: `https://www.instagram.com/p/${code}/` }));

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
          .map((p): IgPost | null => {
            const image = p.sizes?.large?.mediaUrl ?? p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? (p.mediaType === "IMAGE" ? p.mediaUrl : undefined);
            if (!image || !p.permalink) return null;
            return {
              id: p.id ?? p.permalink,
              href: p.permalink,
              image,
              caption: p.prunedCaption ?? p.caption,
              kind: p.mediaType === "VIDEO" ? "video" : p.mediaType === "CAROUSEL_ALBUM" ? "carousel" : "image",
            };
          })
          .filter((p): p is IgPost => !!p)
          .slice(0, 12);
        if (posts.length) return posts;
      }
    } catch {
      /* cai para a lista fixa */
    }
  }
  return fromCodes();
}
