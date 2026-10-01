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
import type { CustomerView } from "@/lib/account/types";
import { getSession, signOut as signOutAction } from "@/lib/account/actions";
import { useCart } from "./CartProvider";

/**
 * Who is logged in. Loaded on mount (like the cart) so pages stay static; the
 * session itself is an httpOnly cookie handled by `@/lib/account/actions`.
 */

interface AccountContextValue {
  customer: CustomerView | null;
  /** false until the session check settles */
  ready: boolean;
  setCustomer: (customer: CustomerView | null) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { refresh: refreshCart } = useCart();
  const [customer, setCustomer] = useState<CustomerView | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const res = await getSession();
    setCustomer(res.ok ? res.data : null);
    setReady(true);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial session check
    void refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await signOutAction();
    setCustomer(null);
    // the bag is dropped on logout, so the header count has to follow
    await refreshCart();
  }, [refreshCart]);

  const value = useMemo<AccountContextValue>(
    () => ({ customer, ready, setCustomer, refresh, signOut }),
    [customer, ready, refresh, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within <AccountProvider>");
  return ctx;
}
