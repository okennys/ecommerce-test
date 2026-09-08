/**
 * Store list for the locator page. Mock data.
 *
 * SWAP POINT: replace with the real boutique network (CMS or Medusa
 * sales-channel locations).
 */
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
    slug: "sao-paulo-oscar-freire",
    name: "JU RUDOLPH Oscar Freire",
    city: "São Paulo",
    state: "SP",
    address: "Rua Oscar Freire, 725 — Jardins",
    phone: "+55 11 3060-1200",
    hours: "Seg a sáb, 10h–20h · Dom, 13h–19h",
    image: "editorial-atelier",
    flagship: true,
  },
  {
    slug: "sao-paulo-iguatemi",
    name: "JU RUDOLPH Iguatemi São Paulo",
    city: "São Paulo",
    state: "SP",
    address: "Av. Brigadeiro Faria Lima, 2232 — Piso Térreo",
    phone: "+55 11 3030-4400",
    hours: "Seg a sáb, 10h–22h · Dom, 14h–20h",
    image: "editorial-roupas",
  },
  {
    slug: "rio-de-janeiro-leblon",
    name: "JU RUDOLPH Leblon",
    city: "Rio de Janeiro",
    state: "RJ",
    address: "Av. Ataulfo de Paiva, 1079 — Leblon",
    phone: "+55 21 2540-3300",
    hours: "Seg a sáb, 10h–21h · Dom, 13h–20h",
    image: "editorial-bolsas",
  },
  {
    slug: "rio-de-janeiro-village-mall",
    name: "JU RUDOLPH VillageMall",
    city: "Rio de Janeiro",
    state: "RJ",
    address: "Av. das Américas, 3900 — Barra da Tijuca",
    phone: "+55 21 3252-2900",
    hours: "Seg a sáb, 10h–22h · Dom, 15h–21h",
    image: "editorial-sapatos",
  },
  {
    slug: "curitiba-batel",
    name: "JU RUDOLPH Batel",
    city: "Curitiba",
    state: "PR",
    address: "Alameda Dr. Carlos de Carvalho, 800 — Batel",
    phone: "+55 41 3010-7700",
    hours: "Seg a sáb, 10h–20h",
    image: "editorial-acessorios",
  },
];

export function getStore(slug: string): Store | undefined {
  return stores.find((s) => s.slug === slug);
}
