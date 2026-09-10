import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/** Drizzle client, or null when no database is configured (falls back to seeds). */
export const db = url ? drizzle(neon(url), { schema }) : null;

export const hasDb = Boolean(db);
export { schema };
