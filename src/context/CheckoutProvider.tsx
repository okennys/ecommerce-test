"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { EMPTY_ADDRESS, type CheckoutAddress } from "@/lib/cart/types";
import { useCart } from "./CartProvider";
import { useAccount } from "./AccountProvider";

/**
 * Form drafts for the checkout steps.
 *
 * What the shopper submits is saved on the Medusa cart (see
 * `@/lib/cart/actions`); this only holds what is being typed, prefilled from
 * the cart so going back a step — or reloading — shows the saved data. Nothing
 * personal is kept in the browser's storage.
 */

export type Address = CheckoutAddress;

export interface Contact {
  email: string;
  newsletter: boolean;
}

interface CheckoutContextValue {
  contact: Contact;
  setContact: (patch: Partial<Contact>) => void;
  cpf: string;
  setCpf: (cpf: string) => void;
  shipping: Address;
  setShipping: (patch: Partial<Address>) => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { cart } = useCart();
  const { customer } = useAccount();
  const [contact, setContactState] = useState<Contact>({ email: "", newsletter: true });
  const [cpf, setCpf] = useState("");
  const [shipping, setShippingState] = useState<Address>(EMPTY_ADDRESS);
  const prefilledFor = useRef<string | null>(null);

  // prefill once per cart from what Medusa already has
  useEffect(() => {
    if (!cart || prefilledFor.current === cart.id) return;
    prefilledFor.current = cart.id;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time prefill from the loaded cart */
    if (cart.email) setContactState({ email: cart.email, newsletter: cart.newsletter });
    if (cart.cpf) setCpf(cart.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"));
    if (cart.address) setShippingState(cart.address);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cart]);

  // logged in: fill what the cart doesn't have yet from the account
  const prefilledCustomer = useRef<string | null>(null);
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time prefill from the account */
    if (!customer) {
      // logged out: nothing of theirs stays filled in for whoever is next
      if (prefilledCustomer.current) {
        prefilledCustomer.current = null;
        prefilledFor.current = null;
        setContactState({ email: "", newsletter: true });
        setCpf("");
        setShippingState(EMPTY_ADDRESS);
      }
      return;
    }
    if (prefilledCustomer.current === customer.id) return;
    prefilledCustomer.current = customer.id;
    setContactState((c) => (c.email ? c : { ...c, email: customer.email }));
    if (customer.cpf) {
      setCpf((v) => v || customer.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"));
    }
    const saved = customer.addresses[0]?.address;
    if (saved) setShippingState((s) => (s.street ? s : saved));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [customer]);

  const setContact = useCallback(
    (patch: Partial<Contact>) => setContactState((c) => ({ ...c, ...patch })),
    [],
  );
  const setShipping = useCallback(
    (patch: Partial<Address>) => setShippingState((s) => ({ ...s, ...patch })),
    [],
  );

  const value = useMemo<CheckoutContextValue>(
    () => ({ contact, setContact, cpf, setCpf, shipping, setShipping }),
    [contact, setContact, cpf, shipping, setShipping],
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within <CheckoutProvider>");
  return ctx;
}
