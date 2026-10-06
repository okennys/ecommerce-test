/**
 * Which product photography the storefront shows.
 *
 * The brand shoots every piece twice: a still-life on the backdrop and the same
 * piece on a model. `scripts/photo-kind.mjs` labels every file at ingest time, so
 * both sets are always in the catalogue — this switch only decides which of them
 * reaches the page.
 *
 *   "all"    stills and model frames, interleaved as the shoot produced them
 *   "still"  only the still-life frames
 *
 * Either way the grid leads with a still (all 92 colourways do), so the catalogue
 * reads as one clean wall of pieces; in "all" the hover and the product page then
 * bring in the model. Flipping this is the whole change — the filter lives in
 * `catalogue.ts`, so every grid, product page, gallery and campaign band follows.
 *
 * The still-only version is kept for the client to come back to: set
 * NEXT_PUBLIC_PHOTO_MODE=still on the host (no deploy needed), or change the
 * default below. It is also tagged `versao-still` in the deploy repo.
 */
export type PhotoMode = "still" | "all";

const fromEnv = process.env.NEXT_PUBLIC_PHOTO_MODE;

export const PHOTO_MODE: PhotoMode = fromEnv === "all" || fromEnv === "still" ? fromEnv : "all";

export const showsModelPhotos = PHOTO_MODE === "all";
