/**
 * Editorial articles. Mock copy for the approval build.
 *
 * SWAP POINT: source from a CMS. `blocks` is a tiny rich-text subset
 * (paragraph / image / quote) rendered by `src/components/content/Article.tsx`.
 */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; by?: string }
  | { type: "image"; src: string; alt: string; caption?: string };

export interface Article {
  slug: string;
  kicker: string;
  title: string;
  dek: string;
  date: string;
  readingTime: string;
  hero: string;
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "os-gestos-da-alfaiataria",
    kicker: "Bastidores",
    title: "Os gestos da alfaiataria",
    dek: "Uma tarde no ateliê, onde cada casaco da coleção Outono Inverno 26 nasce de um molde traçado à mão.",
    date: "2026-08-20",
    readingTime: "4 min de leitura",
    hero: "editorial-film",
    blocks: [
      {
        type: "p",
        text: "A alfaiataria da JU RUDOLPH começa antes do tecido: começa no papel kraft esticado sobre a mesa de corte, onde a modelista desenha as linhas que vão definir o caimento de um ombro pelos próximos dez anos.",
      },
      {
        type: "image",
        src: "editorial-atelier",
        alt: "Mesa de corte no ateliê JU RUDOLPH",
        caption: "Ateliê JU RUDOLPH, São Paulo.",
      },
      {
        type: "h",
        text: "O tempo de uma peça",
      },
      {
        type: "p",
        text: "Um trench de lã dupla face leva, em média, catorze horas de trabalho manual. As lapelas são passadas a ferro três vezes; a barra é chuleada à mão para não marcar o avesso.",
      },
      {
        type: "quote",
        text: "Uma peça de alfaiataria bem feita é aquela que você esquece que está vestindo.",
        by: "Ju Rudolph",
      },
      {
        type: "p",
        text: "É esse o padrão que guia a casa: roupa que se move com o corpo, que envelhece bem, que volta para o ateliê para ajustes em vez de ir para o descarte.",
      },
    ],
  },
  {
    slug: "paleta-outono-inverno-26",
    kicker: "Coleção",
    title: "A paleta de Outono Inverno 26",
    dek: "Areia, cognac, grafite e um vinho profundo. As cores da estação e as histórias por trás delas.",
    date: "2026-08-06",
    readingTime: "3 min de leitura",
    hero: "editorial-season",
    blocks: [
      {
        type: "p",
        text: "Toda coleção da JU RUDOLPH parte de uma paleta curta — no máximo seis cores — para que as peças conversem entre si e possam ser combinadas por anos.",
      },
      {
        type: "image",
        src: "editorial-colecao",
        alt: "Look da coleção Outono Inverno 26",
      },
      {
        type: "p",
        text: "Para o inverno, partimos de tons quentes e terrosos — areia e cognac — contrastados por um grafite frio e um vinho quase preto, reservado para as peças-statement.",
      },
    ],
  },
  {
    slug: "como-cuidar-do-couro",
    kicker: "Serviço",
    title: "Como cuidar das suas bolsas de couro",
    dek: "Cinco hábitos simples para que uma Rudolph ou uma Jabuti dure décadas.",
    date: "2026-07-18",
    readingTime: "5 min de leitura",
    hero: "editorial-bolsas",
    blocks: [
      {
        type: "p",
        text: "O couro é uma matéria viva: reage à umidade, ao calor e ao toque. Bem cuidado, ganha pátina; mal cuidado, resseca e racha.",
      },
      { type: "h", text: "1. Guarde recheada" },
      {
        type: "p",
        text: "Ao guardar a bolsa, preencha o interior com papel de seda para manter a estrutura e evitar vincos permanentes.",
      },
      { type: "h", text: "2. Longe do sol direto" },
      {
        type: "p",
        text: "A luz solar direta desbota e resseca. Guarde a peça na sacola de tecido que acompanha a compra.",
      },
      { type: "h", text: "3. Hidrate duas vezes ao ano" },
      {
        type: "p",
        text: "Use um hidratante de couro neutro, aplicado com pano macio, a cada seis meses — ou traga a peça a uma de nossas lojas para o serviço de cuidado.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
