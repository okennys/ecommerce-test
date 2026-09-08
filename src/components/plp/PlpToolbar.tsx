"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { FilterIcon } from "@/components/ui/icons";
import type { Facets, SortKey } from "@/lib/data/products";
import { usePlpParams } from "./plp-params";
import { FilterPanel } from "./FilterPanel";

const SORT_LABELS: Record<SortKey, string> = {
  novidades: "Novidades",
  "preco-asc": "Menor preço",
  "preco-desc": "Maior preço",
};

export function PlpToolbar({ total, facets }: { total: number; facets: Facets }) {
  const { params, setValue, toggleInList } = usePlpParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const chips: { label: string; onRemove: () => void }[] = [
    ...params.sizes.map((s) => ({ label: `Tamanho ${s}`, onRemove: () => toggleInList("tamanho", s) })),
    ...params.colours.map((c) => ({ label: c, onRemove: () => toggleInList("cor", c) })),
    ...(params.maxPrice
      ? [{ label: `Até ${formatPrice(params.maxPrice)}`, onRemove: () => setValue("ate", null) }]
      : []),
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-4 border-y border-line py-3">
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="label inline-flex items-center gap-2 hover:text-ink"
        >
          <FilterIcon size={16} />
          Filtrar
          {chips.length > 0 && <span className="text-ink-muted">({chips.length})</span>}
        </button>

        <p className="label hidden text-ink-muted sm:block">
          {total} {total === 1 ? "peça" : "peças"}
        </p>

        <div className="flex items-center gap-4">
          {/* density toggle — desktop only */}
          <div className="hidden items-center gap-1 lg:flex" role="group" aria-label="Densidade da grade">
            {([2, 3] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={params.density === d}
                onClick={() => setValue("grade", d === 3 ? null : "2")}
                className={cn(
                  "label h-7 w-7 border",
                  params.density === d ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink",
                )}
              >
                {d}
              </button>
            ))}
          </div>

          <label className="label inline-flex items-center gap-2">
            <span className="hidden text-ink-muted sm:inline">Ordenar</span>
            <select
              value={params.sort}
              onChange={(e) => setValue("ordenar", e.target.value === "novidades" ? null : e.target.value)}
              className="label border border-line-strong bg-paper px-3 py-2 focus:border-ink focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-4">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={chip.onRemove}
                className="label inline-flex items-center gap-2 border border-line-strong px-3 py-1.5 text-ink-muted hover:border-ink hover:text-ink"
              >
                {chip.label}
                <span aria-hidden>×</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <FilterPanel open={filterOpen} onClose={() => setFilterOpen(false)} facets={facets} total={total} />
    </>
  );
}
