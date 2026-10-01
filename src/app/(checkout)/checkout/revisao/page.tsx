import { redirect } from "next/navigation";

// Review now lives on the payment step (Stripe confirms beside the summary).
export default function RevisaoPage() {
  redirect("/checkout/pagamento");
}
