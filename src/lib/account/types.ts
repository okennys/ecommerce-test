import type { CheckoutAddress } from "@/lib/cart/types";

/** Client-safe view of the logged-in customer. */
export interface CustomerView {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
  addresses: SavedAddress[];
}

export interface SavedAddress {
  id: string;
  address: CheckoutAddress;
}

export interface OrderListItem {
  id: string;
  number: number;
  placedAt: string;
  /** shopper-facing status, e.g. "Em preparação" */
  status: string;
  total: number;
  currency: string;
  shippingName: string;
  address: string;
  items: {
    id: string;
    title: string;
    label: string;
    thumbnail?: string;
    quantity: number;
    total: number;
  }[];
}
