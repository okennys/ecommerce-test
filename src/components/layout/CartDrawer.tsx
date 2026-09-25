"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useScrollLock } from "@/lib/useScrollLock";
import { useCart } from "@/context/CartProvider";
import { CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

export function CartDrawer() {
  const { items, count, subtotal, currency, isOpen, closeCart, updateQuantity, removeItem } =
    useCart();

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.cart.title}
      data-open={isOpen}
      inert={!isOpen}
      className={cn(
        "fixed inset-0 z-[110] transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        aria-label={t.common.close}
        onClick={closeCart}
        className="absolute inset-0 bg-ink/25"
      />

      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-paper transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex h-header items-center justify-between border-b border-line px-6">
          <h2 className="label-lg">
            {t.cart.title}
            {count > 0 && ` (${count})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label={t.common.close}
            className="-m-2 p-2"
          >
            <CloseIcon size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="label">{t.cart.empty}</p>
            <p className="label text-ink-muted">{t.cart.emptyHint}</p>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-6">
                <div className="relative aspect-[4/5] w-20 shrink-0 bg-paper-raised">
                  {item.thumbnail && (
                    <Image
                      src={item.thumbnail}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <Link
                      href={`/produtos/${item.product_handle}`}
                      onClick={closeCart}
                      className="label pr-2 hover:underline"
                    >
                      {item.title}
                    </Link>
                    <span className="label whitespace-nowrap">
                      {formatPrice(item.unit_price * item.quantity, item.currency_code)}
                    </span>
                  </div>
                  <p className="label mt-1 text-ink-muted">{item.variant_title}</p>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuir quantidade"
                        className="p-2"
                      >
                        <MinusIcon size={14} />
                      </button>
                      <span className="label w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar quantidade"
                        className="p-2"
                      >
                        <PlusIcon size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="label link-quiet"
                    >
                      {t.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <footer className="border-t border-line px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="label-lg">{t.cart.subtotal}</span>
              <span className="label-lg">{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="label mt-2 text-ink-muted">{t.cart.shippingNote}</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="label mt-5 flex h-[52px] w-full items-center justify-center bg-black px-8 text-on-dark transition-colors hover:bg-ink"
            >
              {t.cart.checkout}
            </Link>
            <Link
              href="/carrinho"
              onClick={closeCart}
              className="label mt-3 flex h-[46px] w-full items-center justify-center border border-ink hover:bg-ink hover:text-paper"
            >
              Ver sacola
            </Link>
          </footer>
        )}
      </aside>
    </div>
  );
}
