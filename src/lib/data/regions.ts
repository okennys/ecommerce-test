/**
 * Shipping regions for the country/language modal.
 *
 * SWAP POINT: replace with `store.region.list()` from Medusa. `regionGroups`
 * is just a presentation grouping of the same countries by continent.
 */
import type { StoreRegion } from "@/types/medusa";

export interface RegionCountry {
  name: string;
  iso2: string;
  currencyCode: string;
  /** locale path this country resolves to */
  href: string;
}

export interface RegionGroup {
  continent: string;
  countries: RegionCountry[];
}

export const regionGroups: RegionGroup[] = [
  {
    continent: "América do Sul",
    countries: [
      { name: "Brasil", iso2: "br", currencyCode: "BRL", href: "/" },
      { name: "Argentina", iso2: "ar", currencyCode: "USD", href: "/ar" },
      { name: "Chile", iso2: "cl", currencyCode: "USD", href: "/cl" },
      { name: "Uruguai", iso2: "uy", currencyCode: "USD", href: "/uy" },
    ],
  },
  {
    continent: "América do Norte",
    countries: [
      { name: "Estados Unidos", iso2: "us", currencyCode: "USD", href: "/us" },
      { name: "Canadá", iso2: "ca", currencyCode: "CAD", href: "/ca" },
      { name: "México", iso2: "mx", currencyCode: "USD", href: "/mx" },
    ],
  },
  {
    continent: "Europa",
    countries: [
      { name: "Portugal", iso2: "pt", currencyCode: "EUR", href: "/pt" },
      { name: "França", iso2: "fr", currencyCode: "EUR", href: "/fr" },
      { name: "Itália", iso2: "it", currencyCode: "EUR", href: "/it" },
      { name: "Reino Unido", iso2: "gb", currencyCode: "GBP", href: "/gb" },
    ],
  },
  {
    continent: "Ásia-Pacífico",
    countries: [
      { name: "Japão", iso2: "jp", currencyCode: "JPY", href: "/jp" },
      { name: "Austrália", iso2: "au", currencyCode: "AUD", href: "/au" },
      { name: "Emirados Árabes", iso2: "ae", currencyCode: "USD", href: "/ae" },
    ],
  },
];

export const defaultRegion: StoreRegion = {
  id: "reg_br",
  name: "Brasil",
  currency_code: "BRL",
  countries: [{ iso_2: "br", display_name: "Brasil" }],
};

export const defaultCountry: RegionCountry = regionGroups[0].countries[0];
