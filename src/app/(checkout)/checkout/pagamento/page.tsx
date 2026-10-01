"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { STRIPE_PUBLISHABLE_KEY, StripePayment } from "@/components/checkout/StripePayment";
import { startPayment } from "@/lib/cart/actions";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartProvider";

type Session = { clientSecret: string; amount: number; currency: string };

export default function PagamentoPage() {
  const { cart, ready } = useCart();
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canPay = ready && Boolean(cart?.email && cart.address && cart.shippingMethod);

  // a fresh session every time: Medusa drops the old one whenever the cart changes
  useEffect(() => {
    if (!canPay || !STRIPE_PUBLISHABLE_KEY) return;
    let alive = true;
    startPayment().then((res) => {
      if (!alive) return;
      if (res.ok) setSession(res.data);
      else setError(res.error);
    });
    return () => {
      alive = false;
    };
  }, [canPay]);

  const a = cart?.address;

  return (
    <CheckoutShell step={3} title="Pagamento">
      {cart && a && (
        <div className="divide-y divide-line border-y border-line">
          <ReviewRow label="Contato" editHref="/checkout">
            {cart.email}
            {cart.cpf && (
              <>
                <br />
                CPF {cart.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4")}
              </>
            )}
          </ReviewRow>
          <ReviewRow label="Entrega" editHref="/checkout/entrega">
            {a.firstName} {a.lastName}
            <br />
            {a.street}, {a.number}
            {a.complement ? ` — ${a.complement}` : ""}
            <br />
            {a.district} · {a.city}/{a.state} · {a.cep}
            <br />
            {a.phone}
          </ReviewRow>
          {cart.shippingMethod && (
            <ReviewRow label="Envio" editHref="/checkout/entrega">
              {cart.shippingMethod.name} ·{" "}
              {cart.shippingMethod.amount === 0
                ? "Grátis"
                : formatPrice(cart.shippingTotal, cart.currency)}
            </ReviewRow>
          )}
        </div>
      )}

      <h2 className="label-lg mt-10 mb-5">Forma de pagamento</h2>

      {!STRIPE_PUBLISHABLE_KEY ? (
        <p className="border border-line p-6 text-ink-muted">
          O pagamento está temporariamente indisponível. Tente novamente mais tarde.
        </p>
      ) : error ? (
        <div className="border border-line p-6">
          <p className="text-[#8a2b2b]">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="label mt-4 underline"
          >
            Tentar de novo
          </button>
        </div>
      ) : !session || !cart || !a ? (
        <p className="label text-ink-muted" aria-busy="true">
          Preparando o pagamento seguro…
        </p>
      ) : (
        <StripePayment
          clientSecret={session.clientSecret}
          total={session.amount}
          currency={session.currency}
          payer={{ email: cart.email, address: a }}
        />
      )}

      <Link href="/checkout/entrega" className="label link-quiet mt-6 inline-block">
        ← Voltar
      </Link>
    </CheckoutShell>
  );
}

function ReviewRow({
  label,
  editHref,
  children,
}: {
  label: string;
  editHref: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-5">
      <div>
        <p className="label-lg mb-1">{label}</p>
        <p className="text-ink-muted">{children}</p>
      </div>
      <Link href={editHref} className="label link-quiet shrink-0">
        Editar
      </Link>
    </div>
  );
}
