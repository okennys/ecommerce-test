/**
 * Money formatting. The reference shows round prices without decimals
 * ("R$ 8.900"), but the real catalogue is full of R$ 299,90 tags — so cents are
 * shown only when the amount actually has them.
 */
export function formatPrice(amount: number, currency = "BRL"): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  const fractionDigits = currency === "BRL" && !hasCents ? 0 : 2;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}
