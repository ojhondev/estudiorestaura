import { NextResponse } from "next/server";

type Payload = {
  nome?: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem?: string;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const nome = (body.nome ?? "").trim();
  const email = (body.email ?? "").trim();
  const mensagem = (body.mensagem ?? "").trim();

  if (nome.length < 2) {
    return NextResponse.json({ error: "Informe seu nome." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 422 });
  }
  if (mensagem.length < 10) {
    return NextResponse.json(
      { error: "Escreva um pouco mais na mensagem." },
      { status: 422 },
    );
  }

  // Mock: sem banco/e-mail ainda. Trocar por integração real depois.
  console.info("[contato] nova mensagem", {
    nome,
    email,
    assunto: body.assunto ?? "",
  });

  return NextResponse.json({ ok: true });
}
