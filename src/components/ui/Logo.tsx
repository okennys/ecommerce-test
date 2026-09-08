import { cn } from "@/lib/cn";
import { t } from "@/lib/dictionary";

/**
 * Placeholder wordmark. Typographic only — display serif, uppercase, wide
 * tracking.
 *
 * SWAP POINT: replace the inner text with the real JU RUDOLPH logo (an inline
 * <svg>) once supplied. Keep the `variant` + `size` API so call sites don't
 * change.
 */

interface LogoProps {
  variant?: "ink" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClass: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-[15px]",
  md: "text-[19px]",
  lg: "text-[clamp(2.5rem,9vw,7rem)]",
};

export function Logo({ variant = "ink", size = "md", className }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display font-medium uppercase leading-none tracking-wordmark whitespace-nowrap select-none",
        variant === "light" ? "text-on-dark" : "text-ink",
        sizeClass[size],
        className,
      )}
    >
      {t.brand.name}
    </span>
  );
}
