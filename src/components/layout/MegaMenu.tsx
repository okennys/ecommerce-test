"use client";

import Link from "next/link";
import { forwardRef } from "react";
import type { NavItem } from "@/lib/data/navigation";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";

/**
 * Full-width typographic panel that drops from the header bar. Purely text
 * columns (no imagery), matching the reference. One panel, contents swap with
 * `activeItem`.
 */

interface MegaMenuProps {
  items: NavItem[];
  activeId: string | null;
  onLinkClick: () => void;
}

export const MegaMenu = forwardRef<HTMLDivElement, MegaMenuProps>(function MegaMenu(
  { items, activeId, onLinkClick },
  ref,
) {
  const activeItem = items.find((i) => i.id === activeId && i.columns?.length);
  const open = Boolean(activeItem);

  return (
    <div
      ref={ref}
      role="region"
      aria-label={activeItem?.label}
      data-open={open}
      inert={!open}
      className={cn(
        "absolute inset-x-0 top-full border-b border-line bg-paper/95 backdrop-blur-[2px]",
        "transition-[opacity,transform] duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        open
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      {activeItem?.columns && (
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 px-gutter pt-10 pb-14 md:grid-cols-3 lg:grid-cols-6">
          {activeItem.columns.map((col) => (
            <div key={col.title}>
              <p className="label-lg mb-4 text-ink">{col.title}</p>
              <ul className="space-y-[0.6rem]">
                <li>
                  <Link
                    href={col.href}
                    onClick={onLinkClick}
                    className="label text-ink underline-offset-4 hover:underline"
                  >
                    {t.common.shop}
                  </Link>
                </li>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onLinkClick}
                      className="label link-quiet"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
