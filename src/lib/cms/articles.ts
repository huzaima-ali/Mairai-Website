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
      if (!error && data && data.length > 0) {
        return data as ArticleRow[];
      }
      // Empty CMS → fall back to code placeholders so the public hub is never blank during setup
      if (!error && data && data.length === 0) {
        return INSIGHT_ARTICLES.map((a) => mapLegacyArticle(a) as ArticleRow);
      }
    } catch {
      // fall through
    }
  }
  return INSIGHT_ARTICLES.map((a) => mapLegacyArticle(a) as ArticleRow);
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

export { staticInsightUrl };
