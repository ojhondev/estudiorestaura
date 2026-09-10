"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import {
  checkCredentials,
  createSession,
  destroySession,
  isAuthed,
} from "@/lib/auth";

async function guard() {
  if (!(await isAuthed())) redirect("/admin/login");
  if (!db) throw new Error("Banco de dados não configurado.");
  return db;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

// ---------- auth ----------

export async function login(_prev: unknown, form: FormData) {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  if (!checkCredentials(email, password))
    return { error: "E-mail ou senha incorretos." };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- projects ----------

export async function saveProject(form: FormData) {
  const database = await guard();
  const id = Number(form.get("id")) || 0;
  const title = String(form.get("title") ?? "").trim();
  const data = {
    title,
    slug: String(form.get("slug") ?? "").trim() || slugify(title),
    category: String(form.get("category") ?? "Restauro"),
    location: String(form.get("location") ?? ""),
    year: String(form.get("year") ?? ""),
    area: String(form.get("area") ?? ""),
    summary: String(form.get("summary") ?? ""),
    body: String(form.get("body") ?? ""),
    coverUrl: String(form.get("coverUrl") ?? "") || null,
    gallery: lines(form.get("gallery")),
    published: form.get("published") === "on",
    featured: form.get("featured") === "on",
    sort: Number(form.get("sort")) || 0,
    updatedAt: new Date(),
  };
  if (id) {
    await database.update(schema.projects).set(data).where(eq(schema.projects.id, id));
  } else {
    await database.insert(schema.projects).values(data);
  }
  revalidatePath("/", "layout");
  redirect("/admin/projetos");
}

export async function deleteProject(form: FormData) {
  const database = await guard();
  await database
    .delete(schema.projects)
    .where(eq(schema.projects.id, Number(form.get("id"))));
  revalidatePath("/", "layout");
  redirect("/admin/projetos");
}

// ---------- posts ----------

export async function savePost(form: FormData) {
  const database = await guard();
  const id = Number(form.get("id")) || 0;
  const title = String(form.get("title") ?? "").trim();
  const data = {
    title,
    slug: String(form.get("slug") ?? "").trim() || slugify(title),
    excerpt: String(form.get("excerpt") ?? ""),
    body: String(form.get("body") ?? ""),
    coverUrl: String(form.get("coverUrl") ?? "") || null,
    tag: String(form.get("tag") ?? "Editorial"),
    published: form.get("published") === "on",
    updatedAt: new Date(),
  };
  if (id) {
    await database.update(schema.posts).set(data).where(eq(schema.posts.id, id));
  } else {
    await database.insert(schema.posts).values(data);
  }
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

export async function deletePost(form: FormData) {
  const database = await guard();
  await database
    .delete(schema.posts)
    .where(eq(schema.posts.id, Number(form.get("id"))));
  revalidatePath("/", "layout");
  redirect("/admin/blog");
}

// ---------- jobs ----------

export async function saveJob(form: FormData) {
  const database = await guard();
  const id = Number(form.get("id")) || 0;
  const title = String(form.get("title") ?? "").trim();
  const data = {
    title,
    slug: String(form.get("slug") ?? "").trim() || slugify(title),
    area: String(form.get("area") ?? ""),
    type: String(form.get("type") ?? "Efetivo"),
    location: String(form.get("location") ?? "São Paulo · SP"),
    body: String(form.get("body") ?? ""),
    requirements: lines(form.get("requirements")),
    published: form.get("published") === "on",
    sort: Number(form.get("sort")) || 0,
    updatedAt: new Date(),
  };
  if (id) {
    await database.update(schema.jobs).set(data).where(eq(schema.jobs.id, id));
  } else {
    await database.insert(schema.jobs).values(data);
  }
  revalidatePath("/", "layout");
  redirect("/admin/vagas");
}

export async function deleteJob(form: FormData) {
  const database = await guard();
  await database
    .delete(schema.jobs)
    .where(eq(schema.jobs.id, Number(form.get("id"))));
  revalidatePath("/", "layout");
  redirect("/admin/vagas");
}

// ---------- settings ----------

export async function saveSetting(form: FormData) {
  const database = await guard();
  const key = String(form.get("_key") ?? "");
  if (!key) throw new Error("chave ausente");
  const value: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (k.startsWith("_")) continue;
    value[k] = String(v);
  }
  await database
    .insert(schema.settings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value, updatedAt: new Date() },
    });
  revalidatePath("/", "layout");
  redirect("/admin/conteudo?ok=1");
}
