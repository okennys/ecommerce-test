import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Hairline underline input, uppercase micro-label. Matches the reference forms. */
export function Field({
  label,
  error,
  hint,
  className,
  id,
  ...rest
}: { label: string; error?: string | null; hint?: ReactNode } & ComponentProps<"input">) {
  const inputId = id ?? `f-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label block text-ink-muted">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          "mt-1.5 w-full border-b bg-transparent py-2 text-[13px] focus:outline-none",
          error ? "border-[#8a2b2b]" : "border-line-strong focus:border-ink",
        )}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error ? (
        <p className="label mt-1 text-[#8a2b2b]">{error}</p>
      ) : hint ? (
        <p className="label mt-1 text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  error,
  className,
  id,
  children,
  ...rest
}: { label: string; error?: string | null } & ComponentProps<"select">) {
  const inputId = id ?? `s-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="label block text-ink-muted">
        {label}
      </label>
      <select
        id={inputId}
        className={cn(
          "mt-1.5 w-full border-b bg-transparent py-2 text-[13px] focus:outline-none",
          error ? "border-[#8a2b2b]" : "border-line-strong focus:border-ink",
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="label mt-1 text-[#8a2b2b]">{error}</p>}
    </div>
  );
}
