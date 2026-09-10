"use client";

import { useEffect, useState } from "react";

const KEY = "er:quote-popup";
const SUBJECTS = [
  "Igrejas e capelas",
  "Casarões e residências históricas",
  "Prédios tombados",
  "Quadros e telas",
  "Bens integrados (forros, retábulos, cantaria)",
  "Outro",
];

export function QuotePopup() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(t);
  }, []);

  function close() {
    setOpen(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const nome = String(fd.get("nome") || "");
    const email = String(fd.get("email") || "");
    const whatsapp = String(fd.get("whatsapp") || "");
    const tipo = String(fd.get("tipo") || "");
    const objeto = String(fd.get("objeto") || "");
    const mensagem = `Solicitação de orçamento.\nWhatsApp: ${whatsapp}\nTipo de projeto: ${tipo}\nObjeto: ${objeto}`;

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, telefone: whatsapp, assunto: "Orçamento", mensagem }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Não foi possível enviar.");
      } else {
        setSent(true);
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {
          /* ignore */
        }
      }
    } catch {
      setError("Não foi possível enviar.");
    }
    setBusy(false);
  }

  if (!open) return null;

  const input =
    "mt-1 w-full rounded-[6px] border border-mist bg-paper px-3 py-2 text-[14px] text-ink outline-none focus:border-ember";

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="relative w-full max-w-md rounded-[12px] bg-paper p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] sm:p-8">
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-[20px] leading-none text-smoke hover:text-ink"
        >
          ×
        </button>

        {sent ? (
          <div className="py-6 text-center">
            <p className="text-[17px] font-light">Recebemos sua solicitação.</p>
            <p className="mt-2 text-[14px] text-pewter">
              A equipe do Estúdio Restaura entra em contato em breve.
            </p>
            <button
              onClick={close}
              className="mt-5 rounded-[80px] bg-char px-5 py-2 text-[13px] text-paper"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ember">
              Orçamento
            </p>
            <h2 className="mt-1.5 text-[20px] font-light leading-snug tracking-tight">
              Gostaria de fazer um orçamento com o Estúdio?
            </h2>

            <form onSubmit={onSubmit} className="mt-5 space-y-3.5">
              <label className="block">
                <span className="text-[12px] text-smoke">Nome</span>
                <input name="nome" required className={input} />
              </label>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[12px] text-smoke">WhatsApp</span>
                  <input name="whatsapp" required inputMode="tel" className={input} />
                </label>
                <label className="block">
                  <span className="text-[12px] text-smoke">E-mail</span>
                  <input name="email" type="email" required className={input} />
                </label>
              </div>
              <label className="block">
                <span className="text-[12px] text-smoke">Tipo de projeto</span>
                <input
                  name="tipo"
                  required
                  placeholder="Restauro, conservação, laudo técnico…"
                  className={input}
                />
              </label>
              <label className="block">
                <span className="text-[12px] text-smoke">Em que</span>
                <select name="objeto" required defaultValue="" className={input}>
                  <option value="" disabled>
                    Selecione
                  </option>
                  {SUBJECTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              {error && <p className="text-[13px] text-coral">{error}</p>}

              <button
                disabled={busy}
                className="w-full rounded-[80px] bg-ember px-5 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
              >
                {busy ? "Enviando…" : "Solicitar orçamento"}
              </button>
              <button
                type="button"
                onClick={close}
                className="w-full text-[12px] text-smoke hover:text-ink"
              >
                Agora não
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
