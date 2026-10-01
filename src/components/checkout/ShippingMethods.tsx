"use client";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { ShippingOptionView } from "@/lib/cart/types";

/** Shipping options as Medusa offers them for this cart. */
export function ShippingMethods({
  legend = "Forma de envio",
  name = "shipping",
  options,
  value,
  onChange,
  loading,
  error,
  currency,
}: {
  legend?: string;
  /** radio group name — unique per group when the cart ships in parts */
  name?: string;
  options: ShippingOptionView[];
  value: string | null;
  onChange: (id: string) => void;
  loading: boolean;
  error?: string | null;
  currency: string;
}) {
  return (
    <fieldset className="mt-10">
      <legend className="label-lg mb-4">{legend}</legend>
      {loading ? (
        <p className="label text-ink-muted" aria-busy="true">
          Calculando o frete…
        </p>
      ) : options.length === 0 ? (
        <p className="label text-[#8a2b2b]">
          {error ?? "Nenhuma forma de envio disponível para este endereço."}
        </p>
      ) : (
        <div className="divide-y divide-line border-y border-line">
          {options.map((m) => {
            const on = value === m.id;
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
                  name={name}
                  value={m.id}
                  checked={on}
                  onChange={() => onChange(m.id)}
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
                    <span className="label block text-ink">{m.name}</span>
                    {m.eta && <span className="label block text-ink-muted">{m.eta}</span>}
                  </span>
                  <span className="label text-ink">
                    {m.amount === 0 ? "Grátis" : formatPrice(m.amount, currency)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      )}
      {error && options.length > 0 && <p className="label mt-3 text-[#8a2b2b]">{error}</p>}
    </fieldset>
  );
}
