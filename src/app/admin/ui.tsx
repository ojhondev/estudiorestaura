"use client";

import { useState } from "react";
import type { ReactNode } from "react";

const inputCls =
  "mt-1.5 w-full rounded-[6px] border border-mist bg-paper px-3 py-2 text-[14px] text-ink outline-none focus:border-ember";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className={inputCls}
      />
      {hint && <span className="mt-1 block text-[12px] text-smoke">{hint}</span>}
    </label>
  );
}

export function Area({
  label,
  name,
  defaultValue,
  rows = 6,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
        {label}
      </span>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        className={`${inputCls} resize-y font-mono text-[13px] leading-relaxed`}
      />
      {hint && <span className="mt-1 block text-[12px] text-smoke">{hint}</span>}
    </label>
  );
}

export function Toggle({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2.5">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-ember"
      />
      <span className="text-[13px]">{label}</span>
    </label>
  );
}

export function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
        {label}
      </span>
      <select name={name} defaultValue={defaultValue} className={inputCls}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

/** Upload one or more images to Vercel Blob, appends URLs into a textarea/input. */
export function Uploader({ targetName }: { targetName: string }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg("");
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const res = await fetch(
          `/api/upload?name=${encodeURIComponent(file.name)}`,
          { method: "POST", body: file },
        );
        const json = await res.json();
        if (json.url) urls.push(json.url);
        else setMsg(json.error || "Falha no upload.");
      } catch {
        setMsg("Falha no upload.");
      }
    }
    setBusy(false);
    if (!urls.length) return;
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
      `[name="${targetName}"]`,
    );
    if (el) {
      if (el.tagName === "TEXTAREA") {
        el.value = el.value
          ? el.value.replace(/\s*$/, "") + "\n" + urls.join("\n")
          : urls.join("\n");
      } else {
        el.value = urls[urls.length - 1];
      }
    }
    setMsg(`${urls.length} imagem(ns) enviada(s).`);
  }

  return (
    <div className="rounded-[6px] border border-dashed border-mist p-3 text-[13px]">
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => onFiles(e.target.files)}
        className="text-[12px]"
      />
      {busy && <span className="ml-2 text-smoke">enviando…</span>}
      {msg && <p className="mt-1.5 text-[12px] text-ember">{msg}</p>}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] border border-mist bg-paper p-5 md:p-7">
      {children}
    </div>
  );
}
