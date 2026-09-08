import type { Metadata } from "next";
import Image from "next/image";
import { stores } from "@/lib/data/stores";
import { ph } from "@/lib/data/media";
import { ContentHero } from "@/components/content/ContentHero";
import { PinIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Lojas",
  description: "As boutiques JU RUDOLPH em São Paulo, Rio de Janeiro e Curitiba.",
};

export default function LojasPage() {
  return (
    <div>
      <ContentHero
        kicker="JU RUDOLPH"
        title="Nossas lojas"
        image="editorial-atelier"
        crumbs={[
          { label: "Início", href: "/" },
          { label: "Lojas", href: "/lojas" },
        ]}
      />

      <div className="mx-auto max-w-5xl px-5 py-14 lg:px-gutter">
        <p className="max-w-xl text-ink-muted">
          Atendimento com hora marcada, ajustes de alfaiataria e o serviço de cuidado com o couro em
          todas as unidades.
        </p>

        <div className="mt-10 aspect-[16/7] w-full bg-paper-raised">
          <div className="flex h-full items-center justify-center text-ink-muted">
            <PinIcon size={20} />
            <span className="label ml-2">Mapa das lojas</span>
          </div>
        </div>

        <ul className="mt-12 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {stores.map((store) => (
            <li key={store.slug}>
              <div className="relative aspect-[4/3] w-full bg-paper-raised">
                <Image
                  src={ph(store.image)}
                  alt={store.name}
                  fill
                  sizes="(min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <h2 className="label-lg mt-4">
                {store.name}
                {store.flagship && <span className="ml-2 text-ink-muted">· Flagship</span>}
              </h2>
              <p className="mt-2 text-ink-muted">
                {store.address}
                <br />
                {store.city}/{store.state}
              </p>
              <p className="label mt-2 text-ink-muted">{store.hours}</p>
              <p className="label mt-1 text-ink-muted">{store.phone}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
