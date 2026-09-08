"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { SearchIcon } from "@/components/ui/icons";

/**
 * Slide-down search field beneath the header bar.
 * SWAP POINT: `/busca` results route is built in a later milestone.
 */
export function SearchPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      inert={!open}
      className={cn(
        "absolute inset-x-0 top-full overflow-hidden border-b border-line bg-paper transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        open ? "max-h-40 opacity-100" : "max-h-0 opacity-0",
      )}
    >
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new FormData(e.currentTarget).get("q")?.toString().trim();
          if (q) router.push(`/busca?q=${encodeURIComponent(q)}`);
          onClose();
        }}
        className="flex items-center gap-4 px-5 py-6 lg:px-gutter"
      >
        <SearchIcon size={20} className="shrink-0 text-ink-muted" />
        <input
          ref={inputRef}
          name="q"
          type="search"
          autoComplete="off"
          placeholder="O que você procura?"
          className="label w-full bg-transparent py-2 tracking-label text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <button type="submit" className="label text-ink-muted hover:text-ink">
          Buscar
        </button>
      </form>
    </div>
  );
}
