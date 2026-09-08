"use client";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { SHIPPING_METHODS, useCheckout } from "@/context/CheckoutProvider";

export function ShippingMethods() {
  const { method, setMethod } = useCheckout();

  return (
    <fieldset className="mt-10">
      <legend className="label-lg mb-4">Forma de envio</legend>
      <div className="divide-y divide-line border-y border-line">
        {SHIPPING_METHODS.map((m) => {
          const on = method === m.id;
          return (
            <label
              key={m.id}
              className={cn(
                "flex cursor-pointer items-center gap-4 py-4",
                on ? "text-ink" : "text-ink-muted",
              )}
            >
              <input
                type="radio"
                name="shipping"
                value={m.id}
                checked={on}
                onChange={() => setMethod(m.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center border",
                  on ? "border-ink" : "border-line-strong",
                )}
              >
                {on && <span className="h-2 w-2 bg-ink" />}
              </span>
              <span className="flex flex-1 items-center justify-between">
                <span>
                  <span className="label block text-ink">{m.label}</span>
                  <span className="label block text-ink-muted">{m.eta}</span>
                </span>
                <span className="label text-ink">
                  {m.amount === 0 ? "Grátis" : formatPrice(m.amount)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
