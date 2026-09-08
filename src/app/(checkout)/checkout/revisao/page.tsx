"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartProvider";
import { useCheckout } from "@/context/CheckoutProvider";

const PAYMENT_LABEL = { cartao: "Cartão de crédito", pix: "PIX", boleto: "Boleto" } as const;

export default function RevisaoPage() {
  const router = useRouter();
  const { items, subtotal, currency, clear } = useCart();
  const { contact, shipping, shippingMethod, payment, placeOrder } = useCheckout();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!accepted) {
      setError("É preciso aceitar os termos para concluir.");
      return;
    }
    placeOrder({
      email: contact.email,
      items,
      shippingLabel: shippingMethod.label,
      shippingAmount: shippingMethod.amount,
      itemTotal: subtotal,
      currency,
      city: shipping.city,
      state: shipping.state,
    });
    clear();
    router.push("/checkout/confirmacao");
  }

  const cardTail = payment.cardNumber.replace(/\s/g, "").slice(-4);

  return (
    <CheckoutShell step={4} title="Revisão">
      <div className="divide-y divide-line border-y border-line">
        <ReviewRow label="Contato" editHref="/checkout">
          {contact.email || "—"}
        </ReviewRow>
        <ReviewRow label="Entrega" editHref="/checkout/entrega">
          {shipping.firstName} {shipping.lastName}
          <br />
          {shipping.street}, {shipping.number}
          {shipping.complement ? ` — ${shipping.complement}` : ""}
          <br />
          {shipping.district} · {shipping.city}/{shipping.state} · {shipping.cep}
          <br />
          {shipping.phone}
        </ReviewRow>
        <ReviewRow label="Envio" editHref="/checkout/entrega">
          {shippingMethod.label} — {shippingMethod.eta}
          <br />
          {shippingMethod.amount === 0 ? "Grátis" : formatPrice(shippingMethod.amount, currency)}
        </ReviewRow>
        <ReviewRow label="Pagamento" editHref="/checkout/pagamento">
          {PAYMENT_LABEL[payment.kind]}
          {payment.kind === "cartao" && cardTail ? ` terminado em ${cardTail}` : ""}
          {payment.kind === "cartao" ? ` · ${payment.installments}x` : ""}
        </ReviewRow>
      </div>

      <label className="label mt-6 flex items-start gap-2.5 text-ink-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            setError(null);
          }}
          className="mt-0.5 h-4 w-4 accent-black"
        />
        <span>
          Li e aceito os{" "}
          <Link href="/legal/termos" className="underline">
            Termos de uso
          </Link>{" "}
          e a{" "}
          <Link href="/legal/privacidade" className="underline">
            Política de privacidade
          </Link>
          .
        </span>
      </label>
      {error && <p className="label mt-3 text-[#8a2b2b]">{error}</p>}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
        <button
          type="button"
          onClick={confirm}
          className="label h-[52px] bg-black px-8 text-on-dark hover:bg-ink sm:min-w-[260px]"
        >
          Confirmar pedido
        </button>
        <Link href="/checkout/pagamento" className="label link-quiet text-center sm:text-left">
          ← Voltar
        </Link>
      </div>
      <p className="label mt-4 text-ink-muted">
        Ambiente de demonstração — nenhuma cobrança é feita.
      </p>
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
  children: React.ReactNode;
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
