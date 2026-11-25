# Plano de SEO — Estúdio Restaura

Meta: ser o resultado nº 1 no Google Brasil para restauro, patrimônio histórico e arte sacra.
Atualizado em 25/11/2026.

## Expectativa realista

- "Restauro" e "patrimônio histórico" sozinhos são termos genéricos, dominados por IPHAN, universidades, Wikipedia e portais. Ser nº 1 neles em poucos meses não é realista.
- O caminho que funciona: dominar primeiro os termos de **intenção de contratação** (quem procura empresa, laudo, projeto), onde a concorrência é pequena, e ir subindo para os termos amplos.
- Prazo típico: primeiros resultados em 4 a 8 semanas, liderança nos nichos em 4 a 6 meses, termos amplos em 9 a 18 meses.
- Ninguém garante posição no Google. O que controlamos é a qualidade técnica, o conteúdo e a autoridade.

## Onde estamos (auditoria de 25/11/2026)

Já feito:
- Search Console verificado, sitemap com 57 páginas processado, home indexada.
- Medição de visitas (Vercel Analytics) ativa.
- Imagem de compartilhamento (og:image) na home e em cada projeto.
- 30 artigos no blog (cerca de 2.600 palavras cada), com dados estruturados e canonical.
- 18 projetos publicados, todas as páginas e imagens respondendo 200.

Falhas encontradas:
1. A home não tem `<h1>`.
2. Home, /projetos, /sobre, /servicos e as páginas de projeto não têm `canonical`.
3. Nenhum dado estruturado (JSON-LD) na home, nos serviços nem nos projetos. Só o blog tem.
4. Textos alternativos vazios em parte das imagens (7 de 49 em uma página de projeto).
5. Serviços numa página única. Não existe uma página por serviço, e é isso que ranqueia "restauro de pintura mural", "laudo técnico", etc.
6. Texto dos projetos curto (um parágrafo). O Google precisa de mais conteúdo para entender e ranquear cada obra.
7. Velocidade não medida (a cota gratuita da API do PageSpeed estourou). A home pesa cerca de 400 KB só de HTML e tem vídeo e muitas imagens. Medir antes de mexer.
8. Sem Perfil da Empresa no Google (se existir, não está ligado ao site).
9. Quase nenhum link de outros sites para o nosso (backlinks).

## Fase 1 — Técnico (CONCLUÍDA em 25/11/2026, exceto onde indicado)

Feito: h1 na home, canonical em todas as páginas, dados estruturados (Organization, WebSite, BreadcrumbList, CreativeWork nos projetos, Service e FAQPage nos serviços), 8 páginas de serviço, texto alternativo descritivo, sitemap com 65 páginas e lastmod, vídeo da home carregando só quando aparece (peso da home de 7,3 MB para 1,9 MB), primeira dobra por CSS.
Pendente: LocalBusiness com endereço (aguarda dados do estúdio), páginas de projeto estáticas (ISR; conflita com a pré-visualização de rascunhos do admin), mais redução de JavaScript na home (nota mobile ainda 50 a 60), breadcrumbs visíveis.


1. `<h1>` na home com a frase principal do estúdio e a palavra-chave ("restauro e conservação de patrimônio histórico").
2. `canonical` em todas as páginas.
3. Dados estruturados:
   - `ProfessionalService` / `LocalBusiness` com nome, endereço, telefone, áreas atendidas e redes sociais (precisa do endereço — ver "O que preciso de você");
   - `WebSite` e `BreadcrumbList` em todas as páginas internas;
   - `CreativeWork` em cada projeto (local, ano, equipe, fotógrafo);
   - `FAQPage` nas páginas de serviço.
4. Texto alternativo descritivo em 100% das imagens, gerado a partir do título do projeto e da legenda.
5. Uma página por serviço, cada uma mirando uma busca (lista na Fase 2), com texto próprio, fotos reais, FAQ e chamada para orçamento.
6. Páginas de projeto estáticas com atualização automática (ISR), para carregar mais rápido e aguentar pico de visitas.
7. Auditoria de velocidade (Core Web Vitals) no celular: LCP da home, peso do vídeo e das imagens, fontes. Meta: nota 90+ no mobile.
8. `lastmod` no sitemap e mapa de imagens, para o Google redescobrir o que mudou.
9. Links internos: blog → serviço → projeto relacionado, e breadcrumbs visíveis.

## Fase 2 — Conteúdo (contínuo)

Páginas de serviço (palavra-chave principal de cada uma):
- Restauro de igrejas e edifícios históricos
- Restauro de pintura mural e arte sacra
- Prospecção estratigráfica e análise cromática
- Laudo técnico e diagnóstico de conservação de patrimônio
- Projeto de decoração e iluminação de igrejas
- Conservação preventiva e manutenção de patrimônio
- Restauro de imagens sacras, douração e policromia
- Consultoria em leis de incentivo (Rouanet, ProAC, PNAB) para obras de patrimônio

Páginas por região (quem contrata procura perto): restauro de igrejas em Minas Gerais, interior de São Paulo, Goiás, e uma por cidade onde já atuamos (Itajubá, Jataí, Botucatu, Sertãozinho, etc.), apontando para os projetos reais de cada lugar.

Projetos: ampliar cada um de 1 para 3 a 5 parágrafos: problema encontrado, método, materiais, resultado, prazo, e o antes/depois já existente. É o nosso maior diferencial sobre concorrentes que só têm texto.

Blog:
- 4 artigos por mês, escritos a partir da experiência da equipe (o Google valoriza autoria e experiência real).
- Guias grandes (3.000+ palavras) sobre os temas de maior busca: como contratar restauro, documentos e aprovações do IPHAN (Portaria 420), custo de restauro, cupim e umidade, conservação preventiva.
- Revisar e atualizar os 30 artigos existentes a cada 6 meses.
- Cada artigo com autor identificado, formação e registro profissional.

## Fase 3 — Autoridade (links e presença)

1. **Perfil da Empresa no Google** (Google Business Profile): o maior ganho local. Categoria "Serviço de restauração", fotos de obras, horário, área de atendimento, link do site. Pedir avaliações a clientes.
2. **Links de clientes**: paróquias, dioceses, prefeituras e o SESC citando o projeto com link para a página da obra no nosso site.
3. **Entidades do setor**: ABRACOR (conservadores-restauradores), CAU, IPHAN, universidades e grupos de pesquisa em patrimônio.
4. **Imprensa e portais**: pautar casos de destaque (mural de Sacilotto no SESC, conjunto de Claudio Pastro em Jataí, prospecções) em jornais regionais e portais de arquitetura (ArchDaily Brasil, Vitruvius, Casa e Jardim).
5. **Créditos com link**: fotógrafos e parceiros que já creditamos (Giovana Souza, Cauê Colodro, Taíse Cortês, Natália Nascimento, Isabela Innocenti, Daniel Cortes Beretta) citando o site no portfólio deles.
6. **Redes**: link do site na bio do Instagram com parâmetro de rastreamento, YouTube com os diários de obra e link na descrição, LinkedIn institucional, Pinterest com os antes/depois.

## Fase 4 — Medir e ajustar (toda semana, 15 minutos)

- Search Console, aba Desempenho: consultas, impressões, cliques e posição média. Anotar as consultas em que estamos entre as posições 8 e 20: são as que mais rápido chegam ao topo.
- Conferir as páginas indexadas e os erros de cobertura.
- Vercel Analytics: de onde vem a visita e quais páginas convertem em mensagem no CRM.
- Uma checagem mensal manual: pesquisar no Google as 10 buscas-alvo e registrar a posição (planilha).
- Metas a acompanhar: impressões por mês, cliques, nº de buscas-alvo no top 10, nº de links de outros sites, nº de mensagens do formulário.

## Ordem de execução

1. Semana 1: Fase 1 (técnico) + Perfil da Empresa no Google.
2. Semanas 2 a 4: páginas de serviço, ampliar textos dos projetos, primeiros pedidos de links a clientes.
3. Mês 2 em diante: páginas por região, blog quatro vezes por mês, imprensa.
4. Revisão com dados do Search Console a cada 30 dias.

## O que preciso de você

- Endereço, telefone e horário do estúdio para o Perfil no Google e para os dados estruturados (ou diga se prefere atender só por "área de atendimento", sem endereço público).
- Nome, formação e registro (CAU / CRBC / ABRACOR) de quem assina os textos técnicos.
- Autorização para pedir link e avaliação a clientes e parceiros.
- Fotos e relatos de bastidores para os textos dos projetos.
