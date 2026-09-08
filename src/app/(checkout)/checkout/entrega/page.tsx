"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethods } from "@/components/checkout/ShippingMethods";
import { useCheckout } from "@/context/CheckoutProvider";

const REQUIRED: Record<string, string> = {
  firstName: "Informe o nome.",
  lastName: "Informe o sobrenome.",
  cep: "Informe o CEP.",
  street: "Informe a rua.",
  number: "Informe o número.",
  district: "Informe o bairro.",
  city: "Informe a cidade.",
  state: "Selecione o estado.",
  phone: "Informe o telefone.",
};

export default function EntregaPage() {
  const router = useRouter();
  const { shipping } = useCheckout();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function next() {
    const found: Record<string, string> = {};
    for (const [k, msg] of Object.entries(REQUIRED)) {
      if (!String(shipping[k as keyof typeof shipping] ?? "").trim()) found[k] = msg;
    }
    setErrors(found);
    if (Object.keys(found).length === 0) router.push("/checkout/pagamento");
  }

  return (
    <CheckoutShell step={2} title="Entrega">
      <AddressForm errors={errors} />
      <ShippingMethods />

      <div className="mt-10 flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
        <button
          type="button"
          onClick={next}
          className="label h-[52px] bg-black px-8 text-on-dark hover:bg-ink sm:min-w-[260px]"
        >
          Continuar para o pagamento
        </button>
        <Link href="/checkout" className="label link-quiet text-center sm:text-left">
          ← Voltar
        </Link>
      </div>
    </CheckoutShell>
  );
}
