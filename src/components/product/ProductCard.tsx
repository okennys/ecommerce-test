import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/types/medusa";
import { t } from "@/lib/dictionary";
import { formatPrice } from "@/lib/format";
import {
  productFromPrice,
  namedColours,
  isInStock,
  productCompareAt,
  discountPercent,
} from "@/lib/data/products";

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
  const compareAt = productCompareAt(product);
  const [front, back] = product.images;

  // The grid stays a tidy 4:5, but model frames (2:3) and video grabs (9:16)
  // are taller than that — anchor them to the top so the crop takes the hem,
  // never the face.
  const anchor = (img?: { width?: number; height?: number }) =>
    img?.width && img?.height && img.height / img.width > 1.26 ? "object-top" : "object-center";
  const colours = namedColours(product);
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
          className={`object-cover ${anchor(front)} transition-opacity duration-500 group-hover:opacity-0`}
        />
        {back && (
          <Image
            src={back.url}
            alt=""
            fill
            sizes={sizes}
            className={`object-cover ${anchor(back)} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          />
        )}
        {soldOut && (
          <span className="label absolute left-3 top-3 bg-paper/90 px-2 py-1 text-ink-muted">
            Esgotado
          </span>
        )}
        {compareAt && (
          <span className="label absolute left-3 top-3 bg-ink px-2 py-1 text-on-dark">
            −{discountPercent(product)}%
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1 text-center">
        <p className="label">{product.title}</p>
        <p className="label text-ink-muted">
          {compareAt && (
            <span className="mr-2 text-ink-muted/70 line-through">
              {formatPrice(compareAt, price.currency)}
            </span>
          )}
          <span className={compareAt ? "text-ink" : undefined}>
            {formatPrice(price.amount, price.currency)}
          </span>
        </p>
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
