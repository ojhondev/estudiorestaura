import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import * as seed from "@/lib/content";

const splitParas = (s: string) =>
  s
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

const splitLines = (s: string) =>
  s
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: string;
  area: string;
  summary: string;
  description: string[];
  coverUrl: string | null;
  galleryUrls: string[];
  gallery: number;
  featured: boolean;
  /** UF (SP, MG, GO…) — agrupa os projetos no mapa */
  state: string;
  city: string;
  beforeAfter: { before: string; after: string; caption: string }[];
  published: boolean;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  coverUrl: string | null;
  tag: string;
  publishedAt: string;
  published?: boolean;
};

export type Job = {
  slug: string;
  title: string;
  area: string;
  type: string;
  location: string;
  body: string[];
  requirements: string[];
};

// ---------- projects ----------

const seedProjects = (): Project[] =>
  seed.projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    location: p.location,
    year: p.year,
    area: p.area,
    summary: p.summary,
    description: [...p.description],
    coverUrl: null,
    galleryUrls: [],
    gallery: p.gallery,
    featured: seed.projects.indexOf(p) < 3,
    state: "",
    city: "",
    beforeAfter: [],
    published: true,
  }));

type ProjectRow = typeof schema.projects.$inferSelect;
const toProject = (r: ProjectRow): Project => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  location: r.location,
  year: r.year,
  area: r.area,
  summary: r.summary,
  description: splitParas(r.body),
  coverUrl: r.coverUrl,
  galleryUrls: r.gallery ?? [],
  gallery: (r.gallery ?? []).length || 4,
  featured: r.featured,
  state: r.state ?? "",
  city: r.city ?? "",
  beforeAfter: r.beforeAfter ?? [],
  published: r.published,
});

/** Projetos publicados. Os de exemplo só aparecem se o banco não estiver acessível. */
export async function getProjects(): Promise<Project[]> {
  if (!db) return seedProjects();
  try {
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.published, true))
      .orderBy(asc(schema.projects.sort), desc(schema.projects.createdAt));
    return rows.map(toProject);
  } catch {
    return seedProjects();
  }
}

/** Um projeto; com `drafts` (admin logado) também devolve rascunhos. */
export async function getProject(slug: string, opts: { drafts?: boolean } = {}) {
  if (opts.drafts && db) {
    try {
      const rows = await db
        .select()
        .from(schema.projects)
        .where(eq(schema.projects.slug, slug))
        .limit(1);
      if (rows.length) return toProject(rows[0]);
    } catch {
      /* cai no caminho normal */
    }
  }
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

// ---------- posts (blog) ----------

export const seedPosts: Post[] = [
  {
    slug: "restauro-alem-da-obra",
    title: "Restauro além da obra",
    excerpt:
      "Por que um bom projeto de restauro entrega também um plano de manutenção — e não só um canteiro que termina.",
    body: [
      "Uma obra de restauro que se encerra no dia da entrega já nasce incompleta. O tempo continua agindo sobre a alvenaria, a madeira, o douramento — e sem um plano que antecipe essa ação, o edifício volta a se degradar em poucos anos.",
      "No Estúdio Restaura, todo projeto entrega um arquivo de manutenção: ficha por elemento, calendário de inspeções e protocolos que a equipe local pode seguir. O restauro, assim, deixa de ser um evento e passa a ser um processo.",
    ],
    coverUrl: null,
    tag: "Método",
    publishedAt: "2026-08-20",
  },
  {
    slug: "as-camadas-do-tempo",
    title: "As camadas do tempo, legíveis",
    excerpt:
      "Distinguir o antigo do novo não é uma questão estética — é uma decisão ética sobre o que uma cidade lembra.",
    body: [
      "Quando uma intervenção imita perfeitamente o original, ela apaga a diferença entre o que foi feito quando e por quem. A carta de restauro chama isso de falso histórico.",
      "Preferimos a distinguibilidade: a adição contemporânea se declara, com materialidade e desenho próprios, e a leitura das épocas permanece clara para quem visita o edifício.",
    ],
    coverUrl: null,
    tag: "Editorial",
    publishedAt: "2026-07-05",
  },
];

export async function getPosts(): Promise<Post[]> {
  if (!db) return seedPosts;
  try {
    const rows = await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.published, true))
      .orderBy(desc(schema.posts.publishedAt));
    if (!rows.length) return seedPosts;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: splitParas(r.body),
      coverUrl: r.coverUrl,
      tag: r.tag,
      publishedAt: r.publishedAt.toISOString().slice(0, 10),
      published: true,
    }));
  } catch {
    return seedPosts;
  }
}

export async function getPost(slug: string, opts: { drafts?: boolean } = {}) {
  const live = (await getPosts()).find((p) => p.slug === slug);
  if (live || !opts.drafts || !db) return live ?? null;
  // rascunho: só quem está logado no admin enxerga
  try {
    const [r] = await db.select().from(schema.posts).where(eq(schema.posts.slug, slug)).limit(1);
    if (!r) return null;
    return {
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: splitParas(r.body),
      coverUrl: r.coverUrl,
      tag: r.tag,
      publishedAt: r.publishedAt.toISOString().slice(0, 10),
      published: r.published,
    } satisfies Post;
  } catch {
    return null;
  }
}

// ---------- jobs (vagas) ----------

// Sem vagas de exemplo: o site só mostra o que for publicado no CMS.
export const seedJobs: Job[] = [];

export async function getJobs(): Promise<Job[]> {
  if (!db) return seedJobs;
  try {
    const rows = await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.published, true))
      .orderBy(asc(schema.jobs.sort), desc(schema.jobs.createdAt));
    if (!rows.length) return seedJobs;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      area: r.area,
      type: r.type,
      location: r.location,
      body: splitParas(r.body),
      requirements: r.requirements ?? [],
    }));
  } catch {
    return seedJobs;
  }
}

export async function getJob(slug: string) {
  return (await getJobs()).find((j) => j.slug === slug) ?? null;
}

// ---------- settings (section content) ----------

export const settingDefaults: Record<string, Record<string, string>> = {
  "home.hero": {
    intro:
      "Cada patrimônio carrega histórias, técnicas e expressões artísticas que merecem ser compreendidas e preservadas. O Estúdio Restaura dedica-se à arquitetura, à conservação e ao restauro de bens históricos e culturais, unindo conhecimento técnico, pesquisa e sensibilidade no cuidado com a matéria e com a memória construída.",
    imageUrl: "",
  },
  "home.statement": {
    text: "Reunimos diferentes conhecimentos e experiências em torno de um propósito comum: compreender, preservar e valorizar o patrimônio histórico e artístico. Cada trabalho começa pelo olhar atento àquilo que já existe, reconhecendo nos materiais, nas técnicas e nas marcas do tempo os elementos que contam a história de cada bem.",
  },
  "home.mediaBand": {
    videoUrl: "/midia-720.mp4",
    posterUrl: "/midia-poster.jpg",
    title: "O Estúdio Restaura na mídia",
    caption:
      "Participação na RedeVida com o Padre Juarez para abordar o projeto de restauro do painel de Luiz Sacilotto.",
  },
  "careers.intro": {
    text: "O Estúdio Restaura cresce devagar e por afinidade. Se o patrimônio te move e você trabalha com rigor e cuidado, queremos te conhecer — mesmo que não haja uma vaga aberta agora.",
  },
  // Imagens por seção — chave do slot → URL (vazio = usa a foto padrão).
  sections: {},
};

/** Slots de imagem editáveis na página "Seções" do CMS. */
export const sectionSlots: { key: string; group: string; label: string }[] = [
  { key: "home.conhecaProjetos", group: "Início", label: "Card “Conheça os projetos”" },
  { key: "home.quemPorTras", group: "Início", label: "Card “Quem está por trás”" },
  { key: "whatwedo.01", group: "O que fazemos", label: "Investigar" },
  { key: "whatwedo.02", group: "O que fazemos", label: "Projetar" },
  { key: "whatwedo.03", group: "O que fazemos", label: "Compor" },
  { key: "whatwedo.04", group: "O que fazemos", label: "Intervir" },
  { key: "whatwedo.05", group: "O que fazemos", label: "Preservar" },
  { key: "criteria.0", group: "O que buscamos", label: "Valor histórico e artístico" },
  { key: "criteria.1", group: "O que buscamos", label: "Respeito à autenticidade" },
  { key: "criteria.2", group: "O que buscamos", label: "Equilíbrio entre passado e presente" },
  { key: "criteria.3", group: "O que buscamos", label: "Sensibilidade e rigor técnico" },
  { key: "criteria.4", group: "O que buscamos", label: "Continuidade e permanência" },
  { key: "brazil.SP.0", group: "Mapa do Brasil", label: "São Paulo · foto 1" },
  { key: "brazil.SP.1", group: "Mapa do Brasil", label: "São Paulo · foto 2" },
  { key: "brazil.SP.2", group: "Mapa do Brasil", label: "São Paulo · foto 3" },
  { key: "brazil.MG.0", group: "Mapa do Brasil", label: "Minas Gerais (Maria da Fé) · foto 1" },
  { key: "brazil.MG.1", group: "Mapa do Brasil", label: "Minas Gerais (Maria da Fé) · foto 2" },
  { key: "brazil.MG.2", group: "Mapa do Brasil", label: "Minas Gerais (Maria da Fé) · foto 3" },
  { key: "brazil.GO.0", group: "Mapa do Brasil", label: "Goiás (Jataí) · foto 1" },
  { key: "brazil.GO.1", group: "Mapa do Brasil", label: "Goiás (Jataí) · foto 2" },
  { key: "brazil.GO.2", group: "Mapa do Brasil", label: "Goiás (Jataí) · foto 3" },
  { key: "pagehero.projetos", group: "Topo das páginas", label: "Projetos" },
  { key: "pagehero.blog", group: "Topo das páginas", label: "Blog" },
  { key: "pagehero.sobre", group: "Topo das páginas", label: "Sobre o Estúdio" },
  { key: "pagehero.servicos", group: "Topo das páginas", label: "Serviços" },
  { key: "pagehero.contato", group: "Topo das páginas", label: "Contato" },
  { key: "pagehero.trabalhe", group: "Topo das páginas", label: "Trabalhe conosco" },
];

export async function getSectionImages(): Promise<Record<string, string>> {
  return getSetting("sections");
}

export async function getSetting(
  key: string,
): Promise<Record<string, string>> {
  const fallback = settingDefaults[key] ?? {};
  if (!db) return fallback;
  try {
    const row = await db
      .select()
      .from(schema.settings)
      .where(eq(schema.settings.key, key))
      .limit(1);
    if (!row.length) return fallback;
    return { ...fallback, ...(row[0].value as Record<string, string>) };
  } catch {
    return fallback;
  }
}
