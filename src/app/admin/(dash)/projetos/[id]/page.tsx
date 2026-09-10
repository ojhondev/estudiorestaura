import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteProject, saveProject } from "../../../actions";
import { Area, Field, GalleryField, ImageField, Select, Toggle } from "../../../ui";
import { getProjectRow } from "../../../data";

const CATEGORIES = ["Arquitetura", "Conservação", "Restauro", "Interiores"];

export default async function ProjetoEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "novo";
  const row = isNew ? null : await getProjectRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projetos" className="text-[13px] text-smoke">
        ← Projetos
      </Link>
      <h1 className="mt-2 text-[24px] font-light tracking-tight">
        {isNew ? "Novo projeto" : row!.title}
      </h1>

      <form action={saveProject} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={row?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" name="title" defaultValue={row?.title} required />
          <Field
            label="Slug (URL)"
            name="slug"
            defaultValue={row?.slug}
            hint="Deixe em branco para gerar do título."
          />
          <Select
            label="Categoria"
            name="category"
            options={CATEGORIES}
            defaultValue={row?.category ?? "Restauro"}
          />
          <Field label="Local" name="location" defaultValue={row?.location} />
          <Field label="Ano" name="year" defaultValue={row?.year} />
          <Field label="Área" name="area" defaultValue={row?.area} />
        </div>

        <Area
          label="Resumo"
          name="summary"
          rows={2}
          defaultValue={row?.summary}
          hint="Frase de abertura da página do projeto."
        />
        <Area
          label="Descrição"
          name="body"
          rows={8}
          defaultValue={row?.body}
          hint="Separe os parágrafos com uma linha em branco."
        />

        <ImageField
          label="Imagem de capa"
          name="coverUrl"
          defaultValue={row?.coverUrl ?? ""}
        />

        <GalleryField
          label="Galeria do projeto"
          name="gallery"
          defaultValue={(row?.gallery ?? []).join("\n")}
          hint="Passe o mouse sobre uma imagem para reordenar ou remover."
        />

        <div className="flex flex-wrap items-center gap-6">
          <Toggle
            label="Publicado"
            name="published"
            defaultChecked={row?.published ?? true}
          />
          <Toggle
            label="Destaque na home"
            name="featured"
            defaultChecked={row?.featured ?? false}
          />
          <Field label="Ordem" name="sort" type="number" defaultValue={row?.sort ?? 0} />
        </div>

        <div className="flex items-center gap-3 border-t border-mist pt-5">
          <button className="rounded-[80px] bg-char px-5 py-2.5 text-[13px] font-medium text-paper">
            Salvar
          </button>
          <Link
            href="/admin/projetos"
            className="text-[13px] text-smoke hover:text-ink"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {!isNew && (
        <form
          action={deleteProject}
          className="mt-8 border-t border-mist pt-5"
        >
          <input type="hidden" name="id" value={row!.id} />
          <button className="text-[12px] text-coral hover:underline">
            Excluir projeto
          </button>
        </form>
      )}
    </div>
  );
}
