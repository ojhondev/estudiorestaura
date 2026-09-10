import Image from "next/image";
import logoDark from "../../public/logo.png";
import logoLight from "../../public/logo-white.png";

type Props = {
  className?: string;
  priority?: boolean;
  variant?: "dark" | "light";
} & Record<`data-${string}`, string | undefined>;

/** The Estúdio Restaura wordmark lockup (mark + "estúdio restaura"). */
export function Logo({
  className = "",
  priority = false,
  variant = "dark",
  ...rest
}: Props) {
  return (
    <Image
      {...rest}
      src={variant === "light" ? logoLight : logoDark}
      alt="Estúdio Restaura"
      priority={priority}
      sizes="(min-width: 1024px) 900px, 90vw"
      className={className}
    />
  );
}
