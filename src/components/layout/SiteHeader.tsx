"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, utilityNav } from "@/lib/data/navigation";
import { t } from "@/lib/dictionary";
import { cn } from "@/lib/cn";
import { useCart } from "@/context/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { BagIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchPanel } from "./SearchPanel";

const OPEN_DELAY = 90;
const CLOSE_DELAY = 180;

export function SiteHeader() {
  const pathname = usePathname();
  const hasHeroRoute = pathname === "/";

  const { count, openCart } = useCart();

  const [y, setY] = useState(0);
  const [heroPx, setHeroPx] = useState<number | null>(hasHeroRoute ? null : 0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Reset every overlay when the route changes (adjust state during render —
  // React's sanctioned alternative to a route-change effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setActiveId(null);
    setMobileOpen(false);
    setSearchOpen(false);
  }

  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Measure the hero (if the current route renders one) + track scroll.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setHeroPx(hero ? hero.offsetHeight : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  const closeMenu = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setActiveId(null);
  }, []);

  // Escape closes the mega-menu and restores focus to its trigger.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const id = activeId;
        closeMenu();
        triggerRefs.current[id]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, closeMenu]);

  const scheduleOpen = (id: string) => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setActiveId(id), OPEN_DELAY);
  };
  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActiveId(null), CLOSE_DELAY);
  };

  const overHero =
    !mobileOpen &&
    !searchOpen &&
    (heroPx === null ? y < 8 : heroPx > 0 && y < heroPx - 64);
  const solid = !overHero || activeId !== null;
  const light = overHero && activeId === null;

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[100]"
        onMouseLeave={scheduleClose}
      >
        <div
          className={cn(
            "relative flex h-header items-center gap-6 px-5 transition-colors duration-300 lg:px-gutter",
            solid ? "bg-paper" : "bg-transparent",
            solid ? "border-b border-line" : "border-b border-transparent",
            light ? "text-on-dark" : "text-ink",
          )}
        >
          {/* left */}
          <div className="flex flex-1 items-center gap-7">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="-m-2 p-2 lg:hidden"
              aria-label={t.a11y.openMenu}
            >
              <MenuIcon size={22} />
            </button>

            <nav aria-label={t.a11y.primaryNav} className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {primaryNav.map((item) => (
                  <li
                    key={item.id}
                    onMouseEnter={() => item.columns && scheduleOpen(item.id)}
                  >
                    <Link
                      href={item.href}
                      ref={(el) => {
                        triggerRefs.current[item.id] = el;
                      }}
                      aria-haspopup={item.columns ? "true" : undefined}
                      aria-expanded={item.columns ? activeId === item.id : undefined}
                      onKeyDown={(e) => {
                        if (item.columns && e.key === "ArrowDown") {
                          e.preventDefault();
                          setActiveId(item.id);
                          requestAnimationFrame(() =>
                            panelRef.current?.querySelector<HTMLElement>("a")?.focus(),
                          );
                        }
                      }}
                      className="label py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* center */}
          <Link
            href="/"
            aria-label={t.brand.name}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Logo variant={light ? "light" : "ink"} size="md" />
          </Link>

          {/* right */}
          <div className="flex flex-1 items-center justify-end gap-6">
            <nav aria-label={t.a11y.utilityNav} className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {utilityNav.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="label py-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/conta" className="label py-2">
                    {t.header.account}
                  </Link>
                </li>
              </ul>
            </nav>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t.a11y.openSearch}
              aria-expanded={searchOpen}
              className="-m-2 p-2"
            >
              <SearchIcon size={20} />
            </button>

            <button
              type="button"
              onClick={openCart}
              aria-label={`${t.a11y.openBag}${count > 0 ? ` (${count})` : ""}`}
              className="relative -m-2 p-2"
            >
              <BagIcon size={20} />
              {count > 0 && (
                <span className="label absolute -right-0.5 -top-0.5 text-[9px] leading-none">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

        <MegaMenu
          ref={panelRef}
          items={primaryNav}
          activeId={activeId}
          onLinkClick={closeMenu}
        />
      </header>

      {/* page dim while the mega-menu is open */}
      <div
        aria-hidden
        onClick={closeMenu}
        data-show={activeId !== null}
        className={cn(
          "fixed inset-0 z-[80] bg-ink/20 transition-opacity duration-[260ms]",
          activeId !== null
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
