"use client";

import { usePlpParams } from "./plp-params";

export function LoadMore({ shown, total }: { shown: number; total: number }) {
  const { loadMore } = usePlpParams();
  const done = shown >= total;

  return (
    <div className="mt-14 flex flex-col items-center gap-4">
      <p className="label text-ink-muted">
        Mostrando {shown} de {total}
      </p>
      <div className="h-px w-40 bg-line-strong" aria-hidden>
        <div
          className="h-full bg-ink transition-[width] duration-500"
          style={{ width: `${total ? Math.round((shown / total) * 100) : 0}%` }}
        />
      </div>
      {!done && (
        <button
          type="button"
          onClick={loadMore}
          className="label mt-2 border border-ink px-8 py-3 hover:bg-ink hover:text-paper"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}
