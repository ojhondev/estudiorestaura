/**
 * Gera src/lib/photo-dims.json com a largura/altura de cada foto em public/fotos.
 * O site usa isso para exibir cada foto na proporção real (sem recortar nem esticar).
 * Uso: npm run fotos:dims  (rode depois de adicionar fotos novas)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const BASE = path.join(ROOT, "public");

function walk(dir: string, out: string[] = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

async function main() {
  const out: Record<string, [number, number]> = {};
  for (const f of walk(path.join(BASE, "fotos")).sort()) {
    const m = await sharp(f).metadata();
    const swap = (m.orientation ?? 1) >= 5;
    const w = (swap ? m.height : m.width) ?? 0;
    const h = (swap ? m.width : m.height) ?? 0;
    if (w && h) out["/" + path.relative(BASE, f).split(path.sep).join("/")] = [w, h];
  }
  fs.writeFileSync(path.join(ROOT, "src", "lib", "photo-dims.json"), JSON.stringify(out) + "\n");
  console.log(Object.keys(out).length + " fotos medidas.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
