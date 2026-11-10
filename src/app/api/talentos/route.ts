import { NextResponse } from "next/server";
import {
  AREAS,
  CV_MAX_BYTES,
  DISPONIBILIDADES,
  EQUIPE,
  EXPERIENCIAS_ANOS,
  FAIXAS,
  FORMACOES,
  REGIMES,
  UFS,
  VIAGEM_ALCANCE,
  type Experiencia,
} from "@/lib/talentos";

export const runtime = "nodejs";
export const maxDuration = 30;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const text = (d: FormData, k: string, max: number) => String(d.get(k) ?? "").trim().slice(0, max);
const oneOf = <T extends string>(v: string, list: readonly T[]): v is T => (list as readonly string[]).includes(v);

/** Confere o conteúdo do arquivo (não só a extensão): PDF, DOC (OLE) ou DOCX (zip). */
function sniff(buf: Buffer): { tipo: string; ext: string } | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return { tipo: "application/pdf", ext: "pdf" };
  if (buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0) return { tipo: "application/msword", ext: "doc" };
  if (buf[0] === 0x50 && buf[1] === 0x4b) {
    return { tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: "docx" };
  }
  return null;
}

// freio simples contra repetição (por instância): 5 cadastros concluídos por hora por IP.
// Só envios que deram certo contam — erros de preenchimento não travam ninguém.
const hits = new Map<string, number[]>();
const recent = (ip: string) => (hits.get(ip) ?? []).filter((t) => Date.now() - t < 3_600_000);
const limited = (ip: string) => recent(ip).length >= 5;
const record = (ip: string) => hits.set(ip, [...recent(ip), Date.now()]);

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Muitos envios seguidos. Tente de novo mais tarde." }, { status: 429 });
  }

  let d: FormData;
  try {
    d = await request.formData();
  } catch {
    return NextResponse.json({ error: "Não foi possível ler o formulário. O arquivo pode ser grande demais." }, { status: 400 });
  }

  // campo-isca: robôs preenchem, pessoas não. Responde "ok" sem guardar nada.
  if (text(d, "website", 50)) return NextResponse.json({ ok: true });

  const fail = (error: string) => NextResponse.json({ error }, { status: 422 });

  const nome = text(d, "nome", 120);
  const email = text(d, "email", 200).toLowerCase();
  const telefone = text(d, "telefone", 40);
  const cidade = text(d, "cidade", 80);
  const uf = text(d, "uf", 2);
  let link = text(d, "link", 300);
  if (nome.length < 2) return fail("Informe seu nome.");
  if (!isEmail(email)) return fail("E-mail inválido.");
  if (telefone.replace(/\D/g, "").length < 10) return fail("Informe um telefone com DDD.");
  if (cidade.length < 2) return fail("Informe sua cidade.");
  if (!oneOf(uf, UFS)) return fail("Escolha o estado.");
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;
  if (link) {
    try {
      new URL(link);
    } catch {
      return fail("O link informado não é válido.");
    }
  }

  const areas = d.getAll("areas").map(String).filter((a) => oneOf(a, AREAS));
  if (!areas.length) return fail("Escolha ao menos uma área de atuação.");
  const regimes = d.getAll("regimes").map(String).filter((r) => oneOf(r, REGIMES));
  if (!regimes.length) return fail("Escolha ao menos um regime de contratação.");

  const formacao = text(d, "formacao", 80);
  const anosExperiencia = text(d, "anosExperiencia", 80);
  const disponibilidade = text(d, "disponibilidade", 80);
  const faixaSalarial = text(d, "faixaSalarial", 80);
  const equipe = text(d, "equipe", 120);
  if (!oneOf(formacao, FORMACOES)) return fail("Escolha a sua formação.");
  if (!oneOf(anosExperiencia, EXPERIENCIAS_ANOS)) return fail("Informe o tempo de experiência.");
  if (!oneOf(disponibilidade, DISPONIBILIDADES)) return fail("Informe a disponibilidade para início.");
  if (!oneOf(faixaSalarial, FAIXAS)) return fail("Escolha a faixa salarial.");
  if (!oneOf(equipe, EQUIPE)) return fail("Conte como você lida com trabalho em equipe.");

  const viajaRaw = text(d, "viaja", 3);
  if (viajaRaw !== "Sim" && viajaRaw !== "Não") return fail("Informe se pode viajar.");
  const viaja = viajaRaw === "Sim";
  const viajaAte = text(d, "viajaAte", 80);
  if (viaja && !oneOf(viajaAte, VIAGEM_ALCANCE)) return fail("Informe até onde pode viajar.");

  const experiencias: Experiencia[] = [1, 2, 3]
    .map((n) => ({
      empresa: text(d, `exp${n}_empresa`, 120),
      cargo: text(d, `exp${n}_cargo`, 120),
      periodo: text(d, `exp${n}_periodo`, 60),
      atividades: text(d, `exp${n}_atividades`, 1200),
    }))
    .filter((e) => e.empresa || e.cargo || e.atividades);
  const first = experiencias[0];
  if (!first || !first.empresa || !first.cargo || !first.atividades) return fail("Preencha ao menos a sua experiência mais recente.");

  if (text(d, "consentimento", 5) !== "sim") return fail("É preciso autorizar o uso dos dados para continuar.");

  const file = d.get("cv");
  if (!(file instanceof File) || file.size === 0) return fail("Anexe o seu currículo.");
  if (file.size > CV_MAX_BYTES) return fail(`O currículo passa de ${CV_MAX_BYTES / 1024 / 1024} MB. Comprima o arquivo e tente de novo.`);
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) return fail("Envie o currículo em PDF, DOC ou DOCX.");

  const payload = {
    nome,
    email,
    telefone,
    cidade,
    uf,
    link,
    areas,
    areaOutra: text(d, "areaOutra", 120),
    formacao,
    anosExperiencia,
    regimes,
    disponibilidade,
    viaja,
    viajaAte: viaja ? viajaAte : "",
    equipe,
    equipeNota: text(d, "equipeNota", 800),
    faixaSalarial,
    experiencias,
    cv: {
      nome: (file.name || `curriculo.${kind.ext}`).replace(/[^\w.\- À-ÿ]/g, "_").slice(0, 120),
      tipo: kind.tipo,
      base64: buf.toString("base64"),
    },
  };

  // Entrega ao CRM do estúdio (restaura-app), que guarda o cadastro e o currículo.
  // A URL vem de CRM_LEADS_URL (…/api/leads) → …/api/talentos.
  const leadsUrl = process.env.CRM_LEADS_URL;
  const crmKey = process.env.LEADS_API_KEY;
  if (leadsUrl && crmKey) {
    try {
      const res = await fetch(leadsUrl.replace(/\/leads\/?$/, "/talentos"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${crmKey}` },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`CRM respondeu ${res.status}`);
    } catch (err) {
      console.error("[talentos] falha ao enviar ao CRM", err, { nome, email });
      return NextResponse.json(
        { error: "Não conseguimos registrar seu cadastro agora. Tente novamente em instantes ou escreva para contato@estudiorestaura.com.br." },
        { status: 502 },
      );
    }
  } else {
    console.info("[talentos] CRM não configurado; cadastro apenas registrado", { nome, email, areas, cvBytes: buf.length });
  }

  record(ip);
  return NextResponse.json({ ok: true });
}
