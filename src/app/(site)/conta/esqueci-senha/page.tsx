import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/PasswordForms";

export const metadata: Metadata = {
  title: "Esqueci minha senha",
  robots: { index: false, follow: false },
};

export default function EsqueciSenhaPage() {
  return <ForgotPasswordForm />;
}
