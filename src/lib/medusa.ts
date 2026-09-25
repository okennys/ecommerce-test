import Medusa from "@medusajs/js-sdk";

/**
 * Medusa Store API client.
 *
 * The backend is the source of truth for the catalogue (see
 * `scripts/seed-medusa.mjs` for how it gets there). Everything below runs on the
 * server — `MEDUSA_BACKEND_URL` is not a `NEXT_PUBLIC_` var, so the browser
 * never talks to Medusa directly for catalogue reads.
 */

export const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL ?? process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "";

export const MEDUSA_PUBLISHABLE_KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

/** Region whose prices and currency the storefront shows. */
export const MEDUSA_REGION_ID = process.env.MEDUSA_REGION_ID ?? "";

export function isMedusaConfigured(): boolean {
  return Boolean(MEDUSA_BACKEND_URL && MEDUSA_PUBLISHABLE_KEY);
}

let client: Medusa | null = null;

export function getMedusaClient(): Medusa {
  if (!isMedusaConfigured()) {
    throw new Error(
      "Medusa não está configurado. Defina MEDUSA_BACKEND_URL e MEDUSA_PUBLISHABLE_KEY em .env.local (veja .env.example).",
    );
  }
  client ??= new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    publishableKey: MEDUSA_PUBLISHABLE_KEY,
  });
  return client;
}
