import Link from "next/link";
import { Arrow } from "@/components/ui";
import { workAreas } from "@/lib/content";

const toneClass: Record<string, string> = {
  pine: "bg-pine",
  tide: "bg-tide",
  ember: "bg-ember",
};

function Mark({ variant }: { variant: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    className: "opacity-40",
  };
  if (variant === "pine")
    return (
      <svg viewBox="0 0 120 90" className="h-24 w-32 text-paper" aria-hidden>
        <rect x="4" y="10" width="52" height="34" {...common} />
        <rect x="64" y="10" width="52" height="20" {...common} />
        <rect x="64" y="38" width="52" height="42" {...common} />
        <rect x="4" y="52" width="52" height="28" {...common} />
      </svg>
    );
  if (variant === "tide")
    return (
      <svg viewBox="0 0 120 90" className="h-24 w-32 text-paper" aria-hidden>
        <path d="M10 80 L60 12 L110 80" {...common} />
        <path d="M28 80 L60 36 L92 80" {...common} />
        <line x1="10" y1="80" x2="110" y2="80" {...common} />
      </svg>
    );
  return (
    <svg viewBox="0 0 120 90" className="h-24 w-32 text-paper" aria-hidden>
      <circle cx="60" cy="45" r="34" {...common} />
      <circle cx="60" cy="45" r="18" {...common} />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={60}
            y1={45}
            x2={60 + Math.cos(r) * 34}
            y2={45 + Math.sin(r) * 34}
            {...common}
          />
        );
      })}
    </svg>
  );
}

export function WorkCards() {
  return (
    <section className="container py-[clamp(4rem,9vw,7rem)]">
      <div className="flex items-start gap-6">
        <span aria-hidden className="mt-3 h-px w-16 shrink-0 bg-ink/25" />
        <div>
          <p data-reveal="fade" className="label">
            Três frentes
          </p>
          <h2 data-reveal="clip" className="h-lg mt-3 text-[clamp(2.25rem,6vw,3.875rem)]">
            Nosso trabalho
          </h2>
        </div>
      </div>

      <div
        data-reveal
        className="mt-12 flex min-h-[16rem] items-center justify-center rounded-[8px] bg-pine text-paper"
      >
        <svg viewBox="0 0 100 100" className="h-20 w-20 text-paper/60" aria-hidden>
          <path
            d="M50 8 L54 46 L92 50 L54 54 L50 92 L46 54 L8 50 L46 46 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {workAreas.map((w) => (
          <article
            key={w.index}
            data-reveal
            className={`card-dark flex min-h-[22rem] flex-col justify-between ${toneClass[w.tone]}`}
          >
            <div>
              <span className="rounded-[80px] bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                {w.index}
              </span>
              <h3 className="h mt-5 text-[clamp(1.5rem,3vw,2rem)]">{w.title}</h3>
              <p className="mt-3 text-[13px] text-paper/70">
                {w.tags.join(" · ")}
              </p>
              <p className="mt-4 max-w-xs text-[14px] text-paper/85">{w.body}</p>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <Link href="/servicos" className="text-arrow text-[13px]">
                Saber mais <Arrow />
              </Link>
              <Mark variant={w.tone} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
