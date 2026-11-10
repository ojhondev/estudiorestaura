export type Artigo = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  /** caminho da foto de capa em /public (sempre paisagem) */
  cover: string;
  /** texto no formato do blog: blocos separados por linha em branco, com ##, ###, listas e links */
  body: string;
};
