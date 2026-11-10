/**
 * Cadastra/atualiza os projetos do Estúdio (texto baseado nos relatórios técnicos
 * e nas respostas à imprensa de cada obra). Entram como RASCUNHO (published=false):
 * revise em /admin/projetos e publique. Reexecutável (upsert por slug).
 * Uso: npm run db:projetos [-- --publish]
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/db/schema";

const url = (process.env.DATABASE_URL || "").replace(/^"|"$/g, "");
if (!url) {
  console.error("DATABASE_URL ausente.");
  process.exit(1);
}
const db = drizzle(neon(url), { schema });
const publish = process.argv.includes("--publish");

type P = {
  slug: string;
  title: string;
  category: string;
  state: string;
  city: string;
  location: string;
  year: string;
  area?: string;
  summary: string;
  body: string[];
  gallery: number; // quantidade de fotos-NN
  ba: string[]; // legendas dos pares antes/depois
  /** blocos temáticos; imagens em <pasta do projeto>/<arquivo> (ex.: lum-01.jpg) */
  sections?: { title: string; body: string[]; images: [file: string, caption: string][] }[];
  sort: number;
  featured?: boolean;
};

const base = (slug: string) => `/fotos/projetos/${slug}`;

const projetos: P[] = [
  {
    slug: "sesc-santo-andre-mural-sacilotto",
    title: "Mural de Luiz Sacilotto — SESC Santo André",
    category: "Restauro",
    state: "SP",
    city: "Santo André",
    location: "Santo André · SP",
    year: "2025",
    area: "≈ 92 m²",
    summary:
      "Restauro aberto do painel mural “Sem Título”, de Luiz Sacilotto (2003): cerca de 92 m² nas quatro faces da caixa do elevador do SESC Santo André.",
    body: [
      "O painel foi concebido e executado em 2003, especialmente para o SESC Santo André, em diálogo direto com a arquitetura do edifício. Com cerca de 7,5 m de largura por 10 m de altura, é um dos maiores murais da carreira de Luiz Sacilotto (1924–2003), referência da arte concreta brasileira. Suas composições geométricas e o cromatismo vibrante criam efeitos ópticos de movimento e volume sobre uma superfície plana.",
      "O mapeamento de danos identificou sujidade impregnada, desprendimento da camada pictórica, fissuras, perdas localizadas, escorrimentos e manchas. A obra já havia sido repintada em intervenção anterior — parte da sua historicidade, mantida e tratada com reintegrações pontuais e correções cromáticas. Os danos não comprometiam a estabilidade estrutural.",
      "O trabalho começou em 17 de junho de 2025, em formato de “canteiro aberto”: o público acompanhou o restauro de perto, com educação patrimonial em tempo real. As etapas foram levantamento de danos, testes progressivos de limpeza, limpeza mecânica a seco e química controlada, consolidação e nivelamento de fissuras e perdas, reintegração cromática pontual nas porções superiores e velaturas nas inferiores.",
      "Os maiores desafios foram o acesso (92 m² a 10 m de altura, com uma face sobre a passarela que exigiu estrutura adicional) e a própria natureza da obra: cores chapadas em superfície lisa, onde qualquer alteração aparece de imediato. As primeiras reintegrações escureciam em poucos minutos, o que levou a uma bateria de testes de pigmentos, diluentes e técnicas até chegar a um resultado estável.",
      "Equipe: Paula Albuquerque, Diego Gonçalves e Silvana Borges. Relatório técnico entregue em dezembro de 2025.",
    ],
    gallery: 10,
    ba: [
      "Base do painel: perda da argamassa antes e depois do nivelamento e da reintegração cromática.",
      "Remate superior: o trecho perdido e a recomposição da superfície.",
    ],
    sort: 1,
    featured: true,
  },
  {
    slug: "botucatu-painel-mural-sagrado-coracao",
    title: "Painel mural do presbitério — Paróquia Sagrado Coração de Jesus",
    category: "Restauro",
    state: "SP",
    city: "Botucatu",
    location: "Botucatu · SP",
    year: "2026",
    summary:
      "Restauro do grande painel mural pintado por Henrique Bicalho Oswald em 1953, com consolidação integral da película, recuperação de douração original e recomposição das figuras inferiores.",
    body: [
      "O projeto nasceu da preocupação da comunidade e do pároco, Padre Athila José Tintino, com o estado do painel do presbitério, pintado em 1953 por Henrique Bicalho Oswald (1918–1965). Ao longo de mais de setenta anos, a obra sofreu degradação intensa e intervenções que alteraram suas características originais.",
      "O estado era crítico. A infiltração deixou manchas brancas de escorrimento e provocou craquelamento e desprendimento da pintura. Somou-se a isso a técnica: a tinta a óleo muito diluída em solvente perde coesão e se solta em escamas ao menor toque. Na faixa inferior foram identificadas ao menos quatro intervenções inadequadas — repintura integral em vermelho, nova camada em verde, remoção sem critério técnico e uma tentativa de recomposição das figuras sem conhecimento de restauro.",
      "Como a pintura caía em escamas, a limpeza não podia ser a primeira etapa. O painel recebeu faceamento integral com papel neutro e solução consolidante, em aplicações sucessivas, até a camada pictórica voltar a aderir à parede. Só então vieram a limpeza a seco e química, o tratamento dos escorrimentos, o nivelamento de fissuras e lacunas e a reintegração das cores com têmpera guache e lápis aquarelável, materiais compatíveis com o original.",
      "A limpeza revelou vestígios de douração original em diversos elementos decorativos, e esses acabamentos foram recuperados. As figuras de sacerdotes da faixa inferior foram recompostas a partir de fotografias históricas guardadas pela própria comunidade, com respeito à linguagem do artista e aos princípios contemporâneos da conservação. Restaurar não é deixar novo: é resgatar a unidade de leitura mantendo as marcas do tempo.",
      "O restauro durou cerca de dois meses. A entrega, em 19 de junho de 2026, coincidiu com os 72 anos da dedicação da igreja — sem planejamento prévio — e emocionou fiéis que reencontraram a obra, inclusive pessoas que presenciaram a entrega original pelo próprio artista.",
      "Equipe: Paula Albuquerque, Diego Gonçalves, Silvana Borges, Gabriela de Resende Ferreira e Leticia de Carvalho Santos.",
    ],
    gallery: 8,
    ba: [
      "O presbitério antes e depois do restauro do painel mural.",
      "Figura de sacerdote na faixa inferior, recomposta a partir de fotografias históricas.",
      "Detalhe da figura coroada, antes e depois da limpeza e da reintegração.",
      "Rosto de um dos anjos: consolidação, limpeza e reintegração cromática.",
      "A figura central de Jesus, antes e depois.",
      "Detalhe da mão: pintura a óleo diluída, craquelada e já consolidada.",
    ],
    sort: 2,
    featured: true,
  },
  {
    slug: "slg-mural-claudio-pastro-sao-paulo",
    title: "Mural de Claudio Pastro — Paróquia São Luiz Gonzaga",
    category: "Restauro",
    state: "SP",
    city: "São Paulo",
    location: "São Paulo · SP",
    year: "2025",
    summary:
      "Restauro do painel mural da abside, de Claudio Pastro com Marcio Motta (2003): consolidação dos desprendimentos que ameaçavam o Cordeiro Místico.",
    body: [
      "O painel mural da abside da Paróquia São Luiz Gonzaga, na Vila Pereira Barreto, foi criado em 2003 por Claudio Pastro (1948–2016) — um dos mais importantes artistas sacros brasileiros contemporâneos — em colaboração com Marcio Motta, que o executou. Na porção superior, a cerca de 7 metros de altura, destaca-se o Cordeiro Místico; abaixo da faixa da videira, o Pantocrator e as tamareiras.",
      "A iniciativa partiu do pároco, Cônego José Renato Ferreira, ao perceber o avanço da degradação da porção superior do painel, muito visível para os fiéis. O mural apresentava severos desprendimentos e craquelamentos decorrentes de infiltrações antigas, com camadas já endurecidas e danificadas.",
      "O desafio técnico foi fixar amplos trechos de pintura soltos, inclusive na imagem do Cordeiro. O processo seguiu, por ordem: limpeza mecânica e química; hidratação e faceamento dos fragmentos em desprendimento com CMC e papel japonês; consolidação da superfície, com adesão da película pictórica; planificação da película com calor sobre adesivo termoplástico; nivelamento das lacunas com massa de preenchimento; consolidação fina e reintegração cromática pontual da figura temática, com velaturas no fundo liso. Tudo com mínima intervenção, preservando a autenticidade e o simbolismo da obra.",
      "A comunidade acompanhou o trabalho com carinho. O pároco registrou os procedimentos diariamente e incentivou a divulgação pela Pastoral da Comunicação. O mural restaurado foi entregue em agosto de 2025.",
      "Equipe: Paula Albuquerque, Diego Gonçalves e Silvana Borges.",
    ],
    gallery: 8,
    ba: [
      "Vista geral da abside: antes e depois do restauro.",
      "O Cordeiro Místico, com desprendimentos e fissuras, e o resultado final.",
    ],
    sort: 3,
    featured: true,
  },
  {
    slug: "inconfidentes-sao-geraldo-magela",
    title: "Imagem de São Geraldo Magela — Inconfidentes",
    category: "Restauro",
    state: "MG",
    city: "Inconfidentes",
    location: "Inconfidentes · MG",
    year: "2026",
    summary:
      "Conservação e restauro da imagem sacra de São Geraldo Magela, em gesso policromado: remoção das camadas de repintura e recuperação da policromia original.",
    body: [
      "A imagem de São Geraldo Magela (1726–1755), padroeiro das mães, gestantes e famílias, pertence ao acervo da paróquia que leva o seu nome, em Inconfidentes (MG), e é protegida como patrimônio histórico municipal. Confeccionada em gesso policromado, tem grande importância histórica, artística e devocional.",
      "O estado geral era bom, sem comprometimento do suporte. Os danos principais eram a sujidade impregnada, pequenas perdas e deformações pontuais. Duas alterações pesavam sobre a leitura da peça: as sucessivas camadas de repintura, que descaracterizavam a composição original — especialmente no rosto —, e a base, que não era a original e concentrava fissuras causadas pelo uso da imagem em procissões.",
      "O trabalho foi feito em ateliê, em Maria da Fé (MG), seguindo os princípios da mínima intervenção, compatibilidade de materiais e reversibilidade: documentação e mapeamento de danos, testes progressivos de limpeza, prospecções estratigráficas, limpeza (a seco, aquosa e química), decapagem gradual das repinturas, consolidação, nivelamento, enxertos e recomposições na base, reintegração cromática e proteção final.",
      "O relatório traz também recomendações de conservação preventiva: limpeza apenas superficial com pincel macio ou pano seco, inspeções técnicas a cada três a cinco anos, proteção contra luz solar direta e umidade e, sobretudo, evitar o uso da imagem em procissões. Contratante: Prefeitura Municipal de Inconfidentes. Equipe: Paula Albuquerque e Diego Gonçalves.",
    ],
    gallery: 7,
    ba: [],
    sort: 4,
  },
  {
    slug: "sertaozinho-prospeccao-nossa-senhora-aparecida",
    title: "Prospecções estratigráficas — Paróquia Nossa Senhora Aparecida",
    category: "Diagnóstico",
    state: "SP",
    city: "Sertãozinho",
    location: "Sertãozinho · SP",
    year: "2025",
    summary:
      "Sondagens em paredes, teto, colunas e ornamentos revelaram que a igreja tinha uma ambientação cromática original bem mais intensa que a atual.",
    body: [
      "A Paróquia Nossa Senhora Aparecida, da Arquidiocese de Ribeirão Preto, tem organização característica das igrejas católicas de influência eclética: planta longitudinal, composição simétrica, nave central ampla, corredores laterais, presbitério elevado e coro sobre a entrada. Colunas com capitéis ornamentados sustentam arcos plenos que conduzem o olhar ao altar.",
      "O estudo, concluído em janeiro de 2026, fez sondagens pontuais em áreas estratégicas — paredes, teto, colunas e elementos decorativos — com registro fotográfico de todas as etapas e descrição das camadas de acabamento encontradas, para subsidiar o diagnóstico e um futuro projeto de decoração.",
      "Os resultados mostram múltiplas camadas de pintura. Nos ornamentos (medalhões, molduras, cimalhas e capitéis), a cor original é um laranja claro; nas superfícies lisas (arcos, paredes e tetos das naves) predominam tons de azul. No altar de Nossa Senhora das Graças foi encontrada decoração original em laranja escuro e marrom avermelhado.",
      "A conclusão é que o conjunto foi concebido com uma ambientação cromática mais intensa e variada do que a visível hoje: o tom neutro atual corresponde apenas à última manutenção. O relatório recomenda remover as sobrepinturas e elaborar um projeto de pintura e decoração que siga a estética inicial do espaço.",
    ],
    gallery: 8,
    ba: [],
    sort: 5,
  },
  {
    slug: "sao-paulo-prospeccao-nossa-senhora-das-angustias",
    title: "Prospecções estratigráficas — Capela do Santíssimo, N. Sra. das Angústias",
    category: "Diagnóstico",
    state: "SP",
    city: "São Paulo",
    location: "São Paulo · SP",
    year: "2025",
    summary:
      "Sondagens na Capela do Santíssimo identificaram a cor original (azul claro), três camadas de pintura e um barrado em escaiola, a técnica que imita mármore.",
    body: [
      "A Capela do Santíssimo da Paróquia Nossa Senhora das Angústias, na Barra Funda, tem planta retangular e organização simétrica, com barrado de imitação de mármore. A parede frontal abriga o sacrário, instalado em uma abertura que originalmente era uma janela, depois vedada.",
      "As prospecções estratigráficas buscaram identificar os tons originais e entender as camadas de acabamento aplicadas ao longo do tempo, para orientar um futuro projeto de conservação e restauro. Foram feitas sondagens em paredes e teto, em diferentes alturas, incluindo motivos decorativos e áreas de pintura lisa.",
      "O resultado: três camadas de pintura — a primeira é a cor original, em azul claro; as duas seguintes são manutenções ou sobrepinturas. Os motivos decorativos hoje visíveis têm execução amadora e não pertencem ao conjunto original. A exceção é o barrado inferior, que conserva uma escaiola: técnica que imita mármore e outras pedras por camadas de pigmento sobre argamassa lisa, polidas e protegidas por verniz.",
      "Equipe: Paula Albuquerque, Diego Gonçalves e Leticia de Carvalho Santos (auxiliar de restauro).",
    ],
    gallery: 7,
    ba: [],
    sort: 6,
  },
  {
    slug: "charqueada-laudo-casarao-antonio-furlan",
    title: "Laudo técnico — Casarão Antonio Furlan",
    category: "Diagnóstico",
    state: "SP",
    city: "Charqueada",
    location: "Charqueada · SP",
    year: "2023",
    summary:
      "Laudo de estado de conservação e identificação de danos do casarão do fundador de Charqueada, com parecer favorável à recuperação e ao restauro.",
    body: [
      "O Casarão Antonio Furlan, a “Casa do Fundador”, marca a paisagem e a memória de Charqueada. Foi moradia de Antonio Furlan, considerado o fundador da cidade, e esteve ocupado até meados da década de 1980. Imponente, tem dois pavimentos — porão alto e casa principal, com cinco dormitórios e escritório —, planta retangular simétrica e platibanda escalonada com vasos e volutas.",
      "Contratado pela Prefeitura Municipal, o laudo de setembro de 2023 analisou o porão, a casa principal, os trechos novos anexos e as fachadas, com mapeamento de danos e fichas de identificação. Os pontos mais graves foram a amarração metálica da estrutura, com deficiências substanciais, e a cobertura, sobretudo o escoamento das águas pluviais.",
      "O parecer técnico é positivo à recuperação e ao restauro do casarão, desde que as ações recomendadas sejam executadas por profissionais qualificados, com supervisão especializada em conservação e restauro arquitetônico. Equipe: Paula Albuquerque e Eduardo Santos.",
    ],
    gallery: 8,
    ba: [],
    sort: 7,
  },
  {
    slug: "sao-manuel-laudo-capela-casa-pia",
    title: "Laudo técnico — Capela da Casa Pia São Vicente de Paulo",
    category: "Diagnóstico",
    state: "SP",
    city: "São Manuel",
    location: "São Manuel · SP",
    year: "2026",
    summary:
      "Avaliação do entelhamento, do madeiramento, do forro de estuque e da pintura decorativa de uma capela inaugurada em 1906.",
    body: [
      "A Capela do Hospital da Casa Pia São Vicente de Paulo foi inaugurada em 19 de agosto de 1906 e incorporada, em 1931, ao novo edifício do hospital, mantendo a função religiosa. De características ecléticas, tem nave única, forro de estuque em abóbada de esquife sobre tela déployé, pintura decorativa em trompe-l’œil, em têmpera, com predominância de verdes, painéis parietais e presbitério em arco pleno com altar de mármore.",
      "Em visita técnica de 6 de julho de 2026, a equipe montou uma torre de andaime, inspecionou o telhado, removeu telhas pontuais para ver o madeiramento e o extradorso do forro e analisou o interior, com registro fotográfico e mapeamento preliminar dos danos.",
      "O entelhamento deixa passar luz e água: telhas deslocadas ou perdidas, falhas de vedação nos encontros com a platibanda, ausência de rufos e calhas corroídas e subdimensionadas, além de líquens. O madeiramento está em boas condições, com sujidade e focos pontuais de insetos xilófagos. No estuque há trincas, manchas de umidade e sinais de perda de aderência, que podem levar ao desprendimento de ornamentos.",
      "Contratante: Irmandade da Casa Pia São Vicente de Paulo. Equipe: Paula Albuquerque, Diego Gonçalves, Eduardo Santos e Francisco Sérgio Pimentel.",
    ],
    gallery: 6,
    ba: [],
    sort: 8,
  },
  {
    slug: "itajuba-projeto-luminotecnico-sao-jose-operario",
    title: "Projeto luminotécnico, de vitrais e de decoração — Igreja Matriz São José Operário",
    category: "Projeto",
    state: "MG",
    city: "Itajubá",
    location: "Itajubá · MG",
    year: "2024–2025",
    summary:
      "Três frentes de projeto para o interior da Igreja Matriz de São José Operário: nova iluminação, restauro dos vitrais e decoração com estamparias.",
    body: [
      "Na Igreja Matriz da Paróquia São José Operário, em Itajubá (MG), o Estúdio Restaura desenvolveu três frentes de projeto para o interior do templo: a iluminação, os vitrais e a decoração. O ponto de partida foi a visita técnica de janeiro de 2024, com registro fotográfico, conversa com o pároco e levantamento das necessidades do espaço.",
      "A igreja tem arcos ogivais que organizam a nave central, as naves laterais e o presbitério, forro de estuque e vitrais em tons de azul e roxo. É uma arquitetura que pede uma luz que desenhe os arcos e uma decoração que dialogue com os símbolos já presentes no templo.",
      "Os projetos de iluminação e de restauro dos vitrais foram submetidos ao Conselho de Bens Culturais da Arquidiocese de Pouso Alegre, que deferiu o pedido da nova iluminação em outubro de 2024 e o da restauração dos vitrais em fevereiro de 2025.",
    ],
    gallery: 6,
    ba: [],
    sections: [
      {
        title: "Projeto luminotécnico",
        body: [
          "A análise da iluminação existente mostrou luz geral suficiente em quantidade, mas feita de luminárias antigas e não originais: lâmpadas fluorescentes tubulares — várias queimadas —, pendentes e arandelas incorporados depois da concepção da igreja e refletores nos capitéis e nas capelas. O resultado era uma luz predominantemente fria, que não valorizava a arquitetura.",
          "O projeto foi desenvolvido em estudo preliminar, com três propostas simuladas em modelo 3D às 12h e às 19h, e seguiu para projeto executivo, memorial descritivo, quantitativo de luminárias e relatório final. A proposta prevê:",
          "- **Luz geral difusa** por luminárias circulares do tipo high bay LED no encontro dos arcos, no forro de estuque, com temperatura de cor neutra (4000K) e novos pontos de luz no presbitério;\n- **Luz quente de destaque** (2700/3000K) sobre as imagens sacras das capelas laterais e do altar-mor, com perfil LED flexível no arco que faz frente ao altar;\n- **Fita de LED nos capitéis**, que contorna cada peça, e novos pontos nas pilastras das naves laterais, formando dois corredores de luz;\n- **Painéis e perfis de LED de sobrepor** (4000K) no nártex, de pé-direito mais baixo;\n- **Uso da infraestrutura elétrica existente**, sem grandes modificações.",
        ],
        images: [
          ["lum-01.jpg", "Estudo preliminar: a nave com a nova luz desenhando os arcos."],
          ["lum-02.jpg", "Proposta do projeto executivo: luz geral homogênea e destaque quente no altar-mor."],
          ["lum-03.jpg", "Simulação às 12h: luz natural e artificial combinadas."],
          ["lum-04.jpg", "A mesma proposta às 19h, com a iluminação artificial conduzindo a leitura da arquitetura."],
          ["lum-05.jpg", "Capela lateral: luz quente de destaque sobre as imagens sacras."],
          ["lum-06.jpg", "Detalhe da luminária de embutir, integrada ao forro."],
        ],
      },
      {
        title: "Restauro dos vitrais",
        body: [
          "O caderno de esquadrias — doze pranchas — cobre os vitrais das naves laterais, do nártex e do coro alto. Em azul e roxo predominantes, eles filtram a luz do sol e dão serenidade ao espaço.",
          "O diagnóstico encontrou, nas naves laterais e no coro alto, muitas peças trocadas em intervenções anteriores sem cuidado com as cores e a divisão geométrica originais, além da falta de uma peça no vitral central do coro. Já os vitrais circulares, os das portas laterais e os do nártex estão em bom estado e pedem apenas higienização.",
          "O projeto define os procedimentos: testes progressivos de limpeza, prospecção estratigráfica nas esquadrias de madeira pintadas para recuperar a primeira camada de tinta, catalogação das peças removidas, réplicas e reintegração por mão de obra especializada, e um plano de manutenção com inspeções quinzenais, mensais e semestrais, conforme a dificuldade de acesso a cada vitral.",
        ],
        images: [
          ["vit-01.jpg", "Caderno de esquadrias: planta e vistas das naves, do nártex e do coro alto."],
          ["vit-02.jpg", "Vitral das naves laterais, com a tipologia das cores-padrão dos vidros."],
          ["vit-03.jpg", "Vitrais circular e arqueado, acima das portas de acesso lateral."],
          ["vit-04.jpg", "Os três vitrais do coro alto."],
        ],
      },
      {
        title: "Projeto de decoração",
        body: [
          "O estudo preliminar de decoração propõe estamparias inspiradas nos símbolos já presentes na igreja, ambiente por ambiente: fundo do altar-mor, paredes e teto do presbitério, parede frontal do presbitério, tetos e paredes das naves central e laterais, capela lateral, coro e nártex.",
          "As estampas e as cores foram organizadas em um moodboard, com cada estamparia, a sua aplicação em cada superfície e uma paleta de cores de referência. A apresentação ao pároco mostra cada ambiente com a sua proposta, e as aplicações foram testadas em modelo, com e sem a iluminação do projeto luminotécnico — luz e cor foram pensadas juntas.",
        ],
        images: [
          ["dec-01.jpg", "Fundo do altar-mor."],
          ["dec-02.jpg", "Paredes do presbitério."],
          ["dec-03.jpg", "Teto do presbitério."],
          ["dec-04.jpg", "Teto da nave central."],
          ["dec-05.jpg", "Parede da nave lateral."],
          ["dec-06.jpg", "Capela lateral."],
          ["dec-07.jpg", "Paredes do coro e do nártex."],
          ["dec-08.jpg", "Moodboard do presbitério: estamparias, aplicação e paleta de cores."],
          ["dec-09.jpg", "Moodboard da nave central."],
        ],
      },
    ],
    sort: 10,
  },
];

async function main() {
  // --only=slug1,slug2 grava só esses (não sobrescreve edições feitas no CRM nos demais)
  const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
  for (const p of projetos.filter((x) => !only.length || only.includes(x.slug))) {
    const b = base(p.slug);
    const data = {
      slug: p.slug,
      title: p.title,
      category: p.category,
      state: p.state,
      city: p.city,
      location: p.location,
      year: p.year,
      area: p.area ?? "",
      summary: p.summary,
      body: p.body.join("\n\n"),
      coverUrl: `${b}/capa.jpg`,
      gallery: Array.from({ length: p.gallery }, (_, i) => `${b}/foto-${String(i + 1).padStart(2, "0")}.jpg`),
      beforeAfter: p.ba.map((caption, i) => ({
        before: `${b}/antes-${i + 1}.jpg`,
        after: `${b}/depois-${i + 1}.jpg`,
        caption,
      })),
      sections: (p.sections ?? []).map((s) => ({
        title: s.title,
        body: s.body.join("\n\n"),
        images: s.images.map(([file, caption]) => ({ src: `${b}/${file}`, caption })),
      })),
      featured: Boolean(p.featured),
      sort: p.sort,
      updatedAt: new Date(),
    };
    const ex = await db.select({ id: schema.projects.id }).from(schema.projects).where(eq(schema.projects.slug, p.slug)).limit(1);
    // quem já está publicado continua publicado; só `--publish` publica os rascunhos
    if (ex.length) {
      const cur = await db.select({ published: schema.projects.published }).from(schema.projects).where(eq(schema.projects.id, ex[0].id));
      await db.update(schema.projects).set({ ...data, published: publish || cur[0].published }).where(eq(schema.projects.id, ex[0].id));
    } else await db.insert(schema.projects).values({ ...data, published: publish });
    console.log(`✓ ${p.slug}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
