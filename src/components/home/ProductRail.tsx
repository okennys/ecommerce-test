import type { StoreProduct } from "@/types/medusa";
import { cn } from "@/lib/cn";
import { t } from "@/lib/dictionary";
import { Reveal } from "@/components/ui/Reveal";
import { TextCta } from "@/components/ui/TextCta";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductRailProps {
  title: string;
  products: StoreProduct[];
  viewAllHref?: string;
}

export function ProductRail({ title, products, viewAllHref }: ProductRailProps) {
  const items = products.slice(0, 8);
  // When the row can't fill four columns, centre it instead of leaving a gap.
  const underfilled = items.length < 4;

  return (
    <section className="px-5 py-20 lg:px-gutter">
      <div className="mb-10 flex items-baseline justify-between">
        <h2 className="label-lg">{title}</h2>
        {viewAllHref && <TextCta href={viewAllHref}>{t.common.seeAll}</TextCta>}
      </div>

      <ul
        className={cn(
          "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2",
          "lg:mx-0 lg:gap-6 lg:overflow-visible lg:px-0",
          underfilled
            ? "lg:flex-wrap lg:justify-center"
            : "lg:grid lg:grid-cols-4",
        )}
      >
        {items.map((product, i) => (
          <Reveal
            as="li"
            key={product.id}
            delayMs={i * 60}
            className={cn(
              "w-[72vw] shrink-0 snap-start sm:w-[46vw] md:w-[32vw]",
              underfilled ? "lg:w-[calc(25%-1.5rem)]" : "lg:w-auto",
            )}
          >
            <ProductCard product={product} sizes="(min-width: 1024px) 22vw, 72vw" />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
