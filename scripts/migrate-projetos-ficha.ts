/** Adiciona à tabela `projects` os campos da nova ficha (paróquia, equipe, status, créditos). Reexecutável. */
import { neon } from "@neondatabase/serverless";
const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) throw new Error("DATABASE_URL ausente.");
const sql = neon(url);
async function main() {
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS client text NOT NULL DEFAULT ''`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS team jsonb NOT NULL DEFAULT '[]'::jsonb`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT ''`;
await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS credit text NOT NULL DEFAULT ''`;
console.log("ok: client, team, status, credit");
}
main().catch((e) => { console.error(e); process.exit(1); });
