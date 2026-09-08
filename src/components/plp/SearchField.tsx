"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "@/components/ui/icons";

export function SearchField({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
      }}
      className="flex items-center gap-3 border-b border-ink py-2"
    >
      <SearchIcon size={18} className="shrink-0 text-ink-muted" />
      <input
        name="q"
        type="search"
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="O que você procura?"
        className="label w-full bg-transparent py-1 tracking-label placeholder:text-ink-muted focus:outline-none"
      />
      <button type="submit" className="label text-ink-muted hover:text-ink">
        Buscar
      </button>
    </form>
  );
}
