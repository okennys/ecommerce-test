import Image from "next/image";
import { ArtDirectedImage } from "@/components/ui/ArtDirectedImage";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

export function ContentHero({
  kicker,
  title,
  image,
  imageMobile,
  crumbs,
}: {
  kicker?: string;
  title: string;
  /** Path under /public. The band is very wide on desktop and nearly square on a
   *  phone, so a banner that carries people should ship a mobile cut too. */
  image?: string;
  imageMobile?: string;
  crumbs?: Crumb[];
}) {
  if (!image) {
    return (
      <header className="px-5 pt-12 lg:px-gutter">
        {crumbs && <Breadcrumb items={crumbs} className="mb-6" />}
        {kicker && <p className="label text-ink-muted">{kicker}</p>}
        <h1 className="font-display mt-2 text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight">
          {title}
        </h1>
      </header>
    );
  }

  return (
    <header className="relative flex h-[46vh] min-h-[300px] w-full items-end overflow-hidden bg-surface-dark">
      {imageMobile ? (
        <ArtDirectedImage desktop={image} mobile={imageMobile} alt="" priority />
      ) : (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="relative w-full px-5 pb-10 text-on-dark lg:px-gutter">
        {kicker && <p className="label opacity-90">{kicker}</p>}
        <h1 className="font-display mt-2 max-w-2xl text-[clamp(1.8rem,4vw,3rem)] font-medium leading-tight">
          {title}
        </h1>
      </div>
    </header>
  );
}
