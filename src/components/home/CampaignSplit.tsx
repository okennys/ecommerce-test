import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { TextCta } from "@/components/ui/TextCta";

interface Panel {
  src: string;
  alt: string;
  title: string;
  cta: { label: string; href: string };
}

/**
 * Two-up campaign band. Panels are 2:3 to match the model frames the shoot
 * produces — `modelShot()` on the homepage feeds it photos of that ratio, so
 * the figure is shown whole instead of being cropped at the neck.
 */
export function CampaignSplit({ panels }: { panels: [Panel, Panel] }) {
  return (
    <section className="grid gap-px bg-line md:grid-cols-2">
      {panels.map((panel) => (
        <Reveal key={panel.title} className="relative aspect-[2/3] overflow-hidden bg-paper">
          <Image src={panel.src} alt={panel.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          {/* the catalogue shoots on pale backdrops — the caption needs its own ground */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
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
