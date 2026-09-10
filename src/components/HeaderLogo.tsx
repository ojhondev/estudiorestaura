"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoMark from "../../public/logo-mark.png";

/**
 * Logo fixa no topo-esquerdo. Só aparece depois que o usuário passa da
 * primeira seção ("O escritório") — ou, em páginas sem essa âncora,
 * depois de uma rolagem curta.
 */
export function HeaderLogo() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.scrollY < 120) {
        setShow(false);
        return;
      }
      const anchor = document.getElementById("header-logo-anchor");
      if (anchor) {
        setShow(anchor.getBoundingClientRect().top <= 8);
      } else {
        setShow(window.scrollY > 480);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <Link
      href="/"
      aria-label="Início — Estúdio Restaura"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: show ? "auto" : "none",
      }}
      className="fixed left-[clamp(1rem,4vw,2rem)] top-[clamp(1rem,4vw,1.6rem)] z-[55] flex items-center rounded-[1584px] border border-mist bg-paper px-4 py-2.5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.28)] transition-all duration-300"
    >
      <Image
        src={logoMark}
        alt="Estúdio Restaura"
        priority
        sizes="220px"
        className="h-[clamp(1.1rem,3vw,1.5rem)] w-auto"
      />
    </Link>
  );
}
