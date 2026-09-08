import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/ContentIndex";

export const metadata: Metadata = { title: "Atendimento ao cliente" };

export default function AjudaPage() {
  return <ContentIndex sectionKey="ajuda" />;
}
