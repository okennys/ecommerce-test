import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sua conta",
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <p className="label text-ink-muted">Conecte-se</p>
      <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-medium">
        Sua conta chega na etapa 2
      </h1>
      <p className="mt-4 text-ink-muted">
        Login, pedidos, endereços e lista de desejos entram junto com a integração do backend. Por
        enquanto, a compra pode ser feita como convidado.
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/mulher"
          className="label flex h-[52px] items-center justify-center bg-black px-10 text-on-dark hover:bg-ink"
        >
          Explorar a coleção
        </Link>
        <Link
          href="/ajuda/pedido"
          className="label flex h-[52px] items-center justify-center border border-ink px-10 hover:bg-ink hover:text-paper"
        >
          Rastrear um pedido
        </Link>
      </div>
    </div>
  );
}
