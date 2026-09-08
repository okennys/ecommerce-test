import type { Metadata } from "next";
import { getContentPage, slugsForSection } from "@/lib/data/content";
import { ContentSlug } from "@/components/content/ContentSlug";

export function generateStaticParams() {
  return slugsForSection("legal").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getContentPage("legal", slug);
  return page ? { title: page.title, description: page.intro } : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ContentSlug sectionKey="legal" slug={slug} />;
}
