/**
 * Cadastra/atualiza os projetos do Estúdio a partir do documento NOTAS.docx (textos, ficha técnica,
 * equipe, capas e imagens). Reexecutável (upsert por slug); as imagens ficam em public/fotos/projetos/<slug>/.
 * Uso: npm run db:projetos [-- --publish] [-- --only=slug1,slug2]
 *
 * Convenções de arquivo: capa.jpg · foto-NN.jpg / cc-NN.jpg (galeria) · antes-N.jpg + depois-N.jpg (pares)
 * · arquivos de seção citados abaixo (lum-01.jpg, vit-01.jpg, dec-01.jpg, hoje-01.jpg…).
 */
import fs from "node:fs";
import path from "node:path";
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

const D = "Diego Gonçalves de Souza — Mestre de Ofício";
const PA = "Paula Franco Albuquerque — Arquiteta-Restauradora";
const E = "Eduardo Henrique dos Santos — Mestre de Ofício";
const L = "Leticia de Carvalho Santos — Arquiteta";
const S = "Silvana Borges da Silva — Arquiteta-Restauradora";
const G = "Gabriela de Resende Ferreira — Restauradora";
const R = "Romolo Picoli Ronchetti — Artista Sacro";
const C = "Cláudia Aparecida Rangel — Conservadora-Restauradora";
const F = "Francisco Sergio Pimentel — Conservador-Restaurador";

type Section = { title: string; body?: string[]; images: [file: string, caption: string][] };
type P = {
  slug: string;
  title: string;
  client: string;
  category: string;
  state: string;
  city: string;
  year: string;
  summary: string;
  body: string[];
  team: string[];
  /** prefixos dos arquivos da galeria, na ordem em que aparecem (ex.: ["cc", "foto"]) */
  gallery: string[];
  /** legendas dos pares antes/depois (antes-N.jpg + depois-N.jpg) */
  ba?: string[];
  sections?: Section[];
  status?: string;
  credit?: string;
  featured?: boolean;
};

const projetos: P[] = [
  {
    slug: "jatai-conjunto-mural-claudio-pastro-catedral",
    credit: "Daniel Cortes Beretta; e acervo Estúdio Restaura",
    title: "Restauro do Conjunto Mural de Claudio Pastro",
    client: "Catedral Divino Espírito Santo",
    category: "Restauro · Diagnóstico · Execução",
    state: "GO",
    city: "Jataí",
    year: "2026",
    summary:
      "Conservação e restauro do conjunto mural de Claudio Pastro (1988), três grandes painéis no presbitério da Catedral Divino Espírito Santo, em Jataí (GO).",
    body: [
      "Em 2026, o Estúdio Restaura realizou a conservação e o restauro do conjunto mural de autoria de Claudio Pastro, executado em 1988 no presbitério da Catedral Divino Espírito Santo, em Jataí/GO. A obra é composta por três grandes painéis, representando os Arcanjos, o Cristo Pantocrator e Pentecostes, e os Querubins. O trabalho contemplou o levantamento do estado de conservação, ensaios e procedimentos de limpeza, remoção criteriosa de intervenções anteriores inadequadas, consolidação da camada pictórica, preenchimento e nivelamento de fissuras e lacunas, reintegração cromática pontual, recomposição das áreas douradas e aplicação de velaturas para harmonização das superfícies. Fundamentada nos princípios da mínima intervenção, compatibilidade e reversibilidade dos materiais, a intervenção buscou recuperar a estabilidade material e a unidade estética do conjunto, preservando as particularidades da técnica pictórica e a autenticidade da obra, além de valorizar sua expressividade artística e simbólica no espaço litúrgico.",
    ],
    team: [D, PA, S, R],
    gallery: ["foto"],
    ba: [
      "Áreas douradas: antes e depois da recomposição.",
      "Fissuras e lacunas: antes e depois do nivelamento e da reintegração cromática.",
      "Base do painel: antes e depois do tratamento da superfície.",
      "Querubim: antes e depois da reintegração das lacunas.",
      "Querubim, vista geral: antes e depois da reintegração.",
    ],
    featured: true,
  },
  {
    slug: "sesc-santo-andre-mural-sacilotto",
    credit: "Cauê Colodro; e acervo Estúdio Restaura",
    title: "Restauro do Mural de Luiz Sacilotto",
    client: "SESC Santo André",
    category: "Restauro · Execução",
    state: "SP",
    city: "Santo André",
    year: "2025",
    summary:
      "Conservação e restauro do painel mural “Sem Título”, de Luiz Sacilotto (2003): cerca de 92 m² de superfície pictórica nas três faces da estrutura do elevador do Sesc Santo André.",
    body: [
      "Em 2025, o Estúdio Restaura realizou a conservação e o restauro do painel mural Sem Título, de Luiz Sacilotto, concebido e executado em 2003 para o Sesc Santo André/SP. Com aproximadamente 92 m² de superfície pictórica, a obra ocupa três faces da estrutura que abriga o elevador da unidade, estabelecendo uma relação direta entre arte e arquitetura. O trabalho contemplou o diagnóstico do estado de conservação, estudos das superfícies pictóricas, higienização, consolidação e reintegração cromática, respeitando as particularidades materiais e estéticas da obra, especialmente o rigor geométrico e as relações cromáticas que caracterizam a produção do artista. A intervenção buscou recuperar a integridade material e a unidade visual do conjunto, contribuindo para a preservação do legado de Luiz Sacilotto, um dos principais expoentes da arte concreta brasileira, e para a permanência de sua obra em um espaço de convivência e difusão cultural.",
    ],
    team: [D, PA, S, L],
    gallery: ["cc", "foto"],
    ba: [
      "Base do painel: perda da argamassa antes e depois do nivelamento e da reintegração cromática.",
      "Remate superior: o trecho perdido e a recomposição da superfície.",
    ],
    featured: true,
  },
  {
    slug: "botucatu-painel-mural-sagrado-coracao",
    credit: "Isabela Innocenti; e acervo Estúdio Restaura",
    title: "Restauro do Mural de Henrique B. Oswald",
    client: "Paróquia Sagrado Coração de Jesus",
    category: "Restauro · Diagnóstico · Execução",
    state: "SP",
    city: "Botucatu",
    year: "2026",
    summary:
      "Conservação e restauro do painel mural de Henrique B. Oswald (1953) no presbitério da Igreja Matriz Sagrado Coração de Jesus, em Botucatu (SP), concluído em junho de 2026.",
    body: [
      "Entre janeiro e junho de 2026, o Estúdio Restaura realizou a conservação e o restauro do painel mural de autoria de Henrique B. Oswald, executado em 1953 e localizado no Presbitério da Igreja Matriz Sagrado Coração de Jesus, em Botucatu/SP. De elevada complexidade técnica, o trabalho contemplou intervenções preliminares na cobertura e no forro de estuque, seguidas do tratamento da superfície pictórica, que apresentava fragilidade generalizada, desprendimentos, perdas e alterações decorrentes de intervenções anteriores. Os procedimentos abrangeram higienização, consolidação da camada pictórica, nivelamento de lacunas, reintegração cromática e douração de elementos específicos da composição. Destaca-se a releitura artística da porção inferior do painel, desenvolvida a partir de registros fotográficos históricos e fundamentada nos princípios da distinguibilidade e do respeito à autenticidade da obra. Concluído em junho de 2026, o restauro recuperou a integridade material e a leitura estética e simbólica do conjunto, contribuindo para a preservação de um importante testemunho da memória religiosa de Botucatu.",
    ],
    team: [D, PA, E, S, G, L],
    gallery: ["foto"],
    ba: [
      "O presbitério antes e depois do restauro do painel mural.",
      "Figura de sacerdote na faixa inferior, recomposta a partir de fotografias históricas.",
      "Detalhe da figura coroada, antes e depois da limpeza e da reintegração.",
      "Rosto de um dos anjos: consolidação, limpeza e reintegração cromática.",
      "A figura central de Jesus, antes e depois.",
      "Detalhe da mão: pintura a óleo diluída, craquelada e já consolidada.",
    ],
    featured: true,
  },
  {
    slug: "maria-da-fe-pinturas-nossa-senhora-de-lourdes",
    credit: "Giovana Souza; e acervo Estúdio Restaura",
    title: "Restauro das Pinturas Artísticas e Elementos Ornamentais da Igreja Matriz",
    client: "Paróquia Nossa Senhora de Lourdes",
    category: "Restauro · Execução",
    state: "MG",
    city: "Maria da Fé",
    year: "2024–2026",
    summary:
      "Conservação e restauro do conjunto pictórico de Pietro e Ulderico Gentilli (1940) na Igreja Matriz de Nossa Senhora de Lourdes, em Maria da Fé (MG).",
    body: [
      "O Estúdio Restaura realizou a conservação e o restauro das pinturas artísticas e dos elementos ornamentais da Igreja Matriz de Nossa Senhora de Lourdes, em Maria da Fé/MG, cuja construção teve início em 1928 e cujo conjunto pictórico foi executado por Pietro e Ulderico Gentilli, em 1940. De elevada complexidade técnica, o trabalho abrangeu pinturas parietais decorativas, painéis murais temáticos, imagens sacras, altares, púlpito, balaustradas e elementos ornamentais integrados à arquitetura. As intervenções contemplaram prospecções estratigráficas, higienização, consolidação da camada pictórica, remoção criteriosa de intervenções anteriores inadequadas, reintegração pictórica e reconstituição de elementos e motivos ornamentais, visando recuperar a integridade material e a leitura estética do conjunto. Iniciado em 2024 e concluído em outubro de 2026, o restauro contribuiu para a preservação de um importante testemunho da arte sacra e da história de Maria da Fé, reafirmando o valor artístico, cultural e religioso da edificação e sua representatividade na memória coletiva da comunidade.",
    ],
    team: [D, PA],
    gallery: ["foto"],
    ba: [
      "Capela do Santíssimo: antes e depois do restauro.",
      "Capela de Nossa Senhora do Rosário: antes e depois do restauro.",
      "Friso do forro: antes e depois da limpeza e da reintegração.",
      "Cúpula: antes e depois do restauro.",
      "Coluna: antes e depois da recomposição da marmorização.",
      "Coluna: antes e depois da reintegração.",
      "Degraus do altar: antes e depois.",
      "Anjo tocheiro: antes e depois do restauro.",
    ],
  },
  {
    slug: "slg-mural-claudio-pastro-sao-paulo",
    credit: "Taíse Cortês; e acervo Estúdio Restaura",
    title: "Restauro Pontual do Mural de Claudio Pastro e Marcio Motta",
    client: "Paróquia São Luiz Gonzaga",
    category: "Restauro · Execução",
    state: "SP",
    city: "São Paulo",
    year: "2025",
    summary:
      "Conservação e restauro da porção superior do painel mural de Claudio Pastro e Marcio Motta (2003), onde está representado o Cordeiro Místico, na Paróquia São Luiz Gonzaga.",
    body: [
      "Em 2025, o Estúdio Restaura realizou a conservação e o restauro do painel mural de autoria de Claudio Pastro, com colaboração de Marcio Motta, executado em 2003 na Paróquia São Luiz Gonzaga, em São Paulo/SP. A intervenção concentrou-se na porção superior da obra, onde está representado o Cordeiro Místico, cuja camada pictórica apresentava extensos desprendimentos, craquelamentos e perdas decorrentes de infiltrações anteriores. O trabalho exigiu um criterioso processo de fixação e consolidação das áreas comprometidas, seguido de nivelamento e reintegração cromática pontual, respeitando os princípios da mínima intervenção e da preservação da autenticidade material e estética da pintura. O restauro possibilitou recuperar a integridade visual e a leitura simbólica da composição, contribuindo para a preservação do legado artístico de Claudio Pastro e de sua importância para a comunidade paroquial.",
    ],
    team: [D, PA, S],
    gallery: ["foto"],
    ba: ["Vista geral da abside: antes e depois do restauro.", "O Cordeiro Místico, com desprendimentos e fissuras, e o resultado final."],
    featured: true,
  },
  {
    slug: "itajuba-projeto-luminotecnico-sao-jose-operario",
    credit: "Acervo Estúdio Restaura",
    title: "Projeto de Decoração, Iluminação e Restauro dos Vitrais da Igreja Matriz",
    client: "Paróquia São José Operário",
    category: "Projeto · Diagnóstico",
    state: "MG",
    city: "Itajubá",
    year: "2024–2025",
    summary:
      "Projetos de decoração interna, iluminação e restauro dos vitrais da Igreja Matriz da Paróquia São José Operário, em Itajubá (MG), concebidos de forma complementar.",
    body: [
      "O Estúdio Restaura desenvolveu os projetos de decoração interna, iluminação e conservação e restauro dos vitrais da Igreja Matriz da Paróquia São José Operário, em Itajubá/MG. O trabalho reuniu estudos técnicos e estéticos, análise das características arquitetônicas existentes, desenvolvimento de composições ornamentais, soluções luminotécnicas e diretrizes de conservação e restauro dos elementos integrados. Concebidos de forma complementar, os projetos buscam valorizar a identidade arquitetônica e artística da edificação, respeitando suas particularidades e reforçando a atmosfera de espiritualidade inerente ao espaço sacro.",
    ],
    team: [D, PA, L],
    gallery: [],
    sections: [
      {
        title: "Projeto de Iluminação",
        body: [
          "O Projeto Luminotécnico foi desenvolvido a partir da análise técnica da iluminação natural e artificial existente, considerando os aspectos funcionais, estéticos e litúrgicos da edificação. A proposta contempla a modernização do sistema de iluminação, a redistribuição dos pontos de luz e a indicação de luminárias, temperaturas de cor e efeitos luminosos. Através da combinação entre iluminação difusa e de destaque, o projeto busca evidenciar os elementos arquitetônicos, ornamentais e sacros, proporcionando conforto visual e valorizando as particularidades do ambiente religioso.",
        ],
        images: [
          ["lum-01.jpg", "Simulação da iluminação vista da nave para o Presbitério."],
          ["lum-02.jpg", "Simulação da iluminação vista do Presbitério para a nave."],
          ["lum-03.jpg", "Planta de forro e iluminação."],
          ["lum-04.jpg", "Vista isométrica da nave lateral."],
          ["lum-05.jpg", "Vista isométrica da capela lateral."],
        ],
      },
      {
        title: "Projeto de Restauro dos Vitrais",
        body: [
          "O Projeto de Conservação e Restauro dos Vitrais contemplou a análise do estado de conservação, a identificação de intervenções anteriores inadequadas, a classificação das tipologias e o detalhamento gráfico das composições geométricas e cromáticas originais. Foram estabelecidos procedimentos específicos para a higienização, recuperação e reconstituição das peças de vidro, bem como para o tratamento das esquadrias metálicas e de madeira, complementados por diretrizes de conservação preventiva. A proposta visa recuperar a integridade material e estética do conjunto, preservando suas características originais e sua relação com a iluminação natural e a arquitetura do templo.",
        ],
        images: [
          ["vit-01.jpg", "Tipologia 1"],
          ["vit-02.jpg", "Tipologias 2 e 3"],
          ["vit-03.jpg", "Tipologia 4"],
          ["vit-04.jpg", "Tipologia 5"],
        ],
      },
      {
        title: "Projeto de Decoração",
        body: [
          "O Projeto de Decoração contemplou a integralidade dos ambientes internos da Igreja Matriz, abrangendo paredes, colunas e tetos. O trabalho envolveu o desenvolvimento de composições ornamentais, a definição cromática das superfícies e a elaboração de estamparias e motivos artísticos em consonância com a linguagem arquitetônica da edificação. A proposta busca estabelecer uma unidade estética entre os ambientes, valorizando a volumetria, os elementos arquitetônicos e a simbologia do espaço litúrgico.",
        ],
        images: [
          ["dec-01.jpg", "Fundo do altar-mor."],
          ["dec-02.jpg", "Paredes do presbitério."],
          ["dec-03.jpg", "Teto do presbitério."],
          ["dec-04.jpg", "Parede frontal do presbitério."],
          ["dec-05.jpg", "Teto da nave central."],
          ["dec-06.jpg", "Parede da nave lateral."],
          ["dec-07.jpg", "Capela lateral."],
          ["dec-08.jpg", "Teto da nave lateral."],
          ["dec-09.jpg", "Paredes do coro e nártex."],
          ["dec-10.jpg", "Teto do nártex."],
        ],
      },
      {
        title: "Situação existente",
        images: [
          ["hoje-01.jpg", ""],
          ["hoje-02.jpg", ""],
          ["hoje-03.jpg", ""],
        ],
      },
    ],
  },
  {
    slug: "sertaozinho-prospeccao-nossa-senhora-aparecida",
    credit: "Acervo Estúdio Restaura",
    title: "Prospecções Estratigráficas e Análise Cromática da Igreja Matriz",
    client: "Paróquia Nossa Senhora Aparecida",
    category: "Diagnóstico · Execução",
    state: "SP",
    city: "Sertãozinho",
    year: "2026",
    summary:
      "Prospecções estratigráficas nas superfícies internas da Igreja Matriz Nossa Senhora Aparecida, em Sertãozinho (SP), reveladoras de uma decoração originalmente mais intensa.",
    body: [
      "O Estúdio Restaura realizou, em janeiro de 2026, prospecções estratigráficas nas superfícies internas da Igreja Matriz Nossa Senhora Aparecida, em Sertãozinho/SP. O trabalho contemplou investigações em paredes, tetos, colunas, capitéis e elementos ornamentais, por meio de sondagens pontuais e exploratórias, visando identificar as camadas pictóricas originais e compreender as transformações cromáticas ocorridas ao longo do tempo. As análises revelaram uma composição decorativa originalmente mais intensa e diversificada que a atualmente visível, com predominância de tonalidades azuladas nas superfícies arquitetônicas, cores quentes nos ornamentos e vestígios de pinturas decorativas e marmorização. Os resultados foram sistematizados em fichas de prospecção, registros fotográficos, mapeamentos e relatório técnico, constituindo uma importante base documental para orientar futuros projetos de decoração e conservação, valorizando a identidade histórica e artística do local.",
    ],
    team: [PA, L],
    gallery: ["foto"],
  },
  {
    slug: "sertaozinho-capela-santissimo-decoracao-iluminacao",
    credit: "Acervo Estúdio Restaura",
    title: "Projeto e Execução de Decoração Artística e Iluminação da Capela do Santíssimo",
    client: "Paróquia Nossa Senhora Aparecida",
    category: "Projeto · Execução",
    state: "SP",
    city: "Sertãozinho",
    year: "2026",
    summary:
      "Projeto e execução de decoração artística em stencil e de iluminação decorativa na Capela do Santíssimo da Paróquia Nossa Senhora Aparecida, em Sertãozinho (SP).",
    body: [
      "Em setembro de 2026, o Estúdio Restaura realizou a execução do Projeto de Decoração Artística e Iluminação da Capela do Santíssimo da Paróquia Nossa Senhora Aparecida, em Sertãozinho/SP. O trabalho contemplou a definição cromática das superfícies e a execução de composições ornamentais, incorporando motivos decorativos e estamparias em stencil nas paredes e no teto, em consonância com a linguagem arquitetônica e a função litúrgica do ambiente. Complementarmente, foram desenvolvidas soluções luminotécnicas com iluminação decorativa, suave e acolhedora, buscando valorizar os elementos arquitetônicos e artísticos sem comprometer a atmosfera de recolhimento. A intervenção estabeleceu uma unidade estética entre decoração e iluminação, conferindo identidade ao espaço e reforçando seu caráter simbólico, contemplativo e religioso.",
    ],
    team: [D, PA, E, L],
    gallery: ["foto"],
    ba: ["A capela antes e depois da decoração.", "O teto: antes e depois da decoração."],
  },
  {
    slug: "camanducaia-marmorizacao-colunas-imaculada-conceicao",
    credit: "Natália Nascimento; e acervo Estúdio Restaura",
    title: "Execução de Pintura Artística das Colunas da Matriz",
    client: "Paróquia Imaculada Conceição",
    category: "Execução",
    state: "MG",
    city: "Camanducaia",
    year: "2026",
    summary:
      "Marmorização dos fustes e acabamento em pátina de capitéis e bases das 18 colunas internas da Igreja Matriz Imaculada Conceição, em Camanducaia (MG).",
    body: [
      "Em fevereiro de 2026, o Estúdio Restaura realizou a execução de pinturas artísticas e decorativas nas 18 colunas internas da Igreja Matriz Imaculada Conceição, em Camanducaia/MG. O trabalho contemplou a aplicação da técnica de marmorização nos fustes das colunas, reproduzindo artisticamente as nuances cromáticas, os veios e as características visuais da pedra natural, além da execução de acabamentos em pátina nos capitéis e bases. A intervenção buscou valorizar os elementos arquitetônicos e ornamentais existentes, estabelecendo uma composição estética harmoniosa e conferindo maior expressividade e unidade visual ao conjunto, em consonância com a linguagem arquitetônica e o caráter sacro da edificação.",
    ],
    team: [D, PA],
    gallery: ["foto"],
    ba: [
      "Nave: antes e depois da pintura das colunas.",
      "Coro e colunas: antes e depois.",
      "Capitel e base: antes e depois do acabamento em pátina.",
    ],
  },
  {
    slug: "botucatu-via-sacra-henrique-oswald",
    credit: "Acervo Estúdio Restaura",
    title: "Conservação e Restauro das 14 Estações da Via Sacra de Henrique B. Oswald",
    client: "Paróquia Sagrado Coração de Jesus",
    category: "Restauro · Diagnóstico · Execução",
    state: "SP",
    city: "Botucatu",
    year: "2026",
    status: "Em andamento",
    summary:
      "Conservação e restauro das 14 pinturas sobre tela da Via Sacra de Henrique B. Oswald (1954), na Paróquia Sagrado Coração de Jesus, em Botucatu (SP).",
    body: [
      "Em 2026, deu-se início ao trabalho de conservação e restauro das 14 pinturas sobre tela que compõem a Via Sacra da Paróquia Sagrado Coração de Jesus, em Botucatu/SP, executadas em 1954 pelo artista Henrique B. Oswald. A intervenção contempla o tratamento dos suportes e das camadas pictóricas, incluindo higienização, consolidação, recuperação de áreas comprometidas, reintegração cromática e substituição dos chassis. O trabalho busca recuperar a integridade material e a leitura estética das obras, respeitando suas características técnicas e artísticas, contribuindo para a preservação desse conjunto de elevada relevância histórica, cultural e devocional para a comunidade da Paróquia.",
    ],
    team: [D, PA, C],
    gallery: ["foto"],
    ba: ["Detalhe do rosto: antes e depois da limpeza.", "Detalhe da camada pictórica: antes e depois da limpeza."],
  },
  {
    slug: "inconfidentes-sao-geraldo-magela",
    credit: "Acervo Estúdio Restaura",
    title: "Restauro da Imagem Sacra de São Geraldo Magela",
    client: "Paróquia São Geraldo Magela",
    category: "Restauro · Diagnóstico · Execução",
    state: "MG",
    city: "Inconfidentes",
    year: "2026",
    summary:
      "Conservação e restauro da imagem de São Geraldo Magela, em gesso policromado e reconhecida como Patrimônio Histórico Municipal de Inconfidentes (MG).",
    body: [
      "Em 2026, o Estúdio Restaura realizou a conservação e o restauro da imagem sacra de São Geraldo Magela, pertencente ao acervo da paróquia de mesmo nome, em Inconfidentes/MG, e reconhecida como Patrimônio Histórico Municipal. Confeccionada em gesso policromado, a escultura apresentava sujidades impregnadas, pequenas perdas e sucessivas camadas de repintura que descaracterizavam sua composição original, além de fissuras na base. A intervenção contemplou documentação fotográfica, mapeamento de danos, testes progressivos de limpeza, prospecções estratigráficas e remoção criteriosa das repinturas, permitindo recuperar a policromia original da obra. Foram realizados ainda procedimentos de consolidação, tratamento de fissuras, nivelamento, reintegração cromática e proteção final. Fundamentado nos princípios da mínima intervenção, compatibilidade e reversibilidade dos materiais, o trabalho buscou restabelecer a integridade material e a leitura estética da imagem, preservando sua autenticidade histórica, artística e devocional para a comunidade.",
    ],
    team: [D, PA],
    gallery: ["foto"],
    ba: ["Busto e mãos: antes e depois do restauro.", "Mão: perdas da policromia e resultado final."],
  },
  {
    slug: "sao-paulo-prospeccao-nossa-senhora-das-angustias",
    credit: "Acervo Estúdio Restaura",
    title: "Prospecções Estratigráficas e Análise Cromática da Capela do Santíssimo",
    client: "Paróquia Nossa Senhora das Angústias",
    category: "Diagnóstico · Execução",
    state: "SP",
    city: "São Paulo",
    year: "2025",
    summary:
      "Prospecções estratigráficas na Capela do Santíssimo da Paróquia Nossa Senhora das Angústias, em São Paulo, que revelaram a tonalidade azul-clara original das superfícies.",
    body: [
      "Em outubro de 2025, o Estúdio Restaura realizou prospecções estratigráficas na Capela do Santíssimo da Paróquia Nossa Senhora das Angústias, em São Paulo/SP. O trabalho contemplou investigações nas paredes, teto e elementos decorativos, por meio de sondagens pontuais e exploratórias, visando identificar as camadas pictóricas originais e compreender as transformações cromáticas ocorridas ao longo do tempo. As análises revelaram a predominância original da tonalidade azul-clara nas superfícies, posteriormente recoberta por sucessivas camadas de pintura, além de identificar a preservação da técnica de escaiola no barrado inferior e as particularidades artísticas da representação do Espírito Santo no teto. Os resultados foram sistematizados em levantamento métrico-arquitetônico, fichas de prospecção, registros fotográficos e relatório técnico, estabelecendo diretrizes para futuras intervenções de conservação e restauro e contribuindo para a recuperação da identidade estética e arquitetônica do ambiente.",
    ],
    team: [PA, L],
    gallery: ["foto"],
  },
  {
    slug: "santa-rita-de-caldas-decoracao-santa-rita-de-cassia",
    credit: "Acervo Estúdio Restaura",
    title: "Projeto de Decoração Artística do Santuário",
    client: "Paróquia Santa Rita de Cássia",
    category: "Projeto",
    state: "MG",
    city: "Santa Rita de Caldas",
    year: "2025–2026",
    summary:
      "Projeto de decoração artística do Santuário de Santa Rita de Cássia, em Santa Rita de Caldas (MG): composição cromática e estamparias em stencil para cada ambiente.",
    body: [
      "O Estúdio Restaura desenvolveu o Projeto de Decoração Artística do Santuário de Santa Rita de Cássia, em Santa Rita de Caldas/MG, contemplando o hall de entrada, coro, nave central e laterais, Presbitério, Capela do Santíssimo e Capela Monsenhor Alderigi. O trabalho envolveu a definição da composição cromática dos ambientes e o desenvolvimento de propostas ornamentais para paredes, tetos, colunas e elementos arquitetônicos, incorporando estamparias em stencil e motivos decorativos em consonância com a linguagem arquitetônica e a função litúrgica de cada espaço. A proposta buscou estabelecer uma unidade estética entre os diferentes ambientes, valorizando os elementos arquitetônicos e conferindo identidade artística ao conjunto, de modo a reforçar o caráter simbólico, contemplativo e religioso da edificação.",
    ],
    team: [D, PA, L],
    gallery: [],
    sections: [
      {
        title: "Projeto de decoração",
        images: [
          ["dec-01.jpg", "Presbitério: acesso à sacristia."],
          ["dec-02.jpg", "Presbitério: teto."],
          ["dec-03.jpg", "Presbitério: perspectiva."],
          ["dec-04.jpg", "Nave central: teto."],
          ["dec-05.jpg", "Nave lateral: parede."],
          ["dec-06.jpg", "Teto: estudo de estamparias."],
        ],
      },
      {
        title: "Situação existente",
        images: [
          ["hoje-01.jpg", "Situação existente: nave central."],
          ["hoje-02.jpg", "Situação existente: presbitério."],
          ["hoje-03.jpg", "Situação existente: vista da nave central ao coro."],
        ],
      },
    ],
  },
  {
    slug: "paraisopolis-presbiterio-nicho-sao-miguel-arcanjo",
    credit: "Acervo Estúdio Restaura",
    title: "Execução de Pinturas Artísticas no Presbitério e Nicho de São Miguel Arcanjo",
    client: "Paróquia São José",
    category: "Execução",
    state: "MG",
    city: "Paraisópolis",
    year: "2024",
    summary:
      "Pinturas artísticas e decorativas em stencil no presbitério da Igreja Matriz da Paróquia São José, em Paraisópolis (MG), e pintura do nicho de São Miguel Arcanjo.",
    body: [
      "Em 2024, o Estúdio Restaura realizou a execução de pinturas artísticas e decorativas no presbitério da Igreja Matriz da Paróquia São José, em Paraisópolis/MG. O trabalho contemplou a ornamentação do teto e das paredes laterais da porção posterior do presbitério, por meio da aplicação de motivos decorativos e estamparias executadas com a técnica de stencil, em harmonia com as características arquitetônicas do templo. A intervenção abrangeu também a execução de uma pintura decorativa específica para o nicho que abriga a imagem de São Miguel Arcanjo, conferindo destaque ao elemento sacro. A composição artística buscou valorizar a arquitetura existente, estabelecer uma unidade estética entre as superfícies ornamentadas e reforçar o caráter simbólico e contemplativo do espaço litúrgico.",
    ],
    team: [D, PA],
    gallery: ["foto"],
    ba: ["Presbitério: parede lateral antes e depois da pintura."],
    sections: [
      {
        title: "Nicho de São Miguel Arcanjo",
        images: [
          ["nicho-01.jpg", ""],
          ["nicho-02.jpg", ""],
          ["nicho-03.jpg", ""],
          ["nicho-04.jpg", ""],
        ],
      },
    ],
  },
  {
    slug: "itajuba-capela-santissimo-nossa-senhora-das-gracas",
    credit: "Acervo Estúdio Restaura",
    title: "Execução de Pintura Artística na Capela do Santíssimo",
    client: "Paróquia Nossa Senhora das Graças",
    category: "Execução",
    state: "MG",
    city: "Itajubá",
    year: "2024",
    summary:
      "Pinturas artísticas e decorativas na Capela do Santíssimo Sacramento da Paróquia Nossa Senhora das Graças, em Itajubá (MG), com iconografia eucarística.",
    body: [
      "O Estúdio Restaura realizou a execução de pinturas artísticas e decorativas na Capela do Santíssimo Sacramento da Paróquia Nossa Senhora das Graças, em Itajubá/MG. A composição ornamental foi desenvolvida em consonância com a função litúrgica do ambiente, incorporando elementos da iconografia cristã, como o Cordeiro de Deus, o pelicano e motivos fitomórficos, representados por ramos e ornamentos vegetais. A escolha dos elementos artísticos e sua disposição no espaço buscaram estabelecer uma relação entre a decoração, a arquitetura e a simbologia eucarística, conferindo identidade ao ambiente e favorecendo uma atmosfera de recolhimento, oração e contemplação.",
    ],
    team: [D, PA],
    gallery: ["foto"],
  },
  {
    slug: "itajuba-capela-sao-francisco-de-assis",
    credit: "Acervo Estúdio Restaura",
    title: "Execução de Pintura Artística no Presbitério",
    client: "Capela São Francisco de Assis",
    category: "Execução",
    state: "MG",
    city: "Itajubá",
    year: "2025",
    summary:
      "Pintura artística com efeito de mármore, pela técnica de marmorização, nas superfícies do presbitério da Capela São Francisco de Assis, em Itajubá (MG).",
    body: [
      "O Estúdio Restaura realizou a execução de pinturas artísticas com efeito de mármore em determinadas superfícies parietais do presbitério da Capela São Francisco de Assis, em Itajubá/MG. O trabalho empregou a técnica de marmorização, reproduzindo artisticamente as nuances cromáticas, os veios e as particularidades visuais da pedra natural. A intervenção buscou integrar o acabamento decorativo à linguagem arquitetônica da capela, conferindo nobreza às superfícies e valorizando estética e simbolicamente o espaço litúrgico.",
    ],
    team: [D, PA],
    gallery: ["foto"],
  },
  {
    slug: "sao-manuel-laudo-capela-casa-pia",
    credit: "Acervo Estúdio Restaura",
    title: "Laudo Técnico de Conservação e Diagnóstico Arquitetônico",
    client: "Capela do Hospital da Casa Pia São Vicente de Paulo",
    category: "Diagnóstico",
    state: "SP",
    city: "São Manuel",
    year: "2026",
    summary:
      "Laudo técnico de conservação da Capela do Hospital da Casa Pia São Vicente de Paulo, em São Manuel (SP): cobertura, forro de estuque e pinturas artísticas.",
    body: [
      "Em 2026, o Estúdio Restaura elaborou o Laudo Técnico de Conservação da Capela do Hospital da Casa Pia São Vicente de Paulo, em São Manuel/SP. O trabalho contemplou a avaliação das condições de conservação da edificação, com atenção especial ao sistema de cobertura, composto por telhas cerâmicas francesas e estrutura de madeira, ao forro de estuque em abóbada de esquife e às superfícies com pinturas artísticas e decorativas. A análise teve como objetivo identificar manifestações patológicas, compreender os fatores responsáveis pela deterioração dos materiais e estabelecer diretrizes técnicas para futuras intervenções de conservação e restauro, considerando as características construtivas, arquitetônicas e artísticas do espaço sacro.",
    ],
    team: [D, PA, E, F],
    gallery: ["foto"],
  },
  {
    slug: "charqueada-laudo-casarao-antonio-furlan",
    credit: "Acervo Estúdio Restaura",
    title: "Laudo Técnico do Estado de Conservação do Casarão Antonio Furlan",
    client: "Prefeitura Municipal de Charqueada",
    category: "Diagnóstico",
    state: "SP",
    city: "Charqueada",
    year: "2023",
    summary:
      "Laudo técnico de estado de conservação e identificação de danos do Casarão Antonio Furlan (1907), a Casa do Fundador de Charqueada (SP).",
    body: [
      "O Estúdio Restaura desenvolveu, para a Prefeitura Municipal de Charqueada (SP), o Laudo Técnico de Estado de Conservação e Identificação de Danos do Casarão Antonio Furlan, edificação histórica construída em 1907 e conhecida como Casa do Fundador. O trabalho contemplou vistoria técnica, levantamento das características construtivas e dos elementos arquitetônicos integrados, registro fotográfico, identificação e análise das manifestações patológicas e avaliação das condições de conservação do porão, da casa principal, dos acréscimos e das fachadas. Como resultado, foi elaborado um diagnóstico técnico com recomendações de intervenção, estabelecendo diretrizes para futuras ações de conservação e restauro. De grande relevância para a memória e a formação urbana de Charqueada, o casarão foi residência de Antonio Furlan, reconhecido como fundador do município, constituindo um importante testemunho material de sua história e desenvolvimento.",
    ],
    team: [D, PA, E],
    gallery: ["foto"],
  },
];

/** ordem cronológica pela data de contratação (código da pasta do projeto) */
const ORDER = [
  "charqueada-laudo-casarao-antonio-furlan", // 2306.01
  "itajuba-projeto-luminotecnico-sao-jose-operario", // 2402.02
  "maria-da-fe-pinturas-nossa-senhora-de-lourdes", // 2403.01
  "paraisopolis-presbiterio-nicho-sao-miguel-arcanjo", // 2408.01
  "itajuba-capela-santissimo-nossa-senhora-das-gracas", // 2409.02
  "sesc-santo-andre-mural-sacilotto", // 2502.01
  "itajuba-capela-sao-francisco-de-assis", // 2503.02
  "slg-mural-claudio-pastro-sao-paulo", // 2505.01
  "jatai-conjunto-mural-claudio-pastro-catedral", // 2508.02
  "sertaozinho-prospeccao-nossa-senhora-aparecida", // 2508.03
  "santa-rita-de-caldas-decoracao-santa-rita-de-cassia", // 2508.05
  "camanducaia-marmorizacao-colunas-imaculada-conceicao", // 2509.01
  "sao-paulo-prospeccao-nossa-senhora-das-angustias", // 2509.04
  "botucatu-painel-mural-sagrado-coracao", // 2512.01
  "inconfidentes-sao-geraldo-magela", // 2603.01
  "sertaozinho-capela-santissimo-decoracao-iluminacao", // 2604.03
  "botucatu-via-sacra-henrique-oswald", // 2606.02
  "sao-manuel-laudo-capela-casa-pia", // 2607.02
];
projetos.sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

const base = (slug: string) => `/fotos/projetos/${slug}`;
const dirOf = (slug: string) => path.join(process.cwd(), "public", "fotos", "projetos", slug);

/** arquivos do projeto que começam com `prefix-` (ordenados) */
function files(slug: string, prefix: string) {
  const d = dirOf(slug);
  if (!fs.existsSync(d)) return [];
  return fs
    .readdirSync(d)
    .filter((f) => f.startsWith(prefix + "-") && /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
}

async function main() {
  // --only=slug1,slug2 grava só esses
  const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7).split(",").filter(Boolean);
  const list = projetos.filter((x) => !only.length || only.includes(x.slug));
  for (const p of list) {
    const i = projetos.indexOf(p);
    const b = base(p.slug);
    const nBa = files(p.slug, "antes").length;
    const baCaps = p.ba ?? [];
    const data = {
      slug: p.slug,
      title: p.title,
      client: p.client,
      category: p.category,
      state: p.state,
      city: p.city,
      location: `${p.city}-${p.state}`,
      year: p.year,
      area: "",
      summary: p.summary,
      body: p.body.join("\n\n"),
      team: p.team,
      status: p.status ?? "",
      credit: p.credit ?? "",
      coverUrl: `${b}/capa.jpg`,
      gallery: p.gallery.flatMap((pre) => files(p.slug, pre)).map((f) => `${b}/${f}`),
      // pares antes/depois: só os projetos com `ba` (nos demais, antes-N/depois-N entram em seções)
      beforeAfter: (p.ba ? Array.from({ length: Math.min(nBa, baCaps.length) }, (_, k) => k) : []).map((k) => ({
        before: `${b}/antes-${k + 1}.jpg`,
        after: `${b}/depois-${k + 1}.jpg`,
        caption: baCaps[k] ?? "",
      })),
      sections: (p.sections ?? []).map((s) => ({
        title: s.title,
        body: (s.body ?? []).join("\n\n"),
        images: s.images.map(([file, caption]) => ({ src: `${b}/${file}`, caption })),
      })),
      featured: Boolean(p.featured),
      sort: i + 1,
      updatedAt: new Date(),
    };
    const ex = await db.select({ id: schema.projects.id, published: schema.projects.published }).from(schema.projects).where(eq(schema.projects.slug, p.slug)).limit(1);
    if (ex.length) await db.update(schema.projects).set({ ...data, published: publish || ex[0].published }).where(eq(schema.projects.id, ex[0].id));
    else await db.insert(schema.projects).values({ ...data, published: publish });
    console.log(`✓ ${p.slug} (${data.gallery.length} fotos, ${data.beforeAfter.length} pares, ${data.sections.length} seções)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
