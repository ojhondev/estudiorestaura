/**
 * Fotos reais do estúdio (public/fotos/01..13.jpg — 1800px, otimizadas pelo
 * next/image), distribuídas de forma pseudo-aleatória mas ESTÁVEL: cada "slot"
 * recebe sempre a mesma foto (via hash da chave), evitando mismatch de
 * hidratação.
 */
export const PHOTOS = Array.from(
  { length: 13 },
  (_, i) => `/fotos/${String(i + 1).padStart(2, "0")}.jpg`,
);

function hash(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Uma foto estável para a chave dada. */
export function photo(key: string): string {
  return PHOTOS[hash(key) % PHOTOS.length];
}

/** `n` fotos distintas (quando possível), estáveis para a chave dada. */
export function photos(key: string, n: number): string[] {
  const start = hash(key) % PHOTOS.length;
  const step = 1 + (hash(key + "*") % (PHOTOS.length - 1));
  const out: string[] = [];
  const seen = new Set<number>();
  let idx = start;
  for (let i = 0; i < n; i++) {
    if (seen.size < PHOTOS.length) {
      while (seen.has(idx)) idx = (idx + 1) % PHOTOS.length;
    }
    seen.add(idx);
    out.push(PHOTOS[idx]);
    idx = (idx + step) % PHOTOS.length;
  }
  return out;
}
