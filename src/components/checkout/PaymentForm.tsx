"use client";

import { cn } from "@/lib/cn";
import { Field, Select } from "@/components/ui/Field";
import { maskCard, maskCvv, maskExpiry } from "@/lib/masks";
import { LockIcon } from "@/components/ui/icons";
import { useCheckout, type PaymentKind } from "@/context/CheckoutProvider";

const KINDS: { id: PaymentKind; label: string }[] = [
  { id: "cartao", label: "Cartão de crédito" },
  { id: "pix", label: "PIX" },
  { id: "boleto", label: "Boleto" },
];

export function PaymentForm({ errors }: { errors: Record<string, string> }) {
  const { payment, setPayment } = useCheckout();

  return (
    <div>
      <div className="flex gap-2">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            aria-pressed={payment.kind === k.id}
            onClick={() => setPayment({ kind: k.id })}
            className={cn(
              "label border px-4 py-2.5 transition-colors",
              payment.kind === k.id ? "border-ink bg-ink text-on-dark" : "border-line-strong hover:border-ink",
            )}
          >
            {k.label}
          </button>
        ))}
      </div>

      <p className="label mt-4 inline-flex items-center gap-2 text-ink-muted">
        <LockIcon size={13} />
        Pagamento simulado — nenhum dado é enviado ou cobrado.
      </p>

      {payment.kind === "cartao" && (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6">
          <Field
            className="col-span-2"
            label="Número do cartão"
            value={payment.cardNumber}
            onChange={(e) => setPayment({ cardNumber: maskCard(e.target.value) })}
            error={errors.cardNumber}
            inputMode="numeric"
            placeholder="0000 0000 0000 0000"
            autoComplete="cc-number"
          />
          <Field
            className="col-span-2"
            label="Nome impresso no cartão"
            value={payment.cardName}
            onChange={(e) => setPayment({ cardName: e.target.value })}
            error={errors.cardName}
            autoComplete="cc-name"
          />
          <Field
            label="Validade"
            value={payment.cardExpiry}
            onChange={(e) => setPayment({ cardExpiry: maskExpiry(e.target.value) })}
            error={errors.cardExpiry}
            inputMode="numeric"
            placeholder="MM/AA"
            autoComplete="cc-exp"
          />
          <Field
            label="CVV"
            value={payment.cardCvv}
            onChange={(e) => setPayment({ cardCvv: maskCvv(e.target.value) })}
            error={errors.cardCvv}
            inputMode="numeric"
            placeholder="123"
            autoComplete="cc-csc"
          />
          <Select
            className="col-span-2"
            label="Parcelas"
            value={String(payment.installments)}
            onChange={(e) => setPayment({ installments: Number(e.target.value) })}
          >
            {[1, 2, 3, 4, 6, 10].map((n) => (
              <option key={n} value={n}>
                {n}x sem juros
              </option>
            ))}
          </Select>
        </div>
      )}

      {payment.kind === "pix" && (
        <div className="mt-8 border border-line bg-paper-raised p-6">
          <p className="label">Ao confirmar, um QR Code PIX seria gerado aqui.</p>
          <p className="label mt-2 text-ink-muted">
            Aprovação imediata. Neste ambiente de demonstração, o pedido é confirmado direto.
          </p>
        </div>
      )}

      {payment.kind === "boleto" && (
        <div className="mt-8 border border-line bg-paper-raised p-6">
          <p className="label">O boleto seria exibido para impressão após a confirmação.</p>
          <p className="label mt-2 text-ink-muted">Prazo de compensação: até 3 dias úteis.</p>
        </div>
      )}
    </div>
  );
}
