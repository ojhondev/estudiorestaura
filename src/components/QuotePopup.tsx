"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WHATSAPP } from "@/lib/content";

const KEY = "er:quote-popup";
const DAY = 86_400_000;

/** Páginas onde o popup não aparece (já são o próprio contato/cadastro). */
const SKIP = ["/contato", "/banco-de-talentos", "/vagas", "/trabalhe-conosco", "/privacidade"];

const OBJETOS = ["Igreja ou capela", "Casarão ou residência", "Prédio tombado", "Quadro ou tela", "Forro, retábulo ou cantaria", "Outro"];
const SERVICOS = ["Restauro", "Conservação", "Laudo técnico", "Iluminação e decoração", "Ainda não sei"];

const BULLETS = [
  "Equipe técnica especializada em patrimônio histórico",
  "Do diagnóstico à execução, em SP, MG e GO",
  "Orçamento pensado para o seu caso, sem compromisso",
];

function snoozed() {
  try {
    const until = Number(localStorage.getItem(KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}
function snooze(days: number) {
  try {
    localStorage.setItem(KEY, String(Date.now() + days * DAY));
  } catch {
    /* ignore */
  }
}

const field =
  "mt-1.5 w-full rounded-[8px] border border-mist bg-paper px-3.5 py-3 text-[14.5px] text-ink outline-none transition-colors placeholder:text-smoke/70 focus:border-ember";

function Chips({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="mt-2 flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            className={`rounded-[80px] border px-3.5 py-1.5 text-[12.5px] transition-colors ${
              on ? "border-ember bg-ember text-paper" : "border-mist bg-paper text-ink hover:border-ember hover:text-ember"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function QuotePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [objeto, setObjeto] = useState("");
  const [servico, setServico] = useState("Ainda não sei");
  const [cidade, setCidade] = useState("");
  const firstRef = useRef<HTMLInputElement>(null);
  const armed = useRef(false);

  const skip = SKIP.some((p) => pathname === p || pathname?.startsWith(p + "/"));

  const show = useCallback(() => {
    if (armed.current) return;
    armed.current = true;
    setOpen(true);
  }, []);

  // Gatilhos: depois de 15s, ao rolar ~40% da página ou ao tentar sair (desktop). Vale o primeiro.
  useEffect(() => {
    if (skip || snoozed()) return;
    const born = Date.now();
    const timer = window.setTimeout(show, 15_000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.4 && Date.now() - born > 6_000) show();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && Date.now() - born > 8_000) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [skip, show]);

  const close = useCallback(() => {
    setOpen(false);
    snooze(sent ? 30 : 3);
  }, [sent]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstRef.current?.focus(), 350);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  function next(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (nome.trim().length < 2) return setError("Diga como podemos te chamar.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Confira o e-mail: parece que falta algo.");
    setStep(2);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (whatsapp.replace(/\D/g, "").length < 10) return setError("Informe o WhatsApp com DDD.");
    if (!objeto) return setError("Escolha o que vamos restaurar.");
    setBusy(true);
    const mensagem =
      `Solicitação de orçamento pelo popup do site.\nWhatsApp: ${whatsapp}\nO que restaurar: ${objeto}\nServiço: ${servico}` +
      (cidade.trim() ? `\nCidade/UF: ${cidade.trim()}` : "");
    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), telefone: whatsapp, assunto: "Orçamento", mensagem }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setError(json.error || "Não foi possível enviar agora. Tente de novo.");
      else {
        setSent(true);
        snooze(30);
      }
    } catch {
      setError("Sem conexão no momento. Tente de novo.");
    }
    setBusy(false);
  }

  if (!open || skip) return null;

  const waText = encodeURIComponent(`Olá! Sou ${nome.split(" ")[0] || "visitante"}, acabei de pedir um orçamento pelo site do Estúdio Restaura.`);

  return (
    <div
      className="pop-backdrop fixed inset-0 z-[75] flex items-end justify-center bg-midnight/60 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-title"
        className="pop-card relative grid max-h-[100dvh] w-full max-w-[56rem] overflow-hidden rounded-t-[18px] bg-paper shadow-[0_40px_100px_-24px_rgba(0,0,0,0.65)] sm:max-h-[92dvh] sm:rounded-[16px] grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[0.85fr_1.15fr] md:grid-rows-[minmax(0,1fr)]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full bg-paper/90 text-[22px] leading-none text-ink shadow-sm transition-colors hover:bg-mist"
        >
          ×
        </button>

        {/* Painel visual */}
        <div className="relative hidden min-h-0 flex-col justify-between gap-8 overflow-hidden p-9 text-paper md:flex">
          <Image src="/fotos/drive/b001.jpg" alt="" fill sizes="420px" quality={80} className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-midnight/55 via-midnight/45 to-midnight/85" />
          <div className="relative">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-paper/80">Estúdio Restaura</p>
            <p className="lora mt-5 text-[26px] leading-[1.25]">Cada camada guarda uma história. Vamos cuidar da sua?</p>
          </div>
          <ul className="relative space-y-3.5">
            {BULLETS.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[13.5px] leading-snug text-paper/90">
                <svg viewBox="0 0 20 20" className="mt-0.5 size-4 shrink-0 text-ember-bright" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m4 10.5 4 4 8-9" />
                </svg>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Faixa visual no mobile */}
        <div className="relative h-24 shrink-0 overflow-hidden md:hidden">
          <Image src="/fotos/drive/b001.jpg" alt="" fill sizes="100vw" quality={70} className="object-cover" style={{ objectPosition: "50% 45%" }} />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/70 to-midnight/20" />
          <p className="lora absolute inset-x-5 bottom-3 text-[17px] leading-tight text-paper">Cada camada guarda uma história.</p>
        </div>

        {/* Conteúdo */}
        <div className="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-9">
          {sent ? (
            <div className="my-auto py-4 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-ember/10 text-ember">
                <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path className="pop-check" d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <h2 id="quote-title" className="mt-5 text-[22px] font-light leading-snug tracking-tight">
                Recebemos o seu pedido{nome ? `, ${nome.split(" ")[0]}` : ""}.
              </h2>
              <p className="mx-auto mt-2 max-w-[30ch] text-[14px] leading-relaxed text-pewter">
                A equipe técnica do Estúdio Restaura vai entrar em contato pelo e-mail ou WhatsApp informado.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <a
                  href={`https://wa.me/${WHATSAPP.digits}?text=${waText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full max-w-xs items-center justify-center rounded-[80px] bg-ember px-5 py-3 text-[12px] font-medium uppercase tracking-[0.14em] text-paper"
                >
                  Adiantar pelo WhatsApp
                </a>
                <Link href="/projetos" onClick={close} className="text-[13px] text-pewter underline underline-offset-4 hover:text-ember">
                  Conhecer nossos projetos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 pr-10" aria-label={`Etapa ${step} de 2`}>
                <div className="flex gap-1.5">
                  <span className="h-1 w-9 rounded-full bg-ember" />
                  <span className={`h-1 w-9 rounded-full transition-colors duration-500 ${step === 2 ? "bg-ember" : "bg-mist"}`} />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-smoke">
                  {step === 1 ? "Etapa 1 de 2" : "Último passo"}
                </span>
              </div>

              <h2 id="quote-title" className="mt-5 text-[clamp(1.4rem,2.6vw,1.75rem)] font-light leading-[1.2] tracking-tight">
                {step === 1 ? "Sua igreja, capela ou casarão precisa de restauro?" : `Ótimo, ${nome.split(" ")[0]}. O que vamos restaurar?`}
              </h2>
              <p className="mt-2.5 text-[14px] leading-relaxed text-pewter">
                {step === 1
                  ? "Deixe seu e-mail e nossa equipe técnica prepara um orçamento para o seu caso."
                  : "Três toques e a equipe já chega com o assunto na mão."}
              </p>

              {step === 1 ? (
                <form onSubmit={next} className="mt-6 space-y-4" noValidate>
                  <label className="block">
                    <span className="text-[12px] font-medium text-ink">Seu nome</span>
                    <input
                      ref={firstRef}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      autoComplete="name"
                      placeholder="Como podemos te chamar?"
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px] font-medium text-ink">Melhor e-mail</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="voce@email.com"
                      className={field}
                    />
                  </label>
                  {error && <p role="alert" className="text-[13px] text-ember">{error}</p>}
                  <button className="group flex w-full items-center justify-center gap-3 rounded-[80px] bg-ember px-5 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90">
                    Quero meu orçamento
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
                  <div>
                    <span className="text-[12px] font-medium text-ink">O que vamos restaurar?</span>
                    <Chips name="O que restaurar" options={OBJETOS} value={objeto} onChange={setObjeto} />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium text-ink">Do que você precisa?</span>
                    <Chips name="Serviço" options={SERVICOS} value={servico} onChange={setServico} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-[12px] font-medium text-ink">WhatsApp</span>
                      <input
                        ref={firstRef}
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(11) 90000-0000"
                        className={field}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[12px] font-medium text-ink">
                        Cidade <span className="font-normal text-smoke">(opcional)</span>
                      </span>
                      <input value={cidade} onChange={(e) => setCidade(e.target.value)} autoComplete="address-level2" placeholder="Ex.: Campinas, SP" className={field} />
                    </label>
                  </div>
                  {error && <p role="alert" className="text-[13px] text-ember">{error}</p>}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setStep(1);
                      }}
                      className="rounded-[80px] border border-mist px-4 py-3.5 text-[12.5px] text-pewter transition-colors hover:border-ember hover:text-ember"
                    >
                      Voltar
                    </button>
                    <button
                      disabled={busy}
                      className="flex-1 rounded-[80px] bg-ember px-5 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {busy ? "Enviando…" : "Enviar pedido"}
                    </button>
                  </div>
                </form>
              )}

              <p className="mt-5 flex items-start gap-2 text-[11.5px] leading-snug text-smoke">
                <svg viewBox="0 0 20 20" className="mt-px size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="9" width="12" height="8" rx="2" />
                  <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
                </svg>
                <span>
                  Seus dados ficam só com o Estúdio e nunca são vendidos. Veja a{" "}
                  <Link href="/privacidade" className="underline underline-offset-2 hover:text-ember">
                    Política de Privacidade
                  </Link>
                  .
                </span>
              </p>
              <button type="button" onClick={close} className="mt-3 self-start text-[12px] text-smoke underline-offset-4 hover:text-ink hover:underline">
                Agora não
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
