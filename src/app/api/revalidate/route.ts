import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Chamado pelo CRM (Restaura Gestão) depois de salvar conteúdo do site, para renovar
 * as páginas estáticas (home). Protegido por segredo compartilhado (REVALIDATE_SECRET).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
