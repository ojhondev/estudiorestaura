import { saveSetting } from "../../actions";
import { Area, Field, Uploader } from "../../ui";
import { getSetting } from "@/lib/cms";

type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "area";
  upload?: boolean;
  hint?: string;
};

const GROUPS: { key: string; title: string; desc: string; fields: FieldDef[] }[] =
  [
    {
      key: "home.hero",
      title: "Início — abertura",
      desc: "Texto e imagem da primeira dobra da home.",
      fields: [
        { name: "intro", label: "Texto de introdução", type: "area" },
        { name: "imageUrl", label: "Imagem de fundo (URL)", upload: true },
      ],
    },
    {
      key: "home.statement",
      title: "Início — manifesto",
      desc: "Parágrafo grande logo abaixo da abertura.",
      fields: [{ name: "text", label: "Texto", type: "area" }],
    },
    {
      key: "home.mediaBand",
      title: "Início — faixa de vídeo",
      desc: "Vídeo em reprodução automática e a chamada exibida ao passar o mouse.",
      fields: [
        { name: "videoUrl", label: "Vídeo (URL .mp4)", upload: true },
        { name: "posterUrl", label: "Imagem de pôster (URL)", upload: true },
        { name: "title", label: "Título do hover" },
        { name: "caption", label: "Chamada do hover", type: "area" },
      ],
    },
    {
      key: "careers.intro",
      title: "Trabalhe conosco — introdução",
      desc: "Texto de abertura da página de vagas.",
      fields: [{ name: "text", label: "Texto", type: "area" }],
    },
  ];

export default async function ConteudoAdmin({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  const values = await Promise.all(GROUPS.map((g) => getSetting(g.key)));

  return (
    <div className="max-w-3xl">
      <h1 className="text-[24px] font-light tracking-tight">Conteúdo das seções</h1>
      <p className="mt-1 text-[14px] text-pewter">
        Edite os textos e as imagens fixas do site. Projetos, blog e vagas têm
        áreas próprias.
      </p>

      {ok && (
        <p className="mt-4 rounded-[8px] border border-pine/30 bg-pine/10 px-4 py-2.5 text-[13px] text-pine">
          Alterações salvas.
        </p>
      )}

      <div className="mt-7 space-y-6">
        {GROUPS.map((g, gi) => (
          <form
            key={g.key}
            action={saveSetting}
            className="rounded-[8px] border border-mist bg-paper p-5 md:p-6"
          >
            <input type="hidden" name="_key" value={g.key} />
            <h2 className="text-[15px] font-medium">{g.title}</h2>
            <p className="mt-0.5 text-[12px] text-smoke">{g.desc}</p>

            <div className="mt-4 space-y-4">
              {g.fields.map((f) => (
                <div key={f.name}>
                  {f.type === "area" ? (
                    <Area
                      label={f.label}
                      name={f.name}
                      rows={3}
                      defaultValue={values[gi][f.name] ?? ""}
                      hint={f.hint}
                    />
                  ) : (
                    <Field
                      label={f.label}
                      name={f.name}
                      defaultValue={values[gi][f.name] ?? ""}
                      hint={f.hint}
                    />
                  )}
                  {f.upload && (
                    <div className="mt-2">
                      <Uploader targetName={f.name} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="mt-5 rounded-[80px] bg-char px-5 py-2.5 text-[13px] font-medium text-paper">
              Salvar
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
