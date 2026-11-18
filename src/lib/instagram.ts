/**
 * Posts exibidos no slide do Instagram (home).
 *
 * Duas fontes, nesta ordem:
 *  1. Feed JSON do Behold (serviço autorizado pelo Instagram) — se INSTAGRAM_FEED_URL estiver definida
 *     (ex.: https://feeds.behold.so/XXXX). Atualiza sozinho: o Next só relê o feed a cada hora.
 *  2. Lista local abaixo: imagens dos posts já salvas em /public/instagram (WebP leve, ~25–75 KB cada).
 *     Carrega na hora, sem iframes nem scripts do Instagram. É estática: posts novos entram quando forem
 *     acrescentados aqui (imagem 540 px de largura em /public/instagram/<código>.webp + miniatura
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

const P = "https://www.instagram.com/p/";
const local = (code: string, kind: IgPost["kind"], parent?: string): IgPost => ({
  id: code,
  href: `${P}${parent ?? code}/`,
  image: `/instagram/${code}.webp`,
  bg: `/instagram/${code}-bg.webp`,
  kind,
});

/** Mais novo primeiro. Os "Dfawe…" são slides do mesmo carrossel (DfawnTVFsza). */
export const IG_LOCAL: IgPost[] = [
  local("DfnCp-fBs-x", "video"),
  local("DfawnTVFsza", "carousel"),
  local("Dfawe0phsUc", "carousel", "DfawnTVFsza"),
  local("Dfawe0zBWwC", "carousel", "DfawnTVFsza"),
  local("Dfawe0OBLkP", "carousel", "DfawnTVFsza"),
  local("Dfawe2NB_V6", "carousel", "DfawnTVFsza"),
  local("DfKrZpkB_7H", "video"),
  local("DfDEUSKB_oY", "video"),
  local("De-s73gBkLO", "video"),
  local("De4yiQwBWG2", "video"),
];

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
            const image = p.sizes?.medium?.mediaUrl ?? p.sizes?.large?.mediaUrl ?? p.thumbnailUrl ?? (p.mediaType === "IMAGE" ? p.mediaUrl : undefined);
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
      /* cai para a lista local */
    }
  }
  return IG_LOCAL;
}
