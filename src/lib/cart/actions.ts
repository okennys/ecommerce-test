"use server";

import { FetchError } from "@medusajs/js-sdk";
import type { HttpTypes } from "@medusajs/types";
import type { StoreCartLineItem } from "@/types/medusa";
import { getMedusaClient, MEDUSA_REGION_ID } from "@/lib/medusa";
import { authHeaders, forgetCart, readCartId, writeCartId } from "@/lib/account/session";
import { toCheckoutAddress, toMedusaAddress } from "./address";
import type {
  ActionResult,
  CartSnapshot,
  CheckoutAddress,
  ShippingGroup,
} from "./types";

/**
 * Cart and checkout, backed by the Medusa Store API.
 *
 * Everything runs on the server: the browser only holds an httpOnly cookie with
 * the cart id and calls these actions. The backend's CORS does not list the
 * storefront, and keeping Medusa server-side means it never has to.
 */

// `*`-prefixed fields are added to Medusa's defaults (which carry the totals)
const CART_FIELDS =
  "*items,*shipping_methods,*shipping_address,*billing_address,+metadata,+completed_at";

type MedusaCart = HttpTypes.StoreCart;

// --- errors ------------------------------------------------------------------

const GENERIC_ERROR = "Não foi possível falar com a loja agora. Tente de novo em instantes.";

/** A failure whose message is written for the shopper and shown as-is. */
class ShopperError extends Error {}

function describe(e: unknown, fallback = GENERIC_ERROR): string {
  if (e instanceof ShopperError) return e.message;
  console.error("[medusa]", e);
  if (e instanceof FetchError) {
    const msg = e.message ?? "";
    if (/do not exist|not published/i.test(msg)) return "Esta peça não está mais disponível.";
    if (/inventory|stock/i.test(msg)) return "Não há estoque suficiente desta peça.";
  }
  return fallback;
}

function isNotFound(e: unknown): boolean {
  return e instanceof FetchError && e.status === 404;
}

// --- translation -------------------------------------------------------------

/** Medusa titles variants "P / Fucsia"; the bag reads better as "Fucsia · P". */
function variantLabel(item: HttpTypes.StoreCartLineItem): string {
  const label = (item.metadata as Record<string, unknown> | null)?.label;
  if (typeof label === "string" && label) return label;
  const [size, colour] = (item.variant_title ?? "").split(" / ");
  if (!colour) return item.variant_title ?? "";
  return size === "Único" ? colour : `${colour} · ${size}`;
}

function toLine(item: HttpTypes.StoreCartLineItem, currency: string): StoreCartLineItem {
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  return {
    id: item.id,
    product_id: item.product_id ?? "",
    product_handle: item.product_handle ?? "",
    variant_id: item.variant_id ?? "",
    title: item.product_title ?? item.title,
    variant_title: variantLabel(item),
    // the PDP passes the photo of the colour that was picked; Medusa's own
    // thumbnail is always the product's first colour
    thumbnail: typeof meta.thumbnail === "string" ? meta.thumbnail : (item.thumbnail ?? undefined),
    quantity: item.quantity,
    unit_price: item.unit_price,
    currency_code: currency,
  };
}

function toSnapshot(cart: MedusaCart): CartSnapshot {
  const currency = (cart.currency_code ?? "brl").toUpperCase();
  const items = [...(cart.items ?? [])]
    .sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)))
    .map((i) => toLine(i, currency));
  const meta = (cart.metadata ?? {}) as Record<string, unknown>;
  const methods = cart.shipping_methods ?? [];
  return {
    id: cart.id,
    currency,
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    itemSubtotal: cart.item_subtotal ?? 0,
    shippingTotal: cart.shipping_total ?? 0,
    discountTotal: cart.discount_total ?? 0,
    total: cart.total ?? 0,
    email: cart.email ?? "",
    cpf: typeof meta.cpf === "string" ? meta.cpf : "",
    newsletter: meta.newsletter === true,
    address: toCheckoutAddress(cart.shipping_address),
    shippingMethod: methods.length
      ? {
          optionIds: methods.map((m) => m.shipping_option_id ?? ""),
          name: methods.map((m) => m.name).join(" + "),
          amount: methods.reduce((n, m) => n + (m.amount ?? 0), 0),
        }
      : null,
  };
}

// --- cart lookup -------------------------------------------------------------

/** The visitor's open cart, or null (no cookie, expired, or already ordered). */
async function loadCart(): Promise<MedusaCart | null> {
  const id = await readCartId();
  if (!id) return null;
  try {
    const { cart } = await getMedusaClient().store.cart.retrieve(id, { fields: CART_FIELDS });
    if (cart.completed_at) {
      await forgetCart();
      return null;
    }
    return cart;
  } catch (e) {
    if (isNotFound(e)) {
      await forgetCart();
      return null;
    }
    throw e;
  }
}

async function requireCart(): Promise<MedusaCart> {
  const cart = await loadCart();
  if (!cart) throw new ShopperError("Sua sacola expirou. Adicione as peças novamente.");
  return cart;
}

async function ensureCart(): Promise<MedusaCart> {
  const existing = await loadCart();
  if (existing) return existing;
  // logged in, the cart is created under the customer so the order lands in
  // their account; a guest cart is moved over at login (see account actions)
  const { cart } = await getMedusaClient().store.cart.create(
    { region_id: MEDUSA_REGION_ID || undefined },
    { fields: CART_FIELDS },
    await authHeaders(),
  );
  await writeCartId(cart.id);
  return cart;
}

async function run<T>(fn: () => Promise<T>, fallback?: string): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: describe(e, fallback) };
  }
}

// --- bag ---------------------------------------------------------------------

export async function getCart(): Promise<ActionResult<CartSnapshot | null>> {
  return run(async () => {
    const cart = await loadCart();
    return cart ? toSnapshot(cart) : null;
  });
}

export async function addToCart(input: {
  variantId: string;
  quantity?: number;
  thumbnail?: string;
  label?: string;
}): Promise<ActionResult<CartSnapshot>> {
  return run(async () => {
    const cart = await ensureCart();
    // identical metadata for the same variant, or Medusa splits it into two lines
    const metadata: Record<string, string> = {};
    if (input.thumbnail) metadata.thumbnail = input.thumbnail;
    if (input.label) metadata.label = input.label;
    const { cart: next } = await getMedusaClient().store.cart.createLineItem(
      cart.id,
      { variant_id: input.variantId, quantity: input.quantity ?? 1, metadata },
      { fields: CART_FIELDS },
    );
    return toSnapshot(next);
  }, "Não foi possível adicionar a peça à sacola.");
}

export async function updateLineItem(
  lineId: string,
  quantity: number,
): Promise<ActionResult<CartSnapshot>> {
  if (quantity <= 0) return removeLineItem(lineId);
  return run(async () => {
    const cart = await requireCart();
    const { cart: next } = await getMedusaClient().store.cart.updateLineItem(
      cart.id,
      lineId,
      { quantity },
      { fields: CART_FIELDS },
    );
    return toSnapshot(next);
  }, "Não foi possível atualizar a quantidade.");
}

export async function removeLineItem(lineId: string): Promise<ActionResult<CartSnapshot>> {
  return run(async () => {
    const cart = await requireCart();
    const sdk = getMedusaClient();
    await sdk.store.cart.deleteLineItem(cart.id, lineId);
    const { cart: next } = await sdk.store.cart.retrieve(cart.id, { fields: CART_FIELDS });
    return toSnapshot(next);
  }, "Não foi possível remover a peça.");
}

// --- checkout ----------------------------------------------------------------

function mergeMetadata(cart: MedusaCart, patch: Record<string, unknown>) {
  return { ...((cart.metadata ?? {}) as Record<string, unknown>), ...patch };
}

export async function saveContact(input: {
  email: string;
  cpf: string;
  newsletter: boolean;
}): Promise<ActionResult<CartSnapshot>> {
  return run(async () => {
    const cart = await requireCart();
    const { cart: next } = await getMedusaClient().store.cart.update(
      cart.id,
      {
        email: input.email.trim().toLowerCase(),
        metadata: mergeMetadata(cart, {
          cpf: input.cpf.replace(/\D/g, ""),
          newsletter: input.newsletter,
        }),
      },
      { fields: CART_FIELDS },
    );
    return toSnapshot(next);
  }, "Não foi possível salvar seus dados.");
}

export async function saveAddress(address: CheckoutAddress): Promise<ActionResult<CartSnapshot>> {
  return run(async () => {
    const cart = await requireCart();
    const medusaAddress = toMedusaAddress(address);
    const { cart: next } = await getMedusaClient().store.cart.update(
      cart.id,
      { shipping_address: medusaAddress, billing_address: medusaAddress },
      { fields: CART_FIELDS },
    );
    return toSnapshot(next);
  }, "Não foi possível salvar o endereço.");
}

/**
 * Shipping options the cart may use, grouped by shipping profile.
 *
 * This Medusa version lists every option in the service zone regardless of the
 * items' shipping profiles (and even accepts a mismatched one), so the match is
 * enforced here. The browser never holds the publishable key, so these actions
 * are the only way in.
 */
async function shippingGroups(cartId: string): Promise<ShippingGroup[]> {
  const sdk = getMedusaClient();
  const [{ cart }, { shipping_options }] = await Promise.all([
    sdk.store.cart.retrieve(cartId, { fields: "*items,*items.product.shipping_profile" }),
    sdk.store.fulfillment.listCartOptions({ cart_id: cartId }),
  ]);
  const groups = new Map<string, ShippingGroup>();
  for (const item of cart.items ?? []) {
    const product = item.product as { shipping_profile?: { id?: string } } | undefined;
    const profileId = product?.shipping_profile?.id;
    if (!profileId) continue;
    const group = groups.get(profileId) ?? { profileId, items: [], options: [] };
    const name = item.product_title ?? item.title;
    if (!group.items.includes(name)) group.items.push(name);
    groups.set(profileId, group);
  }
  for (const o of shipping_options) {
    const group = groups.get(o.shipping_profile_id);
    if (!group || o.insufficient_inventory) continue;
    group.options.push({
      id: o.id,
      name: o.name,
      amount: o.amount ?? 0,
      eta: o.type?.description || undefined,
    });
  }
  return [...groups.values()];
}

export async function listShippingOptions(): Promise<ActionResult<ShippingGroup[]>> {
  return run(async () => shippingGroups((await requireCart()).id), "Não foi possível calcular o frete.");
}

/** One option per shipping profile in the cart (see `listShippingOptions`). */
export async function chooseShipping(optionIds: string[]): Promise<ActionResult<CartSnapshot>> {
  return run(async () => {
    const cart = await requireCart();
    const groups = await shippingGroups(cart.id);
    for (const group of groups) {
      if (!group.options.some((o) => optionIds.includes(o.id))) {
        throw new ShopperError("Escolha a forma de envio de todas as peças.");
      }
    }
    const allowed = new Set(groups.flatMap((g) => g.options.map((o) => o.id)));
    if (optionIds.some((id) => !allowed.has(id))) {
      throw new ShopperError("Essa forma de envio não está disponível para estas peças.");
    }
    const sdk = getMedusaClient();
    for (const id of optionIds) {
      await sdk.store.cart.addShippingMethod(cart.id, { option_id: id });
    }
    const { cart: next } = await sdk.store.cart.retrieve(cart.id, { fields: CART_FIELDS });
    return toSnapshot(next);
  }, "Não foi possível escolher a forma de envio.");
}

/**
 * True when every shipping profile in the cart has a matching shipping method.
 * Checked before charging: if it fails, Medusa would refuse to create the order
 * after Stripe had already taken the money.
 */
async function shippingIsComplete(cart: MedusaCart): Promise<boolean> {
  const groups = await shippingGroups(cart.id);
  const chosen = new Set((cart.shipping_methods ?? []).map((m) => m.shipping_option_id));
  return groups.every((g) => g.options.some((o) => chosen.has(o.id)));
}

/**
 * Opens (or refreshes) the Stripe payment session for the cart's current total
 * and hands back the PaymentIntent's client secret for the Payment Element.
 *
 * Medusa drops existing sessions whenever the cart changes, so this runs every
 * time the payment step mounts.
 */
export async function startPayment(): Promise<
  ActionResult<{ clientSecret: string; amount: number; currency: string }>
> {
  return run(async () => {
    const sdk = getMedusaClient();
    const { cart } = await sdk.store.cart.retrieve((await requireCart()).id, {
      fields: `${CART_FIELDS},*payment_collection,*payment_collection.payment_sessions`,
    });
    if (!cart.shipping_methods?.length || !(await shippingIsComplete(cart))) {
      throw new ShopperError("Escolha a forma de envio novamente antes de pagar.");
    }

    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: cart.region_id ?? MEDUSA_REGION_ID,
    });
    const provider =
      payment_providers.find((p) => p.id === "pp_stripe_stripe") ??
      payment_providers.find((p) => p.id.startsWith("pp_stripe"));
    if (!provider) throw new ShopperError("Nenhum meio de pagamento ativo para esta região.");

    const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
      provider_id: provider.id,
    });
    const session = payment_collection.payment_sessions?.find(
      (s) => s.provider_id === provider.id,
    );
    const clientSecret = (session?.data as Record<string, unknown> | undefined)?.client_secret;
    if (typeof clientSecret !== "string") throw new Error("O Stripe não devolveu a sessão de pagamento.");
    return {
      clientSecret,
      amount: payment_collection.amount,
      currency: (cart.currency_code ?? "brl").toUpperCase(),
    };
  }, "Não foi possível iniciar o pagamento.");
}

/**
 * Turns the paid cart into an order. Called right after Stripe confirms the
 * payment (or when the shopper returns from a redirect-based method).
 */
export async function placeOrder(): Promise<ActionResult<{ orderId: string }>> {
  try {
    const id = await readCartId();
    if (!id) return { ok: false, error: "Sua sacola expirou. Adicione as peças novamente." };
    const result = await getMedusaClient().store.cart.complete(id);
    if (result.type === "order") {
      await forgetCart();
      return { ok: true, data: { orderId: result.order.id } };
    }
    console.error("[medusa] complete cart:", result.error);
    return {
      ok: false,
      error:
        "O pagamento não foi confirmado. Confira os dados do cartão ou tente outro meio de pagamento.",
    };
  } catch (e) {
    return { ok: false, error: describe(e, "Não foi possível concluir o pedido.") };
  }
}
