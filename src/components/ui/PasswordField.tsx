"use client";

import { useState, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Password input in the `Field` style, with a "Mostrar / Ocultar" toggle so the
 * shopper can check what was typed — or what the browser autofilled.
 */
export function PasswordField({
  label,
  error,
  className,
  id,
  ...rest
}: { label: string; error?: string | null } & Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label block text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "mt-1.5 w-full border-b bg-transparent py-2 pr-16 text-[13px] focus:outline-none",
            error ? "border-[#8a2b2b]" : "border-line-strong focus:border-ink",
          )}
          aria-invalid={error ? true : undefined}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-controls={inputId}
          aria-pressed={visible}
          className="label absolute bottom-2 right-0 text-ink-muted hover:text-ink"
        >
          {visible ? "Ocultar" : "Mostrar"}
        </button>
      </div>
      {error && <p className="label mt-1 text-[#8a2b2b]">{error}</p>}
    </div>
  );
}
