import type { StoreProduct, StoreProductVariant } from "@/types/medusa";
import {
  SOURCES,
  CATEGORY_NAMES,
  type SourceProduct,
  type SourceImage,
} from "./products.source";

/**
 * Catalogue built from the client's real product export (see
 * `scripts/ingest-produtos.mjs`). Shapes match the Medusa v2 Store API so later
 * milestones can swap `store.product.list()` in without touching components.
 *
 * Inventory is deliberately not modelled yet — every variant reads as available
 * until Medusa owns stock in etapa 2.
 *
 * SWAP POINT: replace this whole module with real Medusa calls once
 * MEDUSA_BACKEND_URL is wired (see src/lib/medusa.ts). `metadata.colours`
 * (per-colour image sets) maps onto Medusa variant images / option values.
 */

export { CATEGORY_NAMES };

const IN_STOCK = 10;

export interface ProductColour {
  name: string;
  hex: string;
  images: SourceImage[];
}

function make(s: SourceProduct): StoreProduct {
  const colours: ProductColour[] = s.colours.map((c) => ({
    name: c.name,
    hex: c.hex,
    images: c.images,
  }));

  const images = colours[0].images.map((img, i) => ({
    id: `${s.handle}-img-${i}`,
    url: img.url,
    rank: i,
    width: img.w,
    height: img.h,
  }));

  const variants: StoreProductVariant[] = [];
  s.colours.forEach((c, ci) => {
    s.sizes.forEach((size) => {
      variants.push({
        id: `${s.handle}-v-${ci}-${size}`,
        title: `${size} / ${c.name}`,
        sku: `${c.sku}-${size}`,
        options: { Tamanho: size, Cor: c.name },
        inventory_quantity: IN_STOCK,
        calculated_price: {
          calculated_amount: s.price,
          original_amount: s.compareAt,
          currency_code: "BRL",
        },
      });
    });
  });

  return {
    id: `prod_${s.handle}`,
    title: s.title,
    handle: s.handle,
    subtitle: s.subtitle,
    description: s.description ?? s.subtitle,
    status: "published",
    thumbnail: colours[0].images[0].url,
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
    collection_id: s.tags.includes("icone") ? "col_icones" : undefined,
    categories: [
      {
        id: `cat_${s.category}`,
        handle: s.category,
        name: CATEGORY_NAMES[s.category] ?? s.category,
      },
    ],
    metadata: {
      colour: colours[0].name,
      sku: s.sku,
      tags: s.tags,
      colours,
      compareAt: s.compareAt,
      details: s.details ?? [],
    },
  };
}

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

/** Spec bullets ("Manga bufante", "Forro em cetim"), when the copy has them. */
export function productDetails(p: StoreProduct): string[] {
  return (p.metadata?.details as string[] | undefined) ?? [];
}

export function productColours(p: StoreProduct): ProductColour[] {
  return (p.metadata?.colours as ProductColour[] | undefined) ?? [];
}

/** Colour swatches worth showing — unnamed single colours are an artefact of the
 *  export, not a choice the shopper can make. */
export function namedColours(p: StoreProduct): ProductColour[] {
  const colours = productColours(p);
  return colours.length > 1 ? colours : colours.filter((c) => c.name !== "Única");
}

export function hasCategory(p: StoreProduct, handle: string): boolean {
  return (p.categories ?? []).some((c) => c.handle === handle);
}

/** Lowest calculated amount across a product's variants. */
export function productFromPrice(product: StoreProduct): { amount: number; currency: string } {
  const priced = product.variants
    .map((v) => v.calculated_price)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const min = priced.reduce(
    (lo, p) => (p.calculated_amount < lo.calculated_amount ? p : lo),
    priced[0],
  );
  return { amount: min?.calculated_amount ?? 0, currency: min?.currency_code ?? "BRL" };
}

/** Pre-sale price, when the product is discounted. */
export function productCompareAt(product: StoreProduct): number | undefined {
  const value = product.metadata?.compareAt as number | undefined;
  return value && value > productFromPrice(product).amount ? value : undefined;
}

export function isOnSale(product: StoreProduct): boolean {
  return productCompareAt(product) != null;
}

/** Percentage off, rounded — only meaningful when `isOnSale`. */
export function discountPercent(product: StoreProduct): number {
  const was = productCompareAt(product);
  if (!was) return 0;
  return Math.round((1 - productFromPrice(product).amount / was) * 100);
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
  /** "up to X" cut-offs for the filter panel, derived from the list on screen */
  priceStops: number[];
}

/** Round to a step that reads well at that magnitude: 50 / 100 / 500. */
function roundStop(n: number): number {
  const step = n > 2000 ? 500 : n > 500 ? 100 : 50;
  return Math.round(n / step) * step;
}

/**
 * Price buckets that actually split the current list. A fixed ladder is useless
 * here — the catalogue runs from R$ 88 to R$ 5.300 and most categories sit in a
 * narrow band inside that.
 */
function priceStops(min: number, max: number): number[] {
  if (max <= min) return [];
  const stops = [0.25, 0.5, 0.75]
    .map((f) => roundStop(min + (max - min) * f))
    .filter((s) => s > min && s < max);
  return [...new Set(stops)];
}

const SIZE_ORDER = ["XPP", "PP", "P", "M", "G", "GG", "Único"];

export function getFacets(list: StoreProduct[]): Facets {
  const sizeSet = new Set<string>();
  const colourMap = new Map<string, string>();
  let priceMin = Infinity;
  let priceMax = 0;
  for (const p of list) {
    for (const opt of p.options) {
      if (opt.title === "Tamanho") opt.values.forEach((v) => sizeSet.add(v.value));
    }
    for (const c of namedColours(p)) colourMap.set(c.name, c.hex);
    const price = productFromPrice(p).amount;
    priceMin = Math.min(priceMin, price);
    priceMax = Math.max(priceMax, price);
  }
  const sizes = [...sizeSet].sort((a, b) => {
    const ia = SIZE_ORDER.indexOf(a);
    const ib = SIZE_ORDER.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return Number(a) - Number(b) || a.localeCompare(b);
  });
  const lo = priceMin === Infinity ? 0 : priceMin;
  return {
    sizes,
    colours: [...colourMap]
      .map(([name, hex]) => ({ name, hex }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
    priceMin: lo,
    priceMax,
    priceStops: priceStops(lo, priceMax),
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
      const pColours = namedColours(p).map((c) => c.name);
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
  else if (key === "preco-desc")
    out.sort((a, b) => productFromPrice(b).amount - productFromPrice(a).amount);
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
      p.subtitle,
      ...(p.categories ?? []).map((c) => c.name),
      ...namedColours(p).map((c) => c.name),
    ]
      .filter(Boolean)
      .join(" ")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase();
    return q
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .split(/\s+/)
      .every((term) => hay.includes(term));
  });
}

export function getRelated(product: StoreProduct, limit = 4): StoreProduct[] {
  const cat = product.categories?.[0]?.handle;
  const price = productFromPrice(product).amount;
  const pool = products.filter((p) => p.handle !== product.handle);
  const scored = pool
    .map((p) => {
      let score = 0;
      if (cat && hasCategory(p, cat)) score += 3;
      if (product.collection_id && p.collection_id === product.collection_id) score += 1;
      // nudge towards a comparable price bracket so a R$5.300 dress doesn't sit
      // next to a R$88 bermuda
      const ratio = productFromPrice(p).amount / (price || 1);
      if (ratio > 0.5 && ratio < 2) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}
