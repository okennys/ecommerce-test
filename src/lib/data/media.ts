/**
 * Placeholder image helper. Ships curated free-licence women's-fashion stills
 * (Unsplash) downloaded into `public/media/ph/*.jpg` — see `CREDITS.md` there —
 * so the storefront has no runtime third-party image dependency.
 *
 * SWAP POINT: replace every `ph("name")` with a real JU RUDOLPH asset path
 * (public/ file or a CDN/Medusa URL). Trailing size args are accepted for
 * call-site intent but ignored — every consumer renders with `fill`.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- size args kept for call-site intent; ignored (all consumers use `fill`)
export function ph(seed: string, ..._size: number[]): string {
  return `/media/ph/${seed}.jpg`;
}
