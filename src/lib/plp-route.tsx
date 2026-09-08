import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  type Section,
  getCatalogNode,
  catalogParamsForSection,
} from "@/lib/data/catalog";
import { CatalogPage } from "@/components/plp/CatalogPage";

/**
 * Shared body for the three PLP section routes (`/mulher`, `/highlights`,
 * `/presentes`), each an optional catch-all resolved against `catalog.ts`.
 */
type PathParams = Promise<{ path?: string[] }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export function sectionStaticParams(section: Section) {
  return catalogParamsForSection(section);
}

export async function sectionMetadata(section: Section, params: PathParams): Promise<Metadata> {
  const { path = [] } = await params;
  const node = getCatalogNode(section, path);
  if (!node) return {};
  return {
    title: node.title,
    description: node.intro,
  };
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
  const node = getCatalogNode(section, path);
  if (!node) notFound();
  return <CatalogPage node={node} searchParams={await searchParams} />;
}
