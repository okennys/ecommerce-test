"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartProvider";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

/** Totals come straight from the Medusa cart — nothing is summed here. */
export function OrderSummary() {
  const { cart, items, count, currency } = useCart();
  const [open, setOpen] = useState(false);

  const method = cart?.shippingMethod ?? null;
  const discount = cart?.discountTotal ?? 0;

  return (
    <div className="border border-line bg-paper-raised p-6 lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="label flex w-full items-center justify-between lg:cursor-default"
      >
        <span>
          Resumo do pedido <span className="text-ink-muted">({count})</span>
        </span>
        <ChevronDownIcon
          size={16}
          className={cn("transition-transform lg:hidden", open && "rotate-180")}
        />
      </button>

      <ul className={cn("mt-5 space-y-4 lg:block", open ? "block" : "hidden")}>
        {items.map((item) => (
          <li key={item.id} className="flex gap-3">
            <div className="relative aspect-[4/5] w-14 shrink-0 bg-paper">
              {item.thumbnail && (
                <Image src={item.thumbnail} alt="" fill sizes="56px" className="object-cover object-top" />
              )}
              <span className="label absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] text-on-dark">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 justify-between gap-2">
              <div>
                <p className="label leading-tight">{item.title}</p>
                <p className="label text-ink-muted">{item.variant_title}</p>
              </div>
              <span className="label whitespace-nowrap">
                {formatPrice(item.unit_price * item.quantity, item.currency_code)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-5 space-y-2 border-t border-line pt-5">
        <div className="flex justify-between">
          <dt className="label text-ink-muted">Subtotal</dt>
          <dd className="label">{formatPrice(cart?.itemSubtotal ?? 0, currency)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <dt className="label text-ink-muted">Desconto</dt>
            <dd className="label">−{formatPrice(discount, currency)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="label text-ink-muted">Frete</dt>
          <dd className="label">
            {method == null
              ? "Calculado na entrega"
              : method.amount === 0
                ? "Grátis"
                : formatPrice(cart?.shippingTotal ?? method.amount, currency)}
          </dd>
        </div>
        {method && <p className="label text-ink-muted">{method.name}</p>}
      </dl>

      <div className="mt-4 flex justify-between border-t border-line pt-4">
        <span className="label-lg">Total</span>
        <span className="label-lg">{formatPrice(cart?.total ?? 0, currency)}</span>
      </div>
      <p className="label mt-1 text-ink-muted">Impostos incluídos.</p>
    </div>
  );
}
