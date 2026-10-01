import "server-only";
import { cookies } from "next/headers";

/**
 * The two cookies a visitor carries, both httpOnly so page scripts never see
 * them: the open cart's id and, once logged in, the customer's Medusa token.
 */

const CART_COOKIE = "jr_cart";
const AUTH_COOKIE = "jr_auth";
const CART_MAX_AGE = 60 * 60 * 24 * 30;

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// --- cart --------------------------------------------------------------------

export async function readCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

export async function writeCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, { ...base, maxAge: CART_MAX_AGE });
}

export async function forgetCart() {
  (await cookies()).delete(CART_COOKIE);
}

// --- customer session --------------------------------------------------------

/** Seconds until the JWT expires, read from its payload (Medusa issues 24h). */
function secondsLeft(token: string): number {
  try {
    const { exp } = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return Math.max(0, Math.floor(exp - Date.now() / 1000));
  } catch {
    return 60 * 60 * 24;
  }
}

export async function readAuthToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

export async function writeAuthToken(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, { ...base, maxAge: secondsLeft(token) });
}

export async function forgetAuth() {
  (await cookies()).delete(AUTH_COOKIE);
}

/** Authorization header for the logged-in customer, or nothing for a guest. */
export async function authHeaders(): Promise<Record<string, string>> {
  const token = await readAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
