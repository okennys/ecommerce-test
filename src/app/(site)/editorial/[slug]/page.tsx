import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle } from "@/lib/data/editorial";
import { ContentHero } from "@/components/content/ContentHero";
import { Article } from "@/components/content/Article";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  return a ? { title: a.title, description: a.dek } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article>
      <ContentHero
        kicker={article.kicker}
        title={article.title}
        image={article.hero}
        crumbs={[
          { label: "Início", href: "/" },
          { label: "Editorial", href: "/editorial" },
          { label: article.title, href: `/editorial/${article.slug}` },
        ]}
      />
      <div className="mx-auto max-w-2xl px-5 pt-10">
        <p className="label text-ink-muted">
          {new Date(article.date).toLocaleDateString("pt-BR")} · {article.readingTime}
        </p>
        <p className="font-display mt-4 text-xl leading-snug">{article.dek}</p>
      </div>
      <Article blocks={article.blocks} />
      <div className="mx-auto max-w-2xl px-5 pb-20">
        <Link href="/editorial" className="label link-quiet">
          ← Todos os editoriais
        </Link>
      </div>
    </article>
  );
}
