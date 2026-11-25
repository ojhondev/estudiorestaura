import { SERVICOS_FOTOS } from "@/lib/photos";

export type ServicePage = {
  slug: string;
  number: string;
  /** nome curto (cartão na lista de serviços) */
  title: string;
  /** título da página (h1) — contém a busca-alvo */
  h1: string;
  metaDescription: string;
  /** resumo do cartão em /servicos */
  summary: string;
  intro: string;
  bullets: string[];
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  /** slugs de artigos do blog relacionados */
  posts: string[];
  /** projetos relacionados: casa com título + categoria + cliente */
  projectMatch: RegExp;
  photo: string;
};

const P = (slug: string) => `/fotos/projetos/${slug}/capa.jpg`;

export const servicePages: ServicePage[] = [
  {
    slug: "restauro-de-igrejas-e-edificios-historicos",
    number: "01",
    title: "Restauro de igrejas e edifícios históricos",
    h1: "Restauro de igrejas e edifícios históricos",
    metaDescription:
      "Projeto e acompanhamento de restauro de igrejas, capelas e edifícios históricos: levantamento, diagnóstico, projeto aprovado nos órgãos de preservação e obra com intervenção mínima.",
    summary:
      "Projetos de restauro, consolidação e adaptação de uso para edificações de valor histórico, com respeito às cartas patrimoniais e à legibilidade das camadas do tempo.",
    intro:
      "Restaurar uma igreja ou um edifício histórico começa por entender o que ele é hoje e o que já foi: suas fases construtivas, seus materiais e seus danos. A partir dessa leitura, o Estúdio Restaura elabora o projeto de restauro e acompanha a obra, com intervenção mínima, materiais compatíveis com os originais e documentação de cada etapa.",
    bullets: [
      "Leitura histórica e prospecções",
      "Projeto executivo de restauro",
      "Aprovação nos órgãos de preservação",
      "Compatibilização com acessibilidade e segurança",
      "Acompanhamento e fiscalização de obra",
    ],
    steps: [
      { title: "Levantamento e pesquisa", text: "Estudo da história do edifício, levantamento arquitetônico e registro fotográfico do estado atual." },
      { title: "Diagnóstico e prospecções", text: "Mapa de danos, identificação das causas (umidade, cupim, estrutura, intervenções anteriores) e prospecções nas camadas de pintura e argamassa." },
      { title: "Projeto e aprovação", text: "Projeto de restauro com memorial e orçamento, preparado para aprovação no IPHAN ou no órgão estadual e municipal de preservação." },
      { title: "Obra e acompanhamento", text: "Execução ou fiscalização da obra, com registro de cada etapa e relatório final." },
    ],
    faq: [
      { q: "Por onde começar o restauro de uma igreja?", a: "Pelo diagnóstico: laudo do estado de conservação, levantamento e prospecções. Ele orienta o projeto, o orçamento e as prioridades, e costuma ser exigido pelos órgãos de preservação quando o bem é protegido." },
      { q: "Preciso de autorização para restaurar um bem tombado?", a: "Sim. Qualquer intervenção em bem tombado precisa de aprovação do órgão responsável: o IPHAN, no caso federal, ou órgãos estaduais e municipais, como o IEPHA-MG e o CONDEPHAAT (SP). O estúdio prepara o projeto e a documentação para essa aprovação." },
      { q: "A igreja precisa fechar durante a obra?", a: "Nem sempre. Dependendo do escopo, a obra pode ser dividida em etapas e com áreas isoladas, para que as celebrações continuem. Isso é definido no planejamento, depois do diagnóstico." },
      { q: "Quanto custa e quanto tempo leva um restauro?", a: "Depende do tamanho do edifício, do estado de conservação e dos bens integrados envolvidos (pinturas, retábulos, forros). Só depois do diagnóstico é possível estimar custo e prazo com segurança." },
    ],
    posts: ["restauro-de-igreja-guia-para-paroquias", "quanto-custa-restaurar-uma-igreja", "restauro-de-igreja-prazos-etapas", "restauro-igreja-tombada-iphan-condephaat-iepha", "como-escolher-empresa-de-restauro-de-igreja"],
    projectMatch: /igreja|catedral|capela|matriz|par[oó]quia|casar[aã]o/i,
    photo: SERVICOS_FOTOS[0],
  },
  {
    slug: "conservacao-preventiva-de-patrimonio",
    number: "02",
    title: "Conservação preventiva",
    h1: "Conservação preventiva de patrimônio histórico",
    metaDescription:
      "Planos de conservação preventiva e manutenção para igrejas e edifícios históricos: monitoramento de temperatura e umidade, calendário de inspeções e capacitação de equipes locais.",
    summary:
      "Planos que antecipam a deterioração: monitoramento ambiental, calendário de inspeções e protocolos de manutenção que reduzem a necessidade de grandes intervenções.",
    intro:
      "Conservar custa menos e agride menos do que restaurar. A conservação preventiva reduz as causas da deterioração (umidade, variações de temperatura, pragas, poeira, uso inadequado) por meio de monitoramento, inspeções regulares e manutenção planejada, para que o patrimônio chegue bem às próximas gerações.",
    bullets: [
      "Monitoramento de temperatura e umidade",
      "Plano de manutenção por elemento",
      "Calendário de inspeções",
      "Treinamento de equipes locais",
    ],
    steps: [
      { title: "Diagnóstico de riscos", text: "Vistoria para identificar as causas de deterioração e os pontos mais vulneráveis do edifício e do acervo." },
      { title: "Monitoramento", text: "Instalação de sensores de temperatura e umidade e leitura periódica dos dados." },
      { title: "Plano de manutenção", text: "Rotina de limpeza, inspeção e pequenos reparos definida por elemento (telhado, calhas, pisos, retábulos, pinturas)." },
      { title: "Capacitação", text: "Orientação a zeladores, paróquias e equipes locais para executar a rotina no dia a dia." },
    ],
    faq: [
      { q: "O que é conservação preventiva?", a: "É o conjunto de ações que evitam ou retardam a deterioração de um bem: controlar umidade e pragas, manter telhados e calhas, limpar de forma adequada e inspecionar com regularidade. Ela diminui a necessidade de grandes restauros." },
      { q: "Com que frequência fazer inspeções?", a: "Em geral, ao menos uma inspeção por ano, além de vistorias após temporais. O calendário ideal depende do edifício e é definido no plano de manutenção." },
      { q: "Serve para uma igreja que nunca foi restaurada?", a: "Sim, e é um ótimo ponto de partida. O plano mostra o que precisa de intervenção urgente e o que pode ser mantido com manutenção simples." },
      { q: "Quem faz a manutenção do dia a dia?", a: "A equipe local, depois de treinada. O estúdio entrega o plano e orienta a rotina, e volta para as inspeções técnicas periódicas." },
    ],
    posts: ["conservacao-preventiva-igrejas-manutencao", "umidade-em-igreja-antiga-causas-solucoes", "cupim-madeira-igreja-restauro", "restauro-de-forro-e-telhado-de-igreja"],
    projectMatch: /conserva/i,
    photo: SERVICOS_FOTOS[1],
  },
  {
    slug: "restauro-de-pintura-mural-e-arte-sacra",
    number: "03",
    title: "Restauro de pintura mural e arte sacra",
    h1: "Restauro de pintura mural, bens integrados e arte sacra",
    metaDescription:
      "Restauro de pinturas murais, forros pintados, retábulos, talhas, douramento e imagens sacras por conservadores-restauradores: limpeza controlada, consolidação e reintegração cromática reversível.",
    summary:
      "Forros pintados, murais, retábulos, imagens e esquadrias: consolidação, limpeza controlada e reintegração cromática identificável.",
    intro:
      "Murais, forros pintados, retábulos, talhas, douramentos, imagens sacras e esquadrias pedem conservadores-restauradores especializados. A equipe do Estúdio Restaura faz o diagnóstico, a limpeza controlada, a consolidação, a reintegração cromática reversível e, quando necessário, a recomposição de áreas douradas, sempre com o mínimo de intervenção e materiais compatíveis.",
    bullets: [
      "Diagnóstico de patologias",
      "Limpeza controlada e remoção de repinturas",
      "Consolidação e fixação da camada pictórica",
      "Reintegração cromática reversível",
      "Recomposição de douramentos",
    ],
    steps: [
      { title: "Documentação e mapa de danos", text: "Registro fotográfico detalhado e mapeamento de cada patologia: fissuras, lacunas, sujidades, repinturas, perdas de policromia." },
      { title: "Testes de limpeza e materiais", text: "Ensaios em pequenas áreas para definir o método de limpeza e os materiais mais seguros para a obra." },
      { title: "Consolidação e fixação", text: "Fixação da camada pictórica e do suporte, nivelamento de fissuras e lacunas." },
      { title: "Reintegração e proteção", text: "Reintegração cromática pontual e identificável, velaturas de harmonização e proteção final." },
    ],
    faq: [
      { q: "Vocês restauram murais modernos e contemporâneos?", a: "Sim. O estúdio restaurou o conjunto mural de Claudio Pastro (1988), na Catedral de Jataí (GO), e o painel de Luiz Sacilotto, no Sesc Santo André." },
      { q: "O que é reintegração cromática reversível?", a: "É o preenchimento das lacunas de cor com materiais que podem ser removidos no futuro e que se distinguem do original de perto, sem falsificar a obra." },
      { q: "Dá para recuperar uma pintura muito danificada?", a: "Em muitos casos sim, mas depende do diagnóstico. A limpeza e a remoção de repinturas podem revelar a camada original por baixo. Por isso os testes vêm antes de qualquer decisão." },
      { q: "Vocês trabalham com imagens sacras e douramento?", a: "Sim. O estúdio restaura imagens sacras, altares, talhas e douramentos, com limpeza, consolidação e reposição de folhas de ouro quando necessário." },
    ],
    posts: ["restauro-pintura-mural-igreja", "restauro-de-altar-talha-douramento", "restauro-de-imagens-sacras", "marmorizacao-faux-marbre-igrejas", "restauro-de-vitrais-igreja"],
    projectMatch: /mural|pintura|imagem|via sacra|painel|marmoriza/i,
    photo: SERVICOS_FOTOS[2],
  },
  {
    slug: "laudo-tecnico-e-diagnostico-de-patrimonio",
    number: "04",
    title: "Laudos e diagnósticos técnicos",
    h1: "Laudo técnico e diagnóstico de conservação de patrimônio histórico",
    metaDescription:
      "Laudo técnico do estado de conservação de igrejas, casarões e edifícios históricos: mapa de danos, registro fotográfico, ensaios de materiais e recomendações priorizadas por urgência.",
    summary:
      "Documentos que embasam decisões: mapeamento de danos, ensaios de caracterização de materiais e recomendações priorizadas por urgência e custo.",
    intro:
      "O laudo técnico é o documento que diz o que o edifício tem, por que está assim e o que fazer primeiro. O Estúdio Restaura reúne vistoria, mapa de danos, fotografias, ensaios de materiais quando indicados e recomendações priorizadas por urgência: a base para projetos, licitações, captação de recursos e prestação de contas aos órgãos de preservação.",
    bullets: [
      "Mapa de danos com registro fotográfico",
      "Caracterização de argamassas e tintas",
      "Matriz de prioridades de intervenção",
      "Relatório para projetos e captação de recursos",
    ],
    steps: [
      { title: "Vistoria técnica", text: "Visita ao edifício, levantamento das condições gerais e identificação dos pontos críticos." },
      { title: "Mapa de danos", text: "Mapeamento de cada patologia sobre desenhos e fotografias do edifício." },
      { title: "Ensaios e prospecções", text: "Caracterização de argamassas e tintas e prospecções nas camadas de pintura, quando indicadas." },
      { title: "Relatório e prioridades", text: "Documento final com diagnóstico, recomendações e a ordem de intervenção por urgência e custo." },
    ],
    faq: [
      { q: "Para que serve um laudo técnico de patrimônio?", a: "Para saber o estado real do edifício e embasar decisões: projeto de restauro, orçamento, licitação, pedido de recursos e comunicação com os órgãos de preservação." },
      { q: "Laudo e diagnóstico são a mesma coisa?", a: "São etapas do mesmo trabalho. O laudo registra o estado de conservação; o diagnóstico explica as causas dos danos e indica o que fazer. Entregamos os dois no mesmo relatório." },
      { q: "O laudo serve para captação de recursos e aprovação em órgãos?", a: "Sim, ele é a base técnica desses processos. Cada órgão e cada edital têm exigências próprias, e o estúdio confirma o formato antes de iniciar." },
      { q: "Quanto tempo leva?", a: "Depende do tamanho do edifício e da quantidade de ensaios necessários. Informamos o prazo depois da primeira visita." },
    ],
    posts: ["laudo-tecnico-patrimonio-historico", "documentos-necessarios-restauro-igreja", "umidade-em-igreja-antiga-causas-solucoes", "captacao-de-recursos-restauro-igreja"],
    projectMatch: /laudo|diagn[oó]stico/i,
    photo: SERVICOS_FOTOS[3],
  },
  {
    slug: "prospeccao-estratigrafica-e-analise-cromatica",
    number: "05",
    title: "Prospecção estratigráfica e análise cromática",
    h1: "Prospecção estratigráfica e análise cromática",
    metaDescription:
      "Prospecção estratigráfica e análise cromática em igrejas e edifícios históricos: descoberta das cores e acabamentos originais, registro das camadas e relatório para o projeto de restauro.",
    summary:
      "Leitura das camadas de tinta e argamassa para descobrir as cores originais e orientar o projeto de restauro.",
    intro:
      "A prospecção estratigráfica é a leitura das camadas de tinta e argamassa de uma parede, forro ou escultura. Pequenas janelas de investigação revelam as cores e os acabamentos originais e as intervenções posteriores. A análise cromática documenta essas informações e orienta a escolha das cores e dos acabamentos do restauro.",
    bullets: [
      "Planejamento dos pontos de prospecção",
      "Janelas estratigráficas com registro fotográfico",
      "Catalogação e análise das cores encontradas",
      "Relatório com proposta de paleta e acabamentos",
    ],
    steps: [
      { title: "Planejamento", text: "Definição dos pontos que melhor representam cada elemento do edifício: paredes, forros, colunas, esquadrias." },
      { title: "Prospecções", text: "Abertura de pequenas janelas com técnica controlada, expondo cada camada de tinta e de argamassa." },
      { title: "Análise cromática", text: "Catalogação das cores de cada camada e comparação com os sistemas de cor." },
      { title: "Relatório", text: "Documento com fotografias, mapa dos pontos e proposta de cores e acabamentos para o projeto." },
    ],
    faq: [
      { q: "A prospecção danifica a pintura?", a: "As janelas são pequenas, feitas com técnica controlada e registradas. O projeto define o que fazer com elas depois: recompor ou manter como testemunho." },
      { q: "Por que descobrir a cor original de uma igreja?", a: "Porque ela orienta o restauro e evita repetir repinturas sem critério. Com ela, a decisão de cor se apoia em evidências do próprio edifício." },
      { q: "A prospecção é obrigatória?", a: "Em projetos de pintura e restauro de bens protegidos, muitos órgãos de preservação pedem esse estudo. Confirmamos a exigência do órgão responsável antes de começar." },
      { q: "Quanto tempo leva?", a: "Depende do tamanho do edifício e do número de pontos. Em geral a etapa de campo é rápida, e a análise e o relatório levam mais tempo." },
    ],
    posts: ["prospeccao-estratigrafica-o-que-e", "restauro-de-fachada-igreja-cores-reboco", "restauro-pintura-mural-igreja"],
    projectMatch: /prospec/i,
    photo: P("sao-paulo-prospeccao-nossa-senhora-das-angustias"),
  },
  {
    slug: "projeto-de-decoracao-e-iluminacao-de-igrejas",
    number: "06",
    title: "Decoração e iluminação de igrejas",
    h1: "Projeto de decoração artística e iluminação de igrejas",
    metaDescription:
      "Projeto de decoração artística, iluminação e restauro de vitrais para igrejas e capelas: simulações, projeto luminotécnico e soluções reversíveis que respeitam o patrimônio.",
    summary:
      "Decoração artística, projeto luminotécnico e restauro de vitrais pensados para a liturgia e para o patrimônio.",
    intro:
      "A decoração artística e a iluminação de uma igreja realçam a arquitetura, ajudam a ler o espaço e apoiam a liturgia. O Estúdio Restaura desenvolve projetos de decoração, iluminação e restauro de vitrais para igrejas e capelas, com simulações antes da obra e soluções reversíveis que não agridem o edifício.",
    bullets: [
      "Projeto de decoração artística",
      "Projeto luminotécnico com simulações",
      "Restauro de vitrais",
      "Execução e acompanhamento",
    ],
    steps: [
      { title: "Estudos e levantamento", text: "Leitura do espaço, da liturgia e das pinturas existentes, com prospecções quando há camadas antigas." },
      { title: "Proposta e simulações", text: "Proposta de decoração e imagens simuladas da iluminação na nave e no presbitério, para aprovação antes da obra." },
      { title: "Projeto executivo", text: "Planta de forro e iluminação, vistas isométricas e detalhamento das soluções." },
      { title: "Execução", text: "Obra com a equipe do estúdio e acompanhamento até a entrega." },
    ],
    faq: [
      { q: "Vocês mostram como vai ficar antes de executar?", a: "Sim. Fazemos simulações da iluminação e da decoração na nave e no presbitério, para que a paróquia e a comissão de arte sacra aprovem antes da obra." },
      { q: "Iluminação em igreja tombada precisa de aprovação?", a: "Em geral, sim. O projeto luminotécnico passa pelo órgão de preservação competente, e o estúdio prepara a documentação." },
      { q: "Vocês restauram vitrais?", a: "Sim. O projeto de restauro de vitrais identifica cada tipologia, o estado de conservação e a intervenção necessária." },
      { q: "É possível decorar sem apagar as pinturas antigas?", a: "Sim. Por isso começamos com prospecções e documentação, e o projeto respeita as camadas de valor histórico." },
    ],
    posts: ["iluminacao-igreja-patrimonio-projeto-luminotecnico", "comissao-de-arte-sacra-diocese-restauro", "restauro-de-vitrais-igreja"],
    projectMatch: /decora|ilumin|vitra/i,
    photo: P("itajuba-projeto-luminotecnico-sao-jose-operario"),
  },
  {
    slug: "projetos-de-arquitetura-em-patrimonio",
    number: "07",
    title: "Projetos de arquitetura",
    h1: "Projetos de arquitetura em contexto histórico",
    metaDescription:
      "Projetos de arquitetura para ampliações e novas construções que dialogam com edifícios históricos: estruturas reversíveis, materialidade honesta e detalhamento do encontro entre novo e antigo.",
    summary:
      "Novas construções e ampliações contemporâneas que dialogam com preexistências, com estruturas reversíveis e materialidade honesta.",
    intro:
      "Edifícios históricos também precisam de novos usos, ampliações e adaptações. O Estúdio Restaura desenvolve projetos de arquitetura que dialogam com a preexistência: estruturas autônomas e reversíveis, materiais que não imitam o antigo e um detalhamento cuidadoso do ponto onde o novo encontra o histórico.",
    bullets: [
      "Estudo preliminar ao projeto executivo",
      "Estruturas autônomas e reversíveis",
      "Detalhamento do encontro entre novo e antigo",
      "Compatibilização com acessibilidade e segurança",
    ],
    steps: [
      { title: "Leitura da preexistência", text: "Levantamento e análise do valor histórico do local e dos limites de intervenção." },
      { title: "Estudo preliminar", text: "Proposta de implantação e de relação entre o edifício novo e o existente." },
      { title: "Projeto legal e executivo", text: "Projeto para aprovação nos órgãos competentes e detalhamento para obra." },
      { title: "Acompanhamento", text: "Visitas técnicas e fiscalização durante a execução." },
    ],
    faq: [
      { q: "É possível ampliar um edifício tombado?", a: "Em muitos casos sim, desde que o projeto seja aprovado pelo órgão de preservação e respeite o edifício existente. Estruturas reversíveis costumam ser bem aceitas." },
      { q: "O que significa estrutura reversível?", a: "É uma construção que pode ser retirada no futuro sem danificar o edifício histórico, por exemplo uma estrutura autônoma, que não se apoia nem fura as paredes originais." },
      { q: "O projeto novo deve imitar o estilo antigo?", a: "Em geral não. As cartas patrimoniais recomendam que o novo seja legível como novo, em diálogo com o antigo." },
    ],
    posts: ["restauro-de-edificios-historicos-para-empresas-e-instituicoes", "restauro-de-igreja-guia-para-paroquias"],
    projectMatch: /projeto|arquitet/i,
    photo: SERVICOS_FOTOS[4],
  },
  {
    slug: "consultoria-e-gestao-de-patrimonio-cultural",
    number: "08",
    title: "Consultoria e gestão de patrimônio",
    h1: "Consultoria e gestão de patrimônio cultural",
    metaDescription:
      "Consultoria para paróquias, prefeituras e instituições: aprovação em órgãos de preservação, dossiês e inventários, leis de incentivo à cultura e acompanhamento de obras de patrimônio.",
    summary:
      "Acompanhamento de obra, dossiês de tombamento, aprovação em órgãos de preservação e gestão de acervos edificados.",
    intro:
      "Cuidar de um bem histórico envolve burocracia, prazos e decisões técnicas. O Estúdio Restaura orienta paróquias, prefeituras e instituições na aprovação em órgãos de preservação, na elaboração de dossiês e inventários, na estruturação de projetos para leis de incentivo e no acompanhamento de obras.",
    bullets: [
      "Aprovação em órgãos de preservação",
      "Dossiês e inventários",
      "Projeto técnico para leis de incentivo",
      "Fiscalização e gestão de obra",
    ],
    steps: [
      { title: "Entendimento do caso", text: "Conversa inicial para mapear o bem, sua proteção legal e o objetivo da instituição." },
      { title: "Documentação", text: "Preparação de projetos, memoriais, dossiês e demais documentos exigidos." },
      { title: "Aprovações e recursos", text: "Acompanhamento da aprovação no órgão de preservação e estruturação do projeto técnico para leis de incentivo." },
      { title: "Gestão da obra", text: "Fiscalização, medições e relatórios durante a execução." },
    ],
    faq: [
      { q: "Vocês ajudam com leis de incentivo à cultura?", a: "Orientamos a estruturação do projeto técnico e da documentação exigida por leis de incentivo, como a Lei Rouanet, o ProAC (SP) e as leis estaduais de cultura." },
      { q: "Como aprovar uma obra no IPHAN ou no órgão estadual?", a: "O projeto precisa seguir as exigências do órgão (no IPHAN, a Portaria nº 420/2010 define os procedimentos para intervenção em bens protegidos). O estúdio prepara e acompanha o processo." },
      { q: "A comissão de arte sacra da diocese participa do processo?", a: "Em obras em igrejas, a comissão de arte sacra costuma avaliar a proposta. O estúdio apresenta o projeto e acompanha essa etapa junto à paróquia." },
    ],
    posts: ["lei-rouanet-restauro-de-igreja", "proac-icms-restauro-patrimonio-sp", "lei-incentivo-cultura-minas-restauro-igreja", "captacao-de-recursos-restauro-igreja", "comissao-de-arte-sacra-diocese-restauro"],
    projectMatch: /^$/,
    photo: SERVICOS_FOTOS[5],
  },
];

export const getServicePage = (slug: string) => servicePages.find((s) => s.slug === slug);
