"use client";

import { useState } from "react";
import type { ReactNode } from "react";

/**
 * Campo de imagem por UPLOAD (sem URL manual). Guarda a URL final num
 * input hidden `name`, mostra prévia e permite trocar/remover.
 */
export function ImageField({
  label,
  name,
  defaultValue = "",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(
        `/api/upload?name=${encodeURIComponent(file.name)}`,
        { method: "POST", body: file },
      );
      const json = await res.json();
      if (json.url) {
        setUrl(json.url);
        const kb = Math.round((json.bytes || 0) / 1024);
        setMsg(kb ? `Enviada (${kb} KB).` : "Enviada.");
      } else {
        setMsg(json.error || "Falha no upload.");
      }
    } catch {
      setMsg("Falha no upload.");
    }
    setBusy(false);
  }

  return (
    <div>
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
        {label}
      </span>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="mt-1.5 flex items-center gap-3">
        <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-[6px] border border-mist bg-mist">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-smoke">sem imagem</span>
          )}
        </div>
        <div className="text-[13px]">
          <label className="inline-block cursor-pointer rounded-[6px] border border-mist px-3 py-1.5 hover:bg-mist">
            {busy ? "Enviando…" : url ? "Trocar" : "Enviar imagem"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={busy}
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setMsg("");
              }}
              className="ml-2 text-[12px] text-coral hover:underline"
            >
              remover
            </button>
          )}
          {msg && <p className="mt-1 text-[12px] text-smoke">{msg}</p>}
        </div>
      </div>
      {hint && <span className="mt-1 block text-[12px] text-smoke">{hint}</span>}
    </div>
  );
}

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

/** Galeria por upload: lista de imagens, guarda uma URL por linha num hidden. */
export function GalleryField({
  label,
  name,
  defaultValue = "",
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [urls, setUrls] = useState<string[]>(
    defaultValue.split(/\n+/).map((s) => s.trim()).filter(Boolean),
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg("");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const res = await fetch(
          `/api/upload?name=${encodeURIComponent(file.name)}`,
          { method: "POST", body: file },
        );
        const json = await res.json();
        if (json.url) added.push(json.url);
        else setMsg(json.error || "Falha no upload.");
      } catch {
        setMsg("Falha no upload.");
      }
    }
    setBusy(false);
    if (added.length) setUrls((u) => [...u, ...added]);
  }

  const move = (i: number, d: number) =>
    setUrls((u) => {
      const j = i + d;
      if (j < 0 || j >= u.length) return u;
      const c = [...u];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  return (
    <div>
      <span className="text-[12px] font-medium uppercase tracking-[0.12em] text-smoke">
        {label}
      </span>
      <input type="hidden" name={name} value={urls.join("\n")} readOnly />
      <div className="mt-1.5 flex flex-wrap gap-2">
        {urls.map((u, i) => (
          <div
            key={u + i}
            className="group relative h-20 w-28 overflow-hidden rounded-[6px] border border-mist"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 px-1 py-0.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => move(i, -1)}>
                ←
              </button>
              <button
                type="button"
                onClick={() => setUrls((x) => x.filter((_, k) => k !== i))}
                className="text-coral"
              >
                ✕
              </button>
              <button type="button" onClick={() => move(i, 1)}>
                →
              </button>
            </div>
          </div>
        ))}
        <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-[6px] border border-dashed border-mist text-[12px] text-smoke hover:bg-mist">
          {busy ? "enviando…" : "+ imagens"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
      </div>
      {msg && <p className="mt-1 text-[12px] text-ember">{msg}</p>}
      {hint && <span className="mt-1 block text-[12px] text-smoke">{hint}</span>}
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
