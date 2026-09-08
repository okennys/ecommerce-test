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
  showShipping = true,
}: {
  step: CheckoutStep;
  title: string;
  children: ReactNode;
  showShipping?: boolean;
}) {
  const { items } = useCart();

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

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
      <StepNav current={step} />
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-14">
        <div>
          <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">{title}</h1>
          <div className="mt-8">{children}</div>
        </div>
        <div className="mt-12 lg:mt-0">
          <OrderSummary showShipping={showShipping} />
        </div>
      </div>
    </div>
  );
}
