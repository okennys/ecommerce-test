import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { t } from "@/lib/dictionary";
import { TextCta } from "@/components/ui/TextCta";
import { ChevronDownIcon } from "@/components/ui/icons";

/**
 * Stacked-scroll hero, matching `reference/VIDEO REF 2 .mp4` (ysl.com/pt-br home).
 *
 * Mechanism — pure CSS, no scroll library:
 *   each <ScrollPanel> is `position: sticky; top: 0; height: 100svh`. As you
 *   scroll, the current panel stays pinned while the NEXT panel scrolls up and
 *   covers it (later DOM = painted on top). Hard edge, no cross-fade. After the
 *   last panel the page releases into normal flow.
 *
 * `data-hero` lives on the wrapper so <SiteHeader> measures the whole stack and
 * stays light/transparent until the reader reaches the content below.
 */

export function ScrollStack({ children }: { children: ReactNode }) {
  // `isolate` keeps the sticky panels' stacking context to this subtree.
  // `-mt-header` pulls the first panel up under the transparent fixed header
  // (the site <main> adds `pt-header` for every other page).
  return (
    <div data-hero className="isolate -mt-header">
      {children}
    </div>
  );
}

type Media =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

interface ScrollPanelProps {
  media: Media;
  kicker: string;
  cta: { label: string; href: string };
  /** panel 1: render the animated wordmark instead of a plain caption */
  wordmark?: boolean;
  /** optional serif line under the kicker (reference keeps most panels caption-only) */
  title?: string;
  tone?: "dark" | "light";
  priority?: boolean;
}

export function ScrollPanel({
  media,
  kicker,
  cta,
  wordmark = false,
  title,
  tone = "dark",
  priority,
}: ScrollPanelProps) {
  return (
    <section className="sticky top-0 h-svh w-full overflow-hidden bg-surface-dark">
      {media.type === "image" ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          src={media.src}
          poster={media.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={media.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* legibility scrim — keeps the caption/wordmark readable over any still */}
      {tone === "dark" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/20"
        />
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-[12vh] flex flex-col items-center gap-5 px-6 text-center",
          tone === "dark" ? "text-on-dark" : "text-ink",
        )}
      >
        {wordmark ? (
          <>
            <p className="label opacity-80">{kicker}</p>
            <h1 className="hero-wordmark font-display font-medium uppercase leading-[0.95] tracking-wordmark text-[clamp(2.5rem,9vw,7rem)]">
              {t.home.heroTitle}
            </h1>
          </>
        ) : (
          <>
            <p className="label opacity-90">{kicker}</p>
            {title && (
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium leading-tight">
                {title}
              </h2>
            )}
          </>
        )}

        <TextCta href={cta.href} className={tone === "dark" ? "text-on-dark" : "text-ink"}>
          {cta.label}
        </TextCta>

        <ChevronDownIcon
          size={20}
          className={cn("hero-chevron", tone === "dark" ? "text-on-dark-muted" : "text-ink-muted")}
        />
      </div>
    </section>
  );
}
