import { notFound } from "next/navigation";
import { getContentPage, getContentSection } from "@/lib/data/content";
import { ContentLayout } from "./ContentLayout";
import { Prose } from "./Prose";

export function ContentSlug({ sectionKey, slug }: { sectionKey: string; slug: string }) {
  const section = getContentSection(sectionKey);
  const page = getContentPage(sectionKey, slug);
  if (!section || !page) notFound();

  return (
    <ContentLayout section={section} activeHref={`/${sectionKey}/${slug}`}>
      <article>
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-tight">
          {page.title}
        </h1>
        {page.intro && <p className="mt-3 max-w-2xl text-ink-muted">{page.intro}</p>}
        {page.updated && (
          <p className="label mt-3 text-ink-muted">
            Atualizado em {new Date(page.updated).toLocaleDateString("pt-BR")}
          </p>
        )}
        <div className="mt-10">
          <Prose blocks={page.blocks} />
        </div>
      </article>
    </ContentLayout>
  );
}
