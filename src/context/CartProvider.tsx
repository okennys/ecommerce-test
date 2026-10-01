"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StoreCartLineItem } from "@/types/medusa";
import type { ActionResult, CartSnapshot } from "@/lib/cart/types";
import {
  addToCart,
  getCart,
  removeLineItem,
  updateLineItem,
} from "@/lib/cart/actions";

/**
 * The shopper's bag, backed by a Medusa cart.
 *
 * The cart id lives in an httpOnly cookie and every change goes through the
 * server actions in `@/lib/cart/actions`; this provider only mirrors the last
 * snapshot Medusa returned. It loads on mount rather than in a layout, so the
 * catalogue pages stay statically rendered.
 */

export interface AddItemInput {
  variantId: string;
  quantity?: number;
  /** photo of the colour that was picked, shown in the bag */
  thumbnail?: string;
  /** "Colour · Size", shown under the product name */
  label?: string;
}

export interface CartContextValue {
  cart: CartSnapshot | null;
  /** false until the first fetch from Medusa settles */
  ready: boolean;
  /** a change is on its way to Medusa */
  pending: boolean;
  error: string | null;
  dismissError: () => void;
  items: StoreCartLineItem[];
  count: number;
  subtotal: number;
  currency: string;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  /** resolves to an error message, or null when the piece is in the bag */
  addItem: (input: AddItemInput) => Promise<string | null>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  /** for the checkout, whose actions return the updated cart too */
  setCart: (cart: CartSnapshot | null) => void;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// the bag used to live in localStorage; clear what the old build left behind
const LEGACY_KEYS = ["jr.cart.v1", "jr.checkout.v1", "jr.checkout.v1.order"];

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSnapshot | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const refresh = useCallback(async () => {
    const res = await getCart();
    if (res.ok) setCart(res.data);
    else setError(res.error);
    setReady(true);
  }, []);

  useEffect(() => {
    try {
      for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of the server-side cart
    void refresh();
  }, [refresh]);

  /** Runs a cart action, keeping `pending`/`error` and the snapshot in sync. */
  const mutate = useCallback(
    async (action: () => Promise<ActionResult<CartSnapshot>>): Promise<string | null> => {
      setPending(true);
      setError(null);
      try {
        const res = await action();
        if (res.ok) {
          setCart(res.data);
          return null;
        }
        setError(res.error);
        // the cart may have expired or changed underneath us — resync
        await refresh();
        return res.error;
      } catch {
        const offline = "Sem conexão com a loja. Verifique a internet e tente de novo.";
        setError(offline);
        return offline;
      } finally {
        setPending(false);
      }
    },
    [refresh],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const dismissError = useCallback(() => setError(null), []);

  const addItem = useCallback(
    async (input: AddItemInput) => {
      const failure = await mutate(() => addToCart(input));
      if (!failure) setIsOpen(true);
      return failure;
    },
    [mutate],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      await mutate(() => updateLineItem(id, quantity));
    },
    [mutate],
  );

  const removeItem = useCallback(
    async (id: string) => {
      await mutate(() => removeLineItem(id));
    },
    [mutate],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      ready,
      pending,
      error,
      dismissError,
      items: cart?.items ?? [],
      count: cart?.count ?? 0,
      subtotal: cart?.itemSubtotal ?? 0,
      currency: cart?.currency ?? "BRL",
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      setCart,
      refresh,
    }),
    [
      cart,
      ready,
      pending,
      error,
      dismissError,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      refresh,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
