import type { HttpTypes } from "@medusajs/types";
import { maskPhone } from "@/lib/masks";
import type { CheckoutAddress } from "./types";

/**
 * Brazilian addresses don't fit Medusa's two lines: street+number go on line 1,
 * complement+bairro on line 2 (what shows in the admin and the e-mails), and
 * the structured parts ride along in metadata so forms can be refilled. Used
 * for cart addresses and for the customer's saved addresses alike.
 */

type MedusaAddressLike = {
  first_name?: string | null;
  last_name?: string | null;
  address_1?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  phone?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function toCheckoutAddress(a: MedusaAddressLike | null | undefined): CheckoutAddress | null {
  if (!a?.address_1) return null;
  const meta = (a.metadata ?? {}) as Record<string, string>;
  return {
    firstName: a.first_name ?? "",
    lastName: a.last_name ?? "",
    cep: (a.postal_code ?? "").replace(/^(\d{5})(\d{3})$/, "$1-$2"),
    street: meta.street ?? a.address_1 ?? "",
    number: meta.number ?? "",
    complement: meta.complement ?? "",
    district: meta.district ?? "",
    city: a.city ?? "",
    state: (a.province ?? "").toUpperCase(),
    phone: maskPhone(a.phone ?? ""),
  };
}

export function toMedusaAddress(a: CheckoutAddress): HttpTypes.StoreAddAddress {
  return {
    first_name: a.firstName.trim(),
    last_name: a.lastName.trim(),
    address_1: `${a.street.trim()}, ${a.number.trim()}`,
    address_2: [a.complement.trim(), a.district.trim()].filter(Boolean).join(" — "),
    city: a.city.trim(),
    province: a.state,
    postal_code: a.cep.replace(/\D/g, ""),
    country_code: "br",
    phone: a.phone.replace(/\D/g, ""),
    metadata: {
      street: a.street.trim(),
      number: a.number.trim(),
      complement: a.complement.trim(),
      district: a.district.trim(),
    },
  };
}

/** Validation shared by the checkout and the address book. */
export function addressErrors(a: CheckoutAddress): Record<string, string> {
  const required: Record<keyof CheckoutAddress, string | null> = {
    firstName: "Informe o nome.",
    lastName: "Informe o sobrenome.",
    cep: "Informe o CEP.",
    street: "Informe a rua.",
    number: "Informe o número.",
    complement: null,
    district: "Informe o bairro.",
    city: "Informe a cidade.",
    state: "Selecione o estado.",
    phone: "Informe o telefone.",
  };
  const found: Record<string, string> = {};
  for (const [k, msg] of Object.entries(required)) {
    if (msg && !String(a[k as keyof CheckoutAddress] ?? "").trim()) found[k] = msg;
  }
  if (!found.cep && a.cep.replace(/\D/g, "").length !== 8) found.cep = "CEP incompleto.";
  if (!found.phone && a.phone.replace(/\D/g, "").length < 10) found.phone = "Telefone incompleto.";
  return found;
}
