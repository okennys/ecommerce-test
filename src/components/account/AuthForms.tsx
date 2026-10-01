"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { PasswordField } from "@/components/ui/PasswordField";
import { isEmail, maskPhone } from "@/lib/masks";
import { signIn, signUp } from "@/lib/account/actions";
import type { CustomerView } from "@/lib/account/types";
import { useAccount } from "@/context/AccountProvider";
import { useCart } from "@/context/CartProvider";

const MIN_PASSWORD = 8;

/** "Entrar" and "Criar conta", side by side as in the reference. */
export function AuthForms({ redirect }: { redirect?: string }) {
  const router = useRouter();
  const { setCustomer } = useAccount();
  const { refresh: refreshCart } = useCart();

  // after either form: the guest bag now belongs to the account
  async function done(customer: CustomerView) {
    setCustomer(customer);
    await refreshCart();
    if (redirect) router.push(redirect);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-16 px-5 py-14 lg:grid-cols-2 lg:gap-24 lg:px-8 lg:py-20">
      <LoginForm onDone={done} />
      <RegisterForm onDone={done} />
    </div>
  );
}

function LoginForm({ onDone }: { onDone: (c: CustomerView) => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!isEmail(email) || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await signIn({ email, password });
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
      return;
    }
    await onDone(res.data);
  }

  return (
    <section>
      <h1 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">Entrar</h1>
      <p className="mt-2 text-ink-muted">Acesse seus pedidos, dados e endereços.</p>
      <form onSubmit={submit} className="mt-8 grid gap-6" noValidate>
        <Field
          id="login-email"
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <PasswordField
          id="login-password"
          label="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <Link href="/conta/esqueci-senha" className="label link-quiet -mt-2 justify-self-start underline">
          Esqueci minha senha
        </Link>
        {error && (
          <p role="alert" className="label text-[#8a2b2b]">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} fullWidth>
          {busy ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </section>
  );
}

function RegisterForm({ onDone }: { onDone: (c: CustomerView) => Promise<void> }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    newsletter: true,
    accepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((x) => ({ ...x, [k]: "", form: "" }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!form.firstName.trim()) found.firstName = "Informe o nome.";
    if (!form.lastName.trim()) found.lastName = "Informe o sobrenome.";
    if (!isEmail(form.email)) found.email = "Informe um e-mail válido.";
    if (form.phone.replace(/\D/g, "").length < 10) found.phone = "Telefone incompleto.";
    if (form.password.length < MIN_PASSWORD) found.password = `Use pelo menos ${MIN_PASSWORD} caracteres.`;
    if (form.confirm !== form.password) found.confirm = "As senhas não conferem.";
    if (!form.accepted) found.form = "É preciso aceitar os termos para criar a conta.";
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setBusy(true);
    const { firstName, lastName, email, phone, password, newsletter } = form;
    const res = await signUp({ firstName, lastName, email, phone, password, newsletter });
    if (!res.ok) {
      setErrors({ form: res.error });
      setBusy(false);
      return;
    }
    await onDone(res.data);
  }

  return (
    <section>
      <h2 className="font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium">Criar conta</h2>
      <p className="mt-2 text-ink-muted">Acompanhe seus pedidos e compre mais rápido.</p>
      <form onSubmit={submit} className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6" noValidate>
        <Field id="reg-first" label="Nome" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} autoComplete="given-name" />
        <Field id="reg-last" label="Sobrenome" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} autoComplete="family-name" />
        <Field id="reg-email" className="col-span-2" label="E-mail" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} autoComplete="email" />
        <Field
          id="reg-phone"
          className="col-span-2"
          label="Telefone"
          value={form.phone}
          onChange={(e) => set("phone", maskPhone(e.target.value))}
          error={errors.phone}
          inputMode="tel"
          placeholder="(11) 90000-0000"
          autoComplete="tel"
        />
        <PasswordField id="reg-password" label="Senha" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} autoComplete="new-password" />
        <PasswordField id="reg-confirm" label="Confirmar senha" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} autoComplete="new-password" />

        <label className="label col-span-2 flex items-center gap-2.5 text-ink-muted">
          <input
            type="checkbox"
            checked={form.newsletter}
            onChange={(e) => set("newsletter", e.target.checked)}
            className="h-4 w-4 accent-black"
          />
          Quero receber novidades e lançamentos por e-mail.
        </label>
        <label className="label col-span-2 flex items-start gap-2.5 text-ink-muted">
          <input
            type="checkbox"
            checked={form.accepted}
            onChange={(e) => set("accepted", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-black"
          />
          <span>
            Li e aceito os{" "}
            <Link href="/legal/termos" className="underline" target="_blank">
              Termos de uso
            </Link>{" "}
            e a{" "}
            <Link href="/legal/privacidade" className="underline" target="_blank">
              Política de privacidade
            </Link>
            .
          </span>
        </label>

        {errors.form && (
          <p role="alert" className="label col-span-2 text-[#8a2b2b]">
            {errors.form}
          </p>
        )}
        <Button type="submit" variant="outline" disabled={busy} fullWidth className="col-span-2">
          {busy ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>
    </section>
  );
}
