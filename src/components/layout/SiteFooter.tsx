import Link from "next/link";
import { footerNav, socialLinks } from "@/lib/data/navigation";
import { t } from "@/lib/dictionary";
import { NewsletterForm } from "./NewsletterForm";
import { RegionTrigger } from "./RegionTrigger";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      aria-label={t.a11y.footerNav}
      className="border-t border-line bg-paper px-5 pb-10 pt-16 lg:px-gutter"
    >
      <div className="grid gap-14 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
        <NewsletterForm />

        <nav className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
          {footerNav.map((col) => (
            <div key={col.title}>
              <p className="label-lg mb-4">{col.title}</p>
              <ul className="space-y-[0.55rem]">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="label link-quiet">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-6">
          {socialLinks.map((s) => (
            <li key={s.href}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="label link-quiet"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <RegionTrigger />

        <p className="label text-ink-muted">{t.footer.rights(year)}</p>
      </div>
    </footer>
  );
}
