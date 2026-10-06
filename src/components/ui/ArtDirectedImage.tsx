import { getImageProps } from "next/image";

const PORTRAIT = "(orientation: portrait)";

/**
 * A landscape and a portrait cut of the same banner, each optimised by Next and
 * only the one that matches the screen downloaded (Next's art-direction recipe).
 *
 * Banners live or die on the crop: a full-length studio frame cropped to a wide
 * band loses the faces, and the same frame cropped to a phone loses the styling.
 * So each one ships as two files and the browser picks — see `public/media/marca`.
 */
export function ArtDirectedImage({
  desktop,
  mobile,
  alt,
  priority,
}: {
  desktop: string;
  mobile: string;
  alt: string;
  priority?: boolean;
}) {
  const common = { alt, sizes: "100vw", priority };
  const {
    props: { srcSet: mobileSet },
  } = getImageProps({ ...common, src: mobile, width: 1080, height: 1920 });
  const {
    props: { srcSet: desktopSet, ...rest },
  } = getImageProps({ ...common, src: desktop, width: 1920, height: 1080 });
  return (
    <picture>
      <source media={PORTRAIT} srcSet={mobileSet} />
      <source srcSet={desktopSet} />
      <img {...rest} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    </picture>
  );
}
