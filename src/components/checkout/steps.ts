export const CHECKOUT_STEPS = [
  { n: 1, label: "Identificação", href: "/checkout" },
  { n: 2, label: "Entrega", href: "/checkout/entrega" },
  { n: 3, label: "Pagamento", href: "/checkout/pagamento" },
  { n: 4, label: "Revisão", href: "/checkout/revisao" },
] as const;

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]["n"];
