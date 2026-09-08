"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import { useCheckout } from "@/context/CheckoutProvider";

export default function PagamentoPage() {
  const router = useRouter();
  const { payment } = useCheckout();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function next() {
    const found: Record<string, string> = {};
    if (payment.kind === "cartao") {
      if (payment.cardNumber.replace(/\s/g, "").length < 16) found.cardNumber = "Número incompleto.";
      if (!payment.cardName.trim()) found.cardName = "Informe o nome no cartão.";
      if (payment.cardExpiry.length < 5) found.cardExpiry = "Validade incompleta.";
      if (payment.cardCvv.length < 3) found.cardCvv = "CVV incompleto.";
    }
    setErrors(found);
    if (Object.keys(found).length === 0) router.push("/checkout/revisao");
  }

  return (
    <CheckoutShell step={3} title="Pagamento">
      <PaymentForm errors={errors} />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
        <button
          type="button"
          onClick={next}
          className="label h-[52px] bg-black px-8 text-on-dark hover:bg-ink sm:min-w-[260px]"
        >
          Revisar o pedido
        </button>
        <Link href="/checkout/entrega" className="label link-quiet text-center sm:text-left">
          ← Voltar
        </Link>
      </div>
    </CheckoutShell>
  );
}
