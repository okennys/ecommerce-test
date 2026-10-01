// Review and payment share the last step: Stripe confirms with the Payment
// Element mounted, so the "place order" button has to sit beside it.
export const CHECKOUT_STEPS = [
  { n: 1, label: "Identificação", href: "/checkout" },
  { n: 2, label: "Entrega", href: "/checkout/entrega" },
  { n: 3, label: "Pagamento", href: "/checkout/pagamento" },
] as const;

export type CheckoutStep = (typeof CHECKOUT_STEPS)[number]["n"];
