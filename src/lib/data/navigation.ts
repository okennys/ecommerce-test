import { CATEGORY_NAMES } from "./products";
import { giftLabel, type Catalog } from "./catalog";

/**
 * Navigation model — drives BOTH the desktop mega-menu and the mobile nav.
 * Structure mirrors the reference (ysl.com/pt-br): a few primary entries, each
 * opening a full-width panel of purely typographic columns.
 *
 * `buildNavigation()` is pure and takes the catalogue Medusa returned, so the
 * menu can never offer a category the backend no longer carries. The server
 * layout resolves it once and hands the result to the header and footer, which
 * are client components.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavColumn {
  title: string;
  href: string;
  links: NavLink[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  /** presence of `columns` means this entry opens a mega-menu */
  columns?: NavColumn[];
}

export interface Navigation {
  primary: NavItem[];
  utility: NavLink[];
  footer: NavColumn[];
  social: NavLink[];
}

const UPPER = ["vestidos", "blusas", "conjuntos", "macacoes", "casacos"];
const LOWER = ["calcas", "saias", "denim"];

const linkFor = (handle: string): NavLink => ({
  label: CATEGORY_NAMES[handle] ?? handle,
  href: `/mulher/${handle}`,
});

export const utilityNav: NavLink[] = [
  { label: "A Marca", href: "/a-marca" },
  { label: "Lojas", href: "/lojas" },
  { label: "Serviços", href: "/servicos" },
];

export const footerNav: NavColumn[] = [
  {
    title: "Ajuda",
    href: "/ajuda",
    links: [
      { label: "Atendimento ao cliente", href: "/ajuda/atendimento" },
      { label: "Envio e prazos", href: "/ajuda/envio" },
      { label: "Trocas e devoluções", href: "/ajuda/trocas" },
      { label: "Guia de tamanhos", href: "/ajuda/tamanhos" },
      { label: "Rastrear pedido", href: "/ajuda/pedido" },
    ],
  },
  {
    title: "A Marca",
    href: "/a-marca",
    links: [
      { label: "Nossa história", href: "/a-marca/historia" },
      { label: "Sustentabilidade", href: "/a-marca/sustentabilidade" },
      { label: "Lojas", href: "/lojas" },
      { label: "Trabalhe conosco", href: "/a-marca/carreiras" },
      { label: "Imprensa", href: "/a-marca/imprensa" },
    ],
  },
  {
    title: "Serviços",
    href: "/servicos",
    links: [
      { label: "Agendar atendimento", href: "/servicos/agendar" },
      { label: "Reserva na loja", href: "/servicos/reserva" },
      { label: "Cuidados com a peça", href: "/servicos/cuidados" },
      { label: "Embalagem para presente", href: "/servicos/presente" },
    ],
  },
  {
    title: "Legal",
    href: "/legal",
    links: [
      { label: "Termos de uso", href: "/legal/termos" },
      { label: "Política de privacidade", href: "/legal/privacidade" },
      { label: "Política de cookies", href: "/legal/cookies" },
      { label: "Acessibilidade", href: "/legal/acessibilidade" },
    ],
  },
];

export const socialLinks: NavLink[] = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export function buildNavigation(catalog: Catalog): Navigation {
  const { stockedCategories, giftCeiling } = catalog;

  const categoryColumn = (title: string, handles: string[]): NavColumn[] => {
    const links = handles.filter((h) => stockedCategories.includes(h)).map(linkFor);
    return links.length ? [{ title, href: "/mulher", links }] : [];
  };

  const gift = { label: `Até ${giftLabel(giftCeiling)}`, href: `/presentes/ate-${giftCeiling}` };

  const womenColumns: NavColumn[] = [
    {
      title: "Novidades",
      href: "/mulher/novidades",
      links: [
        { label: "Selecionados pela Ju", href: "/highlights/selecao" },
        { label: "Ícones", href: "/highlights/icones" },
        { label: "Sale", href: "/sale" },
        { label: "Ver tudo", href: "/mulher" },
      ],
    },
    ...categoryColumn("Roupas", UPPER),
    ...categoryColumn("Calças e saias", LOWER),
    {
      title: "Presentes",
      href: "/presentes",
      links: [
        ...(stockedCategories.includes("joias") ? [linkFor("joias")] : []),
        { label: "Novidades para presentear", href: "/presentes/novidades" },
        gift,
        { label: "Cartão-presente", href: "/presentes/cartao" },
      ],
    },
  ];

  const highlightsColumns: NavColumn[] = [
    {
      title: "Destaques",
      href: "/highlights",
      links: [
        { label: "Selecionados pela Ju", href: "/highlights/selecao" },
        { label: "Ícones", href: "/highlights/icones" },
        { label: "Novidades", href: "/mulher/novidades" },
      ],
    },
    {
      title: "Sale",
      href: "/sale",
      links: [{ label: "Tudo em promoção", href: "/sale" }, gift],
    },
    {
      title: "Presentes",
      href: "/presentes",
      links: [
        { label: "Novidades para presentear", href: "/presentes/novidades" },
        gift,
        { label: "Cartão-presente", href: "/presentes/cartao" },
      ],
    },
  ];

  return {
    primary: [
      { id: "highlights", label: "Highlights", href: "/highlights", columns: highlightsColumns },
      { id: "mulher", label: "Mulher", href: "/mulher", columns: womenColumns },
      { id: "sale", label: "Sale", href: "/sale" },
    ],
    utility: utilityNav,
    footer: footerNav,
    social: socialLinks,
  };
}
