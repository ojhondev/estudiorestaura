import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteJob, saveJob } from "../../../actions";
import { Area, Field, Select, Toggle } from "../../../ui";
import { getJobRow } from "../../../data";

const TYPES = ["Efetivo", "Estágio", "PJ", "Freelance", "Temporário"];

export default async function VagaEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "nova" || id === "novo";
  const row = isNew ? null : await getJobRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/vagas" className="text-[13px] text-smoke">
        ← Vagas
      </Link>
      <h1 className="mt-2 text-[24px] font-light tracking-tight">
        {isNew ? "Nova vaga" : row!.title}
      </h1>

      <form action={saveJob} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={row?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" name="title" defaultValue={row?.title} required />
          <Field label="Slug (URL)" name="slug" defaultValue={row?.slug} />
          <Field label="Área" name="area" defaultValue={row?.area} />
          <Select
            label="Tipo"
            name="type"
            options={TYPES}
            defaultValue={row?.type ?? "Efetivo"}
          />
          <Field
            label="Local"
            name="location"
            defaultValue={row?.location ?? "São Paulo · SP"}
          />
          <Field label="Ordem" name="sort" type="number" defaultValue={row?.sort ?? 0} />
        </div>

        <Area
          label="Descrição"
          name="body"
          rows={7}
          defaultValue={row?.body}
          hint="Separe os parágrafos com uma linha em branco."
        />
        <Area
          label="Requisitos"
          name="requirements"
          rows={6}
          defaultValue={(row?.requirements ?? []).join("\n")}
          hint="Um requisito por linha."
        />

        <Toggle
          label="Vaga aberta (visível no site)"
          name="published"
          defaultChecked={row?.published ?? true}
        />

        <div className="flex items-center gap-3 border-t border-mist pt-5">
          <button className="rounded-[80px] bg-char px-5 py-2.5 text-[13px] font-medium text-paper">
            Salvar
          </button>
          <Link href="/admin/vagas" className="text-[13px] text-smoke hover:text-ink">
            Cancelar
          </Link>
        </div>
      </form>

      {!isNew && (
        <form action={deleteJob} className="mt-8 border-t border-mist pt-5">
          <input type="hidden" name="id" value={row!.id} />
          <button className="text-[12px] text-coral hover:underline">
            Excluir vaga
          </button>
        </form>
      )}
    </div>
  );
}
