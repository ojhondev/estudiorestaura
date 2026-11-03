/**
 * Aplica as fotos profissionais (src/lib/photos.ts) nos registros do banco:
 * capa + galeria dos projetos e capa dos artigos do blog.
 * Só mexe em registros cuja imagem ainda é uma das fotos padrão do site
 * (/fotos/...) ou está vazia — imagens enviadas pelo CMS (Blob) são preservadas.
 * Também remove as vagas de exemplo do seed original.
 * Uso: npm run db:photos
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { POSTS_FOTOS, PROJETOS_FOTOS } from "../src/lib/photos";

const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) {
  console.error("DATABASE_URL ausente.");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

// true = imagem própria do cliente (não é foto padrão do site)
const custom = (u: string | null | undefined) =>
  Boolean(u && !u.startsWith("/fotos/") && !u.includes("i.ibb.co"));

async function main() {
  for (const p of await db.select().from(schema.projects)) {
    const set = PROJETOS_FOTOS[p.slug];
    if (!set) continue;
    await db
      .update(schema.projects)
      .set({
        coverUrl: custom(p.coverUrl) ? p.coverUrl : set.cover,
        gallery: (p.gallery ?? []).some(custom) ? p.gallery : set.gallery,
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, p.id));
    console.log(`✓ projeto ${p.slug}`);
  }

  for (const post of await db.select().from(schema.posts)) {
    const cover = POSTS_FOTOS[post.slug];
    if (!cover || custom(post.coverUrl)) continue;
    await db
      .update(schema.posts)
      .set({ coverUrl: cover, updatedAt: new Date() })
      .where(eq(schema.posts.id, post.id));
    console.log(`✓ artigo ${post.slug}`);
  }

  let removidas = 0;
  for (const slug of ["arquiteto-de-patrimonio", "conservador-restaurador"]) {
    const r = await db
      .delete(schema.jobs)
      .where(eq(schema.jobs.slug, slug))
      .returning({ slug: schema.jobs.slug });
    removidas += r.length;
  }
  console.log(`✓ vagas de exemplo removidas: ${removidas}`);
  console.log("Concluído.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
