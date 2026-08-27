"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/cms/auth";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { slugify, ALLOWED_MEDIA_MIME, MAX_MEDIA_BYTES } from "@/lib/cms/utils";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { articlePublicUrl, listArticlesAdmin } from "@/lib/cms/articles";
import { jobPublicUrl, listJobsAdmin } from "@/lib/cms/jobs";
import {
  upsertSeoExtras,
  saveCmsPage,
  softDeleteCmsPage,
  listCmsPages,
  getCmsPageByRoute,
  getCmsPageById,
  setHomepageFeaturedArticleId,
  getHomepageFeaturedArticleId,
} from "@/lib/cms/ops-store";
import { regionalRouteFor } from "@/lib/cms/seo-helpers";
import { CMS_PAGE_TYPE_OPTIONS, REGION_VARIANT_OPTIONS, type CmsPageRow } from "@/lib/cms/types";
import { randomUUID } from "crypto";
import { getRegistryPage } from "@/lib/cms/route-registry";
import {
  assertRouteAvailable,
  buildCmsRoute,
  canCreateRegionalVariant,
  canDuplicateRoute,
  defaultCmsFieldsFromName,
  lookupCodeMarketingPage,
  marketingPageToHtml,
  normalizeRoute,
  regionOption,
  slugFromRoute,
  withCmsPageDefaults,
} from "@/lib/cms/page-routes";

function assertConfigured() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured. Add env vars before using Site Ops.");
  }
}

async function adminClient() {
  assertConfigured();
  const session = await requireAdminSession();
  const supabase = createServerSupabaseClient();
  return { session, supabase };
}

function revalidateInsights(slug?: string) {
  revalidatePath("/insights");
  revalidatePath("/insights", "layout");
  revalidatePath("/sitemap.xml");
  if (slug) {
    const path = articlePublicUrl(slug);
    revalidatePath(path);
    revalidatePath(path, "page");
  }
  revalidatePath("/");
  revalidatePath("/", "layout");
}

function revalidateCareers(slug?: string) {
  revalidatePath("/careers");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(jobPublicUrl(slug));
}

function revalidateCmsPublic(route: string, extra?: string | null) {
  revalidatePath(route);
  revalidatePath(route, "page");
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
  if (extra && extra !== route) {
    revalidatePath(extra);
    revalidatePath(extra, "page");
  }
}

async function collisionLists() {
  const [cmsPages, articles, jobs] = await Promise.all([
    listCmsPages(),
    listArticlesAdmin(),
    listJobsAdmin(),
  ]);
  return {
    cmsPages,
    articleRoutes: articles.map((article) => articlePublicUrl(article.slug)),
    jobRoutes: jobs.map((job) => jobPublicUrl(job.slug)),
  };
}

async function persistCmsSeo(page: CmsPageRow, userId: string) {
  const published = page.status === "published";
  await upsertSeoExtras(page.route, {
    route: page.route,
    page_name: page.page_name,
    page_type: page.page_type,
    seo_title: page.seo_title,
    meta_description: page.meta_description,
    og_title: page.og_title,
    og_description: page.og_description,
    og_image_url: page.og_image_url,
    canonical_override: page.canonical_override,
    noindex: page.noindex || !published,
    include_in_sitemap: published && page.include_in_sitemap && !page.noindex,
    status: page.status,
    region_code: page.region_code,
    base_route: page.base_route,
    region_served: page.region_served,
    page_summary: page.page_summary,
    primary_topic: page.primary_topic,
    industry: page.industry,
    related_services: page.related_services,
    related_industries: page.related_industries,
    related_case_studies: page.related_case_studies,
    schema_area_served: page.region_served,
    breadcrumb_label: page.page_name,
    updated_by: userId,
    updated_at: page.updated_at,
  });

  const { supabase } = await adminClient();
  await supabase.from("page_seo").upsert(
    {
      route: page.route,
      page_name: page.page_name,
      page_type: page.page_type,
      seo_title: page.seo_title,
      meta_description: page.meta_description,
      og_title: page.og_title,
      og_description: page.og_description,
      og_image_url: page.og_image_url,
      noindex: page.noindex || !published,
      updated_at: page.updated_at,
      updated_by: userId,
    },
    { onConflict: "route" },
  );
}

function emptyCmsPage(partial: Partial<CmsPageRow> & Pick<CmsPageRow, "id" | "route" | "page_name">): CmsPageRow {
  return withCmsPageDefaults(partial);
}

const seoSchema = z.object({
  route: z.string().min(1),
  page_name: z.string().min(1),
  page_type: z.string().min(1),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  noindex: z.boolean().optional(),
  nofollow: z.boolean().optional(),
  twitter_title: z.string().optional().nullable(),
  twitter_description: z.string().optional().nullable(),
  twitter_image_url: z.string().optional().nullable(),
  twitter_card: z.string().optional().nullable(),
  breadcrumb_label: z.string().optional().nullable(),
  include_in_sitemap: z.boolean().optional(),
  sitemap_priority: z.number().optional().nullable(),
  canonical_override: z.string().optional().nullable(),
  page_summary: z.string().optional().nullable(),
  primary_topic: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  region_served: z.string().optional().nullable(),
  related_services: z.array(z.string()).optional(),
  related_industries: z.array(z.string()).optional(),
  related_case_studies: z.array(z.string()).optional(),
  schema_area_served: z.string().optional().nullable(),
  schema_service_name: z.string().optional().nullable(),
  schema_types: z.array(z.string()).optional(),
  advanced_schema_json: z.string().optional().nullable(),
  region_code: z.string().optional().nullable(),
  base_route: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "unpublished"]).optional(),
});

export async function upsertPageSeoAction(input: z.infer<typeof seoSchema>) {
  const parsed = seoSchema.parse(input);
  const { session, supabase } = await adminClient();

  // Core columns always written to page_seo (safe for current schema)
  const { data, error } = await supabase
    .from("page_seo")
    .upsert(
      {
        route: parsed.route,
        page_name: parsed.page_name,
        page_type: parsed.page_type,
        seo_title: parsed.seo_title || null,
        meta_description: parsed.meta_description || null,
        og_title: parsed.og_title || null,
        og_description: parsed.og_description || null,
        og_image_url: parsed.og_image_url || null,
        noindex: parsed.noindex ?? false,
        updated_at: new Date().toISOString(),
        updated_by: session.user.id,
      },
      { onConflict: "route" },
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  try {
    await upsertSeoExtras(parsed.route, {
      ...parsed,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
    });
  } catch (extrasError) {
    console.error("[cms] SEO extras save failed", extrasError);
  }

  revalidatePath(parsed.route);
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
  return data;
}

export async function createCmsPageAction(input: {
  page_name: string;
  slug: string;
  page_type: "service-detail" | "industry" | "region-detail" | "landing";
  h1: string;
  intro: string;
  body_html: string;
  cta_heading?: string | null;
  cta_copy?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  region_code?: "global" | "us" | "uk" | "mena" | "custom";
  custom_prefix?: string;
  related_services?: string[];
  related_industries?: string[];
  related_case_studies?: string[];
  seo_title?: string | null;
  meta_description?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  noindex?: boolean;
  include_in_sitemap?: boolean;
}) {
  const { session } = await adminClient();
  const pageType = CMS_PAGE_TYPE_OPTIONS.find((opt) => opt.value === input.page_type);
  if (!pageType) throw new Error("Invalid page type");

  const regionCode = input.region_code && input.region_code !== "global" ? input.region_code : null;
  const region = regionCode ? regionOption(regionCode) : null;
  const { route, baseRoute, slug } = buildCmsRoute({
    pageType: input.page_type,
    slug: input.slug,
    regionCode,
    customPrefix: input.custom_prefix,
  });

  const lists = await collisionLists();
  assertRouteAvailable({ route, ...lists });

  const defaults = defaultCmsFieldsFromName(input.page_name, input.h1);
  const now = new Date().toISOString();
  const page = emptyCmsPage({
    id: randomUUID(),
    route,
    slug,
    base_route: baseRoute,
    region_code: regionCode || "global",
    region_label: region?.label || "Global",
    page_name: input.page_name.trim(),
    page_type: input.page_type,
    status: "draft",
    h1: input.h1.trim() || input.page_name.trim(),
    intro: input.intro || "",
    body_html: sanitizeArticleHtml(input.body_html || ""),
    cta_heading: input.cta_heading || "Ready to talk through a project?",
    cta_copy:
      input.cta_copy ||
      "Tell us what you are building. The Mirai team will follow up to discuss scope, approach and next steps.",
    cta_label: input.cta_label || "Request a call",
    cta_href: input.cta_href || "/#contact",
    related_services: input.related_services || [],
    related_industries: input.related_industries || [],
    related_case_studies: input.related_case_studies || [],
    page_summary: input.intro || null,
    region_served: region?.areaServed || null,
    seo_title: input.seo_title || defaults.seo_title,
    meta_description: input.meta_description || defaults.meta_description,
    og_title: input.og_title || defaults.og_title,
    og_description: input.og_description || null,
    og_image_url: input.og_image_url || null,
    noindex: input.noindex ?? true,
    include_in_sitemap: false,
    created_at: now,
    updated_at: now,
    created_by: session.user.id,
    updated_by: session.user.id,
  });

  await saveCmsPage(page);
  await persistCmsSeo(page, session.user.id);
  revalidatePath("/admin/pages");
  return page;
}

export async function duplicateCmsPageAction(input: {
  sourceRoute: string;
  slug: string;
  sourcePageId?: string | null;
}) {
  const { session } = await adminClient();
  const sourceRoute = normalizeRoute(input.sourceRoute);
  const sourceCms = input.sourcePageId
    ? await getCmsPageById(input.sourcePageId)
    : (await getCmsPageByRoute(sourceRoute));
  const registry = getRegistryPage(sourceRoute);
  const marketing = lookupCodeMarketingPage(sourceRoute);

  if (!sourceCms && !registry && !marketing) {
    throw new Error("Source page not found");
  }
  if (!canDuplicateRoute(sourceRoute, sourceCms?.page_type || registry?.pageType)) {
    throw new Error("This page type cannot be duplicated from Site Ops.");
  }

  const pageType = (sourceCms?.page_type || registry?.pageType || "landing") as
    | "service-detail"
    | "industry"
    | "region-detail"
    | "landing";
  const safeType = CMS_PAGE_TYPE_OPTIONS.some((opt) => opt.value === pageType) ? pageType : "landing";
  const { route, baseRoute, slug } = buildCmsRoute({
    pageType: safeType,
    slug: input.slug,
    regionCode: sourceCms?.region_code && sourceCms.region_code !== "global" ? sourceCms.region_code : null,
  });

  if (route === sourceRoute) {
    throw new Error("Duplicated pages need a new slug. The source route cannot be reused.");
  }

  const lists = await collisionLists();
  assertRouteAvailable({ route, ...lists });

  const sourceName = sourceCms?.page_name || registry?.pageName || marketing?.title || sourceRoute;
  const now = new Date().toISOString();
  const page = emptyCmsPage({
    ...(sourceCms || {}),
    id: randomUUID(),
    route,
    slug,
    base_route: baseRoute,
    page_name: `${sourceName} (copy)`,
    page_type: sourceCms?.page_type || safeType,
    status: "draft",
    source_page_id: sourceCms?.id || null,
    source_route: sourceRoute,
    source_page_name: sourceName,
    h1: sourceCms?.h1 || marketing?.h1 || registry?.defaultTitle || sourceName,
    intro: sourceCms?.intro || marketing?.intro || registry?.defaultDescription || "",
    body_html: sanitizeArticleHtml(sourceCms?.body_html || (marketing ? marketingPageToHtml(marketing) : "")),
    cta_heading: sourceCms?.cta_heading || "Ready to talk through a project?",
    cta_copy: sourceCms?.cta_copy || null,
    cta_label: sourceCms?.cta_label || marketing?.ctaLabel || "Request a call",
    cta_href: sourceCms?.cta_href || marketing?.ctaHref || "/#contact",
    regional_proof: sourceCms?.regional_proof || "",
    related_services:
      sourceCms?.related_services || marketing?.relatedServices?.map((link) => link.href) || [],
    related_industries: sourceCms?.related_industries || [],
    related_case_studies: sourceCms?.related_case_studies || marketing?.relatedCaseStudies || [],
    page_summary: sourceCms?.page_summary || marketing?.metaDescription || registry?.defaultDescription || null,
    seo_title: sourceCms?.seo_title || registry?.defaultTitle || marketing?.metaTitle || sourceName,
    meta_description:
      sourceCms?.meta_description || registry?.defaultDescription || marketing?.metaDescription || null,
    og_title: sourceCms?.og_title || null,
    og_description: sourceCms?.og_description || null,
    og_image_url: sourceCms?.og_image_url || registry?.defaultOgImage || null,
    canonical_override: null,
    noindex: true,
    include_in_sitemap: false,
    published_at: null,
    created_at: now,
    updated_at: now,
    created_by: session.user.id,
    updated_by: session.user.id,
    deleted_at: null,
  });

  await saveCmsPage(page);
  await persistCmsSeo(page, session.user.id);
  revalidatePath("/admin/pages");
  return page;
}

export async function createRegionalVariantAction(input: {
  baseRoute: string;
  regionCode: "us" | "uk" | "mena" | "custom";
  customPrefix?: string;
  sourcePageId?: string | null;
}) {
  const { session } = await adminClient();
  const region = REGION_VARIANT_OPTIONS.find((r) => r.code === input.regionCode);
  if (!region) throw new Error("Invalid region");
  if (input.regionCode === "custom" && !slugify(input.customPrefix || "")) {
    throw new Error("Custom region requires a path prefix, e.g. apac");
  }

  const baseRoute = normalizeRoute(input.baseRoute);
  const sourceCms = input.sourcePageId
    ? await getCmsPageById(input.sourcePageId)
    : (await getCmsPageByRoute(baseRoute));
  const registry = getRegistryPage(baseRoute);
  const marketing = lookupCodeMarketingPage(baseRoute);

  if (!canCreateRegionalVariant(baseRoute, sourceCms?.region_code, sourceCms?.page_type || registry?.pageType)) {
    throw new Error("Regional variants can only be created from a global source page.");
  }

  const route = normalizeRoute(regionalRouteFor(baseRoute, input.regionCode, input.customPrefix));
  const lists = await collisionLists();
  assertRouteAvailable({ route, ...lists });

  const sourceName = sourceCms?.page_name || registry?.pageName || marketing?.title || baseRoute;
  const pageName = `${sourceName} (${region.label})`;
  const now = new Date().toISOString();
  const page = emptyCmsPage({
    ...(sourceCms || {}),
    id: randomUUID(),
    route,
    slug: slugFromRoute(route),
    base_route: sourceCms?.base_route || baseRoute,
    region_code: input.regionCode,
    region_label: input.regionCode === "custom" ? slugify(input.customPrefix || "custom") : region.label,
    page_name: pageName,
    page_type: sourceCms?.page_type || registry?.pageType || "service-detail",
    status: "draft",
    source_page_id: sourceCms?.id || null,
    source_route: baseRoute,
    source_page_name: sourceName,
    h1: sourceCms?.h1 || marketing?.h1 || registry?.defaultTitle || pageName,
    intro: sourceCms?.intro || marketing?.intro || registry?.defaultDescription || "",
    body_html: sanitizeArticleHtml(
      sourceCms?.body_html || (marketing ? marketingPageToHtml(marketing) : ""),
    ),
    cta_heading: sourceCms?.cta_heading || "Ready to talk through a project?",
    cta_copy: sourceCms?.cta_copy || null,
    cta_label: sourceCms?.cta_label || marketing?.ctaLabel || "Request a call",
    cta_href: sourceCms?.cta_href || marketing?.ctaHref || "/#contact",
    regional_proof: sourceCms?.regional_proof || "",
    related_services:
      sourceCms?.related_services || marketing?.relatedServices?.map((link) => link.href) || [],
    related_industries: sourceCms?.related_industries || [],
    related_case_studies: sourceCms?.related_case_studies || marketing?.relatedCaseStudies || [],
    primary_topic: sourceCms?.primary_topic || marketing?.title || registry?.defaultTitle || null,
    region_served: region.areaServed || sourceCms?.region_served || null,
    page_summary: sourceCms?.page_summary || registry?.defaultDescription || marketing?.metaDescription || null,
    seo_title: `${sourceCms?.seo_title || marketing?.title || registry?.defaultTitle || sourceName} in ${region.label}`,
    meta_description:
      sourceCms?.meta_description || marketing?.metaDescription || registry?.defaultDescription || null,
    og_title: sourceCms?.og_title || null,
    og_description: sourceCms?.og_description || null,
    og_image_url: sourceCms?.og_image_url || null,
    canonical_override: null,
    noindex: true,
    include_in_sitemap: false,
    published_at: null,
    created_at: now,
    updated_at: now,
    created_by: session.user.id,
    updated_by: session.user.id,
    deleted_at: null,
  });

  await saveCmsPage(page);
  await persistCmsSeo(page, session.user.id);
  revalidatePath("/admin/pages");
  return page;
}

const cmsSaveSchema = z.object({
  id: z.string().uuid(),
  page_name: z.string().min(1).optional(),
  slug: z.string().optional(),
  h1: z.string().optional(),
  intro: z.string().optional(),
  body_html: z.string().optional(),
  cta_heading: z.string().optional().nullable(),
  cta_copy: z.string().optional().nullable(),
  cta_label: z.string().optional().nullable(),
  cta_href: z.string().optional().nullable(),
  regional_proof: z.string().optional(),
  related_services: z.array(z.string()).optional(),
  related_industries: z.array(z.string()).optional(),
  related_case_studies: z.array(z.string()).optional(),
  primary_topic: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  region_served: z.string().optional().nullable(),
  page_summary: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  canonical_override: z.string().optional().nullable(),
  noindex: z.boolean().optional(),
  include_in_sitemap: z.boolean().optional(),
  status: z.enum(["draft", "published", "unpublished"]).optional(),
});

export async function saveCmsPageAction(input: z.infer<typeof cmsSaveSchema>) {
  const parsed = cmsSaveSchema.parse(input);
  const { session } = await adminClient();
  const current = await getCmsPageById(parsed.id);
  if (!current) throw new Error("CMS page not found");

  const nextStatus = parsed.status ?? current.status;
  let nextRoute = current.route;
  let nextSlug = current.slug;
  if (parsed.slug && slugify(parsed.slug) && slugify(parsed.slug) !== current.slug) {
    const built = buildCmsRoute({
      pageType: current.page_type,
      slug: parsed.slug,
      regionCode: current.region_code !== "global" ? current.region_code : null,
    });
    nextRoute = built.route;
    nextSlug = built.slug;
    const lists = await collisionLists();
    assertRouteAvailable({ route: nextRoute, ignorePageId: current.id, ...lists });
  }

  const published = nextStatus === "published";
  const next = withCmsPageDefaults({
    ...current,
    page_name: parsed.page_name ?? current.page_name,
    slug: nextSlug,
    route: nextRoute,
    h1: parsed.h1 ?? current.h1,
    intro: parsed.intro ?? current.intro,
    body_html: sanitizeArticleHtml(parsed.body_html ?? current.body_html),
    cta_heading: parsed.cta_heading ?? current.cta_heading,
    cta_copy: parsed.cta_copy ?? current.cta_copy,
    cta_label: parsed.cta_label ?? current.cta_label,
    cta_href: parsed.cta_href ?? current.cta_href,
    regional_proof: parsed.regional_proof ?? current.regional_proof,
    related_services: parsed.related_services ?? current.related_services,
    related_industries: parsed.related_industries ?? current.related_industries,
    related_case_studies: parsed.related_case_studies ?? current.related_case_studies,
    primary_topic: parsed.primary_topic ?? current.primary_topic,
    industry: parsed.industry ?? current.industry,
    region_served: parsed.region_served ?? current.region_served,
    page_summary: parsed.page_summary ?? current.page_summary,
    seo_title: parsed.seo_title ?? current.seo_title,
    meta_description: parsed.meta_description ?? current.meta_description,
    og_title: parsed.og_title ?? current.og_title,
    og_description: parsed.og_description ?? current.og_description,
    og_image_url: parsed.og_image_url ?? current.og_image_url,
    canonical_override: parsed.canonical_override ?? current.canonical_override,
    noindex: parsed.noindex ?? (published ? current.noindex : true),
    include_in_sitemap: published
      ? parsed.include_in_sitemap ?? current.include_in_sitemap
      : false,
    status: nextStatus,
    published_at: published ? current.published_at || new Date().toISOString() : current.published_at,
    updated_at: new Date().toISOString(),
    updated_by: session.user.id,
  });

  await saveCmsPage(next);
  await persistCmsSeo(next, session.user.id);
  revalidateCmsPublic(next.route, current.route);
  revalidatePath(next.base_route);
  return next;
}

export async function deleteCmsPageAction(id: string) {
  const { session } = await adminClient();
  const page = await softDeleteCmsPage(id, session.user.id);
  revalidateCmsPublic(page.route, page.base_route);
  return page;
}

const articleSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
  featured_image_url: z.string().optional().nullable(),
  featured_image_alt: z.string().optional().nullable(),
  category: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  author_name: z.string().optional().default("Mirai Studios"),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_title: z.string().optional().nullable(),
  og_description: z.string().optional().nullable(),
  og_image_url: z.string().optional().nullable(),
  noindex: z.boolean().optional().default(false),
  scheduled_at: z.string().optional().nullable(),
  canonical_override: z.string().optional().nullable(),
  related_services: z.array(z.string()).optional().default([]),
  related_industries: z.array(z.string()).optional().default([]),
  related_articles: z.array(z.string()).optional().default([]),
  related_case_studies: z.array(z.string()).optional().default([]),
});

function articlePayload(parsed: z.infer<typeof articleSchema>, content: string, userId: string) {
  const base: Record<string, unknown> = {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt,
    content,
    featured_image_url: parsed.featured_image_url,
    featured_image_alt: parsed.featured_image_alt,
    category: parsed.category,
    tags: parsed.tags,
    author_name: parsed.author_name,
    seo_title: parsed.seo_title,
    meta_description: parsed.meta_description,
    og_title: parsed.og_title,
    og_description: parsed.og_description,
    og_image_url: parsed.og_image_url,
    noindex: parsed.noindex,
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };
  // Optional columns — stored via extras map if DB lacks them
  return base;
}

export async function saveArticleDraftAction(input: z.infer<typeof articleSchema>) {
  const parsed = articleSchema.parse({
    ...input,
    slug: slugify(input.slug || input.title),
  });
  const { session, supabase } = await adminClient();
  const content = sanitizeArticleHtml(parsed.content || "");
  const payload = articlePayload(parsed, content, session.user.id);
  const articleRoute = `/insights/${parsed.slug}`;

  let previousSlug: string | null = null;
  let wasPublished = false;

  let data: { id: string; slug: string; status?: string; [key: string]: unknown };
  if (parsed.id) {
    const { data: existing } = await supabase
      .from("articles")
      .select("slug, status")
      .eq("id", parsed.id)
      .maybeSingle();
    previousSlug = existing?.slug || null;
    wasPublished = existing?.status === "published";

    const result = await supabase.from("articles").update(payload).eq("id", parsed.id).select("*").single();
    if (result.error) throw new Error(result.error.message);
    data = result.data as { id: string; slug: string; status?: string };
  } else {
    const result = await supabase
      .from("articles")
      .insert({
        ...payload,
        status: "draft",
        created_by: session.user.id,
      })
      .select("*")
      .single();
    if (result.error) throw new Error(result.error.message);
    data = result.data as { id: string; slug: string; status?: string };
  }

  // Best-effort extras — never block the article draft on storage/MIME issues
  try {
    await upsertSeoExtras(articleRoute, {
      route: articleRoute,
      page_name: parsed.title,
      page_type: "insight-article",
      related_services: parsed.related_services,
      related_industries: parsed.related_industries,
      related_case_studies: parsed.related_case_studies,
      canonical_override: parsed.canonical_override,
      page_summary: parsed.excerpt,
      updated_by: session.user.id,
      updated_at: new Date().toISOString(),
      ...(parsed.scheduled_at ? { status: "draft" as const } : {}),
    });
  } catch (error) {
    console.error("[cms] article extras save failed", error);
  }

  revalidatePath("/admin/insights");
  if (data.id) revalidatePath(`/admin/insights/${data.id}`);
  // If the live article was edited via "save draft", refresh public pages too
  if (wasPublished || data.status === "published") {
    revalidateInsights(data.slug);
    if (previousSlug && previousSlug !== data.slug) revalidateInsights(previousSlug);
  }

  return {
    ...data,
    scheduled_at: parsed.scheduled_at,
    related_services: parsed.related_services,
    related_industries: parsed.related_industries,
    related_articles: parsed.related_articles,
    related_case_studies: parsed.related_case_studies,
    canonical_override: parsed.canonical_override,
  };
}

export async function publishArticleAction(
  idOrInput: string | (z.infer<typeof articleSchema> & { id: string }),
) {
  const { session, supabase } = await adminClient();

  // Full payload path: save content + publish atomically (fixes republish not updating)
  if (typeof idOrInput !== "string") {
    const parsed = articleSchema.parse({
      ...idOrInput,
      slug: slugify(idOrInput.slug || idOrInput.title),
    });
    if (!parsed.id) throw new Error("Article id is required to publish");

    const { data: existing } = await supabase.from("articles").select("*").eq("id", parsed.id).single();
    if (!existing) throw new Error("Article not found");

    const content = sanitizeArticleHtml(parsed.content || "");
    const publishedAt = existing.published_at || new Date().toISOString();
    const result = await supabase
      .from("articles")
      .update({
        ...articlePayload(parsed, content, session.user.id),
        status: "published",
        published_at: publishedAt,
      })
      .eq("id", parsed.id)
      .select("*")
      .single();
    if (result.error) throw new Error(result.error.message);

    try {
      await upsertSeoExtras(`/insights/${parsed.slug}`, {
        route: `/insights/${parsed.slug}`,
        page_name: parsed.title,
        page_type: "insight-article",
        related_services: parsed.related_services,
        related_industries: parsed.related_industries,
        related_case_studies: parsed.related_case_studies,
        canonical_override: parsed.canonical_override,
        page_summary: parsed.excerpt,
        status: "published",
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[cms] article extras publish failed", error);
    }

    if (existing.slug && existing.slug !== result.data.slug) {
      revalidateInsights(existing.slug);
    }
    revalidateInsights(result.data.slug);
    revalidatePath("/admin/insights");
    revalidatePath(`/admin/insights/${parsed.id}`);
    return result.data;
  }

  const id = idOrInput;
  const { data: existing } = await supabase.from("articles").select("*").eq("id", id).single();
  if (!existing) throw new Error("Article not found");

  const publishedAt = existing.published_at || new Date().toISOString();
  const { data, error } = await supabase
    .from("articles")
    .update({
      status: "published",
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidateInsights(data.slug);
  revalidatePath("/admin/insights");
  return data;
}

export async function unpublishArticleAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .update({
      status: "unpublished",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const featuredId = await getHomepageFeaturedArticleId();
  if (featuredId === id) {
    await setHomepageFeaturedArticleId(null);
  }
  revalidateInsights(data.slug);
  revalidatePath("/admin/insights");
  return data;
}

export async function softDeleteArticleAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("articles")
    .update({
      deleted_at: new Date().toISOString(),
      status: "unpublished",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  const featuredId = await getHomepageFeaturedArticleId();
  if (featuredId === id) {
    await setHomepageFeaturedArticleId(null);
  }
  revalidateInsights(data.slug);
  revalidatePath("/admin/insights");
  return data;
}

export async function setHomepageFeaturedArticleAction(articleId: string | null) {
  await adminClient();
  if (articleId) {
    const { supabase } = await adminClient();
    const { data, error } = await supabase
      .from("articles")
      .select("id, status")
      .eq("id", articleId)
      .is("deleted_at", null)
      .maybeSingle();
    if (error || !data) throw new Error("Article not found");
    if (data.status !== "published") {
      throw new Error("Only published articles can be featured on the homepage");
    }
  }
  await setHomepageFeaturedArticleId(articleId);
  revalidatePath("/");
  revalidatePath("/admin/insights");
  return articleId;
}

const jobSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  department: z.string().optional().default(""),
  location: z.string().optional().default(""),
  workplace_type: z.string().optional().default(""),
  employment_type: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  description: z.string().optional().default(""),
  requirements: z.string().optional().default(""),
  nice_to_have: z.string().optional().default(""),
  application_type: z.enum(["email", "url", "both"]).optional().default("email"),
  application_url: z.string().optional().nullable(),
  application_email: z.string().optional().nullable(),
  valid_through: z.string().optional().nullable(),
  seo_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

export async function saveJobDraftAction(input: z.infer<typeof jobSchema>) {
  const parsed = jobSchema.parse({
    ...input,
    slug: slugify(input.slug || input.title),
  });
  const { session, supabase } = await adminClient();

  const payload = {
    title: parsed.title,
    slug: parsed.slug,
    department: parsed.department,
    location: parsed.location,
    workplace_type: parsed.workplace_type,
    employment_type: parsed.employment_type,
    summary: parsed.summary,
    description: sanitizeArticleHtml(parsed.description || ""),
    requirements: sanitizeArticleHtml(parsed.requirements || ""),
    nice_to_have: sanitizeArticleHtml(parsed.nice_to_have || ""),
    application_type: parsed.application_type,
    application_url: parsed.application_url,
    application_email: parsed.application_email,
    valid_through: parsed.valid_through,
    seo_title: parsed.seo_title,
    meta_description: parsed.meta_description,
    updated_at: new Date().toISOString(),
    updated_by: session.user.id,
  };

  if (parsed.id) {
    const { data, error } = await supabase.from("jobs").update(payload).eq("id", parsed.id).select("*").single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/careers");
    return data;
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...payload,
      status: "draft",
      created_by: session.user.id,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/careers");
  return data;
}

export async function publishJobAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data: existing } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (!existing) throw new Error("Job not found");
  const publishedAt = existing.published_at || new Date().toISOString();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "published",
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidateCareers(data.slug);
  revalidatePath("/admin/careers");
  return data;
}

export async function closeJobAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "closed",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidateCareers(data.slug);
  revalidatePath("/admin/careers");
  return data;
}

export async function unpublishJobAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      status: "unpublished",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidateCareers(data.slug);
  revalidatePath("/admin/careers");
  return data;
}

export async function softDeleteJobAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("jobs")
    .update({
      deleted_at: new Date().toISOString(),
      status: "unpublished",
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidateCareers(data.slug);
  revalidatePath("/admin/careers");
  return data;
}

export async function uploadMediaAction(formData: FormData) {
  const { session, supabase } = await adminClient();
  const file = formData.get("file");
  const altText = String(formData.get("alt_text") || "");

  if (!(file instanceof File)) throw new Error("No file provided");
  if (!ALLOWED_MEDIA_MIME.includes(file.type as (typeof ALLOWED_MEDIA_MIME)[number])) {
    throw new Error("Unsupported file type. Use JPG, PNG, WebP or AVIF.");
  }
  if (file.size > MAX_MEDIA_BYTES) {
    throw new Error("File exceeds 5MB limit.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const path = `uploads/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from("website-media").upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicData } = supabase.storage.from("website-media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      storage_path: path,
      public_url: publicData.publicUrl,
      file_name: file.name,
      mime_type: file.type,
      byte_size: file.size,
      alt_text: altText,
      created_by: session.user.id,
      updated_by: session.user.id,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  return data;
}

export async function updateMediaAltAction(id: string, altText: string) {
  const { session, supabase } = await adminClient();
  const { data, error } = await supabase
    .from("media_assets")
    .update({
      alt_text: altText,
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  return data;
}

export async function softDeleteMediaAction(id: string) {
  const { session, supabase } = await adminClient();
  const { data: asset } = await supabase.from("media_assets").select("*").eq("id", id).single();
  if (!asset) throw new Error("Asset not found");

  const [{ count: articleCount }, { count: jobCount }, { count: seoCount }] = await Promise.all([
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .or(`featured_image_url.eq.${asset.public_url},og_image_url.eq.${asset.public_url}`)
      .is("deleted_at", null),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null),
    supabase.from("page_seo").select("*", { count: "exact", head: true }).eq("og_image_url", asset.public_url),
  ]);

  const inUse = (articleCount || 0) + (seoCount || 0) > 0;
  if (inUse) {
    throw new Error("This asset may still be in use. Remove references before deleting.");
  }
  void jobCount;

  const { error: storageError } = await supabase.storage.from("website-media").remove([asset.storage_path]);
  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase
    .from("media_assets")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      updated_by: session.user.id,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
  return data;
}

export async function signInAdminAction(email: string, password: string) {
  assertConfigured();
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error("Sign-in failed.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error(profileError.message || "Could not verify admin access.");
  }

  if (!profile || !(profile as { is_admin?: boolean }).is_admin) {
    await supabase.auth.signOut();
    throw new Error("This account is not authorized for Site Ops.");
  }

  return { ok: true };
}

export async function signOutAdminAction() {
  if (!isSupabaseConfigured()) return;
  const supabase = createServerSupabaseClient();
  await supabase.auth.signOut();
}
