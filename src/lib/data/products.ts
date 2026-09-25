import type { StoreProduct } from "@/types/medusa";

/**
 * Pure helpers over a product list.
 *
 * The list itself comes from Medusa — see `catalogue.ts`. Nothing here touches
 * the network or module-level state, so both server components and client
 * components can use it on data they were handed.
 */

export interface ProductImage {
  url: string;
  /** intrinsic size of the file — the shoot mixes 4:5, 2:3 and 9:16 */
  w: number;
  h: number;
}

export interface ProductColour {
  name: string;
  hex: string;
  sku?: string;
  images: ProductImage[];
}

/**
 * Display names and menu order for the categories the brand can carry. Medusa
 * is authoritative for which ones exist and what they are called; this is the
 * ordering, plus a label fallback.
 */
export const CATEGORY_NAMES: Record<string, string> = {
  vestidos: "Vestidos",
  blusas: "Blusas e camisas",
  conjuntos: "Conjuntos",
  calcas: "Calças",
  denim: "Denim",
  saias: "Saias",
  casacos: "Casacos e jaquetas",
  macacoes: "Macacões",
  joias: "Joias",
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_NAMES);

// ---------------------------------------------------------------------------
// per-product accessors

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
 *  import, not a choice the shopper can make. */
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

// ---------------------------------------------------------------------------
// list selectors

export function findProduct(list: StoreProduct[], handle: string): StoreProduct | undefined {
  return list.find((p) => p.handle === handle);
}

export function byCollection(list: StoreProduct[], collectionHandle: string): StoreProduct[] {
  return list.filter((p) => p.collection?.handle === collectionHandle);
}

export function byTag(list: StoreProduct[], tag: string): StoreProduct[] {
  return list.filter((p) => productTags(p).includes(tag));
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
 * here — categories sit in narrow bands inside a wide overall range.
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

const deaccent = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function searchProducts(list: StoreProduct[], query: string): StoreProduct[] {
  const q = query.trim();
  if (!q) return [];
  return list.filter((p) => {
    const hay = deaccent(
      [
        p.title,
        p.subtitle,
        ...(p.categories ?? []).map((c) => c.name),
        ...namedColours(p).map((c) => c.name),
      ]
        .filter(Boolean)
        .join(" "),
    );
    return deaccent(q)
      .split(/\s+/)
      .every((term) => hay.includes(term));
  });
}

export function getRelated(list: StoreProduct[], product: StoreProduct, limit = 4): StoreProduct[] {
  const cat = product.categories?.[0]?.handle;
  const price = productFromPrice(product).amount;
  const pool = list.filter((p) => p.handle !== product.handle);
  const scored = pool
    .map((p) => {
      let score = 0;
      if (cat && hasCategory(p, cat)) score += 3;
      if (product.collection_id && p.collection_id === product.collection_id) score += 1;
      // nudge towards a comparable price bracket so a R$5.300 dress doesn't sit
      // next to a R$200 blouse
      const ratio = productFromPrice(p).amount / (price || 1);
      if (ratio > 0.5 && ratio < 2) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}
