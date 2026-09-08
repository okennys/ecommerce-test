import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/ContentIndex";

export const metadata: Metadata = { title: "A Marca" };

export default function AMarcaPage() {
  return <ContentIndex sectionKey="a-marca" />;
}
