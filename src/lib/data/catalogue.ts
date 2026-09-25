import "server-only";
import { cache } from "react";
import type { StoreProduct, StoreProductVariant } from "@/types/medusa";
import type { ProductColour } from "./products";
import {
  getMedusaClient,
  MEDUSA_REGION_ID,
  isMedusaConfigured,
} from "@/lib/medusa";

/**
 * The catalogue, read from Medusa.
 *
 * Medusa is the source of truth: `scripts/seed-medusa.mjs` pushes the brand's
 * products up, and everything the storefront renders comes back down through
 * here. The Medusa payload is translated into the same `StoreProduct` shape the
 * components already speak, so the UI never had to learn a second vocabulary.
 *
 * `cache()` dedupes within a request; `revalidate` below sets how long a built
 * page may serve a stale catalogue.
 */

/**
 * Seconds a rendered page may keep serving the previous catalogue. Pages
 * re-export this as their `revalidate`; `cache()` below dedupes within a
 * single render.
 */
export const CATALOGUE_REVALIDATE = 300;

const PRODUCT_FIELDS = [
  "*variants.calculated_price",
  "*variants.options",
  "*images",
  "*options",
  "*categories",
  "*collection",
  "+metadata",
].join(",");

/** `metadata` round-trips through JSON strings — Medusa stores it as jsonb. */
function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type MedusaProduct = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function toStoreProduct(p: MedusaProduct): StoreProduct {
  const meta = p.metadata ?? {};
  const colours = parseJson<ProductColour[]>(meta.colours, []);
  const tags = parseJson<string[]>(meta.tags, []);
  const details = parseJson<string[]>(meta.details, []);
  const compareAt = meta.compare_at == null ? undefined : Number(meta.compare_at);

  const variants: StoreProductVariant[] = (p.variants ?? []).map((v: MedusaProduct) => {
    const options: Record<string, string> = {};
    for (const o of v.options ?? []) {
      const title = o.option?.title;
      if (title) options[title] = o.value;
    }
    return {
      id: v.id,
      title: v.title,
      sku: v.sku ?? undefined,
      options,
      // stock is not modelled yet — variants are seeded with manage_inventory
      // false, so anything the backend returns is buyable
      inventory_quantity: v.manage_inventory ? (v.inventory_quantity ?? 0) : 10,
      calculated_price: v.calculated_price
        ? {
            calculated_amount: v.calculated_price.calculated_amount,
            original_amount: v.calculated_price.original_amount ?? undefined,
            currency_code: (v.calculated_price.currency_code ?? "brl").toUpperCase(),
          }
        : undefined,
    };
  });

  // Per-colour image sets live in metadata (Medusa has no home for them). Fall
  // back to the flat product gallery when that is missing.
  const images = colours.length
    ? colours[0].images.map((img, i) => ({
        id: `${p.id}-img-${i}`,
        url: img.url,
        rank: i,
        width: img.w,
        height: img.h,
      }))
    : (p.images ?? []).map((img: MedusaProduct, i: number) => ({
        id: img.id,
        url: img.url,
        rank: i,
      }));

  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    subtitle: p.subtitle ?? undefined,
    description: p.description ?? undefined,
    status: "published",
    thumbnail: p.thumbnail ?? images[0]?.url,
    images,
    options: (p.options ?? []).map((o: MedusaProduct) => ({
      id: o.id,
      title: o.title,
      values: (o.values ?? []).map((v: MedusaProduct) => ({ id: v.id, value: v.value })),
    })),
    variants,
    collection_id: p.collection_id ?? undefined,
    collection: p.collection
      ? { id: p.collection.id, title: p.collection.title, handle: p.collection.handle }
      : undefined,
    categories: (p.categories ?? []).map((c: MedusaProduct) => ({
      id: c.id,
      handle: c.handle,
      name: c.name,
    })),
    metadata: {
      colour: colours[0]?.name,
      sku: meta.sku,
      tags,
      colours,
      compareAt,
      details,
    },
  };
}

/** Every published product, in one request per 100. */
export const getProducts = cache(async (): Promise<StoreProduct[]> => {
  if (!isMedusaConfigured()) return [];
  const sdk = getMedusaClient();
  const out: StoreProduct[] = [];
  let offset = 0;
  for (;;) {
    const { products, count } = await sdk.store.product.list(
      {
        limit: 100,
        offset,
        fields: PRODUCT_FIELDS,
        ...(MEDUSA_REGION_ID ? { region_id: MEDUSA_REGION_ID } : {}),
      },
    );
    out.push(...products.map(toStoreProduct));
    offset += products.length;
    if (!products.length || out.length >= (count ?? out.length)) break;
  }
  return out;
});

export const getProductByHandle = cache(async (handle: string): Promise<StoreProduct | undefined> => {
  const all = await getProducts();
  return all.find((p) => p.handle === handle);
});

export interface CatalogueCategory {
  id: string;
  handle: string;
  name: string;
}

export const getCategories = cache(async (): Promise<CatalogueCategory[]> => {
  if (!isMedusaConfigured()) return [];
  const sdk = getMedusaClient();
  const { product_categories } = await sdk.store.category.list(
    { limit: 100, fields: "id,name,handle" },
  );
  return product_categories.map((c) => ({ id: c.id, handle: c.handle, name: c.name }));
});

// ---------------------------------------------------------------------------
// derived structures — built once per request from the fetched catalogue

import { buildCatalog, type Catalog } from "./catalog";
import { buildNavigation, type Navigation } from "./navigation";

export const getCatalog = cache(async (): Promise<Catalog> => buildCatalog(await getProducts()));

export const getNavigation = cache(async (): Promise<Navigation> =>
  buildNavigation(await getCatalog()),
);
