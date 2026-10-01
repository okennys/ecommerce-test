"use client";

import { useRef, useState } from "react";
import { Field, Select } from "@/components/ui/Field";
import { maskCep, maskPhone } from "@/lib/masks";
import type { CheckoutAddress } from "@/lib/cart/types";

const UF = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

interface ViaCep {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

/** Brazilian address fields with CEP lookup — used by the checkout and the address book. */
export function AddressForm({
  value: shipping,
  onChange: setShipping,
  errors,
}: {
  value: CheckoutAddress;
  onChange: (patch: Partial<CheckoutAddress>) => void;
  errors: Record<string, string>;
}) {
  const [cepStatus, setCepStatus] = useState<"idle" | "loading" | "missing">("idle");
  const lastLookup = useRef("");
  const set = (k: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping({ [k]: e.target.value });

  // fill street/bairro/cidade/UF from the CEP — the shopper still edits freely
  async function lookupCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8 || digits === lastLookup.current) return;
    lastLookup.current = digits;
    setCepStatus("loading");
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = (await res.json()) as ViaCep;
      if (!res.ok || data.erro) {
        setCepStatus("missing");
        return;
      }
      setShipping({
        street: data.logradouro || "",
        district: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      });
      setCepStatus("idle");
    } catch {
      // lookup is a convenience; typing the address by hand still works
      setCepStatus("idle");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <Field label="Nome" value={shipping.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
      <Field label="Sobrenome" value={shipping.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
      <Field
        label="CEP"
        value={shipping.cep}
        onChange={(e) => {
          const cep = maskCep(e.target.value);
          setShipping({ cep });
          void lookupCep(cep);
        }}
        error={
          errors.cep ?? (cepStatus === "missing" ? "CEP não encontrado. Preencha o endereço." : undefined)
        }
        inputMode="numeric"
        placeholder="00000-000"
        autoComplete="postal-code"
      />
      <p className="label hidden self-end pb-3 text-ink-muted sm:block" aria-live="polite">
        {cepStatus === "loading" ? "Buscando endereço…" : ""}
      </p>
      <Field className="sm:col-span-2" label="Rua / logradouro" value={shipping.street} onChange={set("street")} error={errors.street} autoComplete="address-line1" />
      <Field label="Número" value={shipping.number} onChange={set("number")} error={errors.number} inputMode="numeric" />
      <Field label="Complemento" value={shipping.complement} onChange={set("complement")} />
      <Field label="Bairro" value={shipping.district} onChange={set("district")} error={errors.district} />
      <Field label="Cidade" value={shipping.city} onChange={set("city")} error={errors.city} autoComplete="address-level2" />
      <Select
        label="Estado"
        value={shipping.state}
        onChange={(e) => setShipping({ state: e.target.value })}
        error={errors.state}
      >
        <option value="">—</option>
        {UF.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </Select>
      <Field
        className="sm:col-span-2"
        label="Telefone"
        value={shipping.phone}
        onChange={(e) => setShipping({ phone: maskPhone(e.target.value) })}
        error={errors.phone}
        inputMode="tel"
        placeholder="(11) 90000-0000"
        autoComplete="tel"
      />
    </div>
  );
}
