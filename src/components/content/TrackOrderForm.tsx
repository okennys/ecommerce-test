"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Field } from "@/components/ui/Field";
import { isEmail } from "@/lib/masks";
import { CheckIcon } from "@/components/ui/icons";

const STEPS = [
  { label: "Pedido confirmado", done: true },
  { label: "Em separação no ateliê", done: true },
  { label: "Despachado", done: true },
  { label: "Em trânsito", done: false },
  { label: "Entregue", done: false },
];

export function TrackOrderForm() {
  const [order, setOrder] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ order?: string; email?: string }>({});
  const [result, setResult] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^JR-?\d{4,}/i.test(order.trim())) next.order = "Formato: JR-123456.";
    if (!isEmail(email)) next.email = "Informe o e-mail do pedido.";
    setErrors(next);
    if (Object.keys(next).length === 0) setResult(order.trim().toUpperCase());
  }

  return (
    <div>
      <form onSubmit={submit} className="max-w-md space-y-6">
        <Field
          label="Número do pedido"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          error={errors.order}
          placeholder="JR-123456"
        />
        <Field
          label="E-mail da compra"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="voce@email.com"
        />
        <button type="submit" className="label h-[52px] w-full bg-black px-8 text-on-dark hover:bg-ink">
          Rastrear
        </button>
      </form>

      {result && (
        <div className="mt-12 border-t border-line pt-8">
          <p className="label">
            Pedido <span className="text-ink-muted">{result}</span> — previsão de entrega em 2 dias
            úteis.
          </p>
          <ol className="mt-6 space-y-4">
            {STEPS.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center border",
                    s.done ? "border-ink bg-ink text-on-dark" : "border-line-strong text-transparent",
                  )}
                >
                  <CheckIcon size={11} />
                </span>
                <span className={cn("label", s.done ? "text-ink" : "text-ink-muted")}>{s.label}</span>
              </li>
            ))}
          </ol>
          <p className="label mt-6 text-ink-muted">
            Demonstração — dados fictícios. O rastreio real vem da transportadora na etapa 2.
          </p>
        </div>
      )}
    </div>
  );
}
