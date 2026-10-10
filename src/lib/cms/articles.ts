import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
  hasServiceRole,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { ArticleRow, ArticleStatus } from "@/lib/cms/types";
import {
  INSIGHT_ARTICLES,
  type InsightArticle,
  getInsightUrl as staticInsightUrl,
} from "@/lib/insights";
import { getHomepageFeaturedArticleId } from "@/lib/cms/ops-store";
import { editorialArticles, getEditorialArticleBySlug } from "@/lib/cms/editorial-articles";

export function articlePublicUrl(slug: string) {
  return `/insights/${slug}`;
}

function mapLegacyArticle(article: InsightArticle): Partial<ArticleRow> & {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: ArticleStatus;
  published_at: string;
  author_name: string;
  featured_image_url: null;
  featured_image_alt: null;
  noindex: boolean;
} {
  return {
    id: `legacy-${article.slug}`,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    content: article.body.map((p) => `<p>${p}</p>`).join(""),
    category: article.category,
    status: "published",
    published_at: new Date(article.date).toISOString(),
    author_name: "Mirai Studios",
    featured_image_url: null,
    featured_image_alt: null,
    noindex: false,
    tags: [],
    seo_title: article.title,
    meta_description: article.excerpt,
    created_at: new Date(article.date).toISOString(),
    updated_at: new Date(article.date).toISOString(),
  };
}

function mergePublished(cms: ArticleRow[]): ArticleRow[] {
  const editorial = editorialArticles();
  const cmsSlugs = new Set(cms.map((article) => article.slug));
  const extra = editorial.filter((article) => !cmsSlugs.has(article.slug));
  return [...cms, ...extra].sort((a, b) => {
    const aTime = a.published_at ? Date.parse(a.published_at) : 0;
    const bTime = b.published_at ? Date.parse(b.published_at) : 0;
    return bTime - aTime;
  });
}

export async function listPublishedArticles(): Promise<ArticleRow[]> {
  if (isSupabaseConfigured() && hasServiceRole()) {
    try {
      const supabase = createServiceSupabaseClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .is("deleted_at", null)
        .order("published_at", { ascending: false });
      if (!error && data) {
        return mergePublished(data as ArticleRow[]);
      }
    } catch {
      // fall through
    }
  }
  return editorialArticles();
}

export async function getPublishedArticleBySlug(slug: string): Promise<ArticleRow | null> {
  if (isSupabaseConfigured() && hasServiceRole()) {
    try {
      const supabase = createServiceSupabaseClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .is("deleted_at", null)
        .maybeSingle();
      if (!error && data) return data as ArticleRow;
    } catch {
      // fall through
    }
  }
  const editorial = getEditorialArticleBySlug(slug);
  if (editorial) return editorial;
  const legacy = INSIGHT_ARTICLES.find((a) => a.slug === slug);
  return legacy ? (mapLegacyArticle(legacy) as ArticleRow) : null;
}

export async function getArticleBySlugAdmin(slug: string): Promise<ArticleRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();
  return (data as ArticleRow | null) ?? null;
}

export async function getArticleByIdAdmin(id: string): Promise<ArticleRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  return (data as ArticleRow | null) ?? null;
}

export async function listArticlesAdmin(): Promise<ArticleRow[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return data as ArticleRow[];
}

export async function getHomepageFeaturedArticle(): Promise<ArticleRow | null> {
  const featuredId = await getHomepageFeaturedArticleId();
  const published = await listPublishedArticles();
  if (featuredId) {
    const match = published.find((a) => a.id === featuredId);
    if (match) return match;
  }
  return published[0] || null;
}

export { staticInsightUrl };
