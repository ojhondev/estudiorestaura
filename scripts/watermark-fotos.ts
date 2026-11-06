/**
 * Aplica a marca d'água nas fotos estáticas do site (public/fotos/{drive,estados,metodo,projetos}).
 * Os originais ficam em .cache/fotos-originais (fora do git) e a marca é sempre aplicada
 * a partir deles — por isso pode rodar de novo sem "marcar duas vezes".
 * Uso: npm run fotos:marca
 */
import fs from "node:fs";
import path from "node:path";
import { applyWatermark } from "../src/lib/watermark";

const ROOT = path.resolve(__dirname, "..");
const DIRS = ["drive", "estados", "metodo", "projetos"];
const BACKUP = path.join(ROOT, ".cache", "fotos-originais");

function walk(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/.(jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function main() {
  let n = 0;
  for (const d of DIRS) {
    const base = path.join(ROOT, "public", "fotos", d);
    if (!fs.existsSync(base)) continue;
    for (const file of walk(base)) {
      const rel = path.relative(path.join(ROOT, "public", "fotos"), file);
      const bak = path.join(BACKUP, rel);
      if (!fs.existsSync(bak)) {
        fs.mkdirSync(path.dirname(bak), { recursive: true });
        fs.copyFileSync(file, bak);
      }
      fs.writeFileSync(file, await applyWatermark(fs.readFileSync(bak), "jpeg"));
      n++;
      if (n % 25 === 0) console.log(n + " fotos…");
    }
  }
  console.log("Marca d'água aplicada em " + n + " fotos.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
