"use client";

import { useEffect } from "react";

/**
 * Proteção das fotos do site contra cópia casual:
 *  - bloqueia o menu de contexto (botão direito / toque longo) sobre imagens e vídeos
 *    ("Salvar imagem como", "Copiar imagem", "Abrir em nova aba");
 *  - bloqueia arrastar a imagem para a área de trabalho/outra aba;
 *  - impede copiar imagens pela seleção (Ctrl+A, Ctrl+C) e salvar/imprimir a página;
 *  - ao detectar atalhos de captura de tela (PrintScreen, Win+Shift+S, Cmd+Shift+3/4/5)
 *    esconde as imagens por um instante e limpa a área de transferência.
 *
 * Importante: nenhum navegador consegue impedir 100% prints ou o download por quem
 * tem conhecimento técnico (ferramentas do desenvolvedor, captura por hardware, câmera).
 * Isto é dissuasão; proteção de verdade vem de fotos em resolução reduzida e marca d'água.
 */
const MEDIA = "img,video,canvas,picture";

function overMedia(x: number, y: number, target: EventTarget | null) {
  if (target instanceof Element && target.closest(MEDIA)) return true;
  return document.elementsFromPoint(x, y).some((el) => /^(IMG|VIDEO|CANVAS)$/.test(el.tagName));
}

export function ImageGuard() {
  useEffect(() => {
    const html = document.documentElement;
    let timer = 0;

    const wipeClipboard = () => {
      try {
        void navigator.clipboard?.writeText("© Estúdio Restaura — conteúdo protegido").catch(() => {});
      } catch {
        /* ignora */
      }
    };
    const shield = (ms = 2200) => {
      html.classList.add("er-shield");
      wipeClipboard();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => html.classList.remove("er-shield"), ms);
    };

    const onContext = (e: MouseEvent) => {
      if (overMedia(e.clientX, e.clientY, e.target)) e.preventDefault();
    };
    const onDrag = (e: DragEvent) => {
      if (e.target instanceof Element && e.target.closest(MEDIA)) e.preventDefault();
    };
    const onCopy = (e: ClipboardEvent) => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return;
      // mantém só o texto: nada de imagens/HTML na área de transferência
      e.clipboardData?.setData("text/plain", sel.toString());
      e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key;
      const mod = e.ctrlKey || e.metaKey;
      if (k === "PrintScreen") return shield();
      if (e.metaKey && e.shiftKey && ["3", "4", "5", "s", "S"].includes(k)) return shield();
      if (mod && e.shiftKey && (k === "s" || k === "S")) return shield();
      if (mod && (k === "s" || k === "S")) return void e.preventDefault();
      if (mod && (k === "p" || k === "P")) {
        e.preventDefault();
        shield();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") shield();
    };

    document.addEventListener("contextmenu", onContext, true);
    document.addEventListener("dragstart", onDrag, true);
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCopy, true);
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("beforeprint", () => shield(4000));
    return () => {
      document.removeEventListener("contextmenu", onContext, true);
      document.removeEventListener("dragstart", onDrag, true);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCopy, true);
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.clearTimeout(timer);
      html.classList.remove("er-shield");
    };
  }, []);

  return null;
}
