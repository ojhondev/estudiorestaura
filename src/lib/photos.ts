/**
 * Fotos profissionais do estúdio (public/fotos/drive/<código>.jpg, até 2400px).
 * Cada ponto do site tem a sua própria foto — nada se repete entre seções.
 * Os códigos vêm da curadoria das pastas do Drive (ex.: "a051", "d058").
 */
const f = (k: string) => `/fotos/drive/${k.toLowerCase()}.jpg`;

/** "O que buscamos" — uma foto por critério (mesma ordem de `criteria`). */
export const CRITERIA_FOTOS = ["A051", "A081", "A113", "A116", "D058"].map(f);

/** Cartões grandes no fim da home. */
export const FEATURE_FOTOS = {
  conheca: f("B003"),
  quem: f("D017"),
};

/** Imagens que acompanham o mouse em "Em números" (3 por indicador). */
export const NUMBERS_FOTOS: Record<string, string[]> = {
  "anos de atuação": ["A064", "B011", "A084"].map(f),
  projetos: ["C037", "C041", "C038"].map(f),
  "estados de atuação": ["A022", "A130", "A132"].map(f),
};

/** Topo de cada página. */
export const PAGEHERO_FOTOS: Record<string, string> = {
  projetos: f("B009"),
  blog: f("A059"),
  sobre: f("D001"),
  servicos: f("A069"),
  contato: f("D059"),
  trabalhe: f("B013"),
  privacidade: f("A041"),
};

/** Miniaturas do menu. */
export const NAV_FOTOS: Record<string, string> = {
  "/projetos": f("C030"),
  "/servicos": f("A121"),
  "/sobre": f("D006"),
  "/blog": f("A042"),
  "/trabalhe-conosco": f("A123"),
  "/contato": f("A001"),
};

/** Página Serviços: uma foto por serviço (mesma ordem de `services`) + faixa final. */
export const SERVICOS_FOTOS = ["B015", "A110", "D035", "A075", "C002", "D088"].map(f);
export const SERVICOS_CTA_FOTO = f("D060");

/** Foto da equipe (página Sobre). */
export const EQUIPE_FOTO = f("D064");

/** Capa e galeria dos projetos já cadastrados (script `npm run db:photos`). */
export const PROJETOS_FOTOS: Record<string, { cover: string; gallery: string[] }> = {
  "resident-project-oma": { cover: f("C005"), gallery: ["C001", "C003", "C025", "C036", "C026"].map(f) },
  "conjunto-vale-verde": { cover: f("B002"), gallery: ["B001", "B004", "B007", "B008", "B012"].map(f) },
  "pavilhao-das-aguas": { cover: f("A055"), gallery: ["A057", "A037", "A039", "A095", "A096"].map(f) },
  "casa-lamego": { cover: f("A115"), gallery: ["A004", "A026", "A094", "A114", "A143"].map(f) },
  "galpao-luz": { cover: f("A104"), gallery: ["A105", "A106", "A107", "C010", "C011"].map(f) },
  "capela-do-morro": { cover: f("C015"), gallery: ["C016", "C019", "C021", "C023", "C022"].map(f) },
};

/** Capa dos artigos do blog. */
export const POSTS_FOTOS: Record<string, string> = {
  "restauro-alem-da-obra": f("D062"),
  "as-camadas-do-tempo": f("A080"),
};
