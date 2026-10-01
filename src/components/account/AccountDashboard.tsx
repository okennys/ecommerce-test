"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { AddressForm } from "@/components/checkout/AddressForm";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { isCpf, maskCpf, maskPhone } from "@/lib/masks";
import { addressErrors } from "@/lib/cart/address";
import { EMPTY_ADDRESS, type CheckoutAddress } from "@/lib/cart/types";
import {
  addAddress,
  listMyOrders,
  removeAddress,
  updateProfile,
} from "@/lib/account/actions";
import type { CustomerView, OrderListItem } from "@/lib/account/types";
import { useAccount } from "@/context/AccountProvider";

const TABS = [
  { id: "pedidos", label: "Pedidos" },
  { id: "dados", label: "Dados pessoais" },
  { id: "enderecos", label: "Endereços" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function AccountDashboard({ customer }: { customer: CustomerView }) {
  const { signOut } = useAccount();
  const [tab, setTab] = useState<Tab>("pedidos");
  const [leaving, setLeaving] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 lg:px-8 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-ink-muted">Sua conta</p>
          <h1 className="font-display mt-2 text-[clamp(1.6rem,3vw,2.25rem)] font-medium">
            Olá, {customer.firstName || customer.email}
          </h1>
        </div>
        <button
          type="button"
          disabled={leaving}
          onClick={async () => {
            setLeaving(true);
            await signOut();
          }}
          className="label link-quiet underline"
        >
          {leaving ? "Saindo…" : "Sair"}
        </button>
      </div>

      <div role="tablist" className="mt-10 flex gap-6 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "label -mb-px border-b py-3",
              tab === t.id ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === "pedidos" && <Orders />}
        {tab === "dados" && <Profile customer={customer} />}
        {tab === "enderecos" && <AddressBook customer={customer} />}
      </div>
    </div>
  );
}

// --- pedidos -----------------------------------------------------------------

function Orders() {
  const [orders, setOrders] = useState<OrderListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    listMyOrders().then((res) => {
      if (res.ok) setOrders(res.data);
      else setError(res.error);
    });
  }, []);

  if (error) return <p className="text-[#8a2b2b]">{error}</p>;
  if (!orders) {
    return (
      <p className="label text-ink-muted" aria-busy="true">
        Carregando seus pedidos…
      </p>
    );
  }
  if (!orders.length) {
    return (
      <div>
        <p className="text-ink-muted">Você ainda não fez pedidos com esta conta.</p>
        <Link href="/mulher" className="label mt-4 inline-block underline">
          Explorar a coleção
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {orders.map((o) => {
        const expanded = open === o.id;
        return (
          <li key={o.id}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : o.id)}
              className="grid w-full grid-cols-2 gap-y-1 py-5 text-left sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-4"
            >
              <span className="label">Pedido nº {o.number}</span>
              <span className="label text-ink-muted sm:order-none">
                {new Date(o.placedAt).toLocaleDateString("pt-BR")}
              </span>
              <span className="label">{o.status}</span>
              <span className="label text-right">{formatPrice(o.total, o.currency)}</span>
            </button>
            {expanded && (
              <div className="pb-6">
                <ul className="space-y-4">
                  {o.items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <div className="relative aspect-[4/5] w-14 shrink-0 bg-paper-raised">
                        {item.thumbnail && (
                          <Image src={item.thumbnail} alt="" fill sizes="56px" className="object-cover object-top" />
                        )}
                      </div>
                      <div className="flex flex-1 justify-between gap-3">
                        <div>
                          <p className="label">{item.title}</p>
                          <p className="label text-ink-muted">
                            {item.label} · Qtd {item.quantity}
                          </p>
                        </div>
                        <span className="label whitespace-nowrap">
                          {formatPrice(item.total, o.currency)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="label mt-5 text-ink-muted">
                  {o.shippingName && `${o.shippingName} · `}
                  {o.address}
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// --- dados pessoais ----------------------------------------------------------

function Profile({ customer }: { customer: CustomerView }) {
  const { setCustomer } = useAccount();
  const [form, setForm] = useState({
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: maskPhone(customer.phone),
    cpf: customer.cpf ? maskCpf(customer.cpf) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((x) => ({ ...x, [k]: "", form: "" }));
    setStatus("idle");
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const found: Record<string, string> = {};
    if (!form.firstName.trim()) found.firstName = "Informe o nome.";
    if (!form.lastName.trim()) found.lastName = "Informe o sobrenome.";
    if (form.phone && form.phone.replace(/\D/g, "").length < 10) found.phone = "Telefone incompleto.";
    if (form.cpf && !isCpf(form.cpf)) found.cpf = "CPF inválido.";
    setErrors(found);
    if (Object.keys(found).length) return;
    setStatus("saving");
    const res = await updateProfile(form);
    if (!res.ok) {
      setErrors({ form: res.error });
      setStatus("idle");
      return;
    }
    setCustomer(res.data);
    setStatus("saved");
  }

  return (
    <form onSubmit={submit} className="grid max-w-xl grid-cols-2 gap-x-4 gap-y-6" noValidate>
      <Field id="pf-first" label="Nome" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} error={errors.firstName} autoComplete="given-name" />
      <Field id="pf-last" label="Sobrenome" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} error={errors.lastName} autoComplete="family-name" />
      <Field id="pf-email" className="col-span-2" label="E-mail" value={customer.email} disabled readOnly hint="Para trocar o e-mail, fale com o atendimento." />
      <Field id="pf-phone" label="Telefone" value={form.phone} onChange={(e) => set("phone", maskPhone(e.target.value))} error={errors.phone} inputMode="tel" autoComplete="tel" />
      <Field id="pf-cpf" label="CPF" value={form.cpf} onChange={(e) => set("cpf", maskCpf(e.target.value))} error={errors.cpf} inputMode="numeric" placeholder="000.000.000-00" />
      {errors.form && (
        <p role="alert" className="label col-span-2 text-[#8a2b2b]">
          {errors.form}
        </p>
      )}
      <div className="col-span-2 flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Salvando…" : "Salvar dados"}
        </Button>
        {status === "saved" && <span className="label text-ink-muted">Dados salvos.</span>}
        <Link href="/conta/esqueci-senha" className="label link-quiet underline">
          Alterar senha
        </Link>
      </div>
    </form>
  );
}

// --- endereços ---------------------------------------------------------------

function AddressBook({ customer }: { customer: CustomerView }) {
  const { setCustomer } = useAccount();
  const [adding, setAdding] = useState(customer.addresses.length === 0);
  const [draft, setDraft] = useState<CheckoutAddress>({
    ...EMPTY_ADDRESS,
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: maskPhone(customer.phone),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const found = addressErrors(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    setBusy("new");
    setError(null);
    const res = await addAddress(draft);
    setBusy(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCustomer(res.data);
    setAdding(false);
    setDraft({ ...EMPTY_ADDRESS, firstName: customer.firstName, lastName: customer.lastName });
  }

  async function remove(id: string) {
    setBusy(id);
    setError(null);
    const res = await removeAddress(id);
    setBusy(null);
    if (!res.ok) setError(res.error);
    else setCustomer(res.data);
  }

  return (
    <div>
      {customer.addresses.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {customer.addresses.map(({ id, address: a }) => (
            <li key={id} className="border border-line p-5">
              <p className="label">
                {a.firstName} {a.lastName}
              </p>
              <p className="mt-2 text-ink-muted">
                {a.street}, {a.number}
                {a.complement ? ` — ${a.complement}` : ""}
                <br />
                {a.district} · {a.city}/{a.state}
                <br />
                CEP {a.cep} · {a.phone}
              </p>
              <button
                type="button"
                onClick={() => remove(id)}
                disabled={busy === id}
                className="label link-quiet mt-4 underline"
              >
                {busy === id ? "Removendo…" : "Remover"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="label mt-6 text-[#8a2b2b]">
          {error}
        </p>
      )}

      {adding ? (
        <div className="mt-10 max-w-2xl">
          <h2 className="label-lg mb-6">Novo endereço</h2>
          <AddressForm value={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} errors={errors} />
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button type="button" onClick={save} disabled={busy === "new"}>
              {busy === "new" ? "Salvando…" : "Salvar endereço"}
            </Button>
            {customer.addresses.length > 0 && (
              <button type="button" onClick={() => setAdding(false)} className="label link-quiet">
                Cancelar
              </button>
            )}
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" className="mt-8" onClick={() => setAdding(true)}>
          Adicionar endereço
        </Button>
      )}
    </div>
  );
}
