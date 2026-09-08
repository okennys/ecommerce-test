"use client";

import { useEffect, useState } from "react";
import { defaultCountry, type RegionCountry } from "@/lib/data/regions";

export const REGION_STORAGE_KEY = "jr.region.v1";

/**
 * Reads the visitor's saved country from localStorage after mount (SSR-safe:
 * server + first client render both use `defaultCountry`, avoiding a hydration
 * mismatch). Returns [current, persist].
 */
export function useStoredRegion(): [RegionCountry, (c: RegionCountry) => void] {
  const [current, setCurrent] = useState<RegionCountry>(defaultCountry);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REGION_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a browser-only store
      if (raw) setCurrent(JSON.parse(raw) as RegionCountry);
    } catch {
      /* no stored value */
    }
  }, []);

  const persist = (c: RegionCountry) => {
    setCurrent(c);
    try {
      localStorage.setItem(REGION_STORAGE_KEY, JSON.stringify(c));
    } catch {
      /* storage unavailable */
    }
  };

  return [current, persist];
}
