import type { Metadata } from "next";
import { getContentSection } from "@/lib/data/content";
import { ContentLayout } from "@/components/content/ContentLayout";
import { SizeGuideTables } from "@/components/content/SizeGuideTables";

export const metadata: Metadata = { title: "Guia de tamanhos" };

export default function TamanhosPage() {
  const section = getContentSection("ajuda")!;
  return (
    <ContentLayout section={section} activeHref="/ajuda/tamanhos">
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium">Guia de tamanhos</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Medidas do corpo, não da peça. As tabelas valem para toda a linha feminina.
      </p>
      <div className="mt-10">
        <SizeGuideTables />
      </div>
    </ContentLayout>
  );
}
