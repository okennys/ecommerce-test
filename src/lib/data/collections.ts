import type { StoreCollection } from "@/types/medusa";

/**
 * Editorial groupings that sit above the category tree. The catalogue itself has
 * no seasons yet — these are curations applied at ingest time (see
 * `scripts/ingest-produtos.mjs`).
 *
 * SWAP POINT: `store.collection.list()` from Medusa.
 */
export const collections: StoreCollection[] = [
  { id: "col_icones", title: "Ícones", handle: "icones" },
];

export function getCollection(handle: string): StoreCollection | undefined {
  return collections.find((c) => c.handle === handle);
}
