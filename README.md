# JU RUDOLPH — storefront

High-end fashion e-commerce **frontend**. Backend (Medusa JS + Stripe/Bling) is
built separately and connected later. Design reference: `ysl.com/pt-br`
(analysis frames in `reference/`).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind v4** — tokens in `src/app/globals.css` (`@theme`)
- Local **fixture data** shaped like the Medusa v2 Store API (`src/lib/data/*`,
  `src/types/medusa.ts`)
- Deploy target: **AWS Amplify Hosting** (Next.js SSR) — see `docs/deploy-amplify.md`

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (Turbopack) — run before pushing
npm run lint
```

## Milestone 1 scope

Design system + app shell + homepage:

- `SiteHeader` — transparent over the hero, solid on scroll; desktop mega-menu,
  mobile full-screen nav, slide-down search
- `SiteFooter` — link columns, newsletter (client validation), socials, region
- `CartDrawer` — right slide-over, `localStorage`-backed `CartProvider`
- `RegionModal` — country/language picker
- Homepage — dark wordmark-reveal hero + editorial blocks + product rails

Not built yet: PLP, PDP, checkout, account, editorial/content pages. Links to
those paths render the branded `not-found` page for now.

## Structure

```
src/
  app/            layout, page (home), globals.css, not-found
  components/
    layout/       SiteHeader, MegaMenu, MobileNav, SearchPanel, SiteFooter,
                  NewsletterForm, RegionTrigger, RegionModal, CartDrawer
    home/         HeroFilm, EditorialBlock, ProductRail, CampaignSplit
    ui/           Logo, Button, TextCta, Reveal, icons
  context/        CartProvider, UIProvider
  lib/
    data/         navigation, products, collections, regions, media
    dictionary.ts pt-BR copy (single source)
    medusa.ts     client stub + wiring instructions
    format.ts, cn.ts, useScrollLock.ts
  types/medusa.ts minimal Store API type subset
```

## Swap points (grep `SWAP POINT`)

| What | Where |
|---|---|
| Placeholder wordmark → real logo | `src/components/ui/Logo.tsx` |
| Bodoni Moda → brand typefaces | `src/app/layout.tsx`, `globals.css` |
| Grayscale picsum → real imagery | `src/lib/data/media.ts` + call sites |
| Hero film | `public/media/` + `src/components/home/HeroFilm.tsx` |
| Fixtures → live Medusa | `src/lib/medusa.ts`, `src/lib/data/*`, `src/types/medusa.ts` |
| `typedRoutes` re-enable | `next.config.ts` (after routes exist) |
