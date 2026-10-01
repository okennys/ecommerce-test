"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A layer that fades out as its hero panel scrolls into place — used to lay a
 * black-and-white frame over the colour photo and let the colour come through.
 *
 * Progress is how far the panel has risen: 0 while its top sits at the bottom
 * of the screen, 1 once it is pinned at the top. The fade runs between `start`
 * and `end` of that, so the colour is whole by the time the panel fills the
 * screen, and comes back to black-and-white if the reader scrolls up.
 */
export function ScrollFade({
  children,
  start = 0.3,
  end = 0.9,
}: {
  children: ReactNode;
  start?: number;
  end?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const panel = layer?.closest("section");
    if (!layer || !panel) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const h = window.innerHeight || 1;
      const risen = 1 - panel.getBoundingClientRect().top / h;
      const t = Math.min(1, Math.max(0, (risen - start) / (end - start)));
      // ease-in-out so the change starts and settles softly
      const eased = t * t * (3 - 2 * t);
      layer.style.opacity = String(1 - eased);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [start, end]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 will-change-[opacity]">
      {children}
    </div>
  );
}
