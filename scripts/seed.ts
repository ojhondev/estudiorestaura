/**
 * Popula o banco com o conteúdo inicial (uma vez).
 * Uso: npm run db:seed
 * Só insere quando a tabela correspondente está vazia.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { projects as seedProjects } from "../src/lib/content";

const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) {
  console.error("DATABASE_URL ausente.");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

const posts = [
  {
    slug: "restauro-alem-da-obra",
    title: "Restauro além da obra",
    excerpt:
      "Por que um bom projeto de restauro entrega também um plano de manutenção — e não só um canteiro que termina.",
    body: "Uma obra de restauro que se encerra no dia da entrega já nasce incompleta. O tempo continua agindo sobre a alvenaria, a madeira, o douramento — e sem um plano que antecipe essa ação, o edifício volta a se degradar em poucos anos.\n\nNo Estúdio Restaura, todo projeto entrega um arquivo de manutenção: ficha por elemento, calendário de inspeções e protocolos que a equipe local pode seguir. O restauro, assim, deixa de ser um evento e passa a ser um processo.",
    tag: "Método",
    published: true,
    publishedAt: new Date("2026-08-20"),
  },
  {
    slug: "as-camadas-do-tempo",
    title: "As camadas do tempo, legíveis",
    excerpt:
      "Distinguir o antigo do novo não é uma questão estética — é uma decisão ética sobre o que uma cidade lembra.",
    body: "Quando uma intervenção imita perfeitamente o original, ela apaga a diferença entre o que foi feito quando e por quem. A carta de restauro chama isso de falso histórico.\n\nPreferimos a distinguibilidade: a adição contemporânea se declara, com materialidade e desenho próprios, e a leitura das épocas permanece clara para quem visita o edifício.",
    tag: "Editorial",
    published: true,
    publishedAt: new Date("2026-07-05"),
  },
];

const jobs = [
  {
    slug: "arquiteto-de-patrimonio",
    title: "Arquiteto(a) de patrimônio",
    area: "Projetos",
    type: "Efetivo",
    location: "São Paulo · SP",
    body: "Você vai conduzir projetos de restauro do estudo preliminar ao executivo, em diálogo com órgãos de preservação e equipes de obra.\n\nBuscamos alguém com repertório em cartas patrimoniais, desenho técnico rigoroso e sensibilidade para a preexistência.",
    requirements: [
      "Graduação em Arquitetura e Urbanismo",
      "3+ anos com patrimônio edificado",
      "Domínio de AutoCAD/Revit e ferramentas de levantamento",
      "Experiência com aprovação em órgãos de preservação (desejável)",
    ],
    published: true,
    sort: 0,
  },
  {
    slug: "conservador-restaurador",
    title: "Conservador(a)-restaurador(a)",
    area: "Conservação",
    type: "Efetivo",
    location: "São Paulo · SP · campo",
    body: "Atuação em bens integrados — forros pintados, cantaria, retábulos — com diagnóstico, consolidação e reintegração cromática.",
    requirements: [
      "Formação em Conservação e Restauro",
      "Experiência de campo com bens integrados",
      "Disponibilidade para viagens a obras",
    ],
    published: true,
    sort: 1,
  },
];

async function count(table: string) {
  const r = await db.execute(sql.raw(`select count(*)::int as n from ${table}`));
  // neon-http returns { rows: [...] }
  const rows = (r as unknown as { rows?: { n: number }[] }).rows ?? (r as unknown as { n: number }[]);
  return rows[0]?.n ?? 0;
}

async function main() {
  if ((await count("projects")) === 0) {
    await db.insert(schema.projects).values(
      seedProjects.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        year: p.year,
        area: p.area,
        summary: p.summary,
        body: p.description.join("\n\n"),
        gallery: [] as string[],
        published: true,
        featured: i < 3,
        sort: i,
      })),
    );
    console.log(`✓ ${seedProjects.length} projetos inseridos`);
  } else {
    console.log("· projetos já existem, pulando");
  }

  if ((await count("posts")) === 0) {
    await db.insert(schema.posts).values(posts);
    console.log(`✓ ${posts.length} artigos inseridos`);
  } else {
    console.log("· artigos já existem, pulando");
  }

  if ((await count("jobs")) === 0) {
    await db.insert(schema.jobs).values(jobs);
    console.log(`✓ ${jobs.length} vagas inseridas`);
  } else {
    console.log("· vagas já existem, pulando");
  }

  console.log("Seed concluído.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
