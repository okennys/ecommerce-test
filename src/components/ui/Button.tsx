import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Two button shapes from the reference: a flat black rectangle (primary) and a
 * hairline-outlined rectangle (secondary). ~52px tall, uppercase micro-label,
 * zero radius.
 */

type Variant = "solid" | "outline";

interface BaseProps {
  variant?: Variant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

const base =
  "label inline-flex h-[52px] items-center justify-center px-8 text-center transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid: "bg-black text-on-dark hover:bg-ink",
  outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
};

export function Button({
  variant = "solid",
  fullWidth,
  className,
  children,
  ...rest
}: BaseProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "solid",
  fullWidth,
  className,
  children,
  href,
  ...rest
}: BaseProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
