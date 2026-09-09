import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** CSS aspect-ratio value, e.g. "16 / 9". Ignored when `fill` is set. */
  ratio?: string;
  /** Fill the parent (parent must be positioned + sized). */
  fill?: boolean;
  label?: string;
  tone?: "default" | "blush" | "peach" | "ink";
  "data-reveal"?: string;
  "data-reveal-delay"?: string | number;
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-[#f2efe9] text-muted border-line",
  blush: "bg-blush-deep/40 text-ink-soft border-ink/15",
  peach: "bg-peach text-ink-soft border-ink/10",
  ink: "bg-ink text-white/55 border-white/15",
};

export function ImagePlaceholder({
  className = "",
  ratio = "4 / 3",
  fill = false,
  label = "Espaço para imagem",
  tone = "default",
  style,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={`relative flex items-center justify-center overflow-hidden border ${tones[tone]} ${
        fill ? "absolute inset-0 h-full w-full" : ""
      } ${className}`}
      style={fill ? style : { aspectRatio: ratio, ...style }}
    >
      <span
        aria-hidden
        className="absolute inset-3 border border-current opacity-40"
      />
      <span className="px-4 text-center font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em]">
        {label}
      </span>
    </div>
  );
}
