"use client";

import Image from "next/image";
import Link from "next/link";
import { t } from "@/lib/dictionary";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartProvider";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

export function CartView() {
  const { items, count, subtotal, currency, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">{t.cart.empty}</h1>
        <p className="text-ink-muted">{t.cart.emptyHint}</p>
        <Link
          href="/mulher"
          className="label mt-4 h-[52px] bg-black px-10 leading-[52px] text-on-dark hover:bg-ink"
        >
          Explorar a coleção
        </Link>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-16">
      <section>
        <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium">
          Sacola <span className="text-ink-muted">({count})</span>
        </h1>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-6">
              <Link
                href={`/produtos/${item.product_handle}`}
                className="relative aspect-[4/5] w-24 shrink-0 bg-paper-raised"
              >
                {item.thumbnail && (
                  <Image src={item.thumbnail} alt="" fill sizes="96px" className="object-cover" />
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link href={`/produtos/${item.product_handle}`} className="label hover:underline">
                    {item.title}
                  </Link>
                  <span className="label whitespace-nowrap">
                    {formatPrice(item.unit_price * item.quantity, item.currency_code)}
                  </span>
                </div>
                <p className="label mt-1 text-ink-muted">{item.variant_title}</p>
                <p className="label mt-1 text-ink-muted">{t.common.taxIncluded}</p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-line-strong">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Diminuir quantidade"
                      className="p-2.5"
                    >
                      <MinusIcon size={14} />
                    </button>
                    <span className="label w-10 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Aumentar quantidade"
                      className="p-2.5"
                    >
                      <PlusIcon size={14} />
                    </button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="label link-quiet">
                    {t.cart.remove}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link href="/mulher" className="label link-quiet mt-6 inline-block">
          ← Continuar comprando
        </Link>
      </section>

      <aside className="mt-12 lg:mt-0">
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+2rem)]">
          <h2 className="label-lg border-b border-line pb-4">Resumo</h2>
          <dl className="space-y-3 py-5">
            <div className="flex justify-between">
              <dt className="label text-ink-muted">{t.cart.subtotal}</dt>
              <dd className="label">{formatPrice(subtotal, currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="label text-ink-muted">Frete</dt>
              <dd className="label text-ink-muted">Calculado no checkout</dd>
            </div>
          </dl>
          <div className="flex justify-between border-t border-line pt-4">
            <span className="label-lg">Total estimado</span>
            <span className="label-lg">{formatPrice(subtotal, currency)}</span>
          </div>
          <p className="label mt-2 text-ink-muted">Impostos incluídos.</p>

          <Link
            href="/checkout"
            className="label mt-6 flex h-[52px] w-full items-center justify-center bg-black px-8 text-on-dark hover:bg-ink"
          >
            {t.cart.checkout}
          </Link>
          <p className="label mt-4 text-center text-ink-muted">
            Pagamento simulado — ambiente de demonstração.
          </p>
        </div>
      </aside>
    </div>
  );
}
