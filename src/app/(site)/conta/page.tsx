import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountPage } from "@/components/account/AccountPage";

export const metadata: Metadata = {
  title: "Sua conta",
  robots: { index: false, follow: false },
};

export default function ContaPage() {
  // `?redirect=` is read on the client; Suspense keeps the route static
  return (
    <Suspense fallback={null}>
      <AccountPage />
    </Suspense>
  );
}
