import type { StoreProduct } from "@/types/medusa";
import { cn } from "@/lib/cn";
import { ProductCard } from "@/components/product/ProductCard";

export function ProductGrid({
  products,
  density = 3,
  className,
}: {
  products: StoreProduct[];
  density?: 2 | 3;
  className?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="label">Nenhuma peça encontrada com esses filtros.</p>
      </div>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-16",
        density === 2 ? "lg:grid-cols-2" : "lg:grid-cols-3",
        className,
      )}
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={i < 4}
            sizes={
              density === 2
                ? "(min-width: 1024px) 46vw, 50vw"
                : "(min-width: 1024px) 30vw, 50vw"
            }
          />
        </li>
      ))}
    </ul>
  );
}
