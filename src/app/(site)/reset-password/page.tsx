import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/account/PasswordForms";

// The path is the backend's: Medusa's password-reset e-mail links to
// `<storefront>/reset-password?token=…&email=…`.
export const metadata: Metadata = {
  title: "Nova senha",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
