"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { parsePlpParams } from "./plp-parse";

export { parsePlpParams, plpParamsFromRecord } from "./plp-parse";
export type { PlpParams } from "./plp-parse";

export function usePlpParams() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const params = parsePlpParams(new URLSearchParams(sp.toString()));

  const commit = useCallback(
    (next: URLSearchParams, opts?: { resetView?: boolean }) => {
      if (opts?.resetView ?? true) next.delete("ver");
      for (const [k, v] of [...next.entries()]) if (!v) next.delete(k);
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setValue = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(sp.toString());
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
      commit(next);
    },
    [sp, commit],
  );

  const toggleInList = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(sp.toString());
      const current = (next.get(key) ?? "").split(",").filter(Boolean);
      const has = current.includes(value);
      const updated = has ? current.filter((v) => v !== value) : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      commit(next);
    },
    [sp, commit],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams(sp.toString());
    ["tamanho", "cor", "ate", "ver"].forEach((k) => next.delete(k));
    commit(next);
  }, [sp, commit]);

  const loadMore = useCallback(() => {
    const next = new URLSearchParams(sp.toString());
    next.set("ver", String(params.view + 1));
    commit(next, { resetView: false });
  }, [sp, commit, params.view]);

  return { params, setValue, toggleInList, clearAll, loadMore };
}
