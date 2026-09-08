import type { Metadata } from "next";
import { getContentSection } from "@/lib/data/content";
import { ContentLayout } from "@/components/content/ContentLayout";
import { TrackOrderForm } from "@/components/content/TrackOrderForm";

export const metadata: Metadata = { title: "Rastrear pedido" };

export default function RastrearPage() {
  const section = getContentSection("ajuda")!;
  return (
    <ContentLayout section={section} activeHref="/ajuda/pedido">
      <h1 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium">Rastrear pedido</h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Informe o número do pedido e o e-mail usado na compra para ver o status da entrega.
      </p>
      <div className="mt-10">
        <TrackOrderForm />
      </div>
    </ContentLayout>
  );
}
