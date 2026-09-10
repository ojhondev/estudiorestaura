import Link from "next/link";
import { notFound } from "next/navigation";
import { deletePost, savePost } from "../../../actions";
import { Area, Field, ImageField, Toggle } from "../../../ui";
import { getPostRow } from "../../../data";

export default async function BlogEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "novo";
  const row = isNew ? null : await getPostRow(Number(id));
  if (!isNew && !row) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/blog" className="text-[13px] text-smoke">
        ← Blog
      </Link>
      <h1 className="mt-2 text-[24px] font-light tracking-tight">
        {isNew ? "Novo artigo" : row!.title}
      </h1>

      <form action={savePost} className="mt-6 space-y-5">
        <input type="hidden" name="id" value={row?.id ?? ""} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" name="title" defaultValue={row?.title} required />
          <Field label="Slug (URL)" name="slug" defaultValue={row?.slug} />
          <Field
            label="Categoria / tag"
            name="tag"
            defaultValue={row?.tag ?? "Editorial"}
          />
        </div>

        <Area
          label="Resumo"
          name="excerpt"
          rows={2}
          defaultValue={row?.excerpt}
        />
        <Area
          label="Texto"
          name="body"
          rows={12}
          defaultValue={row?.body}
          hint="Separe os parágrafos com uma linha em branco."
        />

        <ImageField
          label="Imagem de capa"
          name="coverUrl"
          defaultValue={row?.coverUrl ?? ""}
        />

        <Toggle
          label="Publicado"
          name="published"
          defaultChecked={row?.published ?? false}
        />

        <div className="flex items-center gap-3 border-t border-mist pt-5">
          <button className="rounded-[80px] bg-char px-5 py-2.5 text-[13px] font-medium text-paper">
            Salvar
          </button>
          <Link href="/admin/blog" className="text-[13px] text-smoke hover:text-ink">
            Cancelar
          </Link>
        </div>
      </form>

      {!isNew && (
        <form action={deletePost} className="mt-8 border-t border-mist pt-5">
          <input type="hidden" name="id" value={row!.id} />
          <button className="text-[12px] text-coral hover:underline">
            Excluir artigo
          </button>
        </form>
      )}
    </div>
  );
}
