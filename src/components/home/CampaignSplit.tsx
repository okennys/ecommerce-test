import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TextCta } from "@/components/ui/TextCta";

interface Panel {
  src: string;
  alt: string;
  title: string;
  cta: { label: string; href: string };
}

/** Two-up editorial band, as in the reference ("BOLSAS · VER" / "..."). */
export function CampaignSplit({ panels }: { panels: [Panel, Panel] }) {
  return (
    <section className="grid gap-px bg-line md:grid-cols-2">
      {panels.map((panel) => (
        <Reveal key={panel.title} className="relative aspect-[4/5] overflow-hidden bg-paper md:aspect-[4/5]">
          <Image src={panel.src} alt={panel.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-8 text-center text-on-dark">
            <h2 className="label-lg">{panel.title}</h2>
            <TextCta href={panel.cta.href} className="text-on-dark">
              {panel.cta.label}
            </TextCta>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
