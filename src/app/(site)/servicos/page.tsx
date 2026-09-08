import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/ContentIndex";

export const metadata: Metadata = { title: "Serviços" };

export default function ServicosPage() {
  return <ContentIndex sectionKey="servicos" />;
}
