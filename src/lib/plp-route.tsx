import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Section, getCatalogNode, catalogParamsForSection } from "@/lib/data/catalog";
import { getCatalog, getProducts } from "@/lib/data/catalogue";
import { CatalogPage } from "@/components/plp/CatalogPage";

/**
 * Shared body for the PLP section routes (`/mulher`, `/sale`, `/highlights`,
 * `/presentes`), each an optional catch-all resolved against the catalogue
 * Medusa returned.
 */
type PathParams = Promise<{ path?: string[] }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function sectionStaticParams(section: Section) {
  return catalogParamsForSection(await getCatalog(), section);
}

export async function sectionMetadata(section: Section, params: PathParams): Promise<Metadata> {
  const { path = [] } = await params;
  const node = getCatalogNode(await getCatalog(), section, path);
  if (!node) return {};
  return { title: node.title, description: node.intro };
}

export async function SectionPage({
  section,
  params,
  searchParams,
}: {
  section: Section;
  params: PathParams;
  searchParams: SearchParams;
}) {
  const { path = [] } = await params;
  const [catalog, products] = await Promise.all([getCatalog(), getProducts()]);
  const node = getCatalogNode(catalog, section, path);
  if (!node) notFound();
  return (
    <CatalogPage
      node={node}
      catalog={catalog}
      products={products}
      searchParams={await searchParams}
    />
  );
}
