"use client";

import { useState } from "react";
import { Arrow } from "@/components/ui";
import {
  AREAS,
  CV_MAX_BYTES,
  CV_TYPES,
  DISPONIBILIDADES,
  EQUIPE,
  EXPERIENCIAS_ANOS,
  FAIXAS,
  FORMACOES,
  REGIMES,
  UFS,
  VIAGEM_ALCANCE,
} from "@/lib/talentos";

type Status = "idle" | "sending" | "ok" | "error";

const field =
  "mt-2 w-full rounded-[3.2px] border border-mist bg-paper px-3 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-ember placeholder:text-smoke";
const label = "label";
const MB = (CV_MAX_BYTES / 1024 / 1024).toFixed(0);

function Req() {
  return <span className="text-ember"> *</span>;
}

function Section({ n, title, hint, children }: { n: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-mist pt-8">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden>
        <p className="label">{n}</p>
        <h2 className="h mt-2 text-[clamp(1.4rem,2.6vw,1.9rem)]">{title}</h2>
        {hint && <p className="mt-2 max-w-[56ch] text-[14px] text-pewter">{hint}</p>}
      </div>
      {children}
    </fieldset>
  );
}

/** Opção marcável em formato de "pílula" (checkbox ou radio). */
function Chip({ type, name, value, required }: { type: "checkbox" | "radio"; name: string; value: string; required?: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type={type} name={name} value={value} required={required} className="peer sr-only" />
      <span className="inline-flex rounded-full border border-mist bg-paper px-4 py-2 text-[14px] leading-snug text-ink transition-colors hover:border-ink/40 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:ring-2 peer-focus-visible:ring-ember">
        {value}
      </span>
    </label>
  );
}

function Group({ title, required, children }: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={title}>
      <span className={label}>
        {title}
        {required && <Req />}
      </span>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Select({ name, options, required = true }: { name: string; options: readonly string[]; required?: boolean }) {
  return (
    <select name={name} required={required} defaultValue="" className={field}>
      <option value="" disabled>
        Selecione
      </option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

export function TalentForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [viaja, setViaja] = useState(false);
  const [fileName, setFileName] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError("");
    if (!f) return setFileName("");
    if (f.size > CV_MAX_BYTES) {
      e.target.value = "";
      setFileName("");
      return setError(`O currículo tem ${(f.size / 1024 / 1024).toFixed(1)} MB. O limite é ${MB} MB — comprima o PDF e tente de novo.`);
    }
    if (!CV_TYPES[f.type] && !/\.(pdf|docx?)$/i.test(f.name)) {
      e.target.value = "";
      setFileName("");
      return setError("Envie o currículo em PDF, DOC ou DOCX.");
    }
    setFileName(`${f.name} · ${(f.size / 1024).toFixed(0)} KB`);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setError("");

    if (data.getAll("areas").length === 0) return setError("Escolha ao menos uma área de atuação.");
    if (data.getAll("regimes").length === 0) return setError("Escolha ao menos um regime de contratação.");
    const cv = data.get("cv");
    if (!(cv instanceof File) || cv.size === 0) return setError("Anexe o seu currículo.");

    setStatus("sending");
    try {
      const res = await fetch("/api/talentos", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Falha ao enviar.");
      setStatus("ok");
      form.reset();
      setViaja(false);
      setFileName("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha ao enviar.");
    }
  }

  if (status === "ok") {
    return (
      <div className="self-start rounded-[8px] bg-mist p-10">
        <p className="h text-[clamp(1.5rem,3vw,2.25rem)]">Cadastro recebido.</p>
        <p className="mt-3 max-w-md text-[15px] text-pewter">
          Obrigado por querer fazer parte do Estúdio Restaura. A equipe vai analisar o seu perfil e, quando surgir uma oportunidade
          compatível, entraremos em contato.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="text-arrow mt-6 text-[14px]">
          Enviar outro cadastro <Arrow />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      {/* campo-isca contra robôs: pessoas não veem nem preenchem */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      <Section n="01" title="Sobre você">
        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className={label}>Nome completo<Req /></span>
            <input name="nome" required minLength={2} maxLength={120} autoComplete="name" className={field} placeholder="Seu nome" />
          </label>
          <label>
            <span className={label}>E-mail<Req /></span>
            <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} placeholder="voce@email.com" />
          </label>
          <label>
            <span className={label}>Telefone / WhatsApp<Req /></span>
            <input name="telefone" type="tel" required maxLength={40} autoComplete="tel" className={field} placeholder="(11) 90000-0000" />
          </label>
          <label>
            <span className={label}>LinkedIn, portfólio ou site</span>
            <input name="link" type="url" maxLength={300} className={field} placeholder="https://" />
          </label>
          <label>
            <span className={label}>Cidade<Req /></span>
            <input name="cidade" required maxLength={80} autoComplete="address-level2" className={field} placeholder="Onde você mora" />
          </label>
          <label>
            <span className={label}>Estado<Req /></span>
            <Select name="uf" options={UFS} />
          </label>
        </div>
      </Section>

      <Section n="02" title="Atuação e formação" hint="Marque todas as áreas em que você atua ou gostaria de atuar.">
        <Group title="Área de atuação" required>
          {AREAS.map((a) => (
            <Chip key={a} type="checkbox" name="areas" value={a} />
          ))}
        </Group>
        <label>
          <span className={label}>Se marcou “Outra”, qual?</span>
          <input name="areaOutra" maxLength={120} className={field} placeholder="Descreva a sua área" />
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className={label}>Maior formação<Req /></span>
            <Select name="formacao" options={FORMACOES} />
          </label>
          <label>
            <span className={label}>Tempo de experiência na área<Req /></span>
            <Select name="anosExperiencia" options={EXPERIENCIAS_ANOS} />
          </label>
        </div>
        <div>
          <label htmlFor="cv" className={label}>
            Currículo<Req />
          </label>
          <input
            id="cv"
            name="cv"
            type="file"
            required
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFile}
            className="mt-2 block w-full cursor-pointer rounded-[3.2px] border border-dashed border-ink/30 bg-paper px-3 py-3 text-[14px] text-pewter file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[13px] file:text-paper"
          />
          <p className="mt-2 text-[13px] text-pewter">{fileName || `PDF, DOC ou DOCX · até ${MB} MB`}</p>
        </div>
      </Section>

      <Section n="03" title="Como você quer trabalhar">
        <Group title="Regime de contratação" required>
          {REGIMES.map((r) => (
            <Chip key={r} type="checkbox" name="regimes" value={r} />
          ))}
        </Group>
        <div className="grid gap-6 sm:grid-cols-2">
          <label>
            <span className={label}>Disponibilidade para início<Req /></span>
            <Select name="disponibilidade" options={DISPONIBILIDADES} />
          </label>
          <label>
            <span className={label}>Pretensão salarial (mensal)<Req /></span>
            <Select name="faixaSalarial" options={FAIXAS} />
          </label>
        </div>

        <div role="group" aria-label="Disponibilidade para viajar">
          <span className={label}>
            Tem disponibilidade para viajar?<Req />
          </span>
          <div
            className="mt-3 flex flex-wrap gap-2"
            onChange={(e) => setViaja((e.target as HTMLInputElement).value === "Sim")}
          >
            <Chip type="radio" name="viaja" value="Sim" required />
            <Chip type="radio" name="viaja" value="Não" required />
          </div>
        </div>
        {viaja && (
          <label>
            <span className={label}>Até onde você poderia viajar?<Req /></span>
            <Select name="viajaAte" options={VIAGEM_ALCANCE} />
          </label>
        )}

        <Group title="Como você lida com trabalho em equipe?" required>
          {EQUIPE.map((r) => (
            <Chip key={r} type="radio" name="equipe" value={r} required />
          ))}
        </Group>
        <label>
          <span className={label}>Quer contar uma situação em que trabalhou em equipe?</span>
          <textarea
            name="equipeNota"
            rows={3}
            maxLength={800}
            className={`${field} resize-none`}
            placeholder="Opcional — um exemplo vale mais que um adjetivo."
          />
        </label>
      </Section>

      <Section n="04" title="Suas 3 últimas experiências" hint="Da mais recente para a mais antiga. Preencha ao menos a primeira.">
        {[1, 2, 3].map((n) => (
          <div key={n} className="grid gap-5 rounded-[8px] border border-mist p-5 sm:p-6">
            <p className="label">
              Experiência {n}
              {n === 1 && <Req />}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              <label>
                <span className={label}>Empresa / instituição</span>
                <input name={`exp${n}_empresa`} required={n === 1} maxLength={120} className={field} />
              </label>
              <label>
                <span className={label}>Cargo / função</span>
                <input name={`exp${n}_cargo`} required={n === 1} maxLength={120} className={field} />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>Período</span>
                <input name={`exp${n}_periodo`} maxLength={60} className={field} placeholder="Ex.: mar/2021 a atual · 2 anos" />
              </label>
              <label className="sm:col-span-2">
                <span className={label}>O que você fazia</span>
                <textarea
                  name={`exp${n}_atividades`}
                  required={n === 1}
                  rows={3}
                  maxLength={1200}
                  className={`${field} resize-none`}
                  placeholder="Principais atividades, obras ou projetos."
                />
              </label>
            </div>
          </div>
        ))}
      </Section>

      <div className="grid gap-6 border-t border-mist pt-8">
        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-ink/80">
          <input type="checkbox" name="consentimento" value="sim" required className="mt-1 h-4 w-4 shrink-0 accent-ember" />
          <span>
            Autorizo o Estúdio Restaura a guardar e usar meus dados e meu currículo para processos seletivos, conforme a{" "}
            <a href="/privacidade" className="underline underline-offset-2 hover:text-ember" target="_blank" rel="noreferrer">
              política de privacidade
            </a>
            .
          </span>
        </label>

        {error && (
          <p role="alert" className="text-[14px] text-ember">
            {error}
          </p>
        )}

        <button type="submit" disabled={status === "sending"} className="btn-fill w-fit disabled:opacity-50">
          {status === "sending" ? "Enviando…" : "Enviar cadastro"}
          <Arrow className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
