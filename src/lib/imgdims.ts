import sharp from "sharp";
import dims from "./photo-dims.json";

export type Dim = { w: number; h: number };

const local = dims as unknown as Record<string, [number, number]>;
const remote = new Map<string, Dim | null>();

/** Largura/altura reais de uma foto: do índice gerado (fotos do site) ou lendo a imagem remota (Blob). */
export async function imageDim(src?: string | null): Promise<Dim | null> {
  if (!src) return null;
  const l = local[src];
  if (l) return { w: l[0], h: l[1] };
  if (!/^https?:\/\//.test(src)) return null;
  if (remote.has(src)) return remote.get(src) ?? null;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(String(res.status));
    const m = await sharp(Buffer.from(await res.arrayBuffer()), { failOn: "none" }).metadata();
    const swap = (m.orientation ?? 1) >= 5;
    const d = m.width && m.height ? { w: swap ? m.height : m.width, h: swap ? m.width : m.height } : null;
    remote.set(src, d);
    return d;
  } catch {
    remote.set(src, null);
    return null;
  }
}

export async function imageDims(srcs: (string | null | undefined)[]): Promise<Record<string, Dim>> {
  const out: Record<string, Dim> = {};
  await Promise.all(
    srcs.map(async (s) => {
      const d = await imageDim(s);
      if (s && d) out[s] = d;
    }),
  );
  return out;
}
