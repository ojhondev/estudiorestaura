"use client";

import { useMemo, useState } from "react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { BR_STATES, BR_VIEWBOX } from "@/lib/brazil-map";
import { mapLocations } from "@/lib/content";

const NAMES: Record<string, string> = Object.fromEntries(
  BR_STATES.map((s) => [s.uf, s.name]),
);

export function BrazilMap() {
  const activeUFs = useMemo(() => Object.keys(mapLocations), []);
  const [uf, setUf] = useState(activeUFs[0]);
  const loc = mapLocations[uf];

  return (
    <section className="bleed bg-midnight text-paper">
      <div className="container py-[clamp(4rem,9vw,7rem)]">
        <div className="flex items-start gap-6">
          <span aria-hidden className="mt-3 h-px w-16 shrink-0 bg-paper/25" />
          <div>
            <p data-reveal="fade" className="label text-mist/60">
              Onde atuamos
            </p>
            <h2
              data-reveal="clip"
              className="h-lg mt-3 text-[clamp(2.25rem,6vw,3.875rem)]"
            >
              No mapa do Brasil
            </h2>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div data-reveal className="relative">
            <svg
              viewBox={BR_VIEWBOX}
              className="h-auto w-full"
              role="img"
              aria-label="Mapa do Brasil com os estados de atuação"
            >
              {BR_STATES.map((s) => {
                const state = mapLocations[s.uf];
                const isActive = s.uf === uf;
                const fill = !state
                  ? "var(--color-iron)"
                  : state.status === "atuacao"
                    ? isActive
                      ? "var(--color-ember)"
                      : "rgba(183,89,40,0.55)"
                    : isActive
                      ? "var(--color-driftwood)"
                      : "rgba(83,113,121,0.4)";
                return (
                  <path
                    key={s.uf}
                    d={s.d}
                    fill={fill}
                    stroke="var(--color-midnight)"
                    strokeWidth={1}
                    className={state ? "cursor-pointer transition-[fill] duration-300" : ""}
                    onMouseEnter={() => state && setUf(s.uf)}
                    onClick={() => state && setUf(s.uf)}
                  />
                );
              })}
            </svg>

            <div className="mt-6 flex gap-6 text-[12px] text-mist/70">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-ember" /> Atuação
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-driftwood" /> Prospecção
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="overflow-hidden rounded-[8px]">
                <ImagePlaceholder
                  variant="bleed"
                  ratio="4 / 3"
                  className="bg-iron"
                  label={`Espaço para imagem — ${NAMES[uf] ?? uf}`}
                />
              </div>
              <p className="mt-5 text-[12px] uppercase tracking-[0.2em] text-mist/60">
                {loc.status === "atuacao"
                  ? "Aker é ativo aqui"
                  : "Explorando prospectos"}
              </p>
              <p className="mt-2 text-[15px] text-mist/80">{loc.note}</p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="text-[15px]">{NAMES[uf] ?? uf}</p>
              <span className="display text-[clamp(3rem,10vw,7rem)] leading-none">
                {uf}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeUFs.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setUf(code)}
                  className={`rounded-[80px] px-3 py-1 text-[12px] transition-colors ${
                    code === uf
                      ? "bg-paper text-ink"
                      : "bg-white/10 text-mist/70 hover:bg-white/20"
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
