/**
 * Medusa client — NOT wired yet.
 *
 * Milestone 1 renders entirely from local fixtures in `src/lib/data/*`. When the
 * backend team hands over a URL:
 *   1. `npm i @medusajs/js-sdk @medusajs/types`
 *   2. set MEDUSA_BACKEND_URL (+ NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) in .env
 *   3. implement getMedusaClient() below with `new Medusa({ baseUrl, publishableKey })`
 *   4. replace the fixture reads in `src/lib/data/*` with `client.store.*` calls
 *   5. delete `src/types/medusa.ts` and import from `@medusajs/types`
 */

export const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL ?? "";

export function isMedusaConfigured(): boolean {
  return MEDUSA_BACKEND_URL.length > 0;
}

export function getMedusaClient(): never {
  throw new Error(
    "Medusa backend is not connected yet. Milestone 1 uses local fixtures — see src/lib/medusa.ts for the wiring steps.",
  );
}
