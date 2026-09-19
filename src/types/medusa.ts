/**
 * Minimal hand-written subset of Medusa v2 Store API response types.
 *
 * SWAP POINT: when the backend is available, delete this file and import the
 * real types from `@medusajs/types` (`HttpTypes.StoreProduct`, etc.). The
 * shapes below intentionally mirror those names so the change is mechanical.
 */

export interface StoreImage {
  id: string;
  url: string;
  rank?: number;
}

export interface StoreProductOptionValue {
  id: string;
  value: string;
}

export interface StoreProductOption {
  id: string;
  title: string;
  values: StoreProductOptionValue[];
}

export interface StoreCalculatedPrice {
  calculated_amount: number;
  /** pre-discount price; present only while the variant is on sale */
  original_amount?: number;
  currency_code: string;
}

export interface StoreProductVariant {
  id: string;
  title: string;
  sku?: string;
  /** option title -> option value, e.g. { "Tamanho": "M", "Cor": "Noir" } */
  options: Record<string, string>;
  inventory_quantity?: number;
  calculated_price?: StoreCalculatedPrice;
}

export interface StoreProductCategory {
  id: string;
  name: string;
  handle: string;
  description?: string;
}

export interface StoreCollection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, unknown>;
}

export interface StoreProduct {
  id: string;
  title: string;
  handle: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  status?: "draft" | "proposed" | "published" | "rejected";
  images: StoreImage[];
  options: StoreProductOption[];
  variants: StoreProductVariant[];
  collection_id?: string;
  collection?: StoreCollection;
  categories?: StoreProductCategory[];
  /** free-form; used here for the colour name shown on the PDP */
  metadata?: Record<string, unknown>;
}

export interface StoreCartLineItem {
  id: string;
  product_id: string;
  product_handle: string;
  variant_id: string;
  title: string;
  variant_title: string;
  thumbnail?: string;
  quantity: number;
  unit_price: number;
  currency_code: string;
}

export interface StoreCart {
  id: string;
  region_id?: string;
  currency_code: string;
  items: StoreCartLineItem[];
  item_total: number;
}

export interface StoreCountry {
  iso_2: string;
  display_name: string;
}

export interface StoreRegion {
  id: string;
  name: string;
  currency_code: string;
  countries: StoreCountry[];
}
