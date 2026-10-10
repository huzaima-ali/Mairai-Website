import type { ArticleRow } from "./types";

const CMS_ARTICLE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isCmsArticleId(id: string) {
  return CMS_ARTICLE_ID.test(id);
}

export function editorialToCmsInsert(article: ArticleRow) {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    featured_image_url: article.featured_image_url,
    featured_image_alt: article.featured_image_alt,
    category: article.category,
    tags: article.tags ?? [],
    author_name: article.author_name,
    status: article.status,
    published_at: article.published_at,
    created_at: article.created_at,
    updated_at: article.updated_at,
    seo_title: article.seo_title,
    meta_description: article.meta_description,
    og_title: article.og_title,
    og_description: article.og_description,
    og_image_url: article.og_image_url,
    noindex: article.noindex,
  };
}

export function mergeAdminArticles(
  cms: ArticleRow[],
  editorial: ArticleRow[],
  reservedSlugs: Iterable<string> = [],
): ArticleRow[] {
  const slugs = new Set([...cms.map((article) => article.slug), ...reservedSlugs]);
  const extra = editorial.filter((article) => !slugs.has(article.slug));
  return [...cms, ...extra].sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}

export function mergePublishedArticles(
  cms: ArticleRow[],
  editorial: ArticleRow[],
  reservedSlugs: Iterable<string> = [],
): ArticleRow[] {
  const blocked = new Set([...cms.map((article) => article.slug), ...reservedSlugs]);
  const extra = editorial.filter((article) => !blocked.has(article.slug));
  return [...cms, ...extra].sort((a, b) => {
    const aTime = a.published_at ? Date.parse(a.published_at) : 0;
    const bTime = b.published_at ? Date.parse(b.published_at) : 0;
    return bTime - aTime;
  });
}
