import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  ratio?: string;
  /** Fill the parent (parent must be positioned + sized). */
  fill?: boolean;
  label?: string;
  /** "card" = 8px radius muted panel; "bleed" = square-cornered dark hero. */
  variant?: "card" | "bleed";
  "data-reveal"?: string;
};

export function ImagePlaceholder({
  className = "",
  ratio = "4 / 3",
  fill = false,
  label = "Espaço para imagem",
  variant = "card",
  style,
  ...rest
}: Props) {
  const skin =
    variant === "bleed"
      ? "bg-iron text-paper/45"
      : "bg-mist text-pewter rounded-[8px]";
  const position = fill ? "absolute inset-0 h-full w-full" : "relative";

  return (
    <div
      {...rest}
      className={`flex items-center justify-center overflow-hidden ${skin} ${position} ${className}`}
      style={fill ? style : { aspectRatio: ratio, ...style }}
    >
      <span className="px-4 text-center text-[11px] font-medium uppercase tracking-[0.22em]">
        {label}
      </span>
    </div>
  );
}
