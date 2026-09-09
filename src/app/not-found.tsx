import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center">
      <p className="text-[12px] uppercase tracking-[0.32em] text-terracotta">
        Erro 404
      </p>
      <h1 className="display mt-4 text-[clamp(2.5rem,9vw,7rem)]">
        Página não encontrada
      </h1>
      <p className="mt-6 max-w-md text-[15px] text-ink-soft">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link href="/" className="ulink mt-8 text-[15px]">
        Voltar ao início
      </Link>
    </section>
  );
}
