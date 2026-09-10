import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Estúdio Restaura coleta, usa e protege dados no site e nos contatos.",
};

const SECTIONS: [string, string][] = [
  [
    "Dados que coletamos",
    "Coletamos apenas os dados que você nos envia voluntariamente pelo formulário de contato ou por e-mail (nome, e-mail, telefone e a mensagem), e dados de navegação anônimos (páginas visitadas, tempo de permanência) por meio de cookies e ferramentas de análise.",
  ],
  [
    "Como usamos",
    "Usamos seus dados de contato exclusivamente para responder à sua solicitação e para o acompanhamento de um eventual projeto. Os dados de navegação são usados de forma agregada para melhorar o site. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.",
  ],
  [
    "Cookies",
    "O site usa cookies essenciais para funcionar e cookies de análise para medir audiência. Você pode recusar os cookies não essenciais nas configurações do seu navegador; isso não impede o uso do site.",
  ],
  [
    "Seus direitos (LGPD)",
    "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, além de revogar consentimentos. Basta escrever para contato@estudiorestaura.com.br.",
  ],
  [
    "Retenção",
    "Guardamos os dados de contato pelo tempo necessário ao atendimento e, quando houver contrato, pelo prazo legal aplicável. Depois disso, os dados são anonimizados ou eliminados.",
  ],
];

export default function PrivacidadePage() {
  return (
    <>
      <PageHero
        label="Transparência"
        title="Política de Privacidade"
        intro="Última atualização em setembro de 2026. Este texto explica, em linguagem simples, o que fazemos com os seus dados."
        imageLabel="Espaço para imagem"
      />

      <div className="shell grid gap-y-12 py-[clamp(4rem,9vw,7rem)] md:grid-cols-[0.4fr_1fr] md:gap-x-16">
        {SECTIONS.map(([title, body]) => (
          <div key={title} className="contents">
            <h2 data-reveal="fade" className="label md:pt-1">
              {title}
            </h2>
            <p data-reveal className="measure text-[16px] leading-relaxed text-pewter">
              {body}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
