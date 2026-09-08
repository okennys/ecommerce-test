/**
 * pt-BR UI copy. Single source for every user-facing string that isn't
 * catalogue data, so tone stays consistent and translation stays possible.
 */
export const t = {
  brand: {
    name: "JU RUDOLPH",
    // Shown by screen readers / as the <title> suffix.
    tagline: "Moda autoral brasileira",
  },

  common: {
    discover: "Descobrir",
    see: "Ver",
    seeAll: "Ver tudo",
    shop: "Shop",
    close: "Fechar",
    back: "Voltar",
    taxIncluded: "Imposto incluído",
    menu: "Menu",
  },

  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    openSearch: "Abrir busca",
    openBag: "Abrir sacola",
    openRegion: "Escolher país e idioma",
    primaryNav: "Navegação principal",
    utilityNav: "Serviços e conta",
    footerNav: "Rodapé",
  },

  header: {
    search: "Buscar",
    account: "Conecte-se",
    bag: "Sacola",
  },

  megaMenu: {
    // closer link at the bottom of a column, %s replaced with the column title
    seeEverythingIn: (label: string) => `Ver tudo em ${label}`,
  },

  home: {
    heroKicker: "Outono Inverno 26",
    heroTitle: "JU RUDOLPH",
    heroCaption: "A nova coleção",
    heroCta: "Descobrir",
    scrollHint: "Rolar",
  },

  cart: {
    title: "Sacola",
    empty: "Sua sacola está vazia.",
    emptyHint: "As peças que você adicionar aparecem aqui.",
    subtotal: "Subtotal",
    shippingNote: "Frete e impostos calculados no checkout.",
    checkout: "Finalização da compra",
    checkoutSoon: "Checkout disponível em breve.",
    remove: "Remover",
    quantity: "Quantidade",
  },

  region: {
    title: "País e idioma",
    intro: "Escolha onde você quer receber suas compras.",
    current: "Seleção atual",
    confirm: "Confirmar",
  },

  newsletter: {
    title: "Newsletter",
    prompt: "Receba lançamentos, editoriais e acesso antecipado.",
    placeholder: "Seu e-mail",
    submit: "Inscrever",
    consent:
      "Ao se inscrever, você concorda em receber e-mails da JU RUDOLPH e com a nossa Política de Privacidade.",
    success: "Pronto — você está na lista.",
    errorEmpty: "Informe um e-mail para continuar.",
    errorInvalid: "Esse e-mail não parece completo. Confira e tente de novo.",
  },

  footer: {
    rights: (year: number) => `© ${year} JU RUDOLPH. Todos os direitos reservados.`,
  },
} as const;

export type Dictionary = typeof t;
