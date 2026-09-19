import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct, getRelated, productFromPrice } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { ProductDetail } from "@/components/pdp/ProductDetail";
import { ProductRail } from "@/components/home/ProductRail";
import type { Crumb } from "@/components/ui/Breadcrumb";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return {};
  const price = productFromPrice(product);
  return {
    title: product.title,
    description: `${product.title} — ${formatPrice(price.amount, price.currency)}. ${product.description}`,
  };
}

function buildCrumbs(product: ReturnType<typeof getProduct>): Crumb[] {
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
  const product = getProduct(handle);
  if (!product) notFound();

  const related = getRelated(product, 4);

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
