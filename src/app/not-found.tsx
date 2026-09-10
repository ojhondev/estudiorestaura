import Link from "next/link";
import { Arrow } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80vh] flex-col justify-center py-32">
      <p className="label">Erro 404</p>
      <h1 className="display mt-4 text-[clamp(2.5rem,9vw,7rem)]">
        Página não encontrada
      </h1>
      <p className="mt-6 max-w-md text-[15px] text-pewter">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link href="/" className="text-arrow mt-8 text-[15px]">
        Voltar ao início <Arrow />
      </Link>
    </section>
  );
}
