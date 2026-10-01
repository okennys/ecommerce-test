"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethods } from "@/components/checkout/ShippingMethods";
import { chooseShipping, listShippingOptions, saveAddress } from "@/lib/cart/actions";
import { addAddress } from "@/lib/account/actions";
import { addressErrors } from "@/lib/cart/address";
import type { CheckoutAddress, ShippingGroup } from "@/lib/cart/types";
import { cn } from "@/lib/cn";
import { useCart } from "@/context/CartProvider";
import { useAccount } from "@/context/AccountProvider";
import { useCheckout } from "@/context/CheckoutProvider";

/** Same place, ignoring formatting — so a saved address isn't saved twice. */
function sameAddress(a: CheckoutAddress, b: CheckoutAddress) {
  const key = (x: CheckoutAddress) =>
    [
      x.cep.replace(/\D/g, ""),
      x.street.trim().toLowerCase(),
      x.number.trim(),
      x.complement.trim().toLowerCase(),
    ].join("|");
  return key(a) === key(b);
}

export default function EntregaPage() {
  const router = useRouter();
  const { cart, ready, currency, setCart } = useCart();
  const { shipping, setShipping } = useCheckout();
  const { customer, setCustomer } = useAccount();
  const [remember, setRemember] = useState(true);
  const savedAddresses = customer?.addresses ?? [];
  const alreadySaved = savedAddresses.some((s) => sameAddress(s.address, shipping));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [groups, setGroups] = useState<ShippingGroup[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  // shipping profile id -> chosen option id
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const hasCart = ready && Boolean(cart);

  useEffect(() => {
    if (!hasCart) return;
    let alive = true;
    listShippingOptions().then((res) => {
      if (!alive) return;
      if (res.ok) {
        setGroups(res.data);
        // keep what the cart already has, else preselect each group's first option
        const saved = cart?.shippingMethod?.optionIds ?? [];
        setChosen((current) => {
          const next: Record<string, string> = { ...current };
          for (const g of res.data) {
            next[g.profileId] ??=
              g.options.find((o) => saved.includes(o.id))?.id ?? g.options[0]?.id ?? "";
          }
          return next;
        });
      } else {
        setOptionsError(res.error);
      }
      setLoadingOptions(false);
    });
    return () => {
      alive = false;
    };
    // options depend on the cart, not on every snapshot change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCart]);

  async function next() {
    const found = addressErrors(shipping);
    setErrors(found);
    if (Object.keys(found).length) return;
    const picks = groups.map((g) => chosen[g.profileId]).filter(Boolean);
    if (!groups.length || picks.length !== groups.length) {
      setFormError("Escolha a forma de envio.");
      return;
    }

    setSaving(true);
    setFormError(null);
    // address first: Medusa re-checks the shipping method when the address changes
    const saved = await saveAddress(shipping);
    const res = saved.ok ? await chooseShipping(picks) : saved;
    setSaving(false);
    if (!res.ok) {
      setFormError(res.error);
      return;
    }
    setCart(res.data);
    // logged in: keep a new address in the account (a failure here never blocks the order)
    if (customer && remember && !alreadySaved) {
      const added = await addAddress(shipping);
      if (added.ok) setCustomer(added.data);
    }
    router.push("/checkout/pagamento");
  }

  return (
    <CheckoutShell step={2} title="Entrega">
      {savedAddresses.length > 0 && (
        <fieldset className="mb-10">
          <legend className="label-lg mb-4">Endereços salvos</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {savedAddresses.map(({ id, address: a }) => {
              const on = sameAddress(a, shipping);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setShipping(a);
                    setErrors({});
                  }}
                  className={cn(
                    "border p-4 text-left transition-colors",
                    on ? "border-ink" : "border-line hover:border-line-strong",
                  )}
                >
                  <span className="label block">
                    {a.firstName} {a.lastName}
                  </span>
                  <span className="mt-1 block text-ink-muted">
                    {a.street}, {a.number}
                    {a.complement ? ` — ${a.complement}` : ""} · {a.city}/{a.state}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="label mt-4 text-ink-muted">Ou preencha um novo endereço abaixo.</p>
        </fieldset>
      )}

      <AddressForm value={shipping} onChange={setShipping} errors={errors} />

      {customer && !alreadySaved && (
        <label className="label mt-6 flex items-center gap-2.5 text-ink-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 accent-black"
          />
          Salvar este endereço na minha conta
        </label>
      )}
      {loadingOptions || groups.length === 0 ? (
        <ShippingMethods
          options={[]}
          value={null}
          onChange={() => {}}
          loading={loadingOptions}
          error={optionsError}
          currency={currency}
        />
      ) : (
        groups.map((g) => (
          <ShippingMethods
            key={g.profileId}
            name={`shipping-${g.profileId}`}
            // a cart that ships in parts names the pieces each choice covers
            legend={groups.length > 1 ? `Forma de envio — ${g.items.join(", ")}` : undefined}
            options={g.options}
            value={chosen[g.profileId] ?? null}
            onChange={(id) => {
              setChosen((c) => ({ ...c, [g.profileId]: id }));
              setFormError(null);
            }}
            loading={false}
            error={g.options.length ? null : "Nenhuma forma de envio disponível para estas peças."}
            currency={currency}
          />
        ))
      )}

      {formError && <p className="label mt-6 text-[#8a2b2b]">{formError}</p>}

      <div className="mt-10 flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
        <button
          type="button"
          onClick={next}
          disabled={saving || loadingOptions}
          className="label h-[52px] bg-black px-8 text-on-dark hover:bg-ink disabled:opacity-60 sm:min-w-[260px]"
        >
          {saving ? "Salvando…" : "Continuar para o pagamento"}
        </button>
        <Link href="/checkout" className="label link-quiet text-center sm:text-left">
          ← Voltar
        </Link>
      </div>
    </CheckoutShell>
  );
}
