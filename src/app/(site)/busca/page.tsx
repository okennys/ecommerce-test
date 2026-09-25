import type { Metadata } from "next";
import { searchProducts } from "@/lib/data/products";
import { getProducts } from "@/lib/data/catalogue";
import { ProductGrid } from "@/components/plp/ProductGrid";
import { SearchField } from "@/components/plp/SearchField";

export const metadata: Metadata = { title: "Busca" };
// Next needs a literal here — keep in sync with CATALOGUE_REVALIDATE.
export const revalidate = 300;

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? searchProducts(await getProducts(), query) : [];

  return (
    <div className="px-5 py-12 lg:px-gutter">
      <h1 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-medium">Busca</h1>

      <div className="mt-6 max-w-xl">
        <SearchField initial={query} />
      </div>

      {query && (
        <p className="label mt-8 text-ink-muted">
          {results.length} {results.length === 1 ? "resultado" : "resultados"} para “{query}”
        </p>
      )}

      <div className="mt-8">
        {query ? (
          results.length > 0 ? (
            <ProductGrid products={results} density={3} />
          ) : (
            <p className="py-16 text-center text-ink-muted">
              Nada encontrado. Tente outro termo — “vestido”, “lurex”, “alfaiataria”.
            </p>
          )
        ) : (
          <p className="py-16 text-center text-ink-muted">Digite acima para buscar no catálogo.</p>
        )}
      </div>
    </div>
  );
}
