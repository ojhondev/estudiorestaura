import "server-only";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export const dbReady = Boolean(db);

export async function allProjects() {
  if (!db) return [];
  return db
    .select()
    .from(schema.projects)
    .orderBy(asc(schema.projects.sort), desc(schema.projects.createdAt));
}

export async function allPosts() {
  if (!db) return [];
  return db
    .select()
    .from(schema.posts)
    .orderBy(desc(schema.posts.publishedAt));
}

export async function allJobs() {
  if (!db) return [];
  return db
    .select()
    .from(schema.jobs)
    .orderBy(asc(schema.jobs.sort), desc(schema.jobs.createdAt));
}

async function one<T>(rows: Promise<T[]>, id: number) {
  return (await rows).find((r) => (r as { id: number }).id === id) ?? null;
}

export const getProjectRow = (id: number) => one(allProjects(), id);
export const getPostRow = (id: number) => one(allPosts(), id);
export const getJobRow = (id: number) => one(allJobs(), id);
