/**
 * Which product photography the storefront shows.
 *
 * The brand shoots every piece twice: a still-life on the pale backdrop and the
 * same piece on a model. `scripts/photo-kind.mjs` labels every file at ingest
 * time, so both sets are always in the catalogue — this switch only decides
 * which of them reaches the page.
 *
 *   "still"  only the still-life frames (what the client approved)
 *   "all"    stills and model frames, interleaved as the shoot produced them
 *
 * Flipping this is the whole change: the filter lives in `catalogue.ts`, so
 * every grid, product page, gallery and campaign band follows it. The env var
 * is there so the mode can be changed on the host without a deploy.
 */
export type PhotoMode = "still" | "all";

const fromEnv = process.env.NEXT_PUBLIC_PHOTO_MODE;

export const PHOTO_MODE: PhotoMode = fromEnv === "all" || fromEnv === "still" ? fromEnv : "still";

export const showsModelPhotos = PHOTO_MODE === "all";
