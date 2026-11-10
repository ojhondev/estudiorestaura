/**
 * Cadastra/atualiza os 30 artigos de SEO do blog (foco: igrejas, paróquias, empresas e
 * instituições que buscam restauro em São Paulo e Minas Gerais). Entram como RASCUNHO
 * (published=false): revise em /admin/blog e publique. Reexecutável (upsert por slug).
 * Uso: npm run db:artigos [-- --publish]   (--publish publica todos de uma vez)
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import type { Artigo } from "./artigos/tipos";
import { LOTE1 } from "./artigos/lote1";
import { LOTE2 } from "./artigos/lote2";
import { LOTE3 } from "./artigos/lote3";
import { LOTE4 } from "./artigos/lote4";
import { LOTE5 } from "./artigos/lote5";
import { LOTE6 } from "./artigos/lote6";

const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) {
  console.error("DATABASE_URL ausente.");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });
const publish = process.argv.includes("--publish");

const ARTIGOS: Artigo[] = [...LOTE1, ...LOTE2, ...LOTE3, ...LOTE4, ...LOTE5, ...LOTE6];

// ---- conferência antes de gravar ----
const slugs = new Set(ARTIGOS.map((a) => a.slug));
const antigos = new Set(["restauro-alem-da-obra", "as-camadas-do-tempo"]);
let problemas = 0;
const falha = (m: string) => {
  problemas++;
  console.error("✗ " + m);
};
if (slugs.size !== ARTIGOS.length) falha("slugs repetidos");
for (const a of ARTIGOS) {
  const palavras = a.body.split(/\s+/).filter(Boolean).length;
  if (a.title.length > 72) falha(`${a.slug}: título com ${a.title.length} caracteres`);
  if (a.excerpt.length > 175) falha(`${a.slug}: resumo com ${a.excerpt.length} caracteres`);
  if (!/## Perguntas frequentes/.test(a.body)) falha(`${a.slug}: sem seção de perguntas frequentes`);
  if (palavras < 450) falha(`${a.slug}: só ${palavras} palavras`);
  for (const m of a.body.matchAll(/\]\(\/blog\/([a-z0-9-]+)\)/g)) {
    if (!slugs.has(m[1]) && !antigos.has(m[1])) falha(`${a.slug}: link para artigo inexistente /blog/${m[1]}`);
  }
}
if (ARTIGOS.length !== 30) falha(`esperado 30 artigos, há ${ARTIGOS.length}`);
if (problemas) process.exit(1);

async function main() {
  const base = new Date("2026-11-10T15:00:00-03:00").getTime();
  let novos = 0;
  let atualizados = 0;
  for (let i = 0; i < ARTIGOS.length; i++) {
    const a = ARTIGOS[i];
    // o primeiro da lista fica como o mais recente; 1 min de diferença só para a ordem ficar estável
    const publishedAt = new Date(base - i * 60_000);
    const values = {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      coverUrl: a.cover,
      tag: a.tag,
      published: publish,
      publishedAt,
      updatedAt: new Date(),
    };
    const [found] = await db.select({ id: schema.posts.id, published: schema.posts.published }).from(schema.posts).where(eq(schema.posts.slug, a.slug));
    if (found) {
      // não "despublica" nem republica sem --publish o que você já mexeu no admin
      await db.update(schema.posts).set({ ...values, published: publish || found.published }).where(eq(schema.posts.id, found.id));
      atualizados++;
    } else {
      await db.insert(schema.posts).values(values);
      novos++;
    }
  }
  const total = ARTIGOS.reduce((n, a) => n + a.body.split(/\s+/).filter(Boolean).length, 0);
  console.log(`${novos} artigos novos, ${atualizados} atualizados · ${total} palavras · ${publish ? "PUBLICADOS" : "como rascunho"}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
