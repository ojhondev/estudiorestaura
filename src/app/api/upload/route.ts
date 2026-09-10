import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

const MAX = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Armazenamento de mídia não configurado." },
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const name = (url.searchParams.get("name") || "arquivo").replace(
    /[^a-zA-Z0-9._-]/g,
    "-",
  );
  const body = await request.arrayBuffer();

  if (body.byteLength === 0) {
    return NextResponse.json({ error: "Arquivo vazio." }, { status: 422 });
  }
  if (body.byteLength > MAX) {
    return NextResponse.json(
      { error: "Arquivo acima de 25 MB." },
      { status: 413 },
    );
  }

  try {
    const blob = await put(`uploads/${Date.now()}-${name}`, body, {
      access: "public",
      contentType: request.headers.get("content-type") || undefined,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Falha ao enviar." }, { status: 500 });
  }
}
