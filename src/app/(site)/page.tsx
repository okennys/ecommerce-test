import { ScrollStack, ScrollPanel } from "@/components/home/ScrollStack";
import { EditorialBlock } from "@/components/home/EditorialBlock";
import { ProductRail } from "@/components/home/ProductRail";
import { CampaignSplit } from "@/components/home/CampaignSplit";
import { ph } from "@/lib/data/media";
import { t } from "@/lib/dictionary";
import type { StoreProduct } from "@/types/medusa";
import { byTag, byCollection, findProduct } from "@/lib/data/products";
import { getProducts } from "@/lib/data/catalogue";

/**
 * The catalogue shoots every piece twice: a still on a pale backdrop, then the
 * same piece on a model. Stills carry the grid; the model frames are what the
 * campaign bands want — and those are 2:3, which is the ratio CampaignSplit
 * uses, so the shot lands uncropped.
 */
function modelShot(products: StoreProduct[], handle: string, fallback: string): string {
  const images = findProduct(products, handle)?.images ?? [];
  const twoByThree = images.find(
    (i) => i.width && i.height && Math.abs(i.height / i.width - 1.5) < 0.05,
  );
  return twoByThree?.url ?? images[1]?.url ?? images[0]?.url ?? fallback;
}

// Next needs a literal here — keep in sync with CATALOGUE_REVALIDATE.
export const revalidate = 300;

export default async function HomePage() {
  const products = await getProducts();
  const season = byTag(products, "novidade").slice(0, 4);
  const icons = byCollection(products, "icones").slice(0, 4);

  return (
    <>
      {/* Stacked-scroll hero — each panel pins while the next covers it.
          Films live in public/media/hero/: a 16:9 desktop cut and a 9:16
          mobile cut per panel, silent, with a poster frame each. */}
      <ScrollStack>
        <ScrollPanel
          wordmark
          priority
          media={{
            type: "video",
            // both cuts play the two films back to back (VIDEO HERO 1 + intercalado)
            desktop: { src: "/media/hero/hero-1-desktop-loop.mp4", poster: "/media/hero/hero-1-desktop.jpg" },
            mobile: { src: "/media/hero/hero-1-mobile-loop.mp4", poster: "/media/hero/hero-1-mobile.jpg" },
            alt: "Campanha JU RUDOLPH",
          }}
          kicker={t.home.heroKicker}
          cta={{ label: t.home.heroCta, href: "/mulher/novidades" }}
        />
        <ScrollPanel
          media={{
            // black-and-white gives way to colour as the panel scrolls in
            type: "image",
            src: "/media/hero/hero-2-color.jpg",
            from: { src: "/media/hero/hero-2-pb.jpg" },
            alt: "A coleção JU RUDOLPH",
          }}
          kicker="A coleção"
          cta={{ label: "Descobrir", href: "/mulher" }}
        />
        <ScrollPanel
          media={{
            type: "image",
            src: "/media/hero/hero-3-desktop.jpg",
            mobileSrc: "/media/hero/hero-3-mobile.jpg",
            alt: "Selecionados pela Ju",
          }}
          kicker="Selecionados pela Ju"
          cta={{ label: "Ver a seleção", href: "/highlights/selecao" }}
        />
      </ScrollStack>

      {/* release into normal flow */}
      <CampaignSplit
        panels={[
          {
            src: modelShot(products, "vestido-rafa", ph("look-02")),
            alt: "Vestidos JU RUDOLPH",
            title: "Vestidos",
            cta: { label: "Ver", href: "/mulher/vestidos" },
          },
          {
            src: modelShot(products, "conjunto-leticia", ph("split-mulher")),
            alt: "Conjuntos JU RUDOLPH",
            title: "Conjuntos",
            cta: { label: "Descobrir", href: "/mulher/conjuntos" },
          },
        ]}
      />

      <ProductRail
        title="Novidades"
        products={season.length ? season : products.slice(0, 4)}
        viewAllHref="/mulher/novidades"
      />

      <ProductRail
        title="Clássicos JU RUDOLPH"
        products={icons.length ? icons : products.slice(0, 4)}
        viewAllHref="/highlights/classicos"
      />

      <EditorialBlock
        src={ph("editorial-atelier")}
        alt="Ateliê JU RUDOLPH em São Paulo"
        kicker="A Marca"
        title="Feito à mão, em São Paulo"
        cta={{ label: "Nossa história", href: "/a-marca/historia" }}
        tone="dark"
      />
    </>
  );
}
