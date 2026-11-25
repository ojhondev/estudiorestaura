import { INSTAGRAM, WHATSAPP } from "@/lib/content";

export const SITE_URL = "https://estudiorestaura.com.br";
export const SITE_NAME = "Estúdio Restaura";

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

/** Organização (aparece em todas as páginas). Quando o endereço do estúdio for público, trocar por LocalBusiness + address. */
export const organizationLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs("/logo.png"),
  image: abs("/og.jpg"),
  description:
    "Escritório de arquitetura, conservação e restauro de patrimônio histórico e cultural: restauro de igrejas, pintura mural e arte sacra, laudos técnicos, prospecções estratigráficas e projetos de decoração e iluminação.",
  telephone: `+${WHATSAPP.digits}`,
  areaServed: { "@type": "Country", name: "Brasil" },
  knowsAbout: [
    "Restauro de igrejas",
    "Restauro de pintura mural",
    "Arte sacra",
    "Prospecção estratigráfica",
    "Laudo técnico de patrimônio histórico",
    "Conservação preventiva",
    "Projeto de iluminação de igrejas",
    "Patrimônio cultural",
  ],
  sameAs: [INSTAGRAM.url],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "pt-BR",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/** Trilha de navegação: [["Projetos", "/projetos"], ["Nome do projeto", "/projetos/x"]] (a home entra sozinha). */
export function breadcrumbLd(items: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Início", "/"], ...items].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

export function faqLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export { abs as absoluteUrl };
