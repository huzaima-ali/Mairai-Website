import type { Metadata } from "next";
import { buildPageMetadata, absoluteUrl } from "@/lib/seo";
import { getRegistryPage } from "@/lib/cms/route-registry";
import type { PageSeoRow } from "@/lib/cms/types";
import { createServiceSupabaseClient, hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/server";
import { getSeoExtras, getSeoExtrasMap } from "@/lib/cms/ops-store";

function mergeSeo(row: PageSeoRow | null, extras: Partial<PageSeoRow>): PageSeoRow | null {
  if (!row && !Object.keys(extras).length) return null;
  return {
    id: row?.id || extras.id || "extras",
    route: row?.route || extras.route || "",
    page_name: row?.page_name || extras.page_name || "",
    page_type: row?.page_type || extras.page_type || "other",
    seo_title: extras.seo_title ?? row?.seo_title ?? null,
    meta_description: extras.meta_description ?? row?.meta_description ?? null,
    og_title: extras.og_title ?? row?.og_title ?? null,
    og_description: extras.og_description ?? row?.og_description ?? null,
    og_image_url: extras.og_image_url ?? row?.og_image_url ?? null,
    noindex: extras.noindex ?? row?.noindex ?? false,
    nofollow: extras.nofollow ?? row?.nofollow ?? false,
    twitter_title: extras.twitter_title ?? row?.twitter_title ?? null,
    twitter_description: extras.twitter_description ?? row?.twitter_description ?? null,
    twitter_image_url: extras.twitter_image_url ?? row?.twitter_image_url ?? null,
    twitter_card: extras.twitter_card ?? row?.twitter_card ?? "summary_large_image",
    breadcrumb_label: extras.breadcrumb_label ?? row?.breadcrumb_label ?? null,
    include_in_sitemap: extras.include_in_sitemap ?? row?.include_in_sitemap ?? true,
    sitemap_priority: extras.sitemap_priority ?? row?.sitemap_priority ?? null,
    canonical_override: extras.canonical_override ?? row?.canonical_override ?? null,
    page_summary: extras.page_summary ?? row?.page_summary ?? null,
    primary_topic: extras.primary_topic ?? row?.primary_topic ?? null,
    industry: extras.industry ?? row?.industry ?? null,
    region_served: extras.region_served ?? row?.region_served ?? null,
    related_services: extras.related_services ?? row?.related_services ?? [],
    related_industries: extras.related_industries ?? row?.related_industries ?? [],
    related_case_studies: extras.related_case_studies ?? row?.related_case_studies ?? [],
    schema_area_served: extras.schema_area_served ?? row?.schema_area_served ?? null,
    schema_service_name: extras.schema_service_name ?? row?.schema_service_name ?? null,
    schema_types: extras.schema_types ?? row?.schema_types ?? [],
    advanced_schema_json: extras.advanced_schema_json ?? row?.advanced_schema_json ?? null,
    region_code: extras.region_code ?? row?.region_code ?? null,
    base_route: extras.base_route ?? row?.base_route ?? null,
    status: extras.status ?? row?.status ?? "published",
    created_at: row?.created_at || extras.created_at || new Date().toISOString(),
    updated_at: extras.updated_at || row?.updated_at || new Date().toISOString(),
    updated_by: extras.updated_by ?? row?.updated_by ?? null,
  };
}

export async function getPageSeoOverride(route: string): Promise<PageSeoRow | null> {
  let row: PageSeoRow | null = null;
  if (isSupabaseConfigured() && hasServiceRole()) {
    try {
      const supabase = createServiceSupabaseClient();
      const { data, error } = await supabase.from("page_seo").select("*").eq("route", route).maybeSingle();
      if (!error && data) row = data as PageSeoRow;
    } catch {
      // fall through
    }
  }
  const extras = await getSeoExtras(route);
  return mergeSeo(row, extras);
}

export async function getAllPageSeoOverrides(): Promise<PageSeoRow[]> {
  const extrasMap = await getSeoExtrasMap();
  const byRoute = new Map<string, PageSeoRow>();

  if (isSupabaseConfigured() && hasServiceRole()) {
    try {
      const supabase = createServiceSupabaseClient();
      const { data } = await supabase.from("page_seo").select("*").order("updated_at", { ascending: false });
      for (const row of (data || []) as PageSeoRow[]) {
        byRoute.set(row.route, mergeSeo(row, extrasMap[row.route] || {})!);
      }
    } catch {
      // ignore
    }
  }

  for (const [route, extras] of Object.entries(extrasMap)) {
    if (!byRoute.has(route)) {
      const merged = mergeSeo(null, { ...extras, route });
      if (merged) byRoute.set(route, merged);
    }
  }

  return Array.from(byRoute.values()).sort(
    (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
  );
}

type ResolveInput = {
  path: string;
  title?: string;
  description?: string;
  ogImage?: string;
  index?: boolean;
  follow?: boolean;
  type?: "website" | "article";
  ogTitle?: string;
  ogDescription?: string;
};

/**
 * Code defaults + optional admin override. Override wins when present.
 * DB/storage failure falls back to code metadata (never blank).
 */
export async function resolvePageMetadata(input: ResolveInput): Promise<Metadata> {
  const registry = getRegistryPage(input.path);
  const defaults = {
    title: input.title ?? registry?.defaultTitle ?? "Mirai Studios",
    description: input.description ?? registry?.defaultDescription ?? "",
    path: input.path,
    index: input.index ?? registry?.indexable ?? true,
    follow: input.follow ?? true,
    ogImage: input.ogImage ?? registry?.defaultOgImage,
    type: input.type ?? "website",
  };

  let override: PageSeoRow | null = null;
  try {
    override = await getPageSeoOverride(input.path);
  } catch {
    override = null;
  }

  if (!override) {
    return buildPageMetadata({
      title: defaults.title,
      description: defaults.description,
      path: defaults.path,
      index: defaults.index,
      follow: defaults.follow,
      ogImage: defaults.ogImage,
      type: defaults.type,
    });
  }

  // Draft CMS SEO rows stay noindex
  const draftBlocked = override.status === "draft" || override.status === "unpublished";
  const title = override.seo_title?.trim() || defaults.title;
  const description = override.meta_description?.trim() || defaults.description;
  const ogImage = override.og_image_url?.trim() || defaults.ogImage;
  const index = draftBlocked || override.noindex ? false : defaults.index;
  const follow = override.nofollow ? false : defaults.follow;
  const canonicalPath = override.canonical_override?.trim() || defaults.path;

  const base = buildPageMetadata({
    title,
    description,
    path: canonicalPath.startsWith("http") ? defaults.path : canonicalPath,
    index,
    follow,
    ogImage,
    type: defaults.type,
    canonicalUrl: override.canonical_override?.startsWith("http")
      ? override.canonical_override
      : undefined,
    ogTitle: override.og_title?.trim() || undefined,
    ogDescription: override.og_description?.trim() || undefined,
    twitterTitle: override.twitter_title?.trim() || undefined,
    twitterDescription: override.twitter_description?.trim() || undefined,
    twitterImage: override.twitter_image_url?.trim() || undefined,
    twitterCard: (override.twitter_card as "summary" | "summary_large_image" | undefined) || undefined,
  });

  return base;
}

export function parseAdvancedSchemaJson(raw: string | null | undefined): Record<string, unknown> | null {
  if (!raw?.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    if (!("@type" in parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function absoluteCanonical(pathOrUrl: string) {
  return pathOrUrl.startsWith("http") ? pathOrUrl : absoluteUrl(pathOrUrl);
}
