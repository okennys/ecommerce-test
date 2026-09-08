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
      { label: "Tudo que chegou", href: "/mulher/novidades" },
      { label: "Outono Inverno 26", href: "/mulher/outono-inverno-26" },
      { label: "Pré-coleção", href: "/mulher/pre-colecao" },
      { label: "De volta ao estoque", href: "/mulher/de-volta" },
    ],
  },
  {
    title: "Roupas",
    href: "/mulher/roupas",
    links: [
      { label: "Vestidos", href: "/mulher/roupas/vestidos" },
      { label: "Alfaiataria", href: "/mulher/roupas/alfaiataria" },
      { label: "Camisas e blusas", href: "/mulher/roupas/camisas" },
      { label: "Tricô", href: "/mulher/roupas/trico" },
      { label: "Jaquetas e casacos", href: "/mulher/roupas/jaquetas" },
      { label: "Calças", href: "/mulher/roupas/calcas" },
      { label: "Saias", href: "/mulher/roupas/saias" },
    ],
  },
  {
    title: "Bolsas",
    href: "/mulher/bolsas",
    links: [
      { label: "Rudolph", href: "/mulher/bolsas/rudolph" },
      { label: "Jabuti", href: "/mulher/bolsas/jabuti" },
      { label: "Vera", href: "/mulher/bolsas/vera" },
      { label: "Ombro", href: "/mulher/bolsas/ombro" },
      { label: "Tote", href: "/mulher/bolsas/tote" },
      { label: "Mini", href: "/mulher/bolsas/mini" },
      { label: "Ver todas as bolsas", href: "/mulher/bolsas" },
    ],
  },
  {
    title: "Sapatos",
    href: "/mulher/sapatos",
    links: [
      { label: "Saltos", href: "/mulher/sapatos/saltos" },
      { label: "Rasteiras", href: "/mulher/sapatos/rasteiras" },
      { label: "Botas", href: "/mulher/sapatos/botas" },
      { label: "Tênis", href: "/mulher/sapatos/tenis" },
    ],
  },
  {
    title: "Acessórios",
    href: "/mulher/acessorios",
    links: [
      { label: "Joias", href: "/mulher/acessorios/joias" },
      { label: "Cintos", href: "/mulher/acessorios/cintos" },
      { label: "Óculos", href: "/mulher/acessorios/oculos" },
      { label: "Lenços", href: "/mulher/acessorios/lencos" },
    ],
  },
];

const highlightsColumns: NavColumn[] = [
  {
    title: "Destaques",
    href: "/highlights",
    links: [
      { label: "A coleção Outono Inverno 26", href: "/mulher/outono-inverno-26" },
      { label: "O editorial da estação", href: "/editorial" },
      { label: "Selecionados pela Ju", href: "/highlights/selecao" },
    ],
  },
  {
    title: "Ícones",
    href: "/highlights/icones",
    links: [
      { label: "Bolsa Rudolph", href: "/mulher/bolsas/rudolph" },
      { label: "Bolsa Jabuti", href: "/mulher/bolsas/jabuti" },
      { label: "Trench de alfaiataria", href: "/mulher/roupas/alfaiataria" },
      { label: "Salto Vera", href: "/mulher/sapatos/saltos" },
    ],
  },
  {
    title: "Presentes",
    href: "/presentes",
    links: [
      { label: "Novidades para presentear", href: "/presentes/novidades" },
      { label: "Bolsas-ícone", href: "/presentes/bolsas" },
      { label: "Até R$ 1.500", href: "/presentes/ate-1500" },
      { label: "Cartão-presente", href: "/presentes/cartao" },
    ],
  },
];

export const primaryNav: NavItem[] = [
  { id: "highlights", label: "Highlights", href: "/highlights", columns: highlightsColumns },
  { id: "mulher", label: "Mulher", href: "/mulher", columns: womenColumns },
  { id: "editorial", label: "Editorial", href: "/editorial" },
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
