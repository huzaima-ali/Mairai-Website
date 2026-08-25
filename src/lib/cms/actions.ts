"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/cms/auth";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { slugify, ALLOWED_MEDIA_MIME, MAX_MEDIA_BYTES } from "@/lib/cms/utils";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { articlePublicUrl } from "@/lib/cms/articles";
import { jobPublicUrl } from "@/lib/cms/jobs";
import { upsertSeoExtras, saveCmsPage, softDeleteCmsPage, listCmsPages, getCmsPageByRoute } from "@/lib/cms/ops-store";
import { regionalRouteFor } from "@/lib/cms/seo-helpers";
import { REGION_VARIANT_OPTIONS, type CmsPageRow } from "@/lib/cms/types";
import { randomUUID } from "crypto";
import { getServicePage } from "@/lib/services";
import { getRegistryPage } from "@/lib/cms/route-registry";

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
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(articlePublicUrl(slug));
  revalidatePath("/");
}

function revalidateCareers(slug?: string) {
  revalidatePath("/careers");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(jobPublicUrl(slug));
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

  // Extended SEO / AIO fields live in ops storage (works without DDL)
  await upsertSeoExtras(parsed.route, {
    ...parsed,
    updated_by: session.user.id,
    updated_at: new Date().toISOString(),
  });

  revalidatePath(parsed.route);
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
  return data;
}

export async function createRegionalVariantAction(input: {
  baseRoute: string;
  regionCode: "us" | "uk" | "mena" | "custom";
  customPrefix?: string;
}) {
  const { session } = await adminClient();
  const region = REGION_VARIANT_OPTIONS.find((r) => r.code === input.regionCode);
  if (!region) throw new Error("Invalid region");

  const baseRoute = input.baseRoute.startsWith("/") ? input.baseRoute : `/${input.baseRoute}`;
  const route = regionalRouteFor(baseRoute, input.regionCode, input.customPrefix);
  const existing = await getCmsPageByRoute(route);
  if (existing) throw new Error(`A variant already exists at ${route}`);

  const registry = getRegistryPage(baseRoute);
  const service = baseRoute.startsWith("/services/")
    ? getServicePage(baseRoute.replace("/services/", ""))
    : null;

  const pageName = `${registry?.pageName || service?.title || baseRoute} (${region.label})`;
  const now = new Date().toISOString();
  const page: CmsPageRow = {
    id: randomUUID(),
    route,
    base_route: baseRoute,
    region_code: input.regionCode,
    region_label: region.label,
    page_name: pageName,
    page_type: registry?.pageType || "service-detail",
    status: "draft",
    h1: service?.h1 || registry?.defaultTitle || pageName,
    intro: service?.intro || registry?.defaultDescription || "",
    body_html: service
      ? service.sections
          .map(
            (section) =>
              `<h2>${section.heading}</h2>${section.body.map((p) => `<p>${p}</p>`).join("")}${
                section.bullets?.length
                  ? `<ul>${section.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
                  : ""
              }`,
          )
          .join("")
      : "",
    cta_label: service?.ctaLabel || "Request a call",
    cta_href: service?.ctaHref || "/#contact",
    regional_proof: "",
    related_services: service?.relatedServices?.map((l) => l.href) || [],
    related_industries: [],
    related_case_studies: service?.relatedCaseStudies || [],
    primary_topic: service?.title || registry?.defaultTitle || null,
    industry: null,
    region_served: region.areaServed || null,
    page_summary: registry?.defaultDescription || service?.metaDescription || null,
    created_at: now,
    updated_at: now,
    created_by: session.user.id,
    updated_by: session.user.id,
    deleted_at: null,
  };

  await saveCmsPage(page);
  await upsertSeoExtras(route, {
    route,
    page_name: pageName,
    page_type: page.page_type,
    seo_title: `${service?.title || registry?.defaultTitle || pageName} in ${region.label}`,
    meta_description: page.page_summary,
    noindex: true,
    nofollow: false,
    include_in_sitemap: false,
    status: "draft",
    region_code: input.regionCode,
    base_route: baseRoute,
    region_served: region.areaServed || null,
    schema_area_served: region.areaServed || null,
    breadcrumb_label: pageName,
    related_services: page.related_services,
    related_case_studies: page.related_case_studies,
    updated_by: session.user.id,
    updated_at: now,
  });

  // Ensure a page_seo stub exists
  const { supabase } = await adminClient();
  await supabase.from("page_seo").upsert(
    {
      route,
      page_name: pageName,
      page_type: page.page_type,
      seo_title: `${service?.title || registry?.defaultTitle || pageName} in ${region.label}`,
      meta_description: page.page_summary,
      noindex: true,
      updated_at: now,
      updated_by: session.user.id,
    },
    { onConflict: "route" },
  );

  revalidatePath("/admin/pages");
  return page;
}

export async function saveCmsPageAction(input: {
  id: string;
  h1: string;
  intro: string;
  body_html: string;
  cta_label?: string | null;
  cta_href?: string | null;
  regional_proof?: string;
  related_services?: string[];
  related_industries?: string[];
  related_case_studies?: string[];
  primary_topic?: string | null;
  industry?: string | null;
  region_served?: string | null;
  page_summary?: string | null;
  status?: "draft" | "published" | "unpublished";
}) {
  const { session } = await adminClient();
  const pages = await listCmsPages();
  const current = pages.find((p) => p.id === input.id);
  if (!current) throw new Error("CMS page not found");

  const next: CmsPageRow = {
    ...current,
    h1: input.h1,
    intro: input.intro,
    body_html: sanitizeArticleHtml(input.body_html || ""),
    cta_label: input.cta_label ?? current.cta_label,
    cta_href: input.cta_href ?? current.cta_href,
    regional_proof: input.regional_proof ?? current.regional_proof,
    related_services: input.related_services ?? current.related_services,
    related_industries: input.related_industries ?? current.related_industries,
    related_case_studies: input.related_case_studies ?? current.related_case_studies,
    primary_topic: input.primary_topic ?? current.primary_topic,
    industry: input.industry ?? current.industry,
    region_served: input.region_served ?? current.region_served,
    page_summary: input.page_summary ?? current.page_summary,
    status: input.status ?? current.status,
    updated_at: new Date().toISOString(),
    updated_by: session.user.id,
  };

  await saveCmsPage(next);

  const published = next.status === "published";
  await upsertSeoExtras(next.route, {
    route: next.route,
    status: next.status,
    noindex: !published,
    include_in_sitemap: published,
    region_served: next.region_served,
    page_summary: next.page_summary,
    primary_topic: next.primary_topic,
    industry: next.industry,
    related_services: next.related_services,
    related_industries: next.related_industries,
    related_case_studies: next.related_case_studies,
    updated_at: next.updated_at,
    updated_by: session.user.id,
  });

  revalidatePath(next.route);
  revalidatePath(next.base_route);
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
  return next;
}

export async function deleteCmsPageAction(id: string) {
  const { session } = await adminClient();
  const page = await softDeleteCmsPage(id, session.user.id);
  revalidatePath(page.route);
  revalidatePath("/admin/pages");
  revalidatePath("/sitemap.xml");
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

  // Persist related/schedule/canonical in ops extras keyed by article route
  const articleRoute = `/insights/${parsed.slug}`;
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
  });

  // Keep schedule intent on extras (status remains draft until publish)
  if (parsed.scheduled_at) {
    await upsertSeoExtras(articleRoute, {
      route: articleRoute,
      status: "draft",
      updated_at: parsed.scheduled_at,
    });
  }

  if (parsed.id) {
    const { data, error } = await supabase.from("articles").update(payload).eq("id", parsed.id).select("*").single();
    if (error) throw new Error(error.message);
    revalidatePath("/admin/insights");
    return { ...data, scheduled_at: parsed.scheduled_at, related_services: parsed.related_services, related_industries: parsed.related_industries, related_articles: parsed.related_articles, related_case_studies: parsed.related_case_studies, canonical_override: parsed.canonical_override };
  }

  const { data, error } = await supabase
    .from("articles")
    .insert({
      ...payload,
      status: "draft",
      created_by: session.user.id,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  revalidatePath("/admin/insights");
  return { ...data, scheduled_at: parsed.scheduled_at, related_services: parsed.related_services, related_industries: parsed.related_industries, related_articles: parsed.related_articles, related_case_studies: parsed.related_case_studies, canonical_override: parsed.canonical_override };
}

export async function publishArticleAction(id: string) {
  const { session, supabase } = await adminClient();
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
  revalidateInsights(data.slug);
  revalidatePath("/admin/insights");
  return data;
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
