import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/ContentIndex";

export const metadata: Metadata = { title: "Informações legais" };

export default function LegalPage() {
  return <ContentIndex sectionKey="legal" />;
}
