import { saveSetting } from "../../actions";
import { ImageField } from "../../ui";
import { getSectionImages, sectionSlots } from "@/lib/cms";

export default async function SecoesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const current = await getSectionImages();

  const groups = [...new Set(sectionSlots.map((s) => s.group))];

  return (
    <div className="max-w-3xl">
      <h1 className="text-[24px] font-light tracking-tight">Imagens por seção</h1>
      <p className="mt-1 text-[14px] text-pewter">
        Troque a imagem de cada seção do site. Quando um slot fica vazio, o site
        usa a foto padrão. As imagens são comprimidas automaticamente no envio.
      </p>

      {ok && (
        <p className="mt-4 rounded-[8px] border border-pine/30 bg-pine/10 px-4 py-2.5 text-[13px] text-pine">
          Imagens salvas.
        </p>
      )}

      <form action={saveSetting} className="mt-7 space-y-8">
        <input type="hidden" name="_key" value="sections" />
        <input type="hidden" name="_return" value="/admin/secoes" />

        {groups.map((group) => (
          <section
            key={group}
            className="rounded-[8px] border border-mist bg-paper p-5 md:p-6"
          >
            <h2 className="text-[15px] font-medium">{group}</h2>
            <div className="mt-4 space-y-4">
              {sectionSlots
                .filter((s) => s.group === group)
                .map((s) => (
                  <ImageField
                    key={s.key}
                    label={s.label}
                    name={s.key}
                    defaultValue={current[s.key] ?? ""}
                  />
                ))}
            </div>
          </section>
        ))}

        <button className="sticky bottom-4 rounded-[80px] bg-char px-6 py-3 text-[13px] font-medium text-paper shadow-lg">
          Salvar imagens
        </button>
      </form>
    </div>
  );
}
