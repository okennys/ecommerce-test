import "server-only";
import { FetchError } from "@medusajs/js-sdk";
import { getMedusaClient, isMedusaConfigured } from "@/lib/medusa";

/**
 * A placed order, as the confirmation page shows it. Medusa's Store API lets a
 * guest read an order by id; ids are unguessable ULIDs, the same trust model the
 * official Medusa storefront uses for its "order confirmed" page.
 */
export interface OrderView {
  id: string;
  number: number;
  email: string;
  currency: string;
  itemSubtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  shippingName: string;
  city: string;
  state: string;
  paymentStatus: string;
  items: {
    id: string;
    title: string;
    label: string;
    thumbnail?: string;
    quantity: number;
    total: number;
  }[];
}

const ORDER_FIELDS =
  "*items,*shipping_address,*shipping_methods,+display_id,+email,+payment_status,+item_subtotal,+shipping_total,+discount_total,+total";

function label(variantTitle: string | null | undefined, meta: Record<string, unknown>): string {
  if (typeof meta.label === "string" && meta.label) return meta.label;
  const [size, colour] = (variantTitle ?? "").split(" / ");
  if (!colour) return variantTitle ?? "";
  return size === "Único" ? colour : `${colour} · ${size}`;
}

export async function getOrder(id: string): Promise<OrderView | null> {
  if (!isMedusaConfigured() || !/^order_[A-Z0-9]+$/i.test(id)) return null;
  try {
    const { order } = await getMedusaClient().store.order.retrieve(id, { fields: ORDER_FIELDS });
    const currency = (order.currency_code ?? "brl").toUpperCase();
    return {
      id: order.id,
      number: order.display_id ?? 0,
      email: order.email ?? "",
      currency,
      itemSubtotal: order.item_subtotal ?? 0,
      shippingTotal: order.shipping_total ?? 0,
      discountTotal: order.discount_total ?? 0,
      total: order.total ?? 0,
      shippingName: order.shipping_methods?.[0]?.name ?? "",
      city: order.shipping_address?.city ?? "",
      state: order.shipping_address?.province?.toUpperCase() ?? "",
      paymentStatus: order.payment_status ?? "",
      items: (order.items ?? []).map((item) => {
        const meta = (item.metadata ?? {}) as Record<string, unknown>;
        return {
          id: item.id,
          title: item.product_title ?? item.title,
          label: label(item.variant_title, meta),
          thumbnail:
            typeof meta.thumbnail === "string" ? meta.thumbnail : (item.thumbnail ?? undefined),
          quantity: item.quantity,
          total: item.total ?? item.unit_price * item.quantity,
        };
      }),
    };
  } catch (e) {
    if (e instanceof FetchError && e.status === 404) return null;
    throw e;
  }
}
