"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f3f1] px-5 text-ink">
      <form
        action={action}
        className="w-full max-w-sm rounded-[10px] border border-mist bg-paper p-7"
      >
        <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-smoke">
          Estúdio Restaura
        </p>
        <h1 className="mt-1 text-[22px] font-light tracking-tight">
          Painel de administração
        </h1>
        <label className="mt-6 block">
          <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
            E-mail
          </span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            autoFocus
            required
            className="mt-1.5 w-full rounded-[6px] border border-mist bg-paper px-3 py-2 text-[14px] outline-none focus:border-ember"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
            Senha
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-[6px] border border-mist bg-paper px-3 py-2 text-[14px] outline-none focus:border-ember"
          />
        </label>
        {state?.error && (
          <p className="mt-3 text-[13px] text-coral">{state.error}</p>
        )}
        <button
          disabled={pending}
          className="mt-5 w-full rounded-[80px] bg-char px-5 py-2.5 text-[13px] font-medium text-paper disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
