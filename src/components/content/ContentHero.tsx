import Image from "next/image";
import { ph } from "@/lib/data/media";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";

export function ContentHero({
  kicker,
  title,
  image,
  crumbs,
}: {
  kicker?: string;
  title: string;
  image?: string;
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
      <Image src={ph(image)} alt="" fill priority sizes="100vw" className="object-cover" />
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
