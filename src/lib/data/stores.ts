/**
 * Where the brand receives. It is an e-commerce with one address for
 * appointments, not a retail network — the list stays an array so more can be
 * added without touching the page.
 */
import { brand } from "./brand";

export interface Store {
  slug: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  flagship?: boolean;
}

export const stores: Store[] = [
  {
    slug: "sao-paulo-faria-lima",
    name: "JU RUDOLPH — Atendimento",
    city: "São Paulo",
    state: "SP",
    address: `${brand.address.street} — ${brand.address.district} · CEP ${brand.address.cep}`,
    phone: brand.phoneDisplay,
    hours: brand.hours,
    image: "editorial-atelier",
    flagship: true,
  },
];

export function getStore(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug);
}
