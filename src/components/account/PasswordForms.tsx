"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { isEmail } from "@/lib/masks";
import { requestPasswordReset, resetPassword } from "@/lib/account/actions";

const MIN_PASSWORD = 8;

/** Step 1: ask for the e-mail; the backend sends the link through SES. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    setState("sending");
    await requestPasswordReset(email);
    setState("sent");
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">Esqueci minha senha</h1>
      {state === "sent" ? (
        <>
          <p className="mt-4 text-ink-muted">
            Se houver uma conta para <strong className="font-normal text-ink">{email}</strong>, você
            vai receber em instantes um e-mail com o link para criar uma nova senha. O link vale por
            15 minutos.
          </p>
          <Link href="/conta" className="label mt-8 inline-block underline">
            Voltar para entrar
          </Link>
        </>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-6" noValidate>
          <p className="-mt-4 text-ink-muted">Enviaremos um link para você criar uma nova senha.</p>
          <Field
            id="forgot-email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            error={error}
            autoComplete="email"
          />
          <Button type="submit" disabled={state === "sending"} fullWidth>
            {state === "sending" ? "Enviando…" : "Enviar link"}
          </Button>
          <Link href="/conta" className="label link-quiet">
            ← Voltar
          </Link>
        </form>
      )}
    </div>
  );
}

/** Step 2: the page the e-mailed link opens (`/reset-password?token=…`). */
export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (password.length < MIN_PASSWORD) found.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`;
    if (confirm !== password) found.confirm = "As senhas não conferem.";
    setErrors(found);
    if (Object.keys(found).length) return;
    setState("saving");
    const res = await resetPassword({ token, password });
    if (!res.ok) {
      setErrors({ form: res.error });
      setState("idle");
      return;
    }
    setState("done");
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-5 py-20">
        <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">Link inválido</h1>
        <p className="mt-4 text-ink-muted">Peça um novo link para criar sua senha.</p>
        <Link href="/conta/esqueci-senha" className="label mt-8 inline-block underline">
          Esqueci minha senha
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">Nova senha</h1>
      {state === "done" ? (
        <>
          <p className="mt-4 text-ink-muted">Senha alterada. Já pode entrar com a nova senha.</p>
          <Link
            href="/conta"
            className="label mt-8 flex h-[52px] items-center justify-center bg-black px-10 text-on-dark hover:bg-ink"
          >
            Entrar
          </Link>
        </>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-6" noValidate>
          <PasswordField id="reset-password" label="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} autoComplete="new-password" />
          <PasswordField id="reset-confirm" label="Confirmar nova senha" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} autoComplete="new-password" />
          {errors.form && (
            <p role="alert" className="label text-[#8a2b2b]">
              {errors.form}{" "}
              <Link href="/conta/esqueci-senha" className="underline">
                Pedir novo link
              </Link>
            </p>
          )}
          <Button type="submit" disabled={state === "saving"} fullWidth>
            {state === "saving" ? "Salvando…" : "Salvar nova senha"}
          </Button>
        </form>
      )}
    </div>
  );
}
