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
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  default: "bg-[#efece6] text-muted",
  blush: "bg-blush-deep/45 text-ink-soft",
  peach: "bg-peach text-ink-soft",
  ink: "bg-ink text-white/45",
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
      className={`relative flex items-center justify-center overflow-hidden ${tones[tone]} ${
        fill ? "absolute inset-0 h-full w-full" : ""
      } ${className}`}
      style={fill ? style : { aspectRatio: ratio, ...style }}
    >
      <span className="px-4 text-center text-[10px] font-medium uppercase tracking-[0.34em]">
        {label}
      </span>
    </div>
  );
}
