"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { NavItem, NavLink } from "@/lib/data/navigation";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { useScrollLock } from "@/lib/useScrollLock";
import { Logo } from "@/components/ui/Logo";
import { ChevronDownIcon, CloseIcon } from "@/components/ui/icons";

/** Full-screen paper nav for < lg. Primary entries expand to their columns. */
export function MobileNav({
  open,
  onClose,
  primaryNav,
  utilityNav,
}: {
  open: boolean;
  onClose: () => void;
  primaryNav: NavItem[];
  utilityNav: NavLink[];
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.common.menu}
      data-open={open}
      inert={!open}
      className={cn(
        "fixed inset-0 z-[110] flex flex-col bg-paper transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
        open
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0",
      )}
    >
      <div className="flex h-header shrink-0 items-center justify-between border-b border-line px-5">
        <Logo size="sm" />
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="-m-2 p-2"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <nav
        aria-label={t.a11y.primaryNav}
        className="min-h-0 flex-1 overflow-y-auto px-5 py-6"
      >
        <ul className="divide-y divide-line">
          {primaryNav.map((item) => {
            const isOpen = expanded === item.id;
            if (!item.columns) {
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="label-lg block py-4"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="label-lg flex w-full items-center justify-between py-4"
                >
                  {item.label}
                  <ChevronDownIcon
                    size={16}
                    className={cn("transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-6 pb-6">
                      {item.columns.map((col) => (
                        <div key={col.title}>
                          <p className="label mb-2 text-ink-muted">{col.title}</p>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.href}>
                                <Link
                                  href={link.href}
                                  onClick={onClose}
                                  className="label block py-1"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-line bg-paper px-5 py-6">
        <ul className="space-y-3">
          {utilityNav.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={onClose} className="label block py-1">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/conta" onClick={onClose} className="label block py-1">
              {t.header.account}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
