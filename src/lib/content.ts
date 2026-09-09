export type Project = {
  slug: string;
  title: string;
  category:
    | "Arquitetura"
    | "Conservação"
    | "Restauro"
    | "Interiores";
  location: string;
  year: string;
  area: string;
  summary: string;
  description: string[];
  gallery: number;
};

export const projects: Project[] = [
  {
    slug: "resident-project-oma",
    title: "Resident Project · OMA",
    category: "Interiores",
    location: "Borough Market, Londres",
    year: "2024",
    area: "480 m²",
    summary:
      "Restauro e adaptação de um armazém vitoriano no coração do Borough Market para o novo restaurante do chef David Carter.",
    description: [
      "Aninhado no coração do vibrante Borough Market, em Londres, o OMA é a mais recente obra culinária do aclamado chef David Carter. O Estúdio Restaura foi responsável pela leitura histórica do edifício, pelo diagnóstico das patologias da alvenaria e pelo projeto de intervenção que devolveu legibilidade às camadas originais.",
      "A madeira de demolição da cobertura foi tratada e reaplicada; o reboco à base de cal foi refeito com a mesma granulometria do original; a iluminação linear foi projetada para pousar sobre as superfícies sem competir com elas.",
    ],
    gallery: 6,
  },
  {
    slug: "conjunto-vale-verde",
    title: "Conjunto Vale Verde",
    category: "Arquitetura",
    location: "Serra da Mantiqueira, SP",
    year: "2023",
    area: "2.140 m²",
    summary:
      "Plano de conservação preventiva e ampliação contemporânea de uma sede rural tombada, com estrutura independente em madeira.",
    description: [
      "O projeto parte de um laudo técnico detalhado que mapeou infiltrações, recalques e alterações descaracterizadoras acumuladas ao longo de seis décadas.",
      "A ampliação se apoia numa estrutura autônoma, reversível, que não toca as paredes históricas e emoldura a paisagem da serra.",
    ],
    gallery: 5,
  },
  {
    slug: "pavilhao-das-aguas",
    title: "Pavilhão das Águas",
    category: "Restauro",
    location: "Centro Histórico, Salvador",
    year: "2023",
    area: "760 m²",
    summary:
      "Restauro de bens integrados — forros pintados, cantaria e esquadrias — de um pavilhão do século XIX.",
    description: [
      "A intervenção priorizou a consolidação e a mínima reposição de matéria, com reintegração cromática identificável a olho nu segundo os critérios da carta de restauro.",
      "Todo o processo foi documentado em ficha por elemento, formando um arquivo de referência para a manutenção futura.",
    ],
    gallery: 6,
  },
  {
    slug: "casa-lamego",
    title: "Casa Lâmego",
    category: "Interiores",
    location: "Vila Madalena, São Paulo",
    year: "2022",
    area: "310 m²",
    summary:
      "Adaptação de um sobrado modernista para moradia contemporânea, preservando caixilhos, pastilhas e o pé-direito original.",
    description: [
      "A leitura do imóvel revelou uma sequência de reformas que haviam apagado a lógica de ventilação cruzada do projeto original.",
      "A intervenção reabriu vãos, recuperou a marcenaria embutida e introduziu instalações aparentes, deixando clara a distinção entre o antigo e o novo.",
    ],
    gallery: 4,
  },
  {
    slug: "galpao-luz",
    title: "Galpão Luz",
    category: "Arquitetura",
    location: "Bairro da Luz, São Paulo",
    year: "2021",
    area: "1.520 m²",
    summary:
      "Requalificação de um galpão ferroviário para uso cultural, com reforço estrutural discreto e cobertura translúcida.",
    description: [
      "O desafio central foi compatibilizar as exigências de acessibilidade e segurança contra incêndio com a integridade do conjunto tombado.",
      "A nova cobertura translúcida ilumina a nave sem expor o acervo à radiação direta.",
    ],
    gallery: 5,
  },
  {
    slug: "capela-do-morro",
    title: "Capela do Morro",
    category: "Conservação",
    location: "Ouro Preto, Minas Gerais",
    year: "2020",
    area: "240 m²",
    summary:
      "Plano de conservação preventiva e monitoramento ambiental de uma capela setecentista e seu retábulo dourado.",
    description: [
      "Foram instalados sensores de temperatura e umidade e definido um calendário de inspeções trimestrais.",
      "O retábulo passou por limpeza controlada e fixação de douramento, sem repintura.",
    ],
    gallery: 6,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export type Service = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
};

export const services: Service[] = [
  {
    number: "01",
    title: "Intervenção arquitetônica em patrimônio",
    description:
      "Projetos de restauro, consolidação e adaptação de uso para edificações de valor histórico, com respeito às cartas patrimoniais e à legibilidade das camadas do tempo.",
    bullets: [
      "Leitura histórica e prospecções",
      "Projeto executivo de restauro",
      "Compatibilização com acessibilidade e segurança",
    ],
  },
  {
    number: "02",
    title: "Conservação preventiva",
    description:
      "Planos que antecipam a deterioração: monitoramento ambiental, calendário de inspeções e protocolos de manutenção que reduzem a necessidade de grandes intervenções.",
    bullets: [
      "Monitoramento de temperatura e umidade",
      "Planos de manutenção por elemento",
      "Treinamento de equipes locais",
    ],
  },
  {
    number: "03",
    title: "Restauro de bens integrados",
    description:
      "Forros pintados, cantaria, esquadrias, retábulos e revestimentos: consolidação, limpeza controlada e reintegração cromática identificável.",
    bullets: [
      "Diagnóstico de patologias",
      "Consolidação e fixação",
      "Reintegração cromática reversível",
    ],
  },
  {
    number: "04",
    title: "Laudos e diagnósticos técnicos",
    description:
      "Documentos que embasam decisões: mapeamento de danos, ensaios de caracterização de materiais e recomendações priorizadas por urgência e custo.",
    bullets: [
      "Mapa de danos georreferenciado",
      "Caracterização de argamassas e tintas",
      "Matriz de prioridades de intervenção",
    ],
  },
  {
    number: "05",
    title: "Projetos de arquitetura",
    description:
      "Novas construções e ampliações contemporâneas que dialogam com preexistências, com estruturas reversíveis e materialidade honesta.",
    bullets: [
      "Estudo preliminar a executivo",
      "Estruturas autônomas e reversíveis",
      "Detalhamento de encontro novo/antigo",
    ],
  },
  {
    number: "06",
    title: "Consultoria e gestão de patrimônio",
    description:
      "Acompanhamento de obra, dossiês de tombamento, aprovação em órgãos de preservação e gestão de acervos edificados.",
    bullets: [
      "Aprovação em órgãos de preservação",
      "Dossiês e inventários",
      "Fiscalização e gestão de obra",
    ],
  },
];

export const nav = [
  { href: "/projetos", label: "Projetos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/sobre", label: "Sobre o Estúdio" },
  { href: "/contato", label: "Contato" },
];
