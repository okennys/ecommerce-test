import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * The "DESCOBRIR" / "VER" text link from the reference: uppercase micro-label
 * with a hairline underline that wipes in on hover/focus.
 */
export function TextCta({
  href,
  children,
  className,
  ...rest
}: { href: string } & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(
        "label group relative inline-block pb-1 text-current",
        className,
      )}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}
