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
import {
  editorialArticles,
  getEditorialArticleById,
  getEditorialArticleBySlug,
} from "@/lib/cms/editorial-articles";
import {
  editorialToCmsInsert,
  isCmsArticleId,
  mergeAdminArticles,
  mergePublishedArticles,
} from "@/lib/cms/article-merge";

export { editorialToCmsInsert, isCmsArticleId, mergeAdminArticles };

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

function articlesWriteClient() {
  if (hasServiceRole()) return createServiceSupabaseClient();
  return createServerSupabaseClient();
}

export async function syncEditorialArticlesToCms(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = articlesWriteClient();
  const { data, error } = await supabase.from("articles").select("slug");
  if (error) {
    console.error("[cms] editorial article lookup failed", error);
    return;
  }
  const existing = new Set((data || []).map((row: { slug: string }) => row.slug));
  const missing = editorialArticles().filter((article) => !existing.has(article.slug));
  if (!missing.length) return;
  const { error: insertError } = await supabase.from("articles").insert(missing.map(editorialToCmsInsert));
  if (insertError) {
    console.error("[cms] editorial article sync failed", insertError);
  }
}

export async function resolveAdminArticleId(id: string): Promise<string> {
  if (isCmsArticleId(id)) return id;
  const editorial = getEditorialArticleById(id);
  if (!editorial) throw new Error("Article not found");
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
  const supabase = articlesWriteClient();
  const { data: existing } = await supabase.from("articles").select("id").eq("slug", editorial.slug).maybeSingle();
  if (existing?.id) return existing.id as string;
  const { data, error } = await supabase
    .from("articles")
    .insert(editorialToCmsInsert(editorial))
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message || "Could not import article");
  return data.id as string;
}

export async function listPublishedArticles(): Promise<ArticleRow[]> {
  if (isSupabaseConfigured() && hasServiceRole()) {
    try {
      const supabase = createServiceSupabaseClient();
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data) {
        const rows = data as ArticleRow[];
        const published = rows.filter((article) => article.status === "published" && !article.deleted_at);
        const reserved = rows
          .filter((article) => article.deleted_at || article.status !== "published")
          .map((article) => article.slug);
        return mergePublishedArticles(published, editorialArticles(), reserved);
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
      const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) {
        const row = data as ArticleRow;
        return !row.deleted_at && row.status === "published" ? row : null;
      }
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
  if (isSupabaseConfigured()) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();
    if (data) return data as ArticleRow;
  }
  return getEditorialArticleBySlug(slug);
}

export async function getArticleByIdAdmin(id: string): Promise<ArticleRow | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      if (isCmsArticleId(id)) {
        const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
        if (data) return data as ArticleRow;
      } else {
        const editorial = getEditorialArticleById(id);
        if (editorial) {
          const { data } = await supabase
            .from("articles")
            .select("*")
            .eq("slug", editorial.slug)
            .is("deleted_at", null)
            .maybeSingle();
          if (data) return data as ArticleRow;
        }
      }
    } catch {
      // fall through to editorial
    }
  }
  return getEditorialArticleById(id);
}

export async function listArticlesAdmin(): Promise<ArticleRow[]> {
  if (!isSupabaseConfigured()) return editorialArticles();
  try {
    await syncEditorialArticlesToCms();
  } catch (error) {
    console.error("[cms] editorial article sync failed", error);
  }
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (error || !data) return editorialArticles();
  const rows = data as ArticleRow[];
  const live = rows.filter((article) => !article.deleted_at);
  const reserved = rows.filter((article) => article.deleted_at).map((article) => article.slug);
  return mergeAdminArticles(live, editorialArticles(), reserved);
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
