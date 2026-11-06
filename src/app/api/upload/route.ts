import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { isAuthed } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_INPUT = 40 * 1024 * 1024; // 40 MB de entrada
const MAX_EDGE = 2000; // maior lado após redimensionar

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
  const rawName = (url.searchParams.get("name") || "imagem").replace(
    /\.[a-z0-9]+$/i,
    "",
  );
  const slug =
    rawName
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 60) || "imagem";

  const input = Buffer.from(await request.arrayBuffer());
  if (input.byteLength === 0) {
    return NextResponse.json({ error: "Arquivo vazio." }, { status: 422 });
  }
  if (input.byteLength > MAX_INPUT) {
    return NextResponse.json(
      { error: "Arquivo acima de 40 MB." },
      { status: 413 },
    );
  }

  let output: Buffer;
  let contentType = "image/webp";
  let ext = "webp";
  try {
    const img = sharp(input, { failOn: "none" }).rotate();
    const meta = await img.metadata();
    const pipeline = img.resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
    if (meta.hasAlpha) {
      output = await pipeline.webp({ quality: 80 }).toBuffer();
    } else {
      output = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
      contentType = "image/jpeg";
      ext = "jpg";
    }
  } catch {
    return NextResponse.json(
      { error: "Não foi possível processar a imagem." },
      { status: 422 },
    );
  }

  try {
    const blob = await put(`uploads/${Date.now()}-${slug}.${ext}`, output, {
      access: "public",
      contentType,
    });
    return NextResponse.json({
      url: blob.url,
      bytes: output.byteLength,
      original: input.byteLength,
    });
  } catch (err) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Falha ao enviar." }, { status: 500 });
  }
}
