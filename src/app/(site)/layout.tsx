import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getNavigation } from "@/lib/data/catalogue";

/**
 * Storefront chrome. Everything the customer browses lives under this group;
 * the checkout group has its own stripped-down layout.
 *
 * `<main>` clears the fixed header with `pt-header`; the homepage hero pulls
 * itself back up under the transparent header with `-mt-header` on its
 * `ScrollStack` wrapper.
 */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // the menu is built from what Medusa actually carries, so it is resolved here
  // and handed to the (client) header and footer
  const nav = await getNavigation();

  return (
    <>
      <SiteHeader nav={nav} />
      <main id="conteudo" className="flex-1 pt-header">
        {children}
      </main>
      <SiteFooter nav={nav} />

      <CartDrawer />
    </>
  );
}
