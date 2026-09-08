import type { StoreProduct } from "@/types/medusa";
import {
  products,
  getProductsByCollection,
  hasCategory,
  productTags,
  productFromPrice,
} from "./products";

/**
 * Catalogue tree — drives the PLP routes. Mirrors the mega-menu in
 * `navigation.ts`; kept separate so a node can carry PLP-only data (editorial
 * band image, product-selection rule, breadcrumbs).
 *
 * SWAP POINT: generate from `store.category.list()` + `store.collection.list()`.
 */

export type Section = "mulher" | "highlights" | "presentes";

export interface CatalogNode {
  section: Section;
  /** path segments AFTER the section, e.g. ["roupas","vestidos"] */
  segments: string[];
  /** full url path, e.g. "/mulher/roupas/vestidos" */
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

const TREE: Record<Section, RawNode> = {
  mulher: {
    title: "Mulher",
    intro: "Toda a coleção JU RUDOLPH — alfaiataria, vestidos, bolsas, sapatos e acessórios.",
    editorialImage: "editorial-colecao",
    select: { by: "all" },
    children: {
      novidades: {
        title: "Novidades",
        intro: "Tudo que acabou de chegar ao ateliê.",
        editorialImage: "editorial-season",
        select: { by: "tag", handle: "novidade" },
      },
      "outono-inverno-26": {
        title: "Outono Inverno 26",
        intro: "A nova coleção.",
        editorialImage: "editorial-season",
        select: { by: "collection", handle: "outono-inverno-26" },
      },
      "pre-colecao": {
        title: "Pré-coleção",
        select: { by: "collection", handle: "pre-colecao" },
      },
      "de-volta": {
        title: "De volta ao estoque",
        select: { by: "tag", handle: "de-volta" },
      },
      roupas: {
        title: "Roupas",
        editorialImage: "editorial-roupas",
        select: { by: "category", handle: "roupas" },
        children: {
          vestidos: { title: "Vestidos", select: { by: "category", handle: "vestidos" } },
          alfaiataria: { title: "Alfaiataria", select: { by: "category", handle: "alfaiataria" } },
          camisas: { title: "Camisas e blusas", select: { by: "category", handle: "camisas" } },
          trico: { title: "Tricô", select: { by: "category", handle: "trico" } },
          jaquetas: {
            title: "Jaquetas e casacos",
            select: { by: "category", handle: "jaquetas" },
          },
          calcas: { title: "Calças", select: { by: "category", handle: "calcas" } },
          saias: { title: "Saias", select: { by: "category", handle: "saias" } },
        },
      },
      bolsas: {
        title: "Bolsas",
        editorialImage: "editorial-bolsas",
        select: { by: "category", handle: "bolsas" },
        children: {
          rudolph: { title: "Rudolph", select: { by: "category", handle: "rudolph" } },
          jabuti: { title: "Jabuti", select: { by: "category", handle: "jabuti" } },
          vera: { title: "Vera", select: { by: "category", handle: "vera" } },
          ombro: { title: "Ombro", select: { by: "category", handle: "ombro" } },
          tote: { title: "Tote", select: { by: "category", handle: "tote" } },
          mini: { title: "Mini", select: { by: "category", handle: "mini" } },
        },
      },
      sapatos: {
        title: "Sapatos",
        editorialImage: "editorial-sapatos",
        select: { by: "category", handle: "sapatos" },
        children: {
          saltos: { title: "Saltos", select: { by: "category", handle: "saltos" } },
          rasteiras: { title: "Rasteiras", select: { by: "category", handle: "rasteiras" } },
          botas: { title: "Botas", select: { by: "category", handle: "botas" } },
          tenis: { title: "Tênis", select: { by: "category", handle: "tenis" } },
        },
      },
      acessorios: {
        title: "Acessórios",
        editorialImage: "editorial-acessorios",
        select: { by: "category", handle: "acessorios" },
        children: {
          joias: { title: "Joias", select: { by: "category", handle: "joias" } },
          cintos: { title: "Cintos", select: { by: "category", handle: "cintos" } },
          oculos: { title: "Óculos", select: { by: "category", handle: "oculos" } },
          lencos: { title: "Lenços", select: { by: "category", handle: "lencos" } },
        },
      },
    },
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
        editorialImage: "editorial-bolsas",
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
      bolsas: { title: "Bolsas-ícone", select: { by: "collection", handle: "icones" } },
      "ate-1500": { title: "Até R$ 1.500", select: { by: "maxPrice", amount: 1500 } },
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
  return catalogNodes
    .filter((n) => n.section === section)
    .map((n) => ({ path: n.segments }));
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
