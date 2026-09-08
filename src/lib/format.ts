/** Money formatting. Reference shows "R$ 8 900" — grouped, no decimals for BRL. */
export function formatPrice(amount: number, currency = "BRL"): string {
  const fractionDigits = currency === "BRL" ? 0 : 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
