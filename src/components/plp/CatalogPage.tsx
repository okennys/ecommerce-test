import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { StoreProduct } from "@/types/medusa";
import type { Catalog, CatalogNode } from "@/lib/data/catalog";
import { getProductsForNode, childNodes } from "@/lib/data/catalog";
import {
  filterProducts,
  sortProducts,
  getFacets,
} from "@/lib/data/products";
import { ph } from "@/lib/data/media";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { PlpToolbar } from "./PlpToolbar";
import { ProductGrid } from "./ProductGrid";
import { LoadMore } from "./LoadMore";
import { plpParamsFromRecord } from "./plp-parse";

const PAGE_SIZE = 12;

type SP = Record<string, string | string[] | undefined>;

export function CatalogPage({
  node,
  catalog,
  products,
  searchParams,
}: {
  node: CatalogNode;
  catalog: Catalog;
  products: StoreProduct[];
  searchParams: SP;
}) {
  const base = getProductsForNode(products, node);
  const facets = getFacets(base);
  const p = plpParamsFromRecord(searchParams);

  const filtered = filterProducts(base, {
    sizes: p.sizes,
    colours: p.colours,
    maxPrice: p.maxPrice ?? undefined,
  });
  const sorted = sortProducts(filtered, p.sort);

  const shown = Math.min(sorted.length, p.view * PAGE_SIZE);
  const visible = sorted.slice(0, shown);

  const children = childNodes(catalog, node);

  return (
    <div>
      {node.editorialImage && (
        <section className="relative flex h-[42vh] min-h-[280px] w-full items-end overflow-hidden bg-surface-dark">
          <Image
            src={ph(node.editorialImage)}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
          <div className="relative w-full px-5 pb-10 text-center text-on-dark lg:px-gutter">
            <p className="label opacity-90">{node.crumbs[node.crumbs.length - 2]?.label ?? "JU RUDOLPH"}</p>
            <h1 className="font-display mt-2 text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
              {node.title}
            </h1>
          </div>
        </section>
      )}

      <div className="px-5 py-10 lg:px-gutter">
        <Breadcrumb items={node.crumbs} className="mb-6" />

        {!node.editorialImage && (
          <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium">{node.title}</h1>
        )}
        {node.intro && <p className="mt-3 max-w-xl text-ink-muted">{node.intro}</p>}

        {children.length > 0 && (
          <nav aria-label="Subcategorias" className="mt-6">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {children.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="label link-quiet">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-8">
          <Suspense fallback={<div className="h-14 border-y border-line" />}>
            <PlpToolbar total={sorted.length} facets={facets} />
          </Suspense>
        </div>

        <div className="mt-10">
          <ProductGrid products={visible} density={p.density} />
        </div>

        {sorted.length > 0 && (
          <Suspense fallback={null}>
            <LoadMore shown={shown} total={sorted.length} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
