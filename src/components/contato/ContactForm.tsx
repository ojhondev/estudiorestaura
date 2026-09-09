"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

const SUBJECTS = [
  "Restauro de edifício",
  "Conservação preventiva",
  "Laudo / diagnóstico técnico",
  "Projeto de arquitetura",
  "Outro assunto",
];

const field =
  "mt-2 w-full border-b border-line-strong bg-transparent pb-2 text-[16px] text-ink outline-none transition-colors focus:border-terracotta placeholder:text-muted";
const label = "text-[12px] uppercase tracking-[0.26em] text-muted";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Falha ao enviar.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha ao enviar.");
    }
  }

  if (status === "ok") {
    return (
      <div className="border-t border-line-strong pt-8">
        <p className="section-title text-[clamp(1.5rem,3vw,2.25rem)]">
          Mensagem recebida.
        </p>
        <p className="mt-3 max-w-sm text-[15px] text-ink-soft">
          Obrigado pelo contato. O estúdio responde em até dois dias úteis.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ulink mt-6 text-[14px]"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <div className="grid gap-8 sm:grid-cols-2">
        <label>
          <span className={label}>Nome</span>
          <input name="nome" required className={field} placeholder="Seu nome" />
        </label>
        <label>
          <span className={label}>E-mail</span>
          <input
            name="email"
            type="email"
            required
            className={field}
            placeholder="voce@email.com"
          />
        </label>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <label>
          <span className={label}>Telefone</span>
          <input name="telefone" className={field} placeholder="(11) 90000-0000" />
        </label>
        <label>
          <span className={label}>Assunto</span>
          <select name="assunto" className={field} defaultValue={SUBJECTS[0]}>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <label>
        <span className={label}>Mensagem</span>
        <textarea
          name="mensagem"
          required
          rows={5}
          className={`${field} resize-none`}
          placeholder="Conte sobre o edifício, o acervo ou o projeto."
        />
      </label>

      {status === "error" && (
        <p className="text-[14px] text-terracotta">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="ulink w-fit text-[15px] disabled:opacity-50"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
