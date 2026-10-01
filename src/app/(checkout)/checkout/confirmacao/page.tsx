import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { getOrder } from "@/lib/data/orders";
import { CheckIcon } from "@/components/ui/icons";
import {
  AccountOrdersLink,
  CartReset,
  CompleteAfterRedirect,
} from "@/components/checkout/ConfirmationClient";

export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; retorno?: string; redirect_status?: string }>;
}) {
  const { pedido, retorno, redirect_status } = await searchParams;

  if (retorno && !pedido) return <CompleteAfterRedirect status={redirect_status} />;

  const order = pedido ? await getOrder(pedido) : null;

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Pedido não encontrado</h1>
        <p className="mt-3 text-ink-muted">
          Se você acabou de comprar, a confirmação também foi enviada para o seu e-mail.
        </p>
        <Link
          href="/"
          className="label mt-6 inline-block h-[52px] bg-black px-10 leading-[52px] text-on-dark hover:bg-ink"
        >
          Ir para a página inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 lg:py-24">
      <CartReset />
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center border border-ink">
          <CheckIcon size={22} />
        </span>
        <h1 className="font-display mt-6 text-[clamp(1.6rem,3vw,2.25rem)] font-medium">
          Obrigada pela sua compra
        </h1>
        <p className="mt-3 text-ink-muted">
          Pedido <strong className="font-normal text-ink">nº {order.number}</strong> confirmado.
          Enviamos os detalhes para {order.email}.
        </p>
      </div>

      <div className="mt-10 border-y border-line">
        <ul className="divide-y divide-line">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative aspect-[4/5] w-16 shrink-0 bg-paper-raised">
                {item.thumbnail && (
                  <Image src={item.thumbnail} alt="" fill sizes="64px" className="object-cover object-top" />
                )}
              </div>
              <div className="flex flex-1 justify-between gap-3">
                <div>
                  <p className="label">{item.title}</p>
                  <p className="label text-ink-muted">
                    {item.label} · Qtd {item.quantity}
                  </p>
                </div>
                <span className="label whitespace-nowrap">
                  {formatPrice(item.total, order.currency)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-5 space-y-2">
        <Row label="Subtotal" value={formatPrice(order.itemSubtotal, order.currency)} />
        {order.discountTotal > 0 && (
          <Row label="Desconto" value={`−${formatPrice(order.discountTotal, order.currency)}`} />
        )}
        <Row
          label={`Envio${order.shippingName ? ` — ${order.shippingName}` : ""}`}
          value={
            order.shippingTotal === 0 ? "Grátis" : formatPrice(order.shippingTotal, order.currency)
          }
        />
      </dl>
      <div className="mt-3 flex justify-between border-t border-line pt-3">
        <span className="label-lg">Total</span>
        <span className="label-lg">{formatPrice(order.total, order.currency)}</span>
      </div>

      <p className="mt-8 text-ink-muted">
        Entrega para {order.city}/{order.state}. Você receberá o código de rastreio por e-mail assim
        que o pedido for despachado.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="label flex h-[52px] items-center justify-center bg-black px-10 text-on-dark hover:bg-ink"
        >
          Continuar comprando
        </Link>
        <AccountOrdersLink />
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
