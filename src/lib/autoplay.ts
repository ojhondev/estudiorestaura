"use client";

import { useEffect, useRef, type RefObject } from "react";
import { reducedMotion } from "@/lib/anim";

/**
 * Chama `tick` a cada `ms` enquanto o elemento estiver visível na tela e
 * `active` for verdadeiro. Serve para abrir dropdowns/itens sozinhos conforme
 * o usuário desce a página (mostra que são clicáveis). A contagem dos `ms`
 * começa quando o elemento entra na tela e zera se ele sai. Respeita
 * "prefers-reduced-motion": nesse caso nunca dispara.
 *
 * Usa uma checagem leve a cada 250 ms (getBoundingClientRect) em vez de
 * IntersectionObserver, que é pausado em abas/janelas em segundo plano.
 */
export function useAutoplay(
  ref: RefObject<HTMLElement | null>,
  tick: () => void,
  { ms = 3000, active = true }: { ms?: number; active?: boolean } = {},
) {
  const cb = useRef(tick);
  cb.current = tick;

  useEffect(() => {
    const el = ref.current;
    if (!el || !active || reducedMotion()) return;

    let since = 0; // quando ficou visível (0 = fora da tela)
    const check = window.setInterval(() => {
      if (document.hidden) {
        since = 0;
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;
      const shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      // visível = boa parte do elemento OU boa parte da tela ocupada por ele
      const visible = shown > 0 && (shown >= r.height * 0.3 || shown >= vh * 0.45);
      if (!visible) {
        since = 0;
        return;
      }
      const now = performance.now();
      if (!since) since = now;
      if (now - since >= ms) {
        since = now;
        cb.current();
      }
    }, 250);

    return () => window.clearInterval(check);
  }, [ref, ms, active]);
}
