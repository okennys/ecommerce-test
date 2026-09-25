"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { StoreProduct } from "@/types/medusa";
import { cn } from "@/lib/cn";
import { t } from "@/lib/dictionary";
import { formatPrice } from "@/lib/format";
import {
  productColours,
  namedColours,
  productFromPrice,
  productCompareAt,
  productDetails,
  discountPercent,
} from "@/lib/data/products";
import { useCart } from "@/context/CartProvider";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { PlusIcon } from "@/components/ui/icons";
import { Gallery } from "./Gallery";

export function ProductDetail({
  product,
  crumbs,
}: {
  product: StoreProduct;
  crumbs: Crumb[];
}) {
  const colours = productColours(product);
  const swatches = namedColours(product);
  const { addItem, openCart } = useCart();

  const [colourName, setColourName] = useState(colours[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [galleryStart, setGalleryStart] = useState<number | null>(null);

  const activeColour = colours.find((c) => c.name === colourName) ?? colours[0];
  const images = activeColour?.images?.length
    ? activeColour.images
    : product.images.map((i) => ({ url: i.url, w: i.width ?? 4, h: i.height ?? 5 }));

  const sizeValues = product.options.find((o) => o.title === "Tamanho")?.values.map((v) => v.value) ?? [];
  const isOneSize = sizeValues.length === 1 && sizeValues[0] === "Único";

  const stockBySize = useMemo(() => {
    const map = new Map<string, number>();
    for (const v of product.variants) {
      if (v.options.Cor === colourName) map.set(v.options.Tamanho, v.inventory_quantity ?? 0);
    }
    return map;
  }, [product.variants, colourName]);

  const price = productFromPrice(product);
  const compareAt = productCompareAt(product);
  const details = productDetails(product);
  const sku = (product.metadata?.sku as string) ?? "";

  function handleAdd() {
    const chosenSize = isOneSize ? "Único" : size;
    if (!chosenSize) {
      setError("Selecione um tamanho.");
      return;
    }
    const variant = product.variants.find(
      (v) => v.options.Cor === colourName && v.options.Tamanho === chosenSize,
    );
    if (!variant || (variant.inventory_quantity ?? 0) <= 0) {
      setError("Tamanho indisponível nesta cor.");
      return;
    }
    setError(null);
    addItem({
      product_id: product.id,
      product_handle: product.handle,
      variant_id: variant.id,
      title: product.title,
      variant_title: `${colourName}${isOneSize ? "" : ` · ${chosenSize}`}`,
      thumbnail: images[0].url,
      unit_price: variant.calculated_price?.calculated_amount ?? price.amount,
      currency_code: variant.calculated_price?.currency_code ?? price.currency,
    });
    openCart();
  }

  return (
    <div className="lg:grid lg:grid-cols-2">
      {/* image column */}
      <div className="flex flex-col gap-1 bg-paper-raised">
        {/* the shoot mixes 4:5 stills, 2:3 model frames and 9:16 video grabs —
            each photo keeps its own ratio so nobody gets cropped at the neck */}
        {images.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setGalleryStart(i)}
            aria-label={`Ampliar imagem ${i + 1}`}
            style={{ aspectRatio: `${img.w} / ${img.h}` }}
            className="group relative w-full cursor-[zoom-in] overflow-hidden"
          >
            <Image
              src={img.url}
              alt={i === 0 ? product.title : ""}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <span className="label absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center bg-paper/90 opacity-0 transition-opacity group-hover:opacity-100">
              <PlusIcon size={16} />
            </span>
          </button>
        ))}
      </div>

      {/* sticky rail */}
      <div className="lg:h-full">
        <div className="lg:sticky lg:top-header">
          <div className="mx-auto max-w-md px-5 py-10 lg:px-14 lg:py-16">
            <Breadcrumb items={crumbs} className="mb-8" />

            <h1 className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium leading-snug">
              {product.title}
            </h1>
            {product.subtitle && (
              <p className="mt-2 text-ink-muted">{product.subtitle}</p>
            )}

            <p className="mt-3 flex flex-wrap items-baseline gap-x-3 text-ink">
              {compareAt && (
                <span className="text-ink-muted line-through">
                  {formatPrice(compareAt, price.currency)}
                </span>
              )}
              <span>{formatPrice(price.amount, price.currency)}</span>
              {compareAt && (
                <span className="label bg-ink px-2 py-1 text-on-dark">
                  −{discountPercent(product)}%
                </span>
              )}
            </p>
            <p className="label mt-1 text-ink-muted">{t.common.taxIncluded}</p>

            {/* colour */}
            {swatches.length > 1 && (
              <div className="mt-8">
                <p className="label">
                  Cor: <span className="text-ink-muted">{colourName}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {swatches.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={c.name === colourName}
                      aria-label={c.name}
                      onClick={() => {
                        setColourName(c.name);
                        setSize(null);
                        setError(null);
                      }}
                      className={cn(
                        "h-8 w-8 border transition-shadow",
                        c.name === colourName
                          ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper"
                          : "border-line-strong hover:border-ink",
                      )}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* size */}
            {!isOneSize && (
              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <p className="label">Tamanho</p>
                  <Link href="/ajuda/tamanhos" className="label link-quiet">
                    Guia de tamanhos
                  </Link>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {sizeValues.map((s) => {
                    const stock = stockBySize.get(s) ?? 0;
                    const disabled = stock <= 0;
                    const selected = size === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={disabled}
                        aria-pressed={selected}
                        onClick={() => {
                          setSize(s);
                          setError(null);
                        }}
                        className={cn(
                          "label border py-3 transition-colors",
                          selected
                            ? "border-ink bg-ink text-on-dark"
                            : "border-line-strong hover:border-ink",
                          disabled && "cursor-not-allowed text-ink-muted line-through hover:border-line-strong",
                        )}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {error && <p className="label mt-4 text-[#8a2b2b]">{error}</p>}

            <button
              type="button"
              onClick={handleAdd}
              className="label mt-6 h-[52px] w-full bg-black px-8 text-on-dark transition-colors hover:bg-ink"
            >
              Adicionar à sacola
            </button>

            <div className="mt-4 flex items-center justify-center">
              <Link href="/lojas" className="label link-quiet">
                Encontrar na loja
              </Link>
            </div>

            {/* accordions */}
            <div className="mt-10 divide-y divide-line border-y border-line">
              <Accordion title="Descrição" defaultOpen>
                <p>{product.description}</p>
                {details.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 marker:text-ink-muted">
                    {details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                )}
              </Accordion>
              <Accordion title="Composição e cuidados">
                <p>
                  Siga sempre a etiqueta interna da peça. Na dúvida, opte por limpeza profissional
                  a seco e guarde em local seco, ao abrigo da luz direta.
                </p>
                {sku && <p className="label mt-3 text-ink-muted">Referência {sku}</p>}
              </Accordion>
              <Accordion title="Entrega e devoluções">
                <p>Entrega padrão em 3 a 7 dias úteis. Frete grátis acima de {formatPrice(500)}.</p>
                <p className="mt-2 text-ink-muted">
                  Primeira troca grátis, em até 30 dias. Ver{" "}
                  <Link href="/ajuda/trocas" className="underline">
                    trocas e devoluções
                  </Link>
                  .
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {galleryStart !== null && (
        <Gallery
          images={images.map((i) => i.url)}
          alt={product.title}
          startIndex={galleryStart}
          onClose={() => setGalleryStart(null)}
        />
      )}
    </div>
  );
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group py-4">
      <summary className="label flex cursor-pointer list-none items-center justify-between py-1">
        {title}
        <span aria-hidden className="text-ink-muted transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-3 pt-3 leading-relaxed">{children}</div>
    </details>
  );
}
