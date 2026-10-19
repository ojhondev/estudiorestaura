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

  // Encaminha o lead ao CRM do estúdio (restaura-app). Sem as variáveis
  // (ex.: desenvolvimento local) apenas registra no log.
  const crmUrl = process.env.CRM_LEADS_URL;
  const crmKey = process.env.LEADS_API_KEY;
  if (crmUrl && crmKey) {
    try {
      const res = await fetch(crmUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${crmKey}` },
        body: JSON.stringify({
          nome,
          email,
          telefone: (body.telefone ?? "").trim(),
          assunto: (body.assunto ?? "").trim(),
          mensagem,
          origem: "Site",
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`CRM respondeu ${res.status}`);
    } catch (err) {
      console.error("[contato] falha ao enviar ao CRM", err, { nome, email });
      return NextResponse.json(
        { error: "Não conseguimos enviar agora. Tente novamente em instantes ou fale conosco por e-mail." },
        { status: 502 },
      );
    }
  } else {
    console.info("[contato] CRM não configurado; mensagem apenas registrada", { nome, email });
  }

  return NextResponse.json({ ok: true });
}
