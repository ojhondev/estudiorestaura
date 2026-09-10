"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "er:cookies-ok";

export function CookieBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  function accept() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-mist bg-paper/97 text-ink backdrop-blur-md">
      <div className="shell flex flex-col gap-3 py-4 text-[13px] leading-relaxed sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p className="text-pewter">
          Usamos cookies para entender como o site é usado e melhorar sua
          experiência. Ao continuar, você concorda com nossa{" "}
          <Link
            href="/privacidade"
            className="underline underline-offset-2 hover:text-ember"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <Link
            href="/privacidade"
            className="rounded-[80px] border border-mist px-4 py-2 text-[12px] transition-colors hover:border-smoke"
          >
            Saber mais
          </Link>
          <button
            type="button"
            onClick={accept}
            className="rounded-[80px] bg-char px-4 py-2 text-[12px] font-medium text-paper transition-opacity hover:opacity-90"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
