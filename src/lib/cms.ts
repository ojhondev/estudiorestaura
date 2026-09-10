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
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  coverUrl: string | null;
  tag: string;
  publishedAt: string;
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
  }));

export async function getProjects(): Promise<Project[]> {
  if (!db) return seedProjects();
  try {
    const rows = await db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.published, true))
      .orderBy(asc(schema.projects.sort), desc(schema.projects.createdAt));
    if (!rows.length) return seedProjects();
    return rows.map((r) => ({
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
    }));
  } catch {
    return seedProjects();
  }
}

export async function getProject(slug: string) {
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
    }));
  } catch {
    return seedPosts;
  }
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

// ---------- jobs (vagas) ----------

export const seedJobs: Job[] = [
  {
    slug: "arquiteto-de-patrimonio",
    title: "Arquiteto(a) de patrimônio",
    area: "Projetos",
    type: "Efetivo",
    location: "São Paulo · SP",
    body: [
      "Você vai conduzir projetos de restauro do estudo preliminar ao executivo, em diálogo com órgãos de preservação e equipes de obra.",
      "Buscamos alguém com repertório em cartas patrimoniais, desenho técnico rigoroso e sensibilidade para a preexistência.",
    ],
    requirements: [
      "Graduação em Arquitetura e Urbanismo",
      "3+ anos com patrimônio edificado",
      "Domínio de AutoCAD/Revit e ferramentas de levantamento",
      "Experiência com aprovação em órgãos de preservação (desejável)",
    ],
  },
  {
    slug: "conservador-restaurador",
    title: "Conservador(a)-restaurador(a)",
    area: "Conservação",
    type: "Efetivo",
    location: "São Paulo · SP · campo",
    body: [
      "Atuação em bens integrados — forros pintados, cantaria, retábulos — com diagnóstico, consolidação e reintegração cromática.",
    ],
    requirements: [
      "Formação em Conservação e Restauro",
      "Experiência de campo com bens integrados",
      "Disponibilidade para viagens a obras",
    ],
  },
];

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
      "Escritório especializado em arquitetura, conservação e restauro de patrimônio histórico e cultural. Intervenção mínima, reversibilidade e documentação rigorosa de cada etapa.",
    imageUrl: "",
  },
  "home.statement": {
    text: "Somos um time de arquitetos, conservadores e restauradores com um interesse em comum: devolver vida a edifícios e acervos sem apagar as camadas do tempo. Cada projeto começa por uma leitura atenta do que já existe.",
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
};

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
