"use server";

import { FetchError } from "@medusajs/js-sdk";
import type { HttpTypes } from "@medusajs/types";
import { getMedusaClient } from "@/lib/medusa";
import { toCheckoutAddress, toMedusaAddress } from "@/lib/cart/address";
import type { ActionResult, CheckoutAddress } from "@/lib/cart/types";
import {
  forgetAuth,
  forgetCart,
  readAuthToken,
  readCartId,
  writeAuthToken,
} from "./session";
import type { CustomerView, OrderListItem } from "./types";

/**
 * Customer accounts on Medusa's `emailpass` provider.
 *
 * The token from Medusa goes into an httpOnly cookie and is sent explicitly on
 * each call — the shared SDK client never stores it (see `@/lib/medusa`), so one
 * visitor's session can't leak into another's request.
 */

const CUSTOMER_FIELDS = "*addresses,+metadata";
const GENERIC_ERROR = "Não foi possível falar com a loja agora. Tente de novo em instantes.";

class ShopperError extends Error {}

function fail(e: unknown, fallback = GENERIC_ERROR): { ok: false; error: string } {
  if (e instanceof ShopperError) return { ok: false, error: e.message };
  console.error("[medusa:account]", e);
  return { ok: false, error: fallback };
}

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

async function requireToken(): Promise<string> {
  const token = await readAuthToken();
  if (!token) throw new ShopperError("Sua sessão expirou. Entre novamente.");
  return token;
}

function toCustomerView(c: HttpTypes.StoreCustomer): CustomerView {
  const meta = (c.metadata ?? {}) as Record<string, unknown>;
  return {
    id: c.id,
    email: c.email,
    firstName: c.first_name ?? "",
    lastName: c.last_name ?? "",
    phone: c.phone ?? "",
    cpf: typeof meta.cpf === "string" ? meta.cpf : "",
    addresses: (c.addresses ?? []).flatMap((a) => {
      const address = toCheckoutAddress(a);
      return address ? [{ id: a.id, address }] : [];
    }),
  };
}

async function fetchCustomer(token: string): Promise<CustomerView> {
  const { customer } = await getMedusaClient().store.customer.retrieve(
    { fields: CUSTOMER_FIELDS },
    bearer(token),
  );
  return toCustomerView(customer);
}

/**
 * Whether a token already belongs to a customer. Medusa has one login per
 * e-mail shared by every actor: an admin user's e-mail logs in fine as
 * "customer" but carries no customer until one is created.
 */
function hasCustomer(token: string): boolean {
  try {
    const { actor_id } = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return Boolean(actor_id);
  } catch {
    return false;
  }
}

/** Medusa's email/password login; resolves to the customer token. */
async function authenticate(email: string, password: string): Promise<string> {
  try {
    const { token } = await getMedusaClient().client.fetch<{ token: string }>(
      "/auth/customer/emailpass",
      { method: "POST", body: { email, password } },
    );
    return token;
  } catch (e) {
    if (e instanceof FetchError && e.status === 401) {
      throw new ShopperError("E-mail ou senha incorretos.");
    }
    throw e;
  }
}

/**
 * A guest bag follows the shopper into the account: the open cart is moved to
 * the customer so the order shows up under "Pedidos".
 */
async function adoptCart(token: string) {
  const cartId = await readCartId();
  if (!cartId) return;
  try {
    await getMedusaClient().store.cart.transferCart(cartId, {}, bearer(token));
  } catch (e) {
    // a cart that can't be moved (already ordered, or someone else's) is dropped
    console.error("[medusa:account] transfer cart", e);
    await forgetCart();
  }
}

// --- session -----------------------------------------------------------------

export async function getSession(): Promise<ActionResult<CustomerView | null>> {
  try {
    const token = await readAuthToken();
    if (!token) return { ok: true, data: null };
    try {
      return { ok: true, data: await fetchCustomer(token) };
    } catch (e) {
      if (e instanceof FetchError && e.status === 401) {
        await forgetAuth();
        return { ok: true, data: null };
      }
      throw e;
    }
  } catch (e) {
    return fail(e);
  }
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<ActionResult<CustomerView>> {
  try {
    const token = await authenticate(input.email.trim().toLowerCase(), input.password);
    if (!hasCustomer(token)) {
      throw new ShopperError(
        "Este e-mail ainda não tem cadastro de cliente. Use “Criar conta” com a mesma senha.",
      );
    }
    await writeAuthToken(token);
    await adoptCart(token);
    return { ok: true, data: await fetchCustomer(token) };
  } catch (e) {
    return fail(e, "Não foi possível entrar agora. Tente de novo em instantes.");
  }
}

export async function signUp(input: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  newsletter: boolean;
}): Promise<ActionResult<CustomerView>> {
  const email = input.email.trim().toLowerCase();
  try {
    const sdk = getMedusaClient();
    let registration: string;
    try {
      ({ token: registration } = await sdk.client.fetch<{ token: string }>(
        "/auth/customer/emailpass/register",
        { method: "POST", body: { email, password: input.password } },
      ));
    } catch (e) {
      if (!(e instanceof FetchError && /exist/i.test(e.message ?? ""))) throw e;
      // the e-mail already has a login — an admin user's, or an existing
      // customer's. Medusa's documented way in: authenticate with that login.
      let existing: string;
      try {
        existing = await authenticate(email, input.password);
      } catch {
        throw new ShopperError(
          "Já existe uma conta com este e-mail. Entre com sua senha ou use “Esqueci minha senha”.",
        );
      }
      if (hasCustomer(existing)) {
        // already a customer and the password matches: just log them in
        await writeAuthToken(existing);
        await adoptCart(existing);
        return { ok: true, data: await fetchCustomer(existing) };
      }
      registration = existing;
    }
    await sdk.store.customer.create(
      {
        email,
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        phone: input.phone.replace(/\D/g, ""),
        metadata: { newsletter: input.newsletter },
      },
      {},
      bearer(registration),
    );
    // the registration token can't read the account yet — log in for a real one
    const token = await authenticate(email, input.password);
    await writeAuthToken(token);
    await adoptCart(token);
    return { ok: true, data: await fetchCustomer(token) };
  } catch (e) {
    return fail(e, "Não foi possível criar sua conta agora. Tente de novo em instantes.");
  }
}

/** Logging out also drops the bag, so the next person on this device starts clean. */
export async function signOut(): Promise<ActionResult<null>> {
  await forgetAuth();
  await forgetCart();
  return { ok: true, data: null };
}

// --- profile & addresses ----------------------------------------------------

export async function updateProfile(input: {
  firstName: string;
  lastName: string;
  phone: string;
  cpf: string;
}): Promise<ActionResult<CustomerView>> {
  try {
    const token = await requireToken();
    const current = await getMedusaClient().store.customer.retrieve(
      { fields: "+metadata" },
      bearer(token),
    );
    const { customer } = await getMedusaClient().store.customer.update(
      {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        phone: input.phone.replace(/\D/g, ""),
        metadata: {
          ...((current.customer.metadata ?? {}) as Record<string, unknown>),
          cpf: input.cpf.replace(/\D/g, ""),
        },
      },
      { fields: CUSTOMER_FIELDS },
      bearer(token),
    );
    return { ok: true, data: toCustomerView(customer) };
  } catch (e) {
    return fail(e, "Não foi possível salvar seus dados.");
  }
}

export async function addAddress(address: CheckoutAddress): Promise<ActionResult<CustomerView>> {
  try {
    const token = await requireToken();
    const { customer } = await getMedusaClient().store.customer.createAddress(
      toMedusaAddress(address),
      { fields: CUSTOMER_FIELDS },
      bearer(token),
    );
    return { ok: true, data: toCustomerView(customer) };
  } catch (e) {
    return fail(e, "Não foi possível salvar o endereço.");
  }
}

export async function removeAddress(id: string): Promise<ActionResult<CustomerView>> {
  try {
    const token = await requireToken();
    await getMedusaClient().store.customer.deleteAddress(id, bearer(token));
    return { ok: true, data: await fetchCustomer(token) };
  } catch (e) {
    return fail(e, "Não foi possível remover o endereço.");
  }
}

// --- orders ------------------------------------------------------------------

function statusLabel(o: HttpTypes.StoreOrder): string {
  if (o.status === "canceled") return "Cancelado";
  const f = o.fulfillment_status;
  if (f === "delivered" || f === "partially_delivered") return "Entregue";
  if (f === "shipped" || f === "partially_shipped") return "Enviado";
  const p = o.payment_status;
  if (p !== "captured" && p !== "authorized" && p !== "partially_captured") {
    return "Aguardando pagamento";
  }
  return "Em preparação";
}

function itemLabel(variantTitle: string | null | undefined, meta: Record<string, unknown>) {
  if (typeof meta.label === "string" && meta.label) return meta.label;
  const [size, colour] = (variantTitle ?? "").split(" / ");
  if (!colour) return variantTitle ?? "";
  return size === "Único" ? colour : `${colour} · ${size}`;
}

export async function listMyOrders(): Promise<ActionResult<OrderListItem[]>> {
  try {
    const token = await requireToken();
    const { orders } = await getMedusaClient().store.order.list(
      {
        limit: 50,
        order: "-created_at",
        fields:
          "id,display_id,created_at,status,payment_status,fulfillment_status,total,currency_code,*items,*shipping_address,*shipping_methods",
      },
      bearer(token),
    );
    return {
      ok: true,
      data: orders.map((o) => {
        const a = o.shipping_address;
        return {
          id: o.id,
          number: o.display_id ?? 0,
          placedAt: String(o.created_at),
          status: statusLabel(o),
          total: o.total ?? 0,
          currency: (o.currency_code ?? "brl").toUpperCase(),
          shippingName: o.shipping_methods?.map((m) => m.name).join(" + ") ?? "",
          address: a ? `${a.address_1}${a.address_2 ? ` — ${a.address_2}` : ""}, ${a.city}/${(a.province ?? "").toUpperCase()}` : "",
          items: (o.items ?? []).map((i) => {
            const meta = (i.metadata ?? {}) as Record<string, unknown>;
            return {
              id: i.id,
              title: i.product_title ?? i.title,
              label: itemLabel(i.variant_title, meta),
              thumbnail: typeof meta.thumbnail === "string" ? meta.thumbnail : (i.thumbnail ?? undefined),
              quantity: i.quantity,
              total: i.total ?? i.unit_price * i.quantity,
            };
          }),
        };
      }),
    };
  } catch (e) {
    return fail(e, "Não foi possível carregar seus pedidos.");
  }
}

// --- password ----------------------------------------------------------------

/**
 * Asks Medusa to e-mail a reset link (the backend sends it through SES). The
 * answer is the same whether or not the e-mail has an account.
 */
export async function requestPasswordReset(email: string): Promise<ActionResult<null>> {
  try {
    await getMedusaClient().client.fetch("/auth/customer/emailpass/reset-password", {
      method: "POST",
      body: { identifier: email.trim().toLowerCase() },
    });
  } catch (e) {
    console.error("[medusa:account] reset request", e);
  }
  return { ok: true, data: null };
}

/**
 * Sets a new password with the token from the e-mailed link. The e-mail comes
 * from the token itself: the link carries it unencoded, so a "+" in the address
 * arrives as a space.
 */
export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<ActionResult<null>> {
  try {
    let email = "";
    try {
      const payload = JSON.parse(Buffer.from(input.token.split(".")[1], "base64url").toString());
      email = String(payload.entity_id ?? "");
    } catch {
      throw new ShopperError("Link inválido. Peça um novo em “Esqueci minha senha”.");
    }
    try {
      await getMedusaClient().client.fetch("/auth/customer/emailpass/update", {
        method: "POST",
        body: { email, password: input.password },
        headers: bearer(input.token),
      });
    } catch (e) {
      if (e instanceof FetchError && e.status === 401) {
        throw new ShopperError(
          "Este link expirou ou já foi usado. Peça um novo em “Esqueci minha senha”.",
        );
      }
      throw e;
    }
    return { ok: true, data: null };
  } catch (e) {
    return fail(e, "Não foi possível alterar a senha agora.");
  }
}
