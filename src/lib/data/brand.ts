/**
 * The brand's real contact details, as published on jurudolphbrand.com.br.
 *
 * One place for them so the footer, the content pages and the store page can't
 * drift apart — and so there is a single file to edit when something changes.
 */

export const brand = {
  legalName: "Ju Rudolph Brand",
  cnpj: "42.360.946/0001-09",

  email: "contato@jurudolphbrand.com.br",
  /** digits only, for tel: and wa.me links */
  phoneDigits: "5511971500094",
  phoneDisplay: "+55 11 97150-0094",

  address: {
    street: "Avenida Brigadeiro Faria Lima, 2639 — conj. 53",
    district: "Jardim Paulistano",
    city: "São Paulo",
    state: "SP",
    cep: "01452-000",
  },

  hours: "Segunda a sexta, 9h às 18h",

  social: {
    instagram: "https://instagram.com/jurudolphbrand",
    tiktok: "https://tiktok.com/@jurudolphbrand",
    pinterest: "https://pinterest.com/jurudolphbrand",
    youtube: "https://youtube.com/@JuRudolphBrand",
    facebook: "https://facebook.com/jurudolphbrand",
  },
} as const;

export const whatsappUrl = `https://wa.me/${brand.phoneDigits}`;
export const mailtoUrl = `mailto:${brand.email}`;

/** "Avenida …, 2639 — conj. 53 · Jardim Paulistano · São Paulo/SP · 01452-000" */
export const fullAddress = [
  brand.address.street,
  brand.address.district,
  `${brand.address.city}/${brand.address.state}`,
  `CEP ${brand.address.cep}`,
].join(" · ");
