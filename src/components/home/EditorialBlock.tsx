import Image from "next/image";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { TextCta } from "@/components/ui/TextCta";

export interface EditorialBlockProps {
  id?: string;
  src: string;
  alt: string;
  kicker?: string;
  title: string;
  cta: { label: string; href: string };
  /** viewport-height block vs a shorter 4:5-ish band */
  size?: "screen" | "tall";
  align?: "center" | "left";
  tone?: "light" | "dark";
  priority?: boolean;
}

export function EditorialBlock({
  id,
  src,
  alt,
  kicker,
  title,
  cta,
  size = "screen",
  align = "center",
  tone = "light",
  priority,
}: EditorialBlockProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden",
        size === "screen" ? "h-[100svh] min-h-[560px]" : "aspect-[3/4] md:aspect-[16/10]",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
      />

      <Reveal
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 md:p-14",
          align === "center" ? "items-center text-center" : "items-start text-left",
          tone === "dark" ? "text-on-dark" : "text-ink",
        )}
      >
        {kicker && <p className="label opacity-90">{kicker}</p>}
        <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-tight">
          {title}
        </h2>
        <TextCta href={cta.href} className={tone === "dark" ? "text-on-dark" : "text-ink"}>
          {cta.label}
        </TextCta>
      </Reveal>
    </section>
  );
}
