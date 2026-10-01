"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { Field } from "@/components/ui/Field";
import { isCpf, isEmail, maskCpf } from "@/lib/masks";
import { saveContact } from "@/lib/cart/actions";
import { updateProfile } from "@/lib/account/actions";
import { useCart } from "@/context/CartProvider";
import { useAccount } from "@/context/AccountProvider";
import { useCheckout } from "@/context/CheckoutProvider";

export default function IdentificacaoPage() {
  const router = useRouter();
  const { setCart } = useCart();
  const { customer, setCustomer, signOut } = useAccount();
  const { contact, setContact, cpf, setCpf } = useCheckout();
  const [errors, setErrors] = useState<{ email?: string; cpf?: string; form?: string }>({});
  const [saving, setSaving] = useState(false);

  async function next() {
    const email = customer?.email ?? contact.email;
    const found: typeof errors = {};
    if (!isEmail(email)) found.email = "Informe um e-mail válido.";
    if (!isCpf(cpf)) found.cpf = "Informe um CPF válido.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    const res = await saveContact({ email, cpf, newsletter: contact.newsletter });
    if (!res.ok) {
      setErrors({ form: res.error });
      setSaving(false);
      return;
    }
    setCart(res.data);
    // first purchase on the account: keep the CPF for next time
    if (customer && !customer.cpf) {
      const updated = await updateProfile({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        cpf,
      });
      if (updated.ok) setCustomer(updated.data);
    }
    router.push("/checkout/entrega");
  }

  const cpfField = (
    <Field
      label="CPF"
      value={cpf}
      onChange={(e) => {
        setCpf(maskCpf(e.target.value));
        setErrors((x) => ({ ...x, cpf: undefined }));
      }}
      error={errors.cpf}
      inputMode="numeric"
      placeholder="000.000.000-00"
    />
  );

  return (
    <CheckoutShell step={1} title="Identificação">
      {customer ? (
        <>
          <div className="border border-line p-5">
            <p className="label text-ink-muted">Comprando como</p>
            <p className="mt-1">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-ink-muted">{customer.email}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="label link-quiet mt-3 underline"
            >
              Não é você? Sair
            </button>
          </div>
          <p className="mt-8 text-ink-muted">O CPF vai na nota fiscal.</p>
          <div className="mt-6 max-w-sm">{cpfField}</div>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 border border-line p-5">
            <p className="text-ink-muted">Já tem conta? Entre para usar seus dados e endereços salvos.</p>
            <Link href="/conta?redirect=/checkout" className="label underline">
              Entrar
            </Link>
          </div>

          <h2 className="label-lg mt-10">Comprar sem cadastro</h2>
          <p className="mt-2 text-ink-muted">
            Enviaremos a confirmação e o rastreio do pedido para este e-mail. O CPF vai na nota fiscal.
          </p>

          <div className="mt-8 grid max-w-sm gap-6">
            <Field
              label="E-mail"
              type="email"
              value={contact.email}
              onChange={(e) => {
                setContact({ email: e.target.value });
                setErrors((x) => ({ ...x, email: undefined }));
              }}
              error={errors.email}
              autoComplete="email"
              placeholder="voce@email.com"
            />
            {cpfField}
            <label className="label flex items-center gap-2.5 text-ink-muted">
              <input
                type="checkbox"
                checked={contact.newsletter}
                onChange={(e) => setContact({ newsletter: e.target.checked })}
                className="h-4 w-4 accent-black"
              />
              Quero receber novidades e lançamentos por e-mail.
            </label>
          </div>
        </>
      )}

      {errors.form && <p className="label mt-6 text-[#8a2b2b]">{errors.form}</p>}

      <button
        type="button"
        onClick={next}
        disabled={saving}
        className="label mt-8 h-[52px] w-full bg-black px-8 text-on-dark hover:bg-ink disabled:opacity-60 sm:w-auto sm:min-w-[260px]"
      >
        {saving ? "Salvando…" : "Continuar para a entrega"}
      </button>

      <p className="label mt-6">
        <Link href="/carrinho" className="link-quiet underline">
          Voltar à sacola
        </Link>
      </p>
    </CheckoutShell>
  );
}
