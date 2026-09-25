import { ScrollStack, ScrollPanel } from "@/components/home/ScrollStack";
import { EditorialBlock } from "@/components/home/EditorialBlock";
import { ProductRail } from "@/components/home/ProductRail";
import { CampaignSplit } from "@/components/home/CampaignSplit";
import { ph } from "@/lib/data/media";
import { t } from "@/lib/dictionary";
import { products, productTags, getProductsByCollection, getProduct } from "@/lib/data/products";

/**
 * The catalogue shoots every piece twice: a still on a pale backdrop, then the
 * same piece on a model. Stills carry the grid; the model frames are what the
 * campaign bands want — and those are 2:3, which is the ratio CampaignSplit
 * uses, so the shot lands uncropped.
 */
function modelShot(handle: string, fallback: string): string {
  const images = getProduct(handle)?.images ?? [];
  const twoByThree = images.find(
    (i) => i.width && i.height && Math.abs(i.height / i.width - 1.5) < 0.05,
  );
  return twoByThree?.url ?? images[1]?.url ?? images[0]?.url ?? fallback;
}

export default function HomePage() {
  const season = products.filter((p) => productTags(p).includes("novidade")).slice(0, 4);
  const icons = getProductsByCollection("icones").slice(0, 4);

  return (
    <>
      {/* Stacked-scroll hero — each panel pins while the next covers it.
          SWAP POINT: give panels `media={{ type: "video", src, poster, alt }}`
          once JU RUDOLPH campaign films land in public/media/. */}
      <ScrollStack>
        <ScrollPanel
          wordmark
          priority
          media={{ type: "image", src: ph("editorial-season"), alt: "Campanha JU RUDOLPH" }}
          kicker={t.home.heroKicker}
          cta={{ label: t.home.heroCta, href: "/mulher/novidades" }}
        />
        <ScrollPanel
          media={{ type: "image", src: ph("editorial-colecao"), alt: "A coleção JU RUDOLPH" }}
          kicker="A coleção"
          cta={{ label: "Descobrir", href: "/mulher" }}
        />
        <ScrollPanel
          media={{ type: "image", src: ph("split-mulher"), alt: "Selecionados pela Ju" }}
          kicker="Selecionados pela Ju"
          cta={{ label: "Ver a seleção", href: "/highlights/selecao" }}
        />
      </ScrollStack>

      {/* release into normal flow */}
      <CampaignSplit
        panels={[
          {
            src: modelShot("vestido-rafa", ph("look-02")),
            alt: "Vestidos JU RUDOLPH",
            title: "Vestidos",
            cta: { label: "Ver", href: "/mulher/vestidos" },
          },
          {
            src: modelShot("conjunto-leticia", ph("split-mulher")),
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
        title="Ícones"
        products={icons.length ? icons : products.slice(0, 4)}
        viewAllHref="/highlights/icones"
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
