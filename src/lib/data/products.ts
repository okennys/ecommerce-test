import type { StoreProduct, StoreProductVariant } from "@/types/medusa";
import { ph } from "./media";

/**
 * Catalogue fixtures. Shapes match the Medusa v2 Store API so later milestones
 * can swap `store.product.list()` in without touching components.
 *
 * SWAP POINT: replace this whole module with real Medusa calls once
 * MEDUSA_BACKEND_URL is wired (see src/lib/medusa.ts). `metadata.colours`
 * (per-colour image sets) maps onto Medusa variant images / option values.
 */

const CLOTHES = ["PP", "P", "M", "G", "GG"];
const SHOES = ["34", "35", "36", "37", "38", "39"];
const ONE = ["Único"];

export interface ProductColour {
  name: string;
  hex: string;
  images: string[];
}

interface Source {
  handle: string;
  title: string;
  category: string;
  subcategory: string;
  price: number;
  materia: string;
  sizes: string[];
  colours: { name: string; hex: string; seeds: string[] }[];
  collection?: string;
  tags?: string[];
  description?: string;
}

const CATEGORY_NAME: Record<string, string> = {
  roupas: "Roupas",
  bolsas: "Bolsas",
  sapatos: "Sapatos",
  acessorios: "Acessórios",
  vestidos: "Vestidos",
  alfaiataria: "Alfaiataria",
  camisas: "Camisas e blusas",
  trico: "Tricô",
  jaquetas: "Jaquetas e casacos",
  calcas: "Calças",
  saias: "Saias",
  rudolph: "Rudolph",
  jabuti: "Jabuti",
  vera: "Vera",
  ombro: "Ombro",
  tote: "Tote",
  mini: "Mini",
  saltos: "Saltos",
  rasteiras: "Rasteiras",
  botas: "Botas",
  tenis: "Tênis",
  joias: "Joias",
  cintos: "Cintos",
  oculos: "Óculos",
  lencos: "Lenços",
};

function make(s: Source): StoreProduct {
  const colours: ProductColour[] = s.colours.map((c) => ({
    name: c.name,
    hex: c.hex,
    images: c.seeds.map((seed) => ph(seed)),
  }));

  const images = colours[0].images.map((url, i) => ({ id: `${s.handle}-img-${i}`, url, rank: i }));

  const variants: StoreProductVariant[] = [];
  s.colours.forEach((c, ci) => {
    s.sizes.forEach((size, si) => {
      // deterministic "some sizes sold out" — first size of the first colour, plus one mid size
      const soldOut = (ci === 0 && si === 0) || (ci === s.colours.length - 1 && si === s.sizes.length - 2);
      variants.push({
        id: `${s.handle}-v-${ci}-${size}`,
        title: `${size} / ${c.name}`,
        sku: `JR-${s.handle.toUpperCase().replace(/-/g, "")}-${size}-${c.name.slice(0, 2).toUpperCase()}`,
        options: { Tamanho: size, Cor: c.name },
        inventory_quantity: soldOut ? 0 : 4 + ((si + ci) % 5),
        calculated_price: { calculated_amount: s.price, currency_code: "BRL" },
      });
    });
  });

  return {
    id: `prod_${s.handle}`,
    title: s.title,
    handle: s.handle,
    subtitle: s.collection ? CATEGORY_NAME[s.subcategory] : undefined,
    description:
      s.description ??
      `Peça da coleção JU RUDOLPH, desenvolvida no ateliê em São Paulo com ${s.materia.toLowerCase()} e acabamento manual.`,
    status: "published",
    thumbnail: colours[0].images[0],
    images,
    options: [
      {
        id: `${s.handle}-o-size`,
        title: "Tamanho",
        values: s.sizes.map((v) => ({ id: `${s.handle}-s-${v}`, value: v })),
      },
      {
        id: `${s.handle}-o-colour`,
        title: "Cor",
        values: colours.map((c) => ({ id: `${s.handle}-c-${c.name}`, value: c.name })),
      },
    ],
    variants,
    collection_id: s.collection ? `col_${s.collection.replace(/-/g, "")}` : undefined,
    categories: [
      { id: `cat_${s.category}`, handle: s.category, name: CATEGORY_NAME[s.category] ?? s.category },
      {
        id: `cat_${s.subcategory}`,
        handle: s.subcategory,
        name: CATEGORY_NAME[s.subcategory] ?? s.subcategory,
      },
    ],
    metadata: {
      colour: colours[0].name,
      materia: s.materia,
      tags: s.tags ?? [],
      colours,
    },
  };
}

// ---------------------------------------------------------------------------

const SOURCES: Source[] = [
  // ---- ROUPAS · vestidos
  {
    handle: "vestido-midi-crepe",
    title: "Vestido midi em crepe",
    category: "roupas",
    subcategory: "vestidos",
    price: 5400,
    materia: "Crepe de viscose",
    sizes: CLOTHES,
    collection: "outono-inverno-26",
    tags: ["novidade"],
    colours: [
      { name: "Preto", hex: "#14110f", seeds: ["look-02", "look-02b"] },
      { name: "Vinho", hex: "#5b2333", seeds: ["look-08", "look-02b"] },
    ],
  },
  {
    handle: "vestido-longo-seda",
    title: "Vestido longo em seda",
    category: "roupas",
    subcategory: "vestidos",
    price: 6900,
    materia: "Seda pura",
    sizes: CLOTHES,
    collection: "outono-inverno-26",
    tags: ["novidade"],
    colours: [
      { name: "Marfim", hex: "#efe9dd", seeds: ["look-02b", "look-02"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-04", "look-02"] },
    ],
  },
  {
    handle: "vestido-chemise-alfaiataria",
    title: "Vestido chemise de alfaiataria",
    category: "roupas",
    subcategory: "vestidos",
    price: 4700,
    materia: "Lã fria",
    sizes: CLOTHES,
    tags: ["de-volta"],
    colours: [
      { name: "Areia", hex: "#d9cbb3", seeds: ["look-05", "look-01"] },
      { name: "Grafite", hex: "#4a4a4a", seeds: ["look-03", "look-03b"] },
    ],
  },
  {
    handle: "vestido-tricot-canelado",
    title: "Vestido de tricô canelado",
    category: "roupas",
    subcategory: "vestidos",
    price: 3900,
    materia: "Lã merino",
    sizes: CLOTHES,
    tags: ["selecao"],
    colours: [
      { name: "Camel", hex: "#a9773f", seeds: ["look-05", "look-05b"] },
      { name: "Off-white", hex: "#ece7dc", seeds: ["look-11", "look-05b"] },
    ],
  },

  // ---- ROUPAS · alfaiataria
  {
    handle: "trench-alfaiataria-la",
    title: "Trench de alfaiataria em lã",
    category: "roupas",
    subcategory: "alfaiataria",
    price: 8900,
    materia: "Lã dupla face",
    sizes: CLOTHES,
    collection: "outono-inverno-26",
    tags: ["novidade", "icone", "selecao"],
    colours: [
      { name: "Areia", hex: "#d9cbb3", seeds: ["look-01", "look-01b"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-01b", "look-01"] },
    ],
  },
  {
    handle: "blazer-estruturado-la-fria",
    title: "Blazer estruturado em lã fria",
    category: "roupas",
    subcategory: "alfaiataria",
    price: 6200,
    materia: "Lã fria",
    sizes: CLOTHES,
    collection: "outono-inverno-26",
    tags: ["novidade"],
    colours: [
      { name: "Grafite", hex: "#4a4a4a", seeds: ["look-03", "look-03b"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-11", "look-03b"] },
    ],
  },
  {
    handle: "colete-alfaiataria",
    title: "Colete de alfaiataria",
    category: "roupas",
    subcategory: "alfaiataria",
    price: 3200,
    materia: "Lã fria",
    sizes: CLOTHES,
    tags: ["selecao"],
    colours: [
      { name: "Preto", hex: "#14110f", seeds: ["look-03b", "look-03"] },
      { name: "Risca de giz", hex: "#3a3a3c", seeds: ["look-06", "look-06b"] },
    ],
  },

  // ---- ROUPAS · camisas
  {
    handle: "camisa-seda-fluida",
    title: "Camisa de seda fluida",
    category: "roupas",
    subcategory: "camisas",
    price: 3200,
    materia: "Seda pura",
    sizes: CLOTHES,
    collection: "pre-colecao",
    tags: ["novidade"],
    colours: [
      { name: "Marfim", hex: "#efe9dd", seeds: ["look-04", "look-04b"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-04b", "look-04"] },
    ],
  },
  {
    handle: "blusa-gola-laco",
    title: "Blusa com gola laço",
    category: "roupas",
    subcategory: "camisas",
    price: 2600,
    materia: "Crepe de seda",
    sizes: CLOTHES,
    colours: [
      { name: "Off-white", hex: "#ece7dc", seeds: ["look-09", "look-04b"] },
      { name: "Cognac", hex: "#8a4b2d", seeds: ["look-07", "look-04"] },
    ],
  },
  {
    handle: "camisa-popeline-oversize",
    title: "Camisa de popeline oversize",
    category: "roupas",
    subcategory: "camisas",
    price: 2400,
    materia: "Algodão popeline",
    sizes: CLOTHES,
    tags: ["de-volta"],
    colours: [
      { name: "Branco", hex: "#f4f1ea", seeds: ["look-09", "look-04"] },
      { name: "Azul-claro", hex: "#b8c7d6", seeds: ["look-04", "look-09"] },
    ],
  },

  // ---- ROUPAS · trico
  {
    handle: "trico-gola-alta-merino",
    title: "Tricô gola alta em lã merino",
    category: "roupas",
    subcategory: "trico",
    price: 2900,
    materia: "Lã merino",
    sizes: CLOTHES,
    collection: "pre-colecao",
    tags: ["selecao"],
    colours: [
      { name: "Camel", hex: "#a9773f", seeds: ["look-05", "look-05b"] },
      { name: "Cinza", hex: "#8f8b85", seeds: ["look-12", "look-05"] },
    ],
  },
  {
    handle: "cardigan-la-boucle",
    title: "Cardigã em lã bouclé",
    category: "roupas",
    subcategory: "trico",
    price: 3400,
    materia: "Lã bouclé",
    sizes: CLOTHES,
    colours: [
      { name: "Marfim", hex: "#efe9dd", seeds: ["look-12", "look-05b"] },
      { name: "Verde musgo", hex: "#4b5a3f", seeds: ["look-11", "look-12"] },
    ],
  },

  // ---- ROUPAS · jaquetas
  {
    handle: "casaco-la-dupla-face",
    title: "Casaco em lã dupla face",
    category: "roupas",
    subcategory: "jaquetas",
    price: 9600,
    materia: "Lã dupla face",
    sizes: CLOTHES,
    collection: "outono-inverno-26",
    tags: ["novidade"],
    colours: [
      { name: "Camel", hex: "#a9773f", seeds: ["look-01", "look-01b"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-01b", "look-01"] },
    ],
  },
  {
    handle: "jaqueta-couro-caramelo",
    title: "Jaqueta de couro",
    category: "roupas",
    subcategory: "jaquetas",
    price: 7800,
    materia: "Couro de cordeiro",
    sizes: CLOTHES,
    tags: ["selecao"],
    colours: [
      { name: "Caramelo", hex: "#9c5f33", seeds: ["look-07", "look-01"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-03", "look-07"] },
    ],
  },
  {
    handle: "trench-gabardine",
    title: "Trench em gabardine",
    category: "roupas",
    subcategory: "jaquetas",
    price: 6900,
    materia: "Gabardine de algodão",
    sizes: CLOTHES,
    tags: ["de-volta"],
    colours: [
      { name: "Bege", hex: "#cbb79c", seeds: ["look-01", "look-01b"] },
      { name: "Azul-noite", hex: "#22314f", seeds: ["look-01b", "look-01"] },
    ],
  },

  // ---- ROUPAS · calcas
  {
    handle: "calca-alfaiataria-pala-baixa",
    title: "Calça de alfaiataria pala baixa",
    category: "roupas",
    subcategory: "calcas",
    price: 3600,
    materia: "Lã fria",
    sizes: CLOTHES,
    collection: "pre-colecao",
    tags: ["selecao"],
    colours: [
      { name: "Preto", hex: "#14110f", seeds: ["look-06", "look-06b"] },
      { name: "Risca de giz", hex: "#3a3a3c", seeds: ["look-06b", "look-06"] },
    ],
  },
  {
    handle: "calca-reta-cambraia",
    title: "Calça reta em cambraia",
    category: "roupas",
    subcategory: "calcas",
    price: 2800,
    materia: "Cambraia de linho",
    sizes: CLOTHES,
    colours: [
      { name: "Areia", hex: "#d9cbb3", seeds: ["look-09", "look-06"] },
      { name: "Chumbo", hex: "#3a3a3c", seeds: ["look-06", "look-09"] },
    ],
  },

  // ---- ROUPAS · saias
  {
    handle: "saia-midi-plissada",
    title: "Saia midi plissada",
    category: "roupas",
    subcategory: "saias",
    price: 3100,
    materia: "Twill de viscose",
    sizes: CLOTHES,
    tags: ["novidade"],
    colours: [
      { name: "Grafite", hex: "#4a4a4a", seeds: ["look-06", "look-08"] },
      { name: "Terracota", hex: "#a8624a", seeds: ["look-08", "look-06"] },
    ],
  },

  // ---- BOLSAS · rudolph
  {
    handle: "bolsa-rudolph-media",
    title: "Bolsa Rudolph média em couro",
    category: "bolsas",
    subcategory: "rudolph",
    price: 7400,
    materia: "Couro granulado",
    sizes: ONE,
    collection: "icones",
    tags: ["icone", "selecao"],
    colours: [
      { name: "Cognac", hex: "#8a4b2d", seeds: ["bag-01", "bag-01b"] },
      { name: "Preto", hex: "#14110f", seeds: ["bag-02", "bag-02b"] },
    ],
  },
  {
    handle: "bolsa-rudolph-mini",
    title: "Bolsa Rudolph mini em couro",
    category: "bolsas",
    subcategory: "rudolph",
    price: 5600,
    materia: "Couro granulado",
    sizes: ONE,
    collection: "icones",
    tags: ["icone"],
    colours: [
      { name: "Areia", hex: "#d9cbb3", seeds: ["bag-01b", "bag-01"] },
      { name: "Rosa antigo", hex: "#c98f8f", seeds: ["bag-03", "bag-01b"] },
    ],
  },

  // ---- BOLSAS · jabuti
  {
    handle: "bolsa-jabuti-pequena",
    title: "Bolsa Jabuti pequena em couro matelassê",
    category: "bolsas",
    subcategory: "jabuti",
    price: 5900,
    materia: "Couro matelassê",
    sizes: ONE,
    collection: "icones",
    tags: ["icone", "selecao"],
    colours: [
      { name: "Preto", hex: "#14110f", seeds: ["bag-02", "bag-02b"] },
      { name: "Marfim", hex: "#efe9dd", seeds: ["bag-02b", "bag-02"] },
    ],
  },
  {
    handle: "bolsa-jabuti-media",
    title: "Bolsa Jabuti média em couro matelassê",
    category: "bolsas",
    subcategory: "jabuti",
    price: 7200,
    materia: "Couro matelassê",
    sizes: ONE,
    collection: "icones",
    tags: ["icone"],
    colours: [
      { name: "Chumbo", hex: "#3a3a3c", seeds: ["bag-02", "bag-02b"] },
      { name: "Vinho", hex: "#5b2333", seeds: ["bag-02b", "bag-02"] },
    ],
  },

  // ---- BOLSAS · vera / ombro / tote / mini
  {
    handle: "bolsa-vera-tiracolo",
    title: "Bolsa Vera tiracolo",
    category: "bolsas",
    subcategory: "vera",
    price: 4300,
    materia: "Couro liso",
    sizes: ONE,
    tags: ["novidade"],
    colours: [
      { name: "Teal", hex: "#1f6f78", seeds: ["bag-02b", "bag-03"] },
      { name: "Preto", hex: "#14110f", seeds: ["bag-02", "bag-02b"] },
    ],
  },
  {
    handle: "bolsa-ombro-corrente",
    title: "Bolsa de ombro com corrente",
    category: "bolsas",
    subcategory: "ombro",
    price: 4900,
    materia: "Couro liso",
    sizes: ONE,
    tags: ["selecao"],
    colours: [
      { name: "Rosa antigo", hex: "#c98f8f", seeds: ["bag-03", "bag-01b"] },
      { name: "Preto", hex: "#14110f", seeds: ["bag-02", "bag-03"] },
    ],
  },
  {
    handle: "bolsa-tote-couro",
    title: "Bolsa tote em couro",
    category: "bolsas",
    subcategory: "tote",
    price: 6100,
    materia: "Couro selaria",
    sizes: ONE,
    tags: ["de-volta"],
    colours: [
      { name: "Cognac", hex: "#8a4b2d", seeds: ["bag-01", "bag-01b"] },
      { name: "Preto", hex: "#14110f", seeds: ["bag-01b", "bag-01"] },
    ],
  },
  {
    handle: "bolsa-mini-tiracolo",
    title: "Mini bolsa tiracolo",
    category: "bolsas",
    subcategory: "mini",
    price: 3200,
    materia: "Couro liso",
    sizes: ONE,
    tags: ["novidade"],
    colours: [
      { name: "Areia", hex: "#d9cbb3", seeds: ["bag-01b", "bag-03"] },
      { name: "Preto", hex: "#14110f", seeds: ["bag-03", "bag-02"] },
    ],
  },

  // ---- SAPATOS
  {
    handle: "scarpin-vera-salto",
    title: "Scarpin Vera salto 85",
    category: "sapatos",
    subcategory: "saltos",
    price: 3400,
    materia: "Couro metalizado",
    sizes: SHOES,
    collection: "icones",
    tags: ["icone", "selecao"],
    colours: [
      { name: "Prata", hex: "#c7c7cc", seeds: ["shoe-01", "shoe-01"] },
      { name: "Preto", hex: "#14110f", seeds: ["shoe-01", "shoe-01"] },
    ],
  },
  {
    handle: "mule-salto-bloco",
    title: "Mule salto bloco",
    category: "sapatos",
    subcategory: "saltos",
    price: 2900,
    materia: "Couro nobuck",
    sizes: SHOES,
    tags: ["novidade"],
    colours: [
      { name: "Caramelo", hex: "#9c5f33", seeds: ["shoe-01", "shoe-01"] },
      { name: "Preto", hex: "#14110f", seeds: ["shoe-01", "shoe-01"] },
    ],
  },
  {
    handle: "bota-cano-alto-couro",
    title: "Bota cano alto em couro",
    category: "sapatos",
    subcategory: "botas",
    price: 5200,
    materia: "Couro liso",
    sizes: SHOES,
    collection: "outono-inverno-26",
    tags: ["novidade", "selecao"],
    colours: [
      { name: "Preto", hex: "#14110f", seeds: ["shoe-01", "shoe-03"] },
      { name: "Cognac", hex: "#8a4b2d", seeds: ["shoe-03", "shoe-01"] },
    ],
  },
  {
    handle: "sapatilha-bico-fino",
    title: "Sapatilha bico fino",
    category: "sapatos",
    subcategory: "rasteiras",
    price: 2100,
    materia: "Couro macio",
    sizes: SHOES,
    tags: ["de-volta"],
    colours: [
      { name: "Nude", hex: "#d8b79c", seeds: ["shoe-03", "shoe-01"] },
      { name: "Preto", hex: "#14110f", seeds: ["shoe-01", "shoe-03"] },
    ],
  },
  {
    handle: "tenis-couro-minimal",
    title: "Tênis de couro minimalista",
    category: "sapatos",
    subcategory: "tenis",
    price: 2600,
    materia: "Couro liso",
    sizes: SHOES,
    tags: ["selecao"],
    colours: [
      { name: "Branco", hex: "#f1efe9", seeds: ["shoe-03", "shoe-04"] },
      { name: "Pastel", hex: "#cdd6e6", seeds: ["shoe-04", "shoe-03"] },
    ],
  },

  // ---- ACESSÓRIOS
  {
    handle: "colar-elo-banhado",
    title: "Colar de elos banhado a ouro",
    category: "acessorios",
    subcategory: "joias",
    price: 1200,
    materia: "Latão banhado a ouro 18k",
    sizes: ONE,
    collection: "icones",
    tags: ["icone", "selecao"],
    colours: [
      { name: "Ouro", hex: "#b8912f", seeds: ["acc-03", "acc-01"] },
      { name: "Prata", hex: "#c7c7cc", seeds: ["acc-01", "acc-03"] },
    ],
  },
  {
    handle: "bracelete-cristais",
    title: "Bracelete de cristais",
    category: "acessorios",
    subcategory: "joias",
    price: 1600,
    materia: "Latão com cristais",
    sizes: ONE,
    tags: ["novidade"],
    colours: [
      { name: "Ouro rosé", hex: "#c98f6b", seeds: ["acc-02", "acc-03"] },
      { name: "Prata", hex: "#c7c7cc", seeds: ["acc-03", "acc-02"] },
    ],
  },
  {
    handle: "cinto-couro-fivela",
    title: "Cinto de couro com fivela",
    category: "acessorios",
    subcategory: "cintos",
    price: 980,
    materia: "Couro selaria",
    sizes: ["P", "M", "G"],
    tags: ["de-volta"],
    colours: [
      { name: "Cognac", hex: "#8a4b2d", seeds: ["look-09", "acc-04"] },
      { name: "Preto", hex: "#14110f", seeds: ["look-06", "look-09"] },
    ],
  },
  {
    handle: "oculos-gatinho-acetato",
    title: "Óculos gatinho em acetato",
    category: "acessorios",
    subcategory: "oculos",
    price: 1400,
    materia: "Acetato italiano",
    sizes: ONE,
    tags: ["novidade", "selecao"],
    colours: [
      { name: "Âmbar", hex: "#b07d3b", seeds: ["acc-04", "acc-05"] },
      { name: "Preto", hex: "#14110f", seeds: ["acc-05", "acc-04"] },
    ],
  },
  {
    handle: "lenco-seda-estampado",
    title: "Lenço de seda estampado",
    category: "acessorios",
    subcategory: "lencos",
    price: 890,
    materia: "Sarja de seda",
    sizes: ONE,
    tags: ["selecao"],
    colours: [
      { name: "Terracota", hex: "#a8624a", seeds: ["acc-05", "look-08"] },
      { name: "Azul-noite", hex: "#22314f", seeds: ["look-08", "acc-05"] },
    ],
  },
];

export const products: StoreProduct[] = SOURCES.map(make);
export const allProducts = products;

// ---------------------------------------------------------------------------
// selectors & helpers

export function getProduct(handle: string): StoreProduct | undefined {
  return products.find((p) => p.handle === handle);
}

export function getProductsByCollection(collectionHandle: string): StoreProduct[] {
  const id = `col_${collectionHandle.replace(/-/g, "")}`;
  return products.filter((p) => p.collection_id === id);
}

export function productTags(p: StoreProduct): string[] {
  return (p.metadata?.tags as string[] | undefined) ?? [];
}

export function productColours(p: StoreProduct): ProductColour[] {
  return (p.metadata?.colours as ProductColour[] | undefined) ?? [];
}

export function hasCategory(p: StoreProduct, handle: string): boolean {
  return (p.categories ?? []).some((c) => c.handle === handle);
}

/** Lowest calculated amount across a product's variants. */
export function productFromPrice(product: StoreProduct): { amount: number; currency: string } {
  const priced = product.variants
    .map((v) => v.calculated_price)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const min = priced.reduce((lo, p) => (p.calculated_amount < lo.calculated_amount ? p : lo), priced[0]);
  return { amount: min?.calculated_amount ?? 0, currency: min?.currency_code ?? "BRL" };
}

export function isInStock(product: StoreProduct): boolean {
  return product.variants.some((v) => (v.inventory_quantity ?? 0) > 0);
}

// ---- facets / filter / sort -------------------------------------------------

export interface Facets {
  sizes: string[];
  colours: { name: string; hex: string }[];
  priceMin: number;
  priceMax: number;
}

export function getFacets(list: StoreProduct[]): Facets {
  const sizeSet = new Set<string>();
  const colourMap = new Map<string, string>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of list) {
    for (const opt of p.options) {
      if (opt.title === "Tamanho") opt.values.forEach((v) => sizeSet.add(v.value));
    }
    for (const c of productColours(p)) colourMap.set(c.name, c.hex);
    const price = productFromPrice(p).amount;
    priceMin = Math.min(priceMin, price);
    priceMax = Math.max(priceMax, price);
  }
  const CLOTHES_ORDER = ["PP", "P", "M", "G", "GG"];
  const sizes = [...sizeSet].sort((a, b) => {
    const ia = CLOTHES_ORDER.indexOf(a);
    const ib = CLOTHES_ORDER.indexOf(b);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    return Number(a) - Number(b) || a.localeCompare(b);
  });
  return {
    sizes,
    colours: [...colourMap].map(([name, hex]) => ({ name, hex })).sort((a, b) => a.name.localeCompare(b.name)),
    priceMin: priceMin === Infinity ? 0 : priceMin,
    priceMax,
  };
}

export interface FilterParams {
  sizes?: string[];
  colours?: string[];
  maxPrice?: number;
}

export function filterProducts(list: StoreProduct[], params: FilterParams): StoreProduct[] {
  return list.filter((p) => {
    if (params.sizes?.length) {
      const pSizes = p.options.find((o) => o.title === "Tamanho")?.values.map((v) => v.value) ?? [];
      if (!params.sizes.some((s) => pSizes.includes(s))) return false;
    }
    if (params.colours?.length) {
      const pColours = productColours(p).map((c) => c.name);
      if (!params.colours.some((c) => pColours.includes(c))) return false;
    }
    if (params.maxPrice != null && productFromPrice(p).amount > params.maxPrice) return false;
    return true;
  });
}

export type SortKey = "novidades" | "preco-asc" | "preco-desc";

export function sortProducts(list: StoreProduct[], key: SortKey): StoreProduct[] {
  const out = [...list];
  if (key === "preco-asc") out.sort((a, b) => productFromPrice(a).amount - productFromPrice(b).amount);
  else if (key === "preco-desc") out.sort((a, b) => productFromPrice(b).amount - productFromPrice(a).amount);
  else
    out.sort((a, b) => {
      const na = productTags(a).includes("novidade") ? 0 : 1;
      const nb = productTags(b).includes("novidade") ? 0 : 1;
      return na - nb;
    });
  return out;
}

export function searchProducts(query: string): StoreProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter((p) => {
    const hay = [
      p.title,
      p.metadata?.materia as string,
      ...(p.categories ?? []).map((c) => c.name),
      ...productColours(p).map((c) => c.name),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((term) => hay.includes(term));
  });
}

export function getRelated(product: StoreProduct, limit = 4): StoreProduct[] {
  const sub = product.categories?.[1]?.handle;
  const cat = product.categories?.[0]?.handle;
  const pool = products.filter((p) => p.handle !== product.handle);
  const scored = pool
    .map((p) => {
      let score = 0;
      if (sub && hasCategory(p, sub)) score += 3;
      if (cat && hasCategory(p, cat)) score += 2;
      if (product.collection_id && p.collection_id === product.collection_id) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}
