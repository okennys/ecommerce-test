import { ScrollStack, ScrollPanel } from "@/components/home/ScrollStack";
import { EditorialBlock } from "@/components/home/EditorialBlock";
import { ProductRail } from "@/components/home/ProductRail";
import { CampaignSplit } from "@/components/home/CampaignSplit";
import { ph } from "@/lib/data/media";
import { t } from "@/lib/dictionary";
import { products, getProductsByCollection } from "@/lib/data/products";

export default function HomePage() {
  const season = getProductsByCollection("outono-inverno-26").slice(0, 4);
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
          media={{ type: "image", src: ph("editorial-season"), alt: "Campanha Outono Inverno 26" }}
          kicker={t.home.heroKicker}
          cta={{ label: t.home.heroCta, href: "/mulher/outono-inverno-26" }}
        />
        <ScrollPanel
          media={{ type: "image", src: ph("editorial-colecao"), alt: "Coleção Outono Inverno 26" }}
          kicker="Outono Inverno 26 · A coleção"
          cta={{ label: "Descobrir", href: "/mulher/outono-inverno-26" }}
        />
        <ScrollPanel
          media={{ type: "image", src: ph("editorial-bolsas"), alt: "As bolsas da estação" }}
          kicker="As bolsas"
          cta={{ label: "Ver as bolsas", href: "/mulher/bolsas" }}
        />
      </ScrollStack>

      {/* release into normal flow */}
      <CampaignSplit
        panels={[
          {
            src: ph("bag-01"),
            alt: "Bolsas",
            title: "Bolsas",
            cta: { label: "Ver", href: "/mulher/bolsas" },
          },
          {
            src: ph("split-mulher"),
            alt: "Ready to wear",
            title: "Ready to wear",
            cta: { label: "Descobrir", href: "/mulher/roupas" },
          },
        ]}
      />

      <ProductRail
        title="Selecionados da estação"
        products={season.length ? season : products.slice(0, 4)}
        viewAllHref="/mulher/novidades"
      />

      <EditorialBlock
        src={ph("editorial-film")}
        alt="Editorial da estação"
        kicker="Editorial"
        title="Os gestos da alfaiataria"
        cta={{ label: "Ver o editorial", href: "/editorial" }}
        size="tall"
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
