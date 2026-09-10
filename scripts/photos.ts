/**
 * Distribui as fotos do estúdio (src/lib/photos.ts) nos registros do banco:
 * capa + galeria dos projetos e capa dos artigos que ainda não têm imagem.
 * Uso: npm run db:photos
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";
import { photo, photos } from "../src/lib/photos";

const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) {
  console.error("DATABASE_URL ausente.");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });

async function main() {
  // Sobrescreve as imagens que apontam para /fotos ou estão vazias
  // (não mexe em imagens enviadas manualmente pelo CMS via /api/upload).
  const keep = (url: string | null) =>
    Boolean(url && !url.startsWith("/fotos/") && !url.includes("i.ibb.co"));

  const projects = await db.select().from(schema.projects);
  for (const p of projects) {
    const gallery = (p.gallery ?? []).some(keep)
      ? p.gallery
      : photos(`project:${p.slug}`, 5);
    await db
      .update(schema.projects)
      .set({
        coverUrl: keep(p.coverUrl) ? p.coverUrl : photo(`cover:${p.slug}`),
        gallery,
        updatedAt: new Date(),
      })
      .where(eq(schema.projects.id, p.id));
    console.log(`✓ projeto ${p.slug}`);
  }

  const posts = await db.select().from(schema.posts);
  for (const post of posts) {
    if (keep(post.coverUrl)) continue;
    await db
      .update(schema.posts)
      .set({ coverUrl: photo(`post:${post.slug}`), updatedAt: new Date() })
      .where(eq(schema.posts.id, post.id));
    console.log(`✓ artigo ${post.slug}`);
  }

  console.log("Fotos distribuídas.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
