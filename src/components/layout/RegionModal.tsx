"use client";

import { useEffect } from "react";
import { regionGroups, type RegionCountry } from "@/lib/data/regions";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { useScrollLock } from "@/lib/useScrollLock";
import { useStoredRegion } from "@/lib/useStoredRegion";
import { useUI } from "@/context/UIProvider";
import { CloseIcon } from "@/components/ui/icons";

/**
 * Country/language picker. Selection is persisted locally and display-only for
 * Milestone 1.
 * SWAP POINT: wire the choice to a real Medusa region + locale route.
 */
export function RegionModal() {
  const { regionOpen, closeRegion } = useUI();
  const [current, persist] = useStoredRegion();

  useScrollLock(regionOpen);

  useEffect(() => {
    if (!regionOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRegion();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [regionOpen, closeRegion]);

  const choose = (country: RegionCountry) => {
    persist(country);
    closeRegion();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.region.title}
      data-open={regionOpen}
      inert={!regionOpen}
      className={cn(
        "fixed inset-0 z-[120] flex items-start justify-center transition-opacity duration-300",
        regionOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        aria-label={t.common.close}
        onClick={closeRegion}
        className="absolute inset-0 bg-ink/25"
      />

      <div
        className={cn(
          "relative mt-0 max-h-full w-full overflow-y-auto bg-paper px-5 pb-16 pt-6 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:px-gutter",
          regionOpen ? "translate-y-0" : "-translate-y-3",
        )}
      >
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h2 className="label-lg">{t.region.title}</h2>
            <p className="label mt-2 text-ink-muted">{t.region.intro}</p>
            <p className="label mt-4">
              {t.region.current}: <span className="text-ink">{current.name}</span> ·{" "}
              {current.currencyCode}
            </p>
          </div>
          <button
            type="button"
            onClick={closeRegion}
            aria-label={t.common.close}
            className="-m-2 p-2"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-4">
          {regionGroups.map((group) => (
            <div key={group.continent}>
              <p className="label-lg mb-4">{group.continent}</p>
              <ul className="space-y-[0.6rem]">
                {group.countries.map((country) => (
                  <li key={country.iso2}>
                    <button
                      type="button"
                      onClick={() => choose(country)}
                      aria-current={country.iso2 === current.iso2}
                      className={cn(
                        "label link-quiet",
                        country.iso2 === current.iso2 && "text-ink underline underline-offset-4",
                      )}
                    >
                      {country.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
