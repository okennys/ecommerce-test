# public/media

Drop brand assets here.

- `hero.mp4` + `hero-poster.jpg` — homepage hero film. Once present, give the
  first `<ScrollPanel>` in `src/app/page.tsx` a `media={{ type: "video", src,
  poster, alt }}` instead of the image (see the SWAP POINT note in
  `src/components/home/ScrollStack.tsx`).
- `ph/*.jpg` — interim campaign / editorial / product stills. Currently curated
  free-licence photos from Unsplash (women's fashion); see `ph/CREDITS.md`.
  Replace file-for-file with JU RUDOLPH shots, keeping the same names, and no
  code changes are needed.
