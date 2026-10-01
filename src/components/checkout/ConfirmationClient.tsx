"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { placeOrder } from "@/lib/cart/actions";
import { useCart } from "@/context/CartProvider";
import { useAccount } from "@/context/AccountProvider";

/** The order is placed and the cart cookie is gone — sync the header's bag. */
export function CartReset() {
  const { refresh } = useCart();
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return null;
}

/** Logged in: the order is already under "Pedidos" in the account. */
export function AccountOrdersLink() {
  const { customer } = useAccount();
  if (!customer) return null;
  return (
    <Link
      href="/conta"
      className="label flex h-[52px] items-center justify-center border border-ink px-10 hover:bg-ink hover:text-paper"
    >
      Ver meus pedidos
    </Link>
  );
}

/**
 * Back from a redirect-based payment (3DS bank page, PIX, boleto…): Stripe sends
 * the shopper here, and the cart still has to become an order.
 */
export function CompleteAfterRedirect({ status }: { status?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    status === "failed" ? "O pagamento não foi aprovado." : null,
  );
  const started = useRef(false);

  useEffect(() => {
    if (status === "failed" || started.current) return;
    started.current = true;
    placeOrder().then((res) => {
      if (res.ok) router.replace(`/checkout/confirmacao?pedido=${res.data.orderId}`);
      else setError(res.error);
    });
  }, [status, router]);

  if (!error) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center text-ink-muted" aria-busy="true">
        Confirmando seu pagamento…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <h1 className="font-display text-2xl font-medium">Pagamento não concluído</h1>
      <p className="mt-3 text-ink-muted">{error}</p>
      <Link
        href="/checkout/pagamento"
        className="label mt-6 inline-block h-[52px] bg-black px-10 leading-[52px] text-on-dark hover:bg-ink"
      >
        Voltar ao pagamento
      </Link>
    </div>
  );
}
