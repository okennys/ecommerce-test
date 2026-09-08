"use client";

import { Field, Select } from "@/components/ui/Field";
import { maskCep, maskPhone } from "@/lib/masks";
import { useCheckout } from "@/context/CheckoutProvider";

const UF = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR",
  "PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export function AddressForm({ errors }: { errors: Record<string, string> }) {
  const { shipping, setShipping } = useCheckout();
  const set = (k: keyof typeof shipping) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping({ [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <Field label="Nome" value={shipping.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
      <Field label="Sobrenome" value={shipping.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
      <Field
        label="CEP"
        value={shipping.cep}
        onChange={(e) => setShipping({ cep: maskCep(e.target.value) })}
        error={errors.cep}
        inputMode="numeric"
        placeholder="00000-000"
        autoComplete="postal-code"
      />
      <div className="hidden sm:block" />
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
