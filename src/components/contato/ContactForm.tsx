"use client";

import { useState } from "react";
import { Arrow } from "@/components/ui";

type Status = "idle" | "sending" | "ok" | "error";

const SUBJECTS = [
  "Restauro de edifício",
  "Conservação preventiva",
  "Laudo / diagnóstico técnico",
  "Projeto de arquitetura",
  "Outro assunto",
];

const field =
  "mt-2 w-full rounded-[3.2px] border border-mist bg-paper px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ember placeholder:text-smoke";
const label = "label";

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
      <div className="rounded-[8px] bg-mist p-10">
        <p className="h text-[clamp(1.5rem,3vw,2.25rem)]">Mensagem recebida.</p>
        <p className="mt-3 max-w-sm text-[15px] text-pewter">
          Obrigado pelo contato. O estúdio responde em até dois dias úteis.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-arrow mt-6 text-[14px]"
        >
          Enviar outra mensagem <Arrow />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
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

      <div className="grid gap-6 sm:grid-cols-2">
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
        <p className="text-[14px] text-ember">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-fill w-fit disabled:opacity-50"
      >
        {status === "sending" ? "Enviando…" : "Enviar mensagem"}
        <Arrow className="h-4 w-4" />
      </button>
    </form>
  );
}
