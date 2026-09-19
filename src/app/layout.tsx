import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { t } from "@/lib/dictionary";
import { CartProvider } from "@/context/CartProvider";
import { CheckoutProvider } from "@/context/CheckoutProvider";

// Display serif — SWAP POINT: replace with the JU RUDOLPH brand face.
const displaySerif = Bodoni_Moda({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jurudolph.com.br"),
  title: {
    default: `${t.brand.name} — ${t.brand.tagline}`,
    template: `%s — ${t.brand.name}`,
  },
  description:
    "JU RUDOLPH — moda autoral brasileira. Vestidos, alfaiataria, conjuntos, denim e joias.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: t.brand.name,
    title: `${t.brand.name} — ${t.brand.tagline}`,
    description: "Moda autoral brasileira, feita no ateliê em São Paulo.",
  },
  robots: { index: false, follow: false }, // pre-launch
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${displaySerif.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#conteudo"
          className="label sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[120] focus:bg-paper focus:px-4 focus:py-3"
        >
          {t.a11y.skipToContent}
        </a>

        <CartProvider>
          <CheckoutProvider>{children}</CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  );
}
