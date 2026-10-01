"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCart } from "@/context/CartProvider";
import { StepNav } from "./StepNav";
import { OrderSummary } from "./OrderSummary";
import type { CheckoutStep } from "./steps";

export function CheckoutShell({
  step,
  title,
  children,
}: {
  step: CheckoutStep;
  title: string;
  children: ReactNode;
}) {
  const { cart, items, ready } = useCart();

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center text-ink-muted" aria-busy="true">
        Carregando sua sacola…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-2xl font-medium">Sua sacola está vazia</h1>
        <p className="mt-3 text-ink-muted">Adicione peças antes de finalizar a compra.</p>
        <Link
          href="/mulher"
          className="label mt-6 inline-block h-[52px] bg-black px-10 leading-[52px] text-on-dark hover:bg-ink"
        >
          Explorar a coleção
        </Link>
      </div>
    );
  }

  // each step needs what the earlier ones saved on the cart (deep links, reloads)
  const missing =
    step >= 2 && !cart?.email
      ? { href: "/checkout", text: "Antes, informe seu e-mail e CPF." }
      : step >= 3 && (!cart?.address || !cart?.shippingMethod)
        ? { href: "/checkout/entrega", text: "Antes, informe o endereço e a forma de envio." }
        : null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
      <StepNav current={step} />
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-14">
        <div>
          <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">{title}</h1>
          <div className="mt-8">
            {missing ? (
              <div className="border border-line p-6">
                <p>{missing.text}</p>
                <Link href={missing.href} className="label mt-4 inline-block underline">
                  Voltar à etapa anterior
                </Link>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
        <div className="mt-12 lg:mt-0">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
