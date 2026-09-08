import type { Metadata } from "next";
import { CheckoutChrome } from "@/components/checkout/CheckoutChrome";

export const metadata: Metadata = {
  title: "Finalização da compra",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <CheckoutChrome />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
    </div>
  );
}
