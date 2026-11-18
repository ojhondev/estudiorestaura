/**
 * Curvas de nível de um "terreno" sintético (morros gaussianos + ondulações), extraídas por
 * marching squares e ENCADEADAS em linhas contínuas — cada curva vira um caminho SVG que pode
 * ser "desenhado" de ponta a ponta (stroke-dashoffset). Puro, sem DOM.
 */

export type TopoLine = { d: string; level: number };

type Hill = { x: number; y: number; r: number; a: number };
type Pt = [number, number];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function topoLines({
  w,
  h,
  levels = 10,
  cols = 56,
  seed = 11,
}: {
  w: number;
  h: number;
  levels?: number;
  cols?: number;
  seed?: number;
}): TopoLine[] {
  const rand = rng(seed);
  const hills: Hill[] = Array.from({ length: 6 }, () => ({
    x: rand(),
    y: rand(),
    r: 0.14 + rand() * 0.22,
    a: (rand() > 0.3 ? 1 : -0.6) * (0.55 + rand()),
  }));
  const field = (u: number, v: number) => {
    let z = 0.14 * Math.sin(u * 6.1 + v * 2.3) + 0.09 * Math.cos(v * 8.7 - u * 3.1);
    for (const hl of hills) {
      const dx = (u - hl.x) * (w / h);
      const dy = v - hl.y;
      z += hl.a * Math.exp(-(dx * dx + dy * dy) / (hl.r * hl.r));
    }
    return z;
  };

  const rows = Math.round(cols * (h / w));
  const g: number[][] = [];
  let lo = Infinity;
  let hi = -Infinity;
  for (let j = 0; j <= rows; j++) {
    const row: number[] = [];
    for (let i = 0; i <= cols; i++) {
      const z = field(i / cols, j / rows);
      row.push(z);
      lo = Math.min(lo, z);
      hi = Math.max(hi, z);
    }
    g.push(row);
  }

  const cw = w / cols;
  const ch = h / rows;
  const out: TopoLine[] = [];

  for (let l = 1; l <= levels; l++) {
    const t = lo + ((hi - lo) * l) / (levels + 1);

    // segmentos: cada ponta é uma aresta da grade (chave única), então dá para encadear
    type Seg = { a: string; b: string };
    const pos = new Map<string, Pt>();
    const segs: Seg[] = [];
    const lerp = (p: number, q: number) => (t - p) / (q - p);

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = g[j]![i]!;
        const b = g[j]![i + 1]!;
        const c = g[j + 1]![i + 1]!;
        const e = g[j + 1]![i]!;
        const idx = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (e > t ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const x = i * cw;
        const y = j * ch;

        const T = `h${i}_${j}`;
        const B = `h${i}_${j + 1}`;
        const L = `v${i}_${j}`;
        const R = `v${i + 1}_${j}`;
        pos.set(T, [x + cw * lerp(a, b), y]);
        pos.set(R, [x + cw, y + ch * lerp(b, c)]);
        pos.set(B, [x + cw * lerp(e, c), y + ch]);
        pos.set(L, [x, y + ch * lerp(a, e)]);

        const add = (p: string, q: string) => segs.push({ a: p, b: q });
        switch (idx) {
          case 1: case 14: add(L, B); break;
          case 2: case 13: add(B, R); break;
          case 3: case 12: add(L, R); break;
          case 4: case 11: add(T, R); break;
          case 5: add(L, T); add(B, R); break;
          case 6: case 9: add(T, B); break;
          case 7: case 8: add(L, T); break;
          case 10: add(T, R); add(L, B); break;
        }
      }
    }
    if (!segs.length) continue;

    const adj = new Map<string, number[]>();
    segs.forEach((s, k) => {
      (adj.get(s.a) ?? adj.set(s.a, []).get(s.a)!).push(k);
      (adj.get(s.b) ?? adj.set(s.b, []).get(s.b)!).push(k);
    });
    const used = new Array<boolean>(segs.length).fill(false);

    const walk = (startKey: string, first: number | undefined): string[] => {
      const keys: string[] = [];
      let cur = startKey;
      let k: number | undefined = first;
      while (k !== undefined && !used[k]) {
        used[k] = true;
        const s: Seg = segs[k]!;
        cur = s.a === cur ? s.b : s.a;
        keys.push(cur);
        k = (adj.get(cur) ?? []).find((n) => !used[n]);
      }
      return keys;
    };

    for (let k = 0; k < segs.length; k++) {
      if (used[k]) continue;
      const s = segs[k]!;
      // anda para os dois lados a partir do segmento inicial
      used[k] = true;
      const fwd = walk(s.b, (adj.get(s.b) ?? []).find((n) => !used[n]));
      const back = walk(s.a, (adj.get(s.a) ?? []).find((n) => !used[n]));
      const keys = [...back.reverse(), s.a, s.b, ...fwd];
      const pts = keys.map((key) => pos.get(key)!).filter(Boolean);
      if (pts.length < 8) continue; // ignora fiapos minúsculos

      // suaviza: curvas quadráticas passando pelos pontos médios
      let d = `M${pts[0]![0].toFixed(1)} ${pts[0]![1].toFixed(1)}`;
      for (let n = 1; n < pts.length - 1; n++) {
        const p = pts[n]!;
        const q = pts[n + 1]!;
        d += `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${((p[0] + q[0]) / 2).toFixed(1)} ${((p[1] + q[1]) / 2).toFixed(1)}`;
      }
      out.push({ d, level: l });
    }
  }
  return out;
}
