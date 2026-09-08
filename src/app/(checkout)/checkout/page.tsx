"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { Field } from "@/components/ui/Field";
import { isEmail } from "@/lib/masks";
import { useCheckout } from "@/context/CheckoutProvider";

export default function IdentificacaoPage() {
  const router = useRouter();
  const { contact, setContact } = useCheckout();
  const [error, setError] = useState<string | null>(null);

  function next() {
    if (!isEmail(contact.email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    router.push("/checkout/entrega");
  }

  return (
    <CheckoutShell step={1} title="Identificação">
      <p className="text-ink-muted">
        Enviaremos a confirmação e o rastreio do pedido para este e-mail.
      </p>

      <div className="mt-8 max-w-sm">
        <Field
          label="E-mail"
          type="email"
          value={contact.email}
          onChange={(e) => {
            setContact({ email: e.target.value });
            setError(null);
          }}
          error={error}
          autoComplete="email"
          placeholder="voce@email.com"
        />
        <label className="label mt-4 flex items-center gap-2.5 text-ink-muted">
          <input
            type="checkbox"
            checked={contact.newsletter}
            onChange={(e) => setContact({ newsletter: e.target.checked })}
            className="h-4 w-4 accent-black"
          />
          Quero receber novidades e lançamentos por e-mail.
        </label>
      </div>

      <button
        type="button"
        onClick={next}
        className="label mt-8 h-[52px] w-full bg-black px-8 text-on-dark hover:bg-ink sm:w-auto sm:min-w-[260px]"
      >
        Continuar para a entrega
      </button>

      <p className="label mt-6 text-ink-muted">
        Já tem conta? O login chega na <strong className="font-normal text-ink">etapa 2</strong> —
        por ora, siga como convidado.{" "}
        <Link href="/carrinho" className="link-quiet underline">
          Voltar à sacola
        </Link>
      </p>
    </CheckoutShell>
  );
}
