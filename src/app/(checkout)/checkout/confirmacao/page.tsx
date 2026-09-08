"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { formatPrice } from "@/lib/format";
import { CheckIcon } from "@/components/ui/icons";
import { useCheckout } from "@/context/CheckoutProvider";

export default function ConfirmacaoPage() {
  const router = useRouter();
  const { lastOrder, reset } = useCheckout();

  useEffect(() => {
    if (!lastOrder) {
      const id = setTimeout(() => router.replace("/"), 1200);
      return () => clearTimeout(id);
    }
  }, [lastOrder, router]);

  if (!lastOrder) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center text-ink-muted">
        Nenhum pedido para exibir. Redirecionando…
      </div>
    );
  }

  const total = lastOrder.itemTotal + lastOrder.shippingAmount;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:py-24">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center border border-ink">
          <CheckIcon size={22} />
        </span>
        <h1 className="font-display mt-6 text-[clamp(1.6rem,3vw,2.25rem)] font-medium">
          Obrigada pela sua compra
        </h1>
        <p className="mt-3 text-ink-muted">
          Pedido <strong className="font-normal text-ink">{lastOrder.number}</strong> confirmado.
          Enviamos os detalhes para {lastOrder.email}.
        </p>
      </div>

      <div className="mt-10 border-y border-line">
        <ul className="divide-y divide-line">
          {lastOrder.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative aspect-[4/5] w-16 shrink-0 bg-paper-raised">
                {item.thumbnail && (
                  <Image src={item.thumbnail} alt="" fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 justify-between gap-3">
                <div>
                  <p className="label">{item.title}</p>
                  <p className="label text-ink-muted">
                    {item.variant_title} · Qtd {item.quantity}
                  </p>
                </div>
                <span className="label whitespace-nowrap">
                  {formatPrice(item.unit_price * item.quantity, item.currency_code)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-5 space-y-2">
        <Row label="Subtotal" value={formatPrice(lastOrder.itemTotal, lastOrder.currency)} />
        <Row
          label={`Envio — ${lastOrder.shippingLabel}`}
          value={
            lastOrder.shippingAmount === 0
              ? "Grátis"
              : formatPrice(lastOrder.shippingAmount, lastOrder.currency)
          }
        />
      </dl>
      <div className="mt-3 flex justify-between border-t border-line pt-3">
        <span className="label-lg">Total</span>
        <span className="label-lg">{formatPrice(total, lastOrder.currency)}</span>
      </div>

      <p className="mt-8 text-ink-muted">
        Entrega para {lastOrder.city}/{lastOrder.state}. Você receberá o código de rastreio assim que
        o pedido for despachado.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          onClick={() => reset()}
          className="label flex h-[52px] items-center justify-center bg-black px-10 text-on-dark hover:bg-ink"
        >
          Continuar comprando
        </Link>
        <Link
          href="/ajuda/pedido"
          className="label flex h-[52px] items-center justify-center border border-ink px-10 hover:bg-ink hover:text-paper"
        >
          Acompanhar pedido
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="label text-ink-muted">{label}</dt>
      <dd className="label">{value}</dd>
    </div>
  );
}
