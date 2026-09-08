import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { RegionModal } from "@/components/layout/RegionModal";

/**
 * Storefront chrome. Everything the customer browses lives under this group;
 * the checkout group has its own stripped-down layout.
 *
 * `<main>` clears the fixed header with `pt-header`; the homepage hero pulls
 * itself back up under the transparent header with `-mt-header` on its
 * `ScrollStack` wrapper.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="flex-1 pt-header">
        {children}
      </main>
      <SiteFooter />

      <CartDrawer />
      <RegionModal />
    </>
  );
}
