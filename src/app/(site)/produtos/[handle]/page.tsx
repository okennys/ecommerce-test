import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProduct, getRelated, productFromPrice } from "@/lib/data/products";
import { getProducts } from "@/lib/data/catalogue";
import { formatPrice } from "@/lib/format";
import { ProductDetail } from "@/components/pdp/ProductDetail";
import { ProductRail } from "@/components/home/ProductRail";
import type { Crumb } from "@/components/ui/Breadcrumb";

// Next needs a literal here — keep in sync with CATALOGUE_REVALIDATE.
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = findProduct(await getProducts(), handle);
  if (!product) return {};
  const price = productFromPrice(product);
  return {
    title: product.title,
    description: `${product.title} — ${formatPrice(price.amount, price.currency)}. ${product.description}`,
  };
}

function buildCrumbs(product: ReturnType<typeof findProduct>): Crumb[] {
  const crumbs: Crumb[] = [{ label: "Início", href: "/" }, { label: "Mulher", href: "/mulher" }];
  const [cat] = product?.categories ?? [];
  if (cat) crumbs.push({ label: cat.name, href: `/mulher/${cat.handle}` });
  crumbs.push({ label: product?.title ?? "", href: `/produtos/${product?.handle}` });
  return crumbs;
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const all = await getProducts();
  const product = findProduct(all, handle);
  if (!product) notFound();

  const related = getRelated(all, product, 4);

  return (
    <div>
      <ProductDetail product={product} crumbs={buildCrumbs(product)} />

      {related.length > 0 && (
        <div className="border-t border-line">
          <ProductRail title="Você também pode gostar" products={related} />
        </div>
      )}
    </div>
  );
}
