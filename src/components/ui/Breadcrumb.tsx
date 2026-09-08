import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Você está em" className={className}>
      <ol className="label flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={c.href}>
              <li>
                {last ? (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                ) : (
                  <Link href={c.href} className="hover:text-ink">
                    {c.label}
                  </Link>
                )}
              </li>
              {!last && (
                <li aria-hidden className="text-line-strong">
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
