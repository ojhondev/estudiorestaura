/**
 * Créditos das imagens do blog. Todas vêm do Wikimedia Commons e estão em domínio público
 * ou CC0 (uso livre, sem exigir atribuição) — o crédito é cortesia e rastreabilidade.
 * Para trocar uma imagem: coloque o arquivo em public/blog/<slug>.jpg e atualize aqui.
 */
export type BlogCredit = { author: string; license: string; page: string; file: string };

export const BLOG_CREDITS: Record<string, BlogCredit> = {
  "restauro-de-igreja-guia-para-paroquias": {
    "author": "Valmy Gomes",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Igreja_Matriz_de_Sant%C2%B4Anna_-_Pirapetinga_-_Minas_Gerais.jpg",
    "file": "Igreja Matriz de Sant´Anna - Pirapetinga - Minas Gerais.jpg"
  },
  "como-escolher-empresa-de-restauro-de-igreja": {
    "author": "Helena Panzera",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Catedral_da_S%C3%A9_-_S%C3%A3o_Paulo,_Brasil.jpg",
    "file": "Catedral da Sé - São Paulo, Brasil.jpg"
  },
  "quanto-custa-restaurar-uma-igreja": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Capela_Dourada,_Recife,_Pernambuco,_Brasil.jpg",
    "file": "Capela Dourada, Recife, Pernambuco, Brasil.jpg"
  },
  "restauro-de-edificios-historicos-para-empresas-e-instituicoes": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:P%C3%A1tio_do_Col%C3%A9gio_in_S%C3%A3o_Paulo.jpg",
    "file": "Pátio do Colégio in São Paulo.jpg"
  },
  "documentos-necessarios-restauro-igreja": {
    "author": "Michael D Beckwith",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Chester_Cathedral_Nave.jpg",
    "file": "Chester Cathedral Nave.jpg"
  },
  "restauro-de-igreja-prazos-etapas": {
    "author": "Fortunate4now",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Corpus_Christi_RC_church_scaffolding.JPG",
    "file": "Corpus Christi RC church scaffolding.JPG"
  },
  "igreja-aberta-durante-restauro-missas": {
    "author": "Lucas vilela souza",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Interior_da_Igreja_Matriz_de_Nossa_Senhora_da_Concei%C3%A7%C3%A3o_de_Carrancas.jpg",
    "file": "Interior da Igreja Matriz de Nossa Senhora da Conceição de Carrancas.jpg"
  },
  "comissao-de-arte-sacra-diocese-restauro": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Igreja_do_Divino_Esp%C3%ADrito_Santo,_Sao_Paulo,_Brasil.jpg",
    "file": "Igreja do Divino Espírito Santo, Sao Paulo, Brasil.jpg"
  },
  "restauro-igreja-tombada-iphan-condephaat-iepha": {
    "author": "MTur Destinos",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:PedroVilela_Igreja_Matriz_de_Santo_Ant%C3%B4nio_Diamantina_MG_(40157651584).jpg",
    "file": "PedroVilela Igreja Matriz de Santo Antônio Diamantina MG (40157651584).jpg"
  },
  "restaurar-igreja-sao-paulo-condephaat-conpresp": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Santa_Ifig%C3%AAnia_in_S%C3%A3o_Paulo_01.jpg",
    "file": "Santa Ifigênia in São Paulo 01.jpg"
  },
  "restaurar-igreja-minas-gerais-iepha": {
    "author": "MTur Destinos",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:PedroVilela_Igreja_N.S._do_Carmo_Diamantina_MG_(40157643384).jpg",
    "file": "PedroVilela Igreja N.S. do Carmo Diamantina MG (40157643384).jpg"
  },
  "lei-rouanet-restauro-de-igreja": {
    "author": "William Gore Ouseley",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Church_of_Nossa_Se%C3%B1ora_da_Cloria_and_Aqueduct_1844.jpg",
    "file": "Church of Nossa Señora da Cloria and Aqueduct 1844.jpg"
  },
  "proac-icms-restauro-patrimonio-sp": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Church_in_Avenida_Paulista.jpg",
    "file": "Church in Avenida Paulista.jpg"
  },
  "lei-incentivo-cultura-minas-restauro-igreja": {
    "author": "MTur Destinos",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:PedroVilela_Igreja_N.S._do_Carmo_S%C3%A3o_Jo%C3%A3o_Del_Rei_MG_(39972048315).jpg",
    "file": "PedroVilela Igreja N.S. do Carmo São João Del Rei MG (39972048315).jpg"
  },
  "captacao-de-recursos-restauro-igreja": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Church_in_Recife_downtown.jpg",
    "file": "Church in Recife downtown.jpg"
  },
  "restauro-pintura-mural-igreja": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Triumph_of_St._Ignatius_of_Loyola,_ceiling_fresco_by_Andrea_Pozzo.jpg",
    "file": "Triumph of St. Ignatius of Loyola, ceiling fresco by Andrea Pozzo.jpg"
  },
  "prospeccao-estratigrafica-o-que-e": {
    "author": "Ipigott (talk)",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Fanefjord_Church_interior.JPG",
    "file": "Fanefjord Church interior.JPG"
  },
  "umidade-em-igreja-antiga-causas-solucoes": {
    "author": "Eduardo P",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Igreja_de_Nossa_Senhora_do_Ros%C3%A1rio_(Andrel%C3%A2ndia).JPG",
    "file": "Igreja de Nossa Senhora do Rosário (Andrelândia).JPG"
  },
  "cupim-madeira-igreja-restauro": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Colonial_church_in_Nordeste_of_Brazil.jpg",
    "file": "Colonial church in Nordeste of Brazil.jpg"
  },
  "restauro-de-altar-talha-douramento": {
    "author": "14GTR",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Detail_of_the_Troyes_Altarpiece,_V%26A_London_04.jpg",
    "file": "Detail of the Troyes Altarpiece, V&A London 04.jpg"
  },
  "restauro-de-imagens-sacras": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Estatua_en_Monasterio_de_S%C3%A3o_Bento_2.jpg",
    "file": "Estatua en Monasterio de São Bento 2.jpg"
  },
  "restauro-de-vitrais-igreja": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Stained_Glass_in_church_of_S%C3%A3o_Paulo_03.jpg",
    "file": "Stained Glass in church of São Paulo 03.jpg"
  },
  "restauro-de-forro-e-telhado-de-igreja": {
    "author": "Jebulon",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Roof_cross_church_Encarnacion,_Alhama_de_Granada,_Andalusia,_Spain.jpg",
    "file": "Roof cross church Encarnacion, Alhama de Granada, Andalusia, Spain.jpg"
  },
  "restauro-de-fachada-igreja-cores-reboco": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Santa_Ifig%C3%AAnia_in_S%C3%A3o_Paulo_02.jpg",
    "file": "Santa Ifigênia in São Paulo 02.jpg"
  },
  "laudo-tecnico-patrimonio-historico": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Interior_of_Igreja_de_Santo_Ant%C3%B4nio_(Recife).jpg",
    "file": "Interior of Igreja de Santo Antônio (Recife).jpg"
  },
  "conservacao-preventiva-igrejas-manutencao": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Stained_Glass_in_church_of_S%C3%A3o_Paulo_02.jpg",
    "file": "Stained Glass in church of São Paulo 02.jpg"
  },
  "iluminacao-igreja-patrimonio-projeto-luminotecnico": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Vitral_em_Igreja_Santa_Efigenia.jpg",
    "file": "Vitral em Igreja Santa Efigenia.jpg"
  },
  "marmorizacao-faux-marbre-igrejas": {
    "author": "Daniël de Blieck",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Daniel_de_Blieck_-_Church_interior_with_marble_columns,_l19038-b3tw8-1.jpg",
    "file": "Daniel de Blieck - Church interior with marble columns, l19038-b3tw8-1.jpg"
  },
  "igrejas-historicas-minas-gerais-barroco-restauro": {
    "author": "Unknown authorUnknown author",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Concei%C3%A7%C3%A3o_dos_Ouros_-_interior_da_igreja_matriz,_anos_70_(data_estimada),_d%C3%A9cada_de_1970.jpg",
    "file": "Conceição dos Ouros - interior da igreja matriz, anos 70 (data estimada), década de 1970.jpg"
  },
  "igrejas-interior-paulista-restauro-imigracao": {
    "author": "User:OS2Warp",
    "license": "Domínio público",
    "page": "https://commons.wikimedia.org/wiki/File:Igreja_matriz_de_Santana_do_Parna%C3%ADba.jpg",
    "file": "Igreja matriz de Santana do Parnaíba.jpg"
  },
  "restauro-alem-da-obra": {
    "author": "Wilfredor",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Stained_Glass_in_church_of_S%C3%A3o_Paulo_04.jpg",
    "file": "Stained Glass in church of São Paulo 04.jpg"
  },
  "as-camadas-do-tempo": {
    "author": "Bryanlaridma",
    "license": "CC0 (domínio público)",
    "page": "https://commons.wikimedia.org/wiki/File:Igreja_Matriz_do_Divino_Pai_Eterno.jpg",
    "file": "Igreja Matriz do Divino Pai Eterno.jpg"
  }
};

/** Crédito de uma capa: só existe para imagens de /blog/<slug>.jpg. */
export function creditFor(coverUrl: string | null | undefined): BlogCredit | null {
  const m = coverUrl?.match(/^\/blog\/([a-z0-9-]+)\.jpg$/);
  return m ? (BLOG_CREDITS[m[1]] ?? null) : null;
}
