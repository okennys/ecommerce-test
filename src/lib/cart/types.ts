import type { StoreCartLineItem } from "@/types/medusa";

/**
 * Client-safe shapes for the cart and checkout. The server actions in
 * `./actions.ts` translate Medusa's cart into these, so components never touch
 * the Medusa payload directly.
 */

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  phone: string;
}

export const EMPTY_ADDRESS: CheckoutAddress = {
  firstName: "",
  lastName: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  phone: "",
};

/** The cart's shipping, summed when items ship under more than one profile. */
export interface CartShippingMethod {
  optionIds: string[];
  name: string;
  amount: number;
}

export interface CartSnapshot {
  id: string;
  /** upper-case ISO code, e.g. "BRL" */
  currency: string;
  items: StoreCartLineItem[];
  count: number;
  itemSubtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  email: string;
  cpf: string;
  newsletter: boolean;
  address: CheckoutAddress | null;
  shippingMethod: CartShippingMethod | null;
}

export interface ShippingOptionView {
  id: string;
  name: string;
  amount: number;
  /** delivery estimate, when the option carries one */
  eta?: string;
}

/**
 * Options for one shipping profile. Medusa needs one shipping method per
 * profile in the cart; almost always there is a single group.
 */
export interface ShippingGroup {
  profileId: string;
  /** names of the pieces that ship under this profile */
  items: string[];
  options: ShippingOptionView[];
}

/**
 * Server actions never throw to the client: in production Next replaces thrown
 * messages with a generic one, so failures come back as data the UI can show.
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
