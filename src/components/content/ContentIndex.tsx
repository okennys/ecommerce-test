import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentSection } from "@/lib/data/content";
import { ContentHero } from "./ContentHero";

export function ContentIndex({ sectionKey }: { sectionKey: string }) {
  const section = getContentSection(sectionKey);
  if (!section) notFound();

  return (
    <div>
      <ContentHero
        kicker="JU RUDOLPH"
        title={section.title}
        image={section.image}
        crumbs={[
          { label: "Início", href: "/" },
          { label: section.title, href: `/${section.key}` },
        ]}
      />

      <div className="mx-auto max-w-3xl px-5 py-14 lg:py-16">
        <p className="max-w-xl text-ink-muted">{section.intro}</p>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {section.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="label group flex items-center justify-between py-5">
                <span>{l.label}</span>
                <span aria-hidden className="text-ink-muted transition-colors group-hover:text-ink">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
