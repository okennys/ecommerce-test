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

/**
 * Mock checkout state — enough to walk the full multi-step flow for the
 * approval build. No network, no payment.
 *
 * SWAP POINT: back this with Medusa (`store.cart.*` + a payment provider)
 * in etapa 2. Keep the context surface so the step pages don't change.
 */

const STORAGE_KEY = "jr.checkout.v1";

export interface Contact {
  email: string;
  newsletter: boolean;
}

export interface Address {
  firstName: string;
  lastName: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  phone: string;
}

export type ShippingMethodId = "padrao" | "expressa" | "retirada";

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  eta: string;
  amount: number;
}

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: "padrao", label: "Entrega padrão", eta: "3 a 7 dias úteis", amount: 3500 },
  { id: "expressa", label: "Entrega expressa", eta: "1 a 2 dias úteis", amount: 8900 },
  { id: "retirada", label: "Retirada na loja", eta: "Pronto em 24h", amount: 0 },
];

export type PaymentKind = "cartao" | "pix" | "boleto";

export interface Payment {
  kind: PaymentKind;
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  installments: number;
}

export interface PlacedOrder {
  number: string;
  placedAt: string;
  email: string;
  items: StoreCartLineItem[];
  shippingLabel: string;
  shippingAmount: number;
  itemTotal: number;
  currency: string;
  city: string;
  state: string;
}

interface CheckoutState {
  contact: Contact;
  shipping: Address;
  method: ShippingMethodId;
  payment: Payment;
}

const emptyAddress: Address = {
  firstName: "",
  lastName: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  phone: "",
};

const initialState: CheckoutState = {
  contact: { email: "", newsletter: true },
  shipping: emptyAddress,
  method: "padrao",
  payment: {
    kind: "cartao",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    installments: 1,
  },
};

interface CheckoutContextValue extends CheckoutState {
  setContact: (patch: Partial<Contact>) => void;
  setShipping: (patch: Partial<Address>) => void;
  setMethod: (id: ShippingMethodId) => void;
  setPayment: (patch: Partial<Payment>) => void;
  shippingMethod: ShippingMethod;
  lastOrder: PlacedOrder | null;
  placeOrder: (order: Omit<PlacedOrder, "number" | "placedAt">) => PlacedOrder;
  reset: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

function readStorage(): Partial<CheckoutState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Partial<CheckoutState>) : {};
  } catch {
    return {};
  }
}

function orderNumber(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `JR-${n}`;
}

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckoutState>(initialState);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    const stored = readStorage();
    setState((prev) => ({ ...prev, ...stored }));
    try {
      const rawOrder = window.localStorage.getItem(`${STORAGE_KEY}.order`);
      if (rawOrder) setLastOrder(JSON.parse(rawOrder) as PlacedOrder);
    } catch {
      /* ignore */
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const setContact = useCallback(
    (patch: Partial<Contact>) => setState((s) => ({ ...s, contact: { ...s.contact, ...patch } })),
    [],
  );
  const setShipping = useCallback(
    (patch: Partial<Address>) => setState((s) => ({ ...s, shipping: { ...s.shipping, ...patch } })),
    [],
  );
  const setMethod = useCallback((id: ShippingMethodId) => setState((s) => ({ ...s, method: id })), []);
  const setPayment = useCallback(
    (patch: Partial<Payment>) => setState((s) => ({ ...s, payment: { ...s.payment, ...patch } })),
    [],
  );

  const placeOrder = useCallback<CheckoutContextValue["placeOrder"]>((order) => {
    const placed: PlacedOrder = {
      ...order,
      number: orderNumber(),
      placedAt: new Date().toISOString(),
    };
    setLastOrder(placed);
    try {
      window.localStorage.setItem(`${STORAGE_KEY}.order`, JSON.stringify(placed));
    } catch {
      /* ignore */
    }
    return placed;
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<CheckoutContextValue>(() => {
    const shippingMethod =
      SHIPPING_METHODS.find((m) => m.id === state.method) ?? SHIPPING_METHODS[0];
    return {
      ...state,
      setContact,
      setShipping,
      setMethod,
      setPayment,
      shippingMethod,
      lastOrder,
      placeOrder,
      reset,
    };
  }, [state, lastOrder, setContact, setShipping, setMethod, setPayment, placeOrder, reset]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within <CheckoutProvider>");
  return ctx;
}
