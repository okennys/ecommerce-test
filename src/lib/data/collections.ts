import type { StoreCollection } from "@/types/medusa";

/**
 * SWAP POINT: `store.collection.list()` from Medusa.
 */
export const collections: StoreCollection[] = [
  { id: "col_oi26", title: "Outono Inverno 26", handle: "outono-inverno-26" },
  { id: "col_pre", title: "Pré-coleção", handle: "pre-colecao" },
  { id: "col_icones", title: "Ícones", handle: "icones" },
];

export function getCollection(handle: string): StoreCollection | undefined {
  return collections.find((c) => c.handle === handle);
}
