"use client";

import { createElement, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Fades + lifts children the first time they scroll into view. Under
 * `prefers-reduced-motion` the transition is dropped (via `motion-reduce`), so
 * content simply appears when observed.
 */
export function Reveal({
  children,
  className,
  delayMs = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: "div" | "section" | "li" | "figure";
}) {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return createElement(
    as,
    {
      ref: setNode,
      style: { transitionDelay: shown ? `${delayMs}ms` : "0ms" },
      className: cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      ),
    },
    children,
  );
}
