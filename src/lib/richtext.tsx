import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Texto dos artigos do blog. Cada bloco é separado por uma linha em branco e pode ser:
 *   ## Título de seção        ### Subtítulo / pergunta
 *   - item de lista (várias linhas seguidas)    1. item numerado
 *   > citação ou destaque
 *   Parágrafo comum, com **negrito**, *itálico* e [texto do link](/rota ou https://…)
 * Quem edita no admin só precisa seguir isso; qualquer outra coisa vira parágrafo.
 */
export type Block =
  | { t: "h2"; text: string; id: string }
  | { t: "h3"; text: string; id: string }
  | { t: "ul" | "ol"; items: string[] }
  | { t: "quote"; text: string }
  | { t: "p"; text: string };

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

export function parseBlocks(paras: string[]): Block[] {
  const seen = new Map<string, number>();
  const uid = (text: string) => {
    const base = slugify(text) || "secao";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  return paras.map((raw): Block => {
    const p = raw.trim();
    if (p.startsWith("### ")) return { t: "h3", text: p.slice(4).trim(), id: uid(p.slice(4)) };
    if (p.startsWith("## ")) return { t: "h2", text: p.slice(3).trim(), id: uid(p.slice(3)) };
    const lines = p.split("\n").map((l) => l.trim());
    if (lines.every((l) => /^[-•*]\s+/.test(l))) return { t: "ul", items: lines.map((l) => l.replace(/^[-•*]\s+/, "")) };
    if (lines.every((l) => /^\d+[.)]\s+/.test(l))) return { t: "ol", items: lines.map((l) => l.replace(/^\d+[.)]\s+/, "")) };
    if (p.startsWith("> ")) return { t: "quote", text: lines.map((l) => l.replace(/^>\s?/, "")).join(" ") };
    return { t: "p", text: lines.join(" ") };
  });
}

/** Negrito, itálico e links dentro de uma linha. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    const tok = m[0];
    if (tok.startsWith("**")) out.push(<strong key={k++} className="font-medium text-ink">{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("[")) {
      const [, label, href] = tok.match(/\[([^\]]+)\]\(([^)]+)\)/) ?? [];
      const external = /^https?:/.test(href);
      out.push(
        external ? (
          <a key={k++} href={href} target="_blank" rel="noreferrer" className="underline decoration-ember/50 underline-offset-[3px] hover:text-ember">
            {label}
          </a>
        ) : (
          <Link key={k++} href={href} className="underline decoration-ember/50 underline-offset-[3px] hover:text-ember">
            {label}
          </Link>
        ),
      );
    } else out.push(<em key={k++}>{tok.slice(1, -1)}</em>);
    last = i + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function RichBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[16.5px] leading-[1.75] text-ink/85">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} id={b.id} className="h mt-12 scroll-mt-28 text-[clamp(1.5rem,3vw,2rem)] leading-tight first:mt-0">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="mt-8 scroll-mt-28 text-[clamp(1.1rem,2vw,1.3rem)] font-medium leading-snug text-ink">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {b.items.map((it, k) => (
                  <li key={k} className="relative pl-6 before:absolute before:left-0 before:top-[0.8em] before:h-px before:w-3.5 before:bg-ember">
                    {inline(it)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-3 pl-1">
                {b.items.map((it, k) => (
                  <li key={k} className="grid grid-cols-[2rem_1fr] gap-1">
                    <span className="text-[13px] tabular-nums text-ember">{String(k + 1).padStart(2, "0")}</span>
                    <span>{inline(it)}</span>
                  </li>
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote key={i} className="lora my-8 border-l-2 border-ember bg-mist/60 px-6 py-5 text-[clamp(1.05rem,1.8vw,1.25rem)] leading-[1.6] text-pewter">
                {inline(b.text)}
              </blockquote>
            );
          default:
            return <p key={i}>{inline(b.text)}</p>;
        }
      })}
    </div>
  );
}

/** Sumário: os títulos "##" do texto. */
export const tocOf = (blocks: Block[]) => blocks.filter((b): b is Extract<Block, { t: "h2" }> => b.t === "h2").map((b) => ({ id: b.id, text: b.text }));

/** Perguntas e respostas: cada "###" dentro da seção "Perguntas frequentes" com o parágrafo seguinte. */
export function faqOf(blocks: Block[]): { q: string; a: string }[] {
  const start = blocks.findIndex((b) => b.t === "h2" && /perguntas frequentes/i.test(b.text));
  if (start < 0) return [];
  const out: { q: string; a: string }[] = [];
  for (let i = start + 1; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.t === "h2") break;
    if (b.t === "h3") {
      const ans: string[] = [];
      for (let j = i + 1; j < blocks.length && blocks[j].t !== "h3" && blocks[j].t !== "h2"; j++) {
        const x = blocks[j];
        if (x.t === "p" || x.t === "quote") ans.push(x.text);
        if (x.t === "ul" || x.t === "ol") ans.push(x.items.join("; "));
      }
      if (ans.length) out.push({ q: b.text, a: ans.join(" ").replace(/\*\*|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") });
    }
  }
  return out;
}

export const plain = (s: string) => s.replace(/\*\*|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

export function wordCount(blocks: Block[]) {
  return blocks.reduce((n, b) => {
    const txt = b.t === "ul" || b.t === "ol" ? b.items.join(" ") : (b as { text: string }).text;
    return n + txt.split(/\s+/).filter(Boolean).length;
  }, 0);
}
