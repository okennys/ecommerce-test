import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ContentSection } from "@/lib/data/content";

export function ContentLayout({
  section,
  activeHref,
  children,
}: {
  section: ContentSection;
  activeHref: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-gutter lg:py-16">
      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-16">
        <nav aria-label={section.title} className="mb-10 lg:mb-0">
          <p className="label-lg mb-4">
            <Link href={`/${section.key}`}>{section.title}</Link>
          </p>
          <ul className="space-y-2.5">
            {section.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={l.href === activeHref ? "page" : undefined}
                  className={cn(
                    "label",
                    l.href === activeHref ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>{children}</div>
      </div>
    </div>
  );
}
