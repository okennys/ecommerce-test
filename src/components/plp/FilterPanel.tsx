"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { useScrollLock } from "@/lib/useScrollLock";
import { CloseIcon } from "@/components/ui/icons";
import type { Facets } from "@/lib/data/products";
import { usePlpParams } from "./plp-params";

export function FilterPanel({
  open,
  onClose,
  facets,
  total,
}: {
  open: boolean;
  onClose: () => void;
  facets: Facets;
  total: number;
}) {
  const { params, toggleInList, setValue, clearAll } = usePlpParams();
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const activeCount = params.sizes.length + params.colours.length + (params.maxPrice ? 1 : 0);
  const stops = facets.priceStops;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filtrar"
      inert={!open}
      className={cn(
        "fixed inset-0 z-[110] transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-ink/25"
      />

      <aside
        className={cn(
          "absolute left-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-paper transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <header className="flex h-header items-center justify-between border-b border-line px-6">
          <h2 className="label-lg">Filtrar</h2>
          <button type="button" onClick={onClose} aria-label="Fechar" className="-m-2 p-2">
            <CloseIcon size={22} />
          </button>
        </header>

        <div className="flex-1 divide-y divide-line overflow-y-auto px-6">
          {/* Tamanho */}
          <section className="py-6">
            <h3 className="label-lg mb-4">Tamanho</h3>
            <div className="flex flex-wrap gap-2">
              {facets.sizes.map((size) => {
                const on = params.sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleInList("tamanho", size)}
                    className={cn(
                      "label min-w-[52px] border px-3 py-2 transition-colors",
                      on ? "border-ink bg-ink text-on-dark" : "border-line-strong hover:border-ink",
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Cor */}
          <section className="py-6">
            <h3 className="label-lg mb-4">Cor</h3>
            {/* one column: the catalogue has colour names as long as
                "Lurex Prata com Dourado", which a two-up grid clips */}
            <ul className="flex flex-col gap-y-3">
              {facets.colours.map((c) => {
                const on = params.colours.includes(c.name);
                return (
                  <li key={c.name}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleInList("cor", c.name)}
                      className="label flex w-full items-center gap-2.5 text-left"
                    >
                      <span
                        className={cn(
                          "h-4 w-4 shrink-0 border",
                          on ? "border-ink ring-1 ring-ink ring-offset-2 ring-offset-paper" : "border-line-strong",
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className={cn(on ? "text-ink" : "text-ink-muted")}>{c.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Preço */}
          {stops.length > 0 && (
            <section className="py-6">
              <h3 className="label-lg mb-4">Preço</h3>
              <div className="flex flex-col gap-2">
                {stops.map((s) => {
                  const on = params.maxPrice === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setValue("ate", on ? null : String(s))}
                      className={cn("label text-left", on ? "text-ink" : "text-ink-muted hover:text-ink")}
                    >
                      {on ? "— " : ""}
                      Até {formatPrice(s)}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <footer className="flex items-center gap-3 border-t border-line px-6 py-5">
          <button
            type="button"
            onClick={clearAll}
            disabled={activeCount === 0}
            className="label link-quiet disabled:opacity-40"
          >
            Limpar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="label ml-auto h-[46px] flex-1 bg-black px-6 text-on-dark"
          >
            Ver {total} {total === 1 ? "peça" : "peças"}
          </button>
        </footer>
      </aside>
    </div>
  );
}
