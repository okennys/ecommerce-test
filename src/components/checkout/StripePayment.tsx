"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { formatPrice } from "@/lib/format";
import { placeOrder } from "@/lib/cart/actions";
import type { CheckoutAddress } from "@/lib/cart/types";
import { LockIcon } from "@/components/ui/icons";

/**
 * Card payment through Stripe's Payment Element.
 *
 * Medusa's Stripe provider creates the PaymentIntent (see `startPayment`); the
 * card data goes from this iframe straight to Stripe and never touches our
 * server. After Stripe confirms, `placeOrder` completes the Medusa cart.
 *
 * The PaymentIntent has automatic payment methods on, so whatever is enabled in
 * the Stripe dashboard for BRL shows up here: today card and PIX. PIX opens
 * Stripe's QR-code modal inside `confirmPayment` and resolves once it is paid.
 */

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
export const STRIPE_TEST_MODE = STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_");

const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY, { locale: "pt-BR" })
  : null;

const appearance: Appearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#000000",
    colorText: "#191919",
    colorTextSecondary: "#76736f",
    colorBackground: "#ffffff",
    colorDanger: "#8a2b2b",
    fontFamily: '"Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    fontSizeBase: "14px",
    borderRadius: "0px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "1px solid #19191947", boxShadow: "none" },
    ".Input:focus": { border: "1px solid #191919", boxShadow: "none" },
    ".Label": { fontSize: "12px", letterSpacing: "0.09em", textTransform: "uppercase" },
  },
};

export interface Payer {
  email: string;
  address: CheckoutAddress;
}

export function StripePayment(props: {
  clientSecret: string;
  total: number;
  currency: string;
  payer: Payer;
}) {
  if (!stripePromise) return null;
  return (
    <Elements
      key={props.clientSecret}
      stripe={stripePromise}
      options={{ clientSecret: props.clientSecret, appearance, locale: "pt-BR" }}
    >
      <PayForm {...props} />
    </Elements>
  );
}

function PayForm({ total, currency, payer }: { total: number; currency: string; payer: Payer }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [elementReady, setElementReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    if (!stripe || !elements) return;
    if (!accepted) {
      setError("É preciso aceitar os termos para concluir.");
      return;
    }
    setPaying(true);
    setError(null);

    const submitted = await elements.submit();
    if (submitted.error) {
      setError(submitted.error.message ?? "Confira os dados do pagamento.");
      setPaying(false);
      return;
    }

    const a = payer.address;
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      // cards finish here; redirect-based methods come back to the confirmation page
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/checkout/confirmacao?retorno=1`,
        payment_method_data: {
          billing_details: {
            name: `${a.firstName} ${a.lastName}`.trim(),
            email: payer.email,
            phone: a.phone.replace(/\D/g, ""),
            address: {
              line1: `${a.street}, ${a.number}`,
              line2: [a.complement, a.district].filter(Boolean).join(" — "),
              city: a.city,
              state: a.state,
              postal_code: a.cep.replace(/\D/g, ""),
              country: "BR",
            },
          },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? "O pagamento não foi aprovado.");
      setPaying(false);
      return;
    }

    if (paymentIntent && !["succeeded", "requires_capture", "processing"].includes(paymentIntent.status)) {
      // PIX: Stripe shows the QR code in a modal and resolves when it is paid —
      // or still "requires_action" if the shopper closed it without paying
      const pix = paymentIntent.payment_method_types?.includes("pix") && paymentIntent.status === "requires_action";
      setError(
        pix
          ? "O PIX ainda não foi pago. Clique em “Finalizar compra” para ver o QR Code de novo."
          : "O pagamento ainda não foi concluído. Tente novamente.",
      );
      setPaying(false);
      return;
    }

    const order = await placeOrder();
    if (!order.ok) {
      setError(
        `${order.error} Se o valor já aparece no seu cartão, não pague de novo — fale com a gente pelo atendimento.`,
      );
      setPaying(false);
      return;
    }
    router.replace(`/checkout/confirmacao?pedido=${order.data.orderId}`);
  }

  return (
    <div>
      <PaymentElement
        onReady={() => setElementReady(true)}
        options={{
          layout: "tabs",
          // name/e-mail/address were collected in the earlier steps and are
          // sent with the confirmation, so the form only asks for the card
          fields: {
            billingDetails: { name: "never", email: "never", phone: "never", address: "never" },
          },
        }}
      />
      {!elementReady && (
        <p className="label text-ink-muted" aria-busy="true">
          Carregando o formulário de pagamento…
        </p>
      )}

      {STRIPE_TEST_MODE && (
        <p className="label mt-4 border border-line p-3 text-ink-muted">
          Ambiente de teste do Stripe: no cartão, use 4242 4242 4242 4242, qualquer validade futura
          e qualquer CVC. No PIX, clique em “Simular digitalização” no QR Code e depois em “Authorize
          test payment”. Nenhuma cobrança real é feita.
        </p>
      )}

      <label className="label mt-6 flex items-start gap-2.5 text-ink-muted">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => {
            setAccepted(e.target.checked);
            setError(null);
          }}
          className="mt-0.5 h-4 w-4 accent-black"
        />
        <span>
          Li e aceito os{" "}
          <a href="/legal/termos" target="_blank" className="underline">
            Termos de uso
          </a>{" "}
          e a{" "}
          <a href="/legal/privacidade" target="_blank" className="underline">
            Política de privacidade
          </a>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="label mt-3 text-[#8a2b2b]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={pay}
        disabled={!stripe || !elementReady || paying}
        className="label mt-8 flex h-[52px] w-full items-center justify-center gap-2 bg-black px-8 text-on-dark hover:bg-ink disabled:opacity-60 sm:w-auto sm:min-w-[300px]"
      >
        <LockIcon size={13} />
        {paying ? "Processando pagamento…" : `Finalizar compra · ${formatPrice(total, currency)}`}
      </button>
    </div>
  );
}
