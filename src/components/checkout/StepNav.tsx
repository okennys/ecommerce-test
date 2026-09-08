import Link from "next/link";
import { cn } from "@/lib/cn";
import { CheckIcon } from "@/components/ui/icons";
import { CHECKOUT_STEPS, type CheckoutStep } from "./steps";

export function StepNav({ current }: { current: CheckoutStep }) {
  return (
    <nav aria-label="Etapas da compra" className="mb-10">
      <ol className="flex items-center gap-2 sm:gap-4">
        {CHECKOUT_STEPS.map((step, i) => {
          const done = step.n < current;
          const active = step.n === current;
          return (
            <li key={step.n} className="flex items-center gap-2 sm:gap-4">
              {i > 0 && <span aria-hidden className="h-px w-4 bg-line-strong sm:w-8" />}
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "label flex h-6 w-6 items-center justify-center border",
                    active && "border-ink bg-ink text-on-dark",
                    done && "border-ink text-ink",
                    !active && !done && "border-line-strong text-ink-muted",
                  )}
                >
                  {done ? <CheckIcon size={12} /> : step.n}
                </span>
                {done ? (
                  <Link href={step.href} className="label hidden text-ink-muted hover:text-ink sm:inline">
                    {step.label}
                  </Link>
                ) : (
                  <span
                    className={cn("label hidden sm:inline", active ? "text-ink" : "text-ink-muted")}
                  >
                    {step.label}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
