/**
 * Navigation model — drives BOTH the desktop mega-menu and the mobile nav.
 * Structure mirrors the reference (ysl.com/pt-br): a few primary entries, each
 * opening a full-width panel of purely typographic columns.
 *
 * SWAP POINT: once categories/collections come from Medusa, generate this tree
 * from `store.category.list()` + `store.collection.list()` instead of hardcoding.
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
  {
    title: "Roupas",
    href: "/mulher",
    links: [
      { label: "Vestidos", href: "/mulher/vestidos" },
      { label: "Blusas e camisas", href: "/mulher/blusas" },
      { label: "Conjuntos", href: "/mulher/conjuntos" },
      { label: "Macacões", href: "/mulher/macacoes" },
      { label: "Casacos e jaquetas", href: "/mulher/casacos" },
    ],
  },
  {
    title: "Calças e saias",
    href: "/mulher",
    links: [
      { label: "Calças", href: "/mulher/calcas" },
      { label: "Saias", href: "/mulher/saias" },
      { label: "Denim", href: "/mulher/denim" },
    ],
  },
  {
    title: "Joias",
    href: "/mulher/joias",
    links: [
      { label: "Presentes", href: "/presentes" },
      { label: "Até R$ 500", href: "/presentes/ate-500" },
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
    links: [
      { label: "Vestidos", href: "/mulher/vestidos" },
      { label: "Conjuntos", href: "/mulher/conjuntos" },
      { label: "Até R$ 500", href: "/presentes/ate-500" },
    ],
  },
  {
    title: "Presentes",
    href: "/presentes",
    links: [
      { label: "Novidades para presentear", href: "/presentes/novidades" },
      { label: "Joias", href: "/presentes/joias" },
      { label: "Até R$ 500", href: "/presentes/ate-500" },
      { label: "Cartão-presente", href: "/presentes/cartao" },
    ],
  },
];

export const primaryNav: NavItem[] = [
  { id: "highlights", label: "Highlights", href: "/highlights", columns: highlightsColumns },
  { id: "mulher", label: "Mulher", href: "/mulher", columns: womenColumns },
  { id: "sale", label: "Sale", href: "/sale" },
];

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
