"use client";

import { useSearchParams } from "next/navigation";
import { useAccount } from "@/context/AccountProvider";
import { AuthForms } from "./AuthForms";
import { AccountDashboard } from "./AccountDashboard";

/** /conta: login and sign-up for guests, the dashboard once logged in. */
export function AccountPage() {
  const { customer, ready } = useAccount();
  const params = useSearchParams();
  // only same-site paths, so the redirect can't send anyone off the store
  const raw = params.get("redirect") ?? "";
  const redirect = raw.startsWith("/") && !raw.startsWith("//") ? raw : undefined;

  if (!ready) {
    return (
      <p className="py-24 text-center text-ink-muted" aria-busy="true">
        Carregando…
      </p>
    );
  }
  if (!customer) return <AuthForms redirect={redirect} />;
  return <AccountDashboard customer={customer} />;
}
