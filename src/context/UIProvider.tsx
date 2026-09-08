"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Shared open/close state for overlays triggered from more than one place. */
interface UIContextValue {
  regionOpen: boolean;
  openRegion: () => void;
  closeRegion: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [regionOpen, setRegionOpen] = useState(false);
  const openRegion = useCallback(() => setRegionOpen(true), []);
  const closeRegion = useCallback(() => setRegionOpen(false), []);

  const value = useMemo(
    () => ({ regionOpen, openRegion, closeRegion }),
    [regionOpen, openRegion, closeRegion],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within <UIProvider>");
  return ctx;
}
