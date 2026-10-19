import type { MetadataRoute } from "next";
import { getJobs, getPosts, getProjects } from "@/lib/cms";

export const dynamic = "force-dynamic";

const BASE = "https://estudiorestaura.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, jobs] = await Promise.all([getProjects(), getPosts(), getJobs()]);
  const fixed = ["", "/projetos", "/servicos", "/sobre", "/contato", "/blog", "/trabalhe-conosco", "/privacidade"];
  return [
    ...fixed.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const })),
    ...projects.map((p) => ({ url: `${BASE}/projetos/${p.slug}`, changeFrequency: "yearly" as const })),
    ...posts.map((p) => ({ url: `${BASE}/blog/${p.slug}`, changeFrequency: "yearly" as const })),
    ...jobs.map((j) => ({ url: `${BASE}/vagas/${j.slug}`, changeFrequency: "monthly" as const })),
  ];
}
