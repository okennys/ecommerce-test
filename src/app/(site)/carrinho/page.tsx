import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Sacola" };

export default function CarrinhoPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-gutter">
      <CartView />
    </div>
  );
}
