import Image from "next/image";
import logoDark from "../../public/logo.png";
import logoLight from "../../public/logo-white.png";

type Props = {
  className?: string;
  priority?: boolean;
  /** "light" = white wordmark for dark surfaces; "dark" = default (light bg). */
  variant?: "dark" | "light";
};

/** The Estúdio Restaura wordmark lockup (mark + "estúdio restaura"). */
export function Logo({ className = "", priority = false, variant = "dark" }: Props) {
  return (
    <Image
      src={variant === "light" ? logoLight : logoDark}
      alt="Estúdio Restaura"
      priority={priority}
      sizes="(min-width: 1024px) 900px, 90vw"
      className={className}
    />
  );
}
