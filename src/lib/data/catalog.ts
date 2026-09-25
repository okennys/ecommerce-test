import type { StoreProduct } from "@/types/medusa";
import {
  hasCategory,
  productTags,
  productFromPrice,
  byCollection,
  CATEGORY_NAMES,
  CATEGORY_ORDER,
} from "./products";

/**
 * Catalogue tree — drives the PLP routes and the mega-menu.
 *
 * It is **built from the products Medusa returns**, not hardcoded: a category
 * with nothing in it never becomes a node, so taking a line offline in the
 * backend removes it from the site instead of leaving an empty page and a dead
 * menu link. `buildCatalog()` is pure — `catalogue.ts` calls it with the fetched
 * list and caches the result.
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

export interface Catalog {
  nodes: CatalogNode[];
  /** category handles that actually have products, in menu order */
  stockedCategories: string[];
  /** round "gifts under" cut-off, derived from the price spread */
  giftCeiling: number;
}

const CATEGORY_BANNER: Record<string, string> = { joias: "editorial-acessorios" };

/** "R$ 1.000" — the gift node's own label, without pulling in the money helper. */
export function giftLabel(amount: number): string {
  return `R$ ${amount.toLocaleString("pt-BR")}`;
}

function computeGiftCeiling(products: StoreProduct[]): number {
  const prices = products.map((p) => productFromPrice(p).amount).sort((a, b) => a - b);
  const median = prices[Math.floor(prices.length / 2)] ?? 0;
  const step = median > 1000 ? 500 : median > 300 ? 100 : 50;
  return Math.max(step, Math.floor(median / step) * step);
}

function buildTree(stocked: string[], giftCeiling: number): Record<Section, RawNode> {
  const categoryChildren: Record<string, RawNode> = Object.fromEntries(
    stocked.map((handle) => [
      handle,
      {
        title: CATEGORY_NAMES[handle] ?? handle,
        select: { by: "category", handle },
        ...(CATEGORY_BANNER[handle] ? { editorialImage: CATEGORY_BANNER[handle] } : {}),
      } satisfies RawNode,
    ]),
  );

  return {
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
        ...(stocked.includes("joias")
          ? { joias: { title: "Joias", select: { by: "category", handle: "joias" } } satisfies RawNode }
          : {}),
        [`ate-${giftCeiling}`]: {
          title: `Até ${giftLabel(giftCeiling)}`,
          select: { by: "maxPrice", amount: giftCeiling },
        },
      },
    },
  };
}

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
  out.push({
    section,
    segments,
    href,
    title: raw.title,
    intro: raw.intro,
    editorialImage: raw.editorialImage,
    crumbs: [...crumbs, selfCrumb],
    select: raw.select,
  });
  if (raw.children) {
    for (const [key, child] of Object.entries(raw.children)) {
      walk(section, child, [...segments, key], [...crumbs, selfCrumb], out);
    }
  }
}

const HOME_CRUMB = { label: "Início", href: "/" };

export function buildCatalog(products: StoreProduct[]): Catalog {
  const stockedCategories = CATEGORY_ORDER.filter((handle) =>
    products.some((p) => hasCategory(p, handle)),
  );
  const giftCeiling = computeGiftCeiling(products);
  const tree = buildTree(stockedCategories, giftCeiling);

  const nodes: CatalogNode[] = [];
  (Object.keys(tree) as Section[]).forEach((section) => {
    walk(section, tree[section], [], [HOME_CRUMB], nodes);
  });

  return { nodes, stockedCategories, giftCeiling };
}

// ---- lookups ---------------------------------------------------------------

export function getCatalogNode(
  catalog: Catalog,
  section: Section,
  segments: string[],
): CatalogNode | undefined {
  const key = segments.join("/");
  return catalog.nodes.find((n) => n.section === section && n.segments.join("/") === key);
}

/** All `[[...path]]` param combos for a section, for generateStaticParams. */
export function catalogParamsForSection(catalog: Catalog, section: Section): { path: string[] }[] {
  return catalog.nodes.filter((n) => n.section === section).map((n) => ({ path: n.segments }));
}

export function getProductsForNode(products: StoreProduct[], node: CatalogNode): StoreProduct[] {
  switch (node.select.by) {
    case "all":
      return products;
    case "category": {
      const h = node.select.handle;
      return products.filter((p) => hasCategory(p, h));
    }
    case "collection":
      return byCollection(products, node.select.handle);
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
export function childNodes(catalog: Catalog, node: CatalogNode): CatalogNode[] {
  return catalog.nodes.filter(
    (n) =>
      n.section === node.section &&
      n.segments.length === node.segments.length + 1 &&
      n.segments.slice(0, node.segments.length).join("/") === node.segments.join("/"),
  );
}
