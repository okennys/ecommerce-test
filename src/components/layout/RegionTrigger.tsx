"use client";

import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { useUI } from "@/context/UIProvider";
import { useStoredRegion } from "@/lib/useStoredRegion";
import { ChevronDownIcon } from "@/components/ui/icons";

/** Footer / mobile-nav button that opens the <RegionModal>. Shows current pick. */
export function RegionTrigger({ className }: { className?: string }) {
  const { openRegion } = useUI();
  const [current] = useStoredRegion();

  return (
    <button
      type="button"
      onClick={openRegion}
      aria-label={t.a11y.openRegion}
      className={cn("label inline-flex items-center gap-2 link-quiet", className)}
    >
      {current.name} · {current.currencyCode}
      <ChevronDownIcon size={14} />
    </button>
  );
}
