import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  articlePublicUrl,
  getPublishedArticleBySlug,
  listPublishedArticles,
} from "@/lib/cms/articles";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { articleJsonLd } from "@/lib/cms/schema";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { InsightArticleView } from "@/components/insights/InsightArticleView";

export const dynamic = "force-dynamic";

type InsightPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const article = await getPublishedArticleBySlug(params.slug);
  if (!article) return {};
  return resolvePageMetadata({
    path: articlePublicUrl(article.slug),
    title: article.seo_title || article.title,
    description: article.meta_description || article.excerpt,
    ogImage: article.og_image_url || article.featured_image_url || undefined,
    index: !article.noindex,
    type: "article",
    ogTitle: article.og_title || undefined,
    ogDescription: article.og_description || undefined,
  });
}

export default async function InsightArticlePage({ params }: InsightPageProps) {
  const article = await getPublishedArticleBySlug(params.slug);
  if (!article) notFound();

  const safe = {
    ...article,
    content: sanitizeArticleHtml(article.content),
  };

  const all = await listPublishedArticles();
  const related = all.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path: articlePublicUrl(article.slug) },
          ]),
          articleJsonLd(article),
        ])}
      />
      <InsightArticleView article={safe} related={related} />
    </>
  );
}
