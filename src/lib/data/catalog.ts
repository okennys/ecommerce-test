import type { StoreProduct } from "@/types/medusa";
import {
  products,
  getProductsByCollection,
  hasCategory,
  productTags,
  productFromPrice,
  CATEGORY_NAMES,
} from "./products";

/**
 * Catalogue tree — drives the PLP routes. Mirrors the mega-menu in
 * `navigation.ts`; kept separate so a node can carry PLP-only data (editorial
 * band image, product-selection rule, breadcrumbs).
 *
 * The categories below are exactly the ones the brand actually stocks. There is
 * no footwear, leather goods or eyewear in the catalogue, so there are no nodes
 * for them — anything added later needs a node here AND an entry in
 * `navigation.ts`.
 *
 * SWAP POINT: generate from `store.category.list()` + `store.collection.list()`.
 */

export type Section = "mulher" | "sale" | "highlights" | "presentes";

export interface CatalogNode {
  section: Section;
  /** path segments AFTER the section, e.g. ["vestidos"] */
  segments: string[];
  /** full url path, e.g. "/mulher/vestidos" */
  href: string;
  title: string;
  intro?: string;
  editorialImage?: string;
  crumbs: { label: string; href: string }[];
  select:
    | { by: "all" }
    | { by: "category"; handle: string }
    | { by: "collection"; handle: string }
    | { by: "tag"; handle: string }
    | { by: "maxPrice"; amount: number };
}

interface RawNode {
  title: string;
  intro?: string;
  editorialImage?: string;
  select: CatalogNode["select"];
  children?: Record<string, RawNode>;
}

/** One child node per stocked category, in the order they appear in the menu. */
const categoryChildren: Record<string, RawNode> = Object.fromEntries(
  (
    ["vestidos", "blusas", "conjuntos", "calcas", "denim", "saias", "casacos", "macacoes", "joias"] as const
  ).map((handle) => [
    handle,
    {
      title: CATEGORY_NAMES[handle],
      select: { by: "category", handle },
      ...(handle === "joias" ? { editorialImage: "editorial-acessorios" } : {}),
    } satisfies RawNode,
  ]),
);

const TREE: Record<Section, RawNode> = {
  mulher: {
    title: "Mulher",
    intro: "Toda a coleção JU RUDOLPH.",
    editorialImage: "editorial-colecao",
    select: { by: "all" },
    children: {
      novidades: {
        title: "Novidades",
        intro: "Tudo que acabou de chegar ao ateliê.",
        editorialImage: "editorial-season",
        select: { by: "tag", handle: "novidade" },
      },
      ...categoryChildren,
    },
  },
  sale: {
    title: "Sale",
    intro: "Peças selecionadas com preço especial, enquanto durarem os estoques.",
    editorialImage: "editorial-roupas",
    select: { by: "tag", handle: "sale" },
  },
  highlights: {
    title: "Highlights",
    intro: "Os destaques da estação, selecionados pela Ju.",
    editorialImage: "editorial-film",
    select: { by: "tag", handle: "selecao" },
    children: {
      selecao: {
        title: "Selecionados pela Ju",
        editorialImage: "editorial-film",
        select: { by: "tag", handle: "selecao" },
      },
      icones: {
        title: "Ícones",
        intro: "As peças que definem a casa.",
        editorialImage: "editorial-colecao",
        select: { by: "collection", handle: "icones" },
      },
    },
  },
  presentes: {
    title: "Presentes",
    intro: "Para presentear — ou se presentear.",
    editorialImage: "editorial-atelier",
    select: { by: "all" },
    children: {
      novidades: {
        title: "Novidades para presentear",
        select: { by: "tag", handle: "novidade" },
      },
      joias: { title: "Joias", select: { by: "category", handle: "joias" } },
      "ate-500": { title: "Até R$ 500", select: { by: "maxPrice", amount: 500 } },
    },
  },
};

// ---- flatten --------------------------------------------------------------

function walk(
  section: Section,
  raw: RawNode,
  segments: string[],
  crumbs: CatalogNode["crumbs"],
  out: CatalogNode[],
) {
  const href = "/" + [section, ...segments].join("/");
  const selfCrumb = { label: raw.title, href };
  const node: CatalogNode = {
    section,
    segments,
    href,
    title: raw.title,
    intro: raw.intro,
    editorialImage: raw.editorialImage,
    crumbs: [...crumbs, selfCrumb],
    select: raw.select,
  };
  out.push(node);
  if (raw.children) {
    for (const [key, child] of Object.entries(raw.children)) {
      walk(section, child, [...segments, key], [...crumbs, selfCrumb], out);
    }
  }
}

const HOME_CRUMB = { label: "Início", href: "/" };

export const catalogNodes: CatalogNode[] = (() => {
  const out: CatalogNode[] = [];
  (Object.keys(TREE) as Section[]).forEach((section) => {
    walk(section, TREE[section], [], [HOME_CRUMB], out);
  });
  return out;
})();

export function getCatalogNode(section: Section, segments: string[]): CatalogNode | undefined {
  const key = segments.join("/");
  return catalogNodes.find((n) => n.section === section && n.segments.join("/") === key);
}

/** All `[[...path]]` param combos for a section, for generateStaticParams. */
export function catalogParamsForSection(section: Section): { path: string[] }[] {
  return catalogNodes.filter((n) => n.section === section).map((n) => ({ path: n.segments }));
}

/** The PLP node a product belongs to — used for PDP breadcrumbs. */
export function nodeForProduct(product: StoreProduct): CatalogNode | undefined {
  const handle = product.categories?.[0]?.handle;
  if (!handle) return undefined;
  return catalogNodes.find(
    (n) => n.section === "mulher" && n.select.by === "category" && n.select.handle === handle,
  );
}

export function getProductsForNode(node: CatalogNode): StoreProduct[] {
  switch (node.select.by) {
    case "all":
      return products;
    case "category": {
      const h = node.select.handle;
      return products.filter((p) => hasCategory(p, h));
    }
    case "collection":
      return getProductsByCollection(node.select.handle);
    case "tag": {
      const h = node.select.handle;
      return products.filter((p) => productTags(p).includes(h));
    }
    case "maxPrice": {
      const amt = node.select.amount;
      return products.filter((p) => productFromPrice(p).amount <= amt);
    }
  }
}

/** Child nodes one level below the given node (for "explore the category" chips). */
export function childNodes(node: CatalogNode): CatalogNode[] {
  return catalogNodes.filter(
    (n) =>
      n.section === node.section &&
      n.segments.length === node.segments.length + 1 &&
      n.segments.slice(0, node.segments.length).join("/") === node.segments.join("/"),
  );
}
