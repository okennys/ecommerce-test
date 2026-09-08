import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LockIcon } from "@/components/ui/icons";

/**
 * Stripped checkout header — the reference drops the mega-nav and shows only
 * the wordmark plus a way back to the bag and a "secure" cue.
 */
export function CheckoutChrome() {
  return (
    <header className="relative flex h-header items-center justify-between border-b border-line px-5 lg:px-gutter">
      <Link href="/carrinho" className="label link-quiet z-10">
        <span aria-hidden className="sm:hidden">←</span>
        <span className="hidden sm:inline">← Voltar à sacola</span>
        <span className="sr-only sm:hidden">Voltar à sacola</span>
      </Link>

      <Link
        href="/"
        aria-label="JU RUDOLPH — página inicial"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <Logo variant="ink" size="md" />
      </Link>

      <span className="label hidden items-center gap-2 text-ink-muted sm:flex">
        <LockIcon size={14} />
        Ambiente seguro
      </span>
    </header>
  );
}
