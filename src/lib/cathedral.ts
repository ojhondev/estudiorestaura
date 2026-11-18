/**
 * Croqui de uma catedral em perspectiva: modelo 3D feito de arestas (linhas), projetado com câmera
 * levemente elevada e desenhado com tremido de lápis, sobras nas pontas e linhas de construção.
 * Modelo próprio do Estúdio Restaura (nave, naves laterais, transepto, abside, cúpula com peristilo,
 * duas torres com coruchéu, pórtico de colunas, arcobotantes, arcadas e altar-mor). Puro, sem DOM.
 *
 * Eixos: x = largura, y = profundidade (fachada em y = 0, nave para y > 0), z = altura.
 */

export type V3 = [number, number, number];
export type Pt = [number, number];
/** g = grupo de construção (0 linhas-guia … 7 acabamentos); w = peso do traço (0 fino, 1 normal, 2 forte). */
export type Poly = { pts: V3[]; g: number; w: 0 | 1 | 2 };
export type Cam = { yaw: number; elev: number; dist: number; scale: number; cx: number; cy: number };

const TAU = Math.PI * 2;
const YAW = -0.5;
const ELEV = 0.36;
const DIST = 17;
const PIVOT: V3 = [0, 3, 1.8];

/* ───────────────────────────── geometria ───────────────────────────── */

function build(): Poly[] {
  const out: Poly[] = [];
  const add = (g: number, pts: V3[], w: 0 | 1 | 2 = 1) => out.push({ pts, g, w });
  const line = (g: number, a: V3, b: V3, w: 0 | 1 | 2 = 1) => add(g, [a, b], w);

  const ring = (cx: number, cy: number, z: number, r: number, n = 24): V3[] => {
    const pts: V3[] = [];
    for (let i = 0; i <= n; i++) pts.push([cx + r * Math.cos((i / n) * TAU), cy + r * Math.sin((i / n) * TAU), z]);
    return pts;
  };
  /** Arco num plano vertical: (u, v) locais → 3D. */
  const planeFacade = (x0: number, y0: number, z0: number) => (u: number, v: number): V3 => [x0 + u, y0, z0 + v];
  const planeSide = (x0: number, y0: number, z0: number) => (u: number, v: number): V3 => [x0, y0 + u, z0 + v];

  const pointedArch = (g: number, f: (u: number, v: number) => V3, w: number, h: number, wt: 0 | 1 | 2 = 0) => {
    const hs = Math.max(0.01, h - w * 0.866);
    const pts: V3[] = [f(-w / 2, 0), f(-w / 2, hs)];
    for (let i = 1; i <= 8; i++) {
      const a = Math.PI - ((i / 8) * Math.PI) / 3;
      pts.push(f(w / 2 + w * Math.cos(a), hs + w * Math.sin(a)));
    }
    for (let i = 7; i >= 0; i--) {
      const a = Math.PI - ((i / 8) * Math.PI) / 3;
      pts.push(f(-(w / 2 + w * Math.cos(a)), hs + w * Math.sin(a)));
    }
    pts.push(f(w / 2, 0));
    add(g, pts, wt);
  };
  const roundArch = (g: number, f: (u: number, v: number) => V3, w: number, hs: number, wt: 0 | 1 | 2 = 0) => {
    const pts: V3[] = [f(-w / 2, 0), f(-w / 2, hs)];
    for (let i = 1; i < 12; i++) {
      const a = Math.PI - (i / 12) * Math.PI;
      pts.push(f((w / 2) * Math.cos(a), hs + (w / 2) * Math.sin(a)));
    }
    pts.push(f(w / 2, hs), f(w / 2, 0));
    add(g, pts, wt);
  };
  const column = (g: number, x: number, y: number, z0: number, z1: number, r: number, wt: 0 | 1 | 2 = 1) => {
    const ox = r * Math.cos(YAW);
    const oy = -r * Math.sin(YAW);
    line(g, [x - ox, y - oy, z0], [x - ox, y - oy, z1], wt);
    line(g, [x + ox, y + oy, z0], [x + ox, y + oy, z1], wt);
    add(g, ring(x, y, z0, r, 12), 0);
    add(g, ring(x, y, z1, r * 1.25, 12), 0); // capitel
  };
  const box = (g: number, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, wt: 0 | 1 | 2 = 1) => {
    add(g, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], [x0, y0, z1]], wt);
    add(g, [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z0]], wt);
    for (const [x, y] of [[x0, y0], [x1, y0], [x1, y1], [x0, y1]] as Pt[]) line(g, [x, y, z0], [x, y, z1], wt);
  };

  const NAVE_H = 2.4;
  const RIDGE = 3.3;
  const AISLE_H = 1.3;
  const L = 6; // comprimento da nave

  /* g0 — implantação: planta no chão, eixo e linhas-guia */
  add(0, [[-1.7, 0, 0], [1.7, 0, 0], [1.7, 3.6, 0], [2.8, 3.6, 0], [2.8, 4.6, 0], [1.7, 4.6, 0], [1.7, L, 0]], 1);
  add(0, [[-1.7, 0, 0], [-1.7, 3.6, 0], [-2.8, 3.6, 0], [-2.8, 4.6, 0], [-1.7, 4.6, 0], [-1.7, L, 0]], 1);
  add(0, [[-1.7, L, 0], [-1, L, 0]], 1);
  add(0, [[1, L, 0], [1.7, L, 0]], 1);
  {
    const ap: V3[] = [];
    for (let i = 0; i <= 14; i++) ap.push([Math.cos(Math.PI - (i / 14) * Math.PI), L + Math.sin((i / 14) * Math.PI), 0]);
    add(0, ap, 1);
  }
  line(0, [0, -2.2, 0], [0, L + 1.6, 0], 0); // eixo
  line(0, [-3.6, 4.1, 0], [3.6, 4.1, 0], 0); // eixo do transepto

  /* g1 — paredes */
  for (const s of [-1, 1]) {
    line(1, [s, 0, NAVE_H], [s, 3.6, NAVE_H], 1);
    line(1, [s, 4.6, NAVE_H], [s, L, NAVE_H], 1);
    line(1, [s * 1.7, 0, AISLE_H], [s * 1.7, 3.6, AISLE_H], 1);
    line(1, [s * 1.7, 4.6, AISLE_H], [s * 1.7, L, AISLE_H], 1);
    line(1, [s * 1.7, 0, 0], [s * 1.7, 0, AISLE_H], 1);
    line(1, [s * 1.7, L, 0], [s * 1.7, L, AISLE_H], 1);
    line(1, [s * 1, 0, 0], [s * 1, 0, NAVE_H], 1);
    // transepto: cabeceira
    box(1, s > 0 ? 1.7 : -2.8, 3.6, 0, s > 0 ? 2.8 : -1.7, 4.6, NAVE_H, 1);
    line(1, [s * 1.7, 3.6, AISLE_H], [s * 1.7, 3.6, NAVE_H], 0);
    // fiadas (juntas de pedra) na lateral
    for (const z of [0.45, 0.9]) line(1, [s * 1.7, 0.1, z], [s * 1.7, 3.5, z], 0);
  }
  {
    const top: V3[] = [];
    for (let i = 0; i <= 14; i++) top.push([Math.cos(Math.PI - (i / 14) * Math.PI), L + Math.sin((i / 14) * Math.PI), NAVE_H]);
    add(1, top, 1);
    for (const i of [0, 3, 7, 11, 14]) line(1, [Math.cos(Math.PI - (i / 14) * Math.PI), L + Math.sin((i / 14) * Math.PI), 0], [Math.cos(Math.PI - (i / 14) * Math.PI), L + Math.sin((i / 14) * Math.PI), NAVE_H], i === 0 || i === 14 ? 1 : 0);
  }

  /* g2 — colunas, arcadas, pórtico, altar */
  const colY = [0.9, 1.7, 2.5, 3.3, 4.9, 5.5];
  for (const s of [-1, 1]) {
    for (const y of colY) column(2, s, y, 0, 1.25, 0.075, 1);
    for (let i = 0; i < colY.length - 1; i++) {
      if (colY[i]! > 3.3 && colY[i]! < 4.9) continue;
      const mid = (colY[i]! + colY[i + 1]!) / 2;
      roundArch(2, planeSide(s, mid, 1.25), colY[i + 1]! - colY[i]! - 0.15, 0.05, 0);
    }
  }
  // pórtico de entrada: 4 colunas, degraus, entablamento e frontão
  for (const x of [-0.9, -0.3, 0.3, 0.9]) column(2, x, -0.65, 0.2, 1.6, 0.1, 2);
  line(2, [-1.25, -1.05, 0], [1.25, -1.05, 0], 1);
  line(2, [-1.15, -0.95, 0.1], [1.15, -0.95, 0.1], 0);
  add(2, [[-1.2, -0.9, 1.7], [1.2, -0.9, 1.7], [1.2, -0.4, 1.7], [-1.2, -0.4, 1.7], [-1.2, -0.9, 1.7]], 1);
  add(2, [[-1.2, -0.9, 1.6], [1.2, -0.9, 1.6], [1.2, -0.4, 1.6], [-1.2, -0.4, 1.6], [-1.2, -0.9, 1.6]], 0);
  add(2, [[-1.2, -0.9, 1.7], [0, -0.9, 2.3], [1.2, -0.9, 1.7]], 2);
  add(2, [[-1.0, -0.9, 1.78], [0, -0.9, 2.2], [1.0, -0.9, 1.78]], 0);
  line(2, [-1.2, -0.4, 1.7], [-1.2, 0, 1.7], 0);
  line(2, [1.2, -0.4, 1.7], [1.2, 0, 1.7], 0);
  // altar-mor e retábulo
  box(2, -0.3, 5.2, 0, 0.3, 5.55, 0.4, 1);
  roundArch(2, planeFacade(0, 5.95, 0), 0.9, 0.85, 1);
  roundArch(2, planeFacade(0, 5.95, 0), 0.6, 0.75, 0);
  for (const x of [-0.55, 0.55]) column(2, x, 5.93, 0, 1.5, 0.05, 0);

  /* g3 — aberturas: rosácea, portais, janelas */
  add(3, ring(0, 0, 2.95, 0.5, 28), 1);
  add(3, ring(0, 0, 2.95, 0.3, 24), 0);
  add(3, ring(0, 0, 2.95, 0.1, 12), 0);
  for (let i = 0; i < 8; i++) line(3, [0.1 * Math.cos((i / 8) * TAU), 0, 2.95 + 0.1 * Math.sin((i / 8) * TAU)], [0.5 * Math.cos((i / 8) * TAU), 0, 2.95 + 0.5 * Math.sin((i / 8) * TAU)], 0);
  pointedArch(3, planeFacade(0, 0, 0), 0.8, 1.35, 1);
  pointedArch(3, planeFacade(0, 0, 0), 0.52, 1.1, 0);
  for (const s of [-1, 1]) pointedArch(3, planeFacade(s * 1.18, 0, 0), 0.38, 0.8, 0);
  for (const s of [-1, 1]) {
    for (const y of [0.9, 1.7, 2.5, 3.3, 4.9, 5.5]) pointedArch(3, planeSide(s, y, 1.55), 0.34, 0.75, 0);
    for (const y of [0.4, 1.3, 2.2, 3.1]) pointedArch(3, planeSide(s * 1.7, y, 0.45), 0.4, 0.7, 0);
    pointedArch(3, planeSide(s * 2.8, 4.1, 0.6), 0.6, 1.4, 1); // empena do transepto
    pointedArch(3, planeSide(s * 2.8, 4.1, 0.6), 0.34, 0.9, 0);
  }

  /* g4 — telhados */
  for (const s of [-1, 1]) {
    line(4, [s, 0, NAVE_H], [0, 0, RIDGE], 1);
    line(4, [s * 1.7, 0, AISLE_H], [s * 1.0, 0, 1.7], 0);
    line(4, [s * 1.7, 3.6, AISLE_H], [s * 1.0, 3.6, 1.7], 0);
    line(4, [s * 1.7, 4.6, AISLE_H], [s * 1.0, 4.6, 1.7], 0);
    line(4, [s * 1.7, L, AISLE_H], [s * 1.0, L, 1.7], 0);
    // telhas: fiadas paralelas à cumeeira
    for (const f of [0.34, 0.68]) line(4, [s * (1 - f), 0.05, NAVE_H + f * 0.9], [s * (1 - f), 3.55, NAVE_H + f * 0.9], 0);
    for (const f of [0.34, 0.68]) line(4, [s * (1 - f), 4.65, NAVE_H + f * 0.9], [s * (1 - f), L - 0.2, NAVE_H + f * 0.9], 0);
    // transepto: empena e cumeeira
    add(4, [[s * 2.8, 3.6, NAVE_H], [s * 2.8, 4.1, RIDGE], [s * 2.8, 4.6, NAVE_H]], 1);
    line(4, [s * 1.0, 4.1, RIDGE], [s * 2.8, 4.1, RIDGE], 1);
  }
  line(4, [0, 0, RIDGE], [0, 3.55, RIDGE], 2);
  line(4, [0, 4.65, RIDGE], [0, L, RIDGE], 2);
  line(4, [-1, L, NAVE_H], [0, L + 1, RIDGE - 0.1], 0);
  line(4, [1, L, NAVE_H], [0, L + 1, RIDGE - 0.1], 0);
  line(4, [0, L, RIDGE], [0, L + 1, RIDGE - 0.1], 1);
  line(4, [0, L, RIDGE], [0, L, RIDGE + 0.5], 0);
  line(4, [-0.12, L, RIDGE + 0.28], [0.12, L, RIDGE + 0.28], 0);

  /* g5 — cúpula sobre o cruzeiro, com peristilo */
  const cx = 0;
  const cy = 4.1;
  const R = 0.95;
  add(5, ring(cx, cy, 3.3, R, 28), 1);
  add(5, ring(cx, cy, 4.2, R, 28), 1);
  add(5, ring(cx, cy, 4.3, R + 0.06, 28), 1);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const x = cx + (R + 0.02) * Math.cos(a);
    const y = cy + (R + 0.02) * Math.sin(a);
    column(5, x, y, 3.3, 4.2, 0.04, 0);
  }
  for (const zr of [0.3, 0.58, 0.8]) {
    const z = 4.3 + zr;
    const r = Math.sqrt(Math.max(0.01, R * R - zr * zr));
    add(5, ring(cx, cy, z, r, 24), 0);
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * TAU + 0.2;
    const pts: V3[] = [];
    for (let k = 0; k <= 8; k++) {
      const t = (k / 8) * (Math.PI / 2) * 0.93;
      pts.push([cx + R * Math.cos(t) * Math.cos(a), cy + R * Math.cos(t) * Math.sin(a), 4.3 + R * Math.sin(t)]);
    }
    add(5, pts, 0);
  }
  add(5, ring(cx, cy, 5.2, 0.16, 12), 1);
  add(5, ring(cx, cy, 5.62, 0.16, 12), 0);
  line(5, [cx - 0.16, cy, 5.2], [cx - 0.16, cy, 5.62], 0);
  line(5, [cx + 0.16, cy, 5.2], [cx + 0.16, cy, 5.62], 0);
  line(5, [cx - 0.16, cy, 5.62], [cx, cy, 6.05], 1);
  line(5, [cx + 0.16, cy, 5.62], [cx, cy, 6.05], 1);
  line(5, [cx, cy, 6.05], [cx, cy, 6.4], 1);
  line(5, [cx - 0.1, cy, 6.25], [cx + 0.1, cy, 6.25], 1);

  /* g6 — torres da fachada e coruchéus */
  for (const s of [-1, 1]) {
    const x0 = s > 0 ? 0.6 : -1.7;
    const x1 = s > 0 ? 1.7 : -0.6;
    const y0 = 0;
    const y1 = 1.1;
    const top = 4.6;
    box(6, x0, y0, 0, x1, y1, top, 1);
    for (const z of [0.9, 2.4]) {
      add(6, [[x0 - 0.05, y0 - 0.05, z], [x1 + 0.05, y0 - 0.05, z], [x1 + 0.05, y1 + 0.05, z], [x0 - 0.05, y1 + 0.05, z], [x0 - 0.05, y0 - 0.05, z]], 0);
    }
    add(6, [[x0 - 0.1, y0 - 0.1, top], [x1 + 0.1, y0 - 0.1, top], [x1 + 0.1, y1 + 0.1, top], [x0 - 0.1, y1 + 0.1, top], [x0 - 0.1, y0 - 0.1, top]], 1);
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    // janelas e campanário (face da fachada e face externa)
    pointedArch(6, planeFacade(mx, y0, 1.3), 0.34, 0.95, 0);
    pointedArch(6, planeFacade(mx, y0, 3.35), 0.5, 1.05, 1);
    pointedArch(6, planeFacade(mx, y0, 3.35), 0.3, 0.9, 0);
    pointedArch(6, planeSide(s > 0 ? x1 : x0, my, 3.35), 0.5, 1.05, 1);
    pointedArch(6, planeSide(s > 0 ? x1 : x0, my, 1.3), 0.34, 0.95, 0);
    // coruchéu octogonal
    const oct = (z: number, r: number): V3[] => {
      const pts: V3[] = [];
      for (let i = 0; i <= 8; i++) pts.push([mx + r * Math.cos((i / 8) * TAU + Math.PI / 8), my + r * Math.sin((i / 8) * TAU + Math.PI / 8), z]);
      return pts;
    };
    add(6, oct(top, 0.62), 1);
    add(6, oct(5.15, 0.42), 0);
    add(6, oct(5.75, 0.24), 0);
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * TAU + Math.PI / 8;
      line(6, [mx + 0.62 * Math.cos(a), my + 0.62 * Math.sin(a), top], [mx, my, 7.05], i % 2 ? 0 : 1);
    }
    line(6, [mx, my, 7.05], [mx, my, 7.45], 1);
    line(6, [mx - 0.1, my, 7.3], [mx + 0.1, my, 7.3], 1);
    // pináculos nos cantos
    for (const [px, py] of [[x0, y0], [x1, y0]] as Pt[]) {
      line(6, [px, py, top], [px, py, top + 0.45], 0);
      line(6, [px - 0.06, py, top + 0.18], [px, py, top + 0.55], 0);
      line(6, [px + 0.06, py, top + 0.18], [px, py, top + 0.55], 0);
    }
  }
  // empena da fachada entre as torres, com cruz
  add(6, [[-0.6, 0, NAVE_H + 0.9], [0, 0, RIDGE + 0.55], [0.6, 0, NAVE_H + 0.9]], 1);
  line(6, [0, 0, RIDGE + 0.55], [0, 0, RIDGE + 0.95], 1);
  line(6, [-0.09, 0, RIDGE + 0.8], [0.09, 0, RIDGE + 0.8], 1);

  /* g7 — arcobotantes, contrafortes e pináculos */
  for (const s of [-1, 1]) {
    for (const y of [1.3, 2.5, 3.1, 5.2]) {
      if (y > 3.5 && y < 4.7) continue;
      const px = s * 1.95;
      // pilar
      line(7, [px - 0.07, y, 0], [px - 0.07, y, 2.25], 1);
      line(7, [px + 0.07, y, 0], [px + 0.07, y, 2.25], 1);
      line(7, [px - 0.07, y, 2.25], [px, y, 2.9], 0);
      line(7, [px + 0.07, y, 2.25], [px, y, 2.9], 0);
      // arco ascendente (duas linhas = espessura) até a parede da nave
      for (const [dz, th] of [[0, 1], [-0.28, 0]] as const) {
        const pts: V3[] = [];
        for (let k = 0; k <= 10; k++) {
          const t = k / 10;
          pts.push([px - s * 0.95 * t, y, 2.2 + dz + 0.55 * Math.sin(t * Math.PI * 0.85) - 0.25 * t * t + 0.08 * (1 - t)]);
        }
        add(7, pts, th as 0 | 1);
      }
    }
  }
  return out;
}

let cache: Poly[] | null = null;
export const cathedralModel = () => (cache ??= build());

/* ───────────────────────────── projeção ───────────────────────────── */

export function project(p: V3, cam: Cam): Pt {
  const x = p[0] - PIVOT[0];
  const y = p[1] - PIVOT[1];
  const z = p[2] - PIVOT[2];
  const c = Math.cos(cam.yaw);
  const s = Math.sin(cam.yaw);
  const x1 = x * c - y * s;
  const y1 = x * s + y * c;
  const ce = Math.cos(cam.elev);
  const se = Math.sin(cam.elev);
  const depth = y1 * ce - z * se; // distância ao longo do olhar (maior = mais longe)
  const k = cam.dist / (cam.dist + depth);
  return [cam.cx + x1 * k * cam.scale, cam.cy - (z * ce + y1 * se) * k * cam.scale];
}

/** Enquadra o modelo numa caixa (largura × altura) centrada em (cx, cy). */
export function fitCam(box: { w: number; h: number; cx: number; cy: number }): Cam {
  const probe: Cam = { yaw: YAW, elev: ELEV, dist: DIST, scale: 1, cx: 0, cy: 0 };
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const poly of cathedralModel())
    for (const p of poly.pts) {
      const [px, py] = project(p, probe);
      x0 = Math.min(x0, px); x1 = Math.max(x1, px);
      y0 = Math.min(y0, py); y1 = Math.max(y1, py);
    }
  const scale = Math.min(box.w / (x1 - x0), box.h / (y1 - y0));
  return { ...probe, scale, cx: box.cx - ((x0 + x1) / 2) * scale, cy: box.cy - ((y0 + y1) / 2) * scale };
}

/* ───────────────────────────── traço à mão ───────────────────────────── */

function wob(i: number, seed: number) {
  const r = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return r - Math.floor(r) - 0.5;
}

/** Linha projetada → caminho com tremido de lápis e sobra nas pontas das retas. */
function sketch(pts: Pt[], seed: number, amp: number): string {
  let q = pts;
  if (pts.length === 2) {
    const [a, b] = pts as [Pt, Pt];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const e0 = 0.012 + (wob(seed, 3) + 0.5) * 0.03;
    const e1 = 0.012 + (wob(seed, 9) + 0.5) * 0.03;
    q = [[a[0] - dx * e0, a[1] - dy * e0], [b[0] + dx * e1, b[1] + dy * e1]];
  }
  let d = "";
  let k = seed * 31;
  for (let i = 0; i < q.length - 1; i++) {
    const a = q[i]!;
    const b = q[i + 1]!;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.max(1, Math.round(len / 22));
    for (let j = i === 0 ? 0 : 1; j <= n; j++) {
      const t = j / n;
      const x = a[0] + (b[0] - a[0]) * t + wob(k++, seed) * amp;
      const y = a[1] + (b[1] - a[1]) * t + wob(k++, seed + 5) * amp;
      d += `${d ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

export type Stroke = { d: string; g: number; w: 0 | 1 | 2; k: number; n: number };

/** Junta as linhas em traços (vários segmentos por caminho), na ordem de construção. */
export function buildStrokes(cam: Cam): Stroke[] {
  const model = cathedralModel();
  const groups: Poly[][] = Array.from({ length: 8 }, () => []);
  for (const p of model) groups[p.g]!.push(p);
  const out: Stroke[] = [];
  let seed = 1;
  groups.forEach((list, g) => {
    const zmin = (p: Poly) => Math.min(...p.pts.map((v) => v[2]));
    const sorted = [...list].sort((a, b) => b.w - a.w || zmin(a) - zmin(b));
    const chunks: { w: 0 | 1 | 2; items: Poly[] }[] = [];
    for (const p of sorted) {
      const last = chunks[chunks.length - 1];
      if (last && last.w === p.w && last.items.length < 4) last.items.push(p);
      else chunks.push({ w: p.w, items: [p] });
    }
    // dentro do grupo, o desenho sobe: reordena os blocos pela altura
    chunks.sort((a, b) => Math.min(...a.items.map(zmin)) - Math.min(...b.items.map(zmin)));
    chunks.forEach((c, k) => {
      const d = c.items.map((p) => sketch(p.pts.map((v) => project(v, cam)), seed++, c.w === 0 ? 0.55 : 0.8)).join("");
      out.push({ d, g, w: c.w, k, n: chunks.length });
    });
  });
  return out;
}

/** Janela de progresso (0..1) em que cada grupo é desenhado. */
export const GROUP_WINDOWS: [number, number][] = [
  [0.02, 0.1],
  [0.08, 0.24],
  [0.2, 0.36],
  [0.3, 0.44],
  [0.4, 0.54],
  [0.5, 0.64],
  [0.58, 0.74],
  [0.68, 0.82],
];

/** Pontos do edifício que as anotações apontam (posição 3D e grupo em que aparecem). */
export const TARGETS = {
  torre: { p: [-1.15, 0.55, 6.2] as V3, g: 6 },
  cupula: { p: [0, 4.1, 4.9] as V3, g: 5 },
  rosacea: { p: [0, 0, 2.95] as V3, g: 3 },
  coluna: { p: [1, 2.5, 0.7] as V3, g: 2 },
  nave: { p: [0, 2.4, 2.0] as V3, g: 4 },
  altar: { p: [0, 5.5, 0.4] as V3, g: 2 },
  portico: { p: [0.3, -0.65, 0.9] as V3, g: 2 },
  parede: { p: [1.7, 1.8, 0.7] as V3, g: 1 },
};

/** Cantos do terreno (para o sombreado do chão). */
export const GROUND: V3[] = [[-3.4, -2, 0], [3.4, -2, 0], [3.4, 7.2, 0], [-3.4, 7.2, 0]];
