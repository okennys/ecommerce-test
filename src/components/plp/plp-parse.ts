import type { SortKey } from "@/lib/data/products";

/** Pure PLP query-param parsing — safe to call from server or client. */

export interface PlpParams {
  sizes: string[];
  colours: string[];
  maxPrice: number | null;
  sort: SortKey;
  density: 2 | 3;
  view: number;
}

const SORTS: SortKey[] = ["novidades", "preco-asc", "preco-desc"];

export function parsePlpParams(sp: URLSearchParams): PlpParams {
  const list = (k: string) =>
    (sp.get(k) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const sortRaw = sp.get("ordenar") as SortKey | null;
  const ate = Number(sp.get("ate"));
  const grade = sp.get("grade") === "2" ? 2 : 3;
  const ver = Math.max(1, Number(sp.get("ver")) || 1);
  return {
    sizes: list("tamanho"),
    colours: list("cor"),
    maxPrice: Number.isFinite(ate) && ate > 0 ? ate : null,
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "novidades",
    density: grade,
    view: ver,
  };
}

export function plpParamsFromRecord(
  sp: Record<string, string | string[] | undefined>,
): PlpParams {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") usp.set(k, v);
    else if (Array.isArray(v)) usp.set(k, v.join(","));
  }
  return parsePlpParams(usp);
}
