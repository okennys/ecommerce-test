import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/types/medusa";
import { t } from "@/lib/dictionary";
import { formatPrice } from "@/lib/format";
import { productFromPrice, productColours, isInStock } from "@/lib/data/products";

/**
 * Catalogue tile — shared by the homepage rails and the PLP grid.
 * Front image swaps to the second shot on hover (no zoom), per the reference.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 24vw, 50vw",
  priority = false,
}: {
  product: StoreProduct;
  sizes?: string;
  priority?: boolean;
}) {
  const price = productFromPrice(product);
  const [front, back] = product.images;
  const colours = productColours(product);
  const soldOut = !isInStock(product);

  return (
    <Link href={`/produtos/${product.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-raised">
        <Image
          src={front.url}
          alt={product.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {back && (
          <Image
            src={back.url}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        {soldOut && (
          <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-ink-muted">
            Esgotado
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1 text-center">
        <p className="label">{product.title}</p>
        <p className="label text-ink-muted">{formatPrice(price.amount, price.currency)}</p>
        <p className="label text-[10px] text-ink-muted">{t.common.taxIncluded}</p>
        {colours.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-1.5">
            {colours.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2.5 w-2.5 border border-line-strong"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
