import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ph } from "@/lib/data/media";
import { formatPrice } from "@/lib/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Cartão-presente",
  description: "O cartão-presente digital JU RUDOLPH, de R$ 250 a R$ 5.000.",
};

const VALUES = [25000, 50000, 100000, 250000, 500000];

export default function CartaoPresentePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-gutter">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Presentes", href: "/presentes" },
          { label: "Cartão-presente", href: "/presentes/cartao" },
        ]}
        className="mb-8"
      />

      <div className="lg:grid lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] w-full bg-paper-raised">
          <Image src={ph("editorial-acessorios")} alt="Cartão-presente JU RUDOLPH" fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
        </div>

        <div className="mt-10 lg:mt-0">
          <h1 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium">Cartão-presente digital</h1>
          <p className="mt-4 max-w-md text-ink-muted">
            Enviado por e-mail na data que você escolher, com uma mensagem personalizada. Válido por
            24 meses, on-line e em todas as lojas.
          </p>

          <p className="label mt-8">Valor</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <span key={v} className="label border border-line-strong px-4 py-2.5">
                {formatPrice(v / 100)}
              </span>
            ))}
          </div>

          <button
            type="button"
            disabled
            className="label mt-8 h-[52px] w-full bg-black px-8 text-on-dark opacity-40 sm:w-auto sm:min-w-[280px]"
          >
            Comprar cartão-presente
          </button>
          <p className="label mt-3 text-ink-muted">
            Compra do cartão-presente disponível na etapa 2.{" "}
            <Link href="/presentes" className="link-quiet underline">
              Ver outras ideias de presente
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
