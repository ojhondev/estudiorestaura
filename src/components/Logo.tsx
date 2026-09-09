import Image from "next/image";
import logo from "../../public/logo.png";

type Props = {
  className?: string;
  priority?: boolean;
};

/** The Estúdio Restaura wordmark lockup (mark + "estúdio restaura"). */
export function Logo({ className = "", priority = false }: Props) {
  return (
    <Image
      src={logo}
      alt="Estúdio Restaura"
      priority={priority}
      sizes="(min-width: 1024px) 1100px, 92vw"
      className={className}
    />
  );
}
