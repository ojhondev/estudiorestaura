import Image from "next/image";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

type Props = {
  src?: string | null;
  alt?: string;
  ratio?: string;
  fill?: boolean;
  className?: string;
  label?: string;
  variant?: "card" | "bleed";
  sizes?: string;
  priority?: boolean;
  "data-reveal"?: string;
  "data-parallax"?: string;
};

/**
 * Renders a real image when `src` is set, otherwise the
 * "ESPAÇO PARA IMAGEM" placeholder. Keeps the same box in both cases.
 */
export function ImageBox({
  src,
  alt = "",
  ratio = "4 / 3",
  fill = false,
  className = "",
  label = "Espaço para imagem",
  variant = "card",
  sizes = "100vw",
  priority,
  ...rest
}: Props) {
  if (!src) {
    return (
      <ImagePlaceholder
        {...rest}
        fill={fill}
        ratio={ratio}
        className={className}
        label={label}
        variant={variant}
      />
    );
  }

  const radius = variant === "card" ? "rounded-[8px]" : "";

  if (fill) {
    return (
      <span
        {...rest}
        className={`absolute inset-0 block overflow-hidden ${radius} ${className}`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </span>
    );
  }

  return (
    <span
      {...rest}
      className={`relative block overflow-hidden ${radius} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </span>
  );
}
