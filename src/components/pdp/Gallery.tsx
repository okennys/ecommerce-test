"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useScrollLock } from "@/lib/useScrollLock";
import { CloseIcon } from "@/components/ui/icons";

export function Gallery({
  images,
  alt,
  startIndex,
  onClose,
}: {
  images: string[];
  alt: string;
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Galeria de imagens" className="fixed inset-0 z-[120] bg-paper">
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="absolute right-4 top-4 z-10 -m-2 p-2"
      >
        <CloseIcon size={24} />
      </button>

      <div className="flex h-full w-full items-center justify-center p-6 sm:p-12">
        <div className="relative h-full w-full max-w-3xl">
          <Image src={images[index]} alt={alt} fill sizes="100vw" className="object-contain" priority />
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Imagem ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 w-6 transition-colors", i === index ? "bg-ink" : "bg-line-strong")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
