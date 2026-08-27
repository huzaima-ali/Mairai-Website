import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { REGION_PAGES, getRegionPage } from "@/lib/regions";
import { SERVICE_PAGES, getServicePage, type MarketingPage } from "@/lib/services";
import { getStaticRegistryPages } from "@/lib/cms/route-registry";
import { slugify } from "@/lib/cms/utils";
import {
  CMS_PAGE_TYPE_OPTIONS,
  REGION_VARIANT_OPTIONS,
  type CmsManagedPageType,
  type CmsPageRow,
  type CmsPageStatus,
} from "@/lib/cms/types";
import { regionalRouteFor } from "@/lib/cms/seo-helpers";

/** First-path segments and exact routes that CMS pages must never occupy. */
export const RESERVED_PATH_PREFIXES = [
  "/admin",
  "/api",
  "/work",
  "/insights",
  "/careers",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/dev",
  "/_next",
  "/_cms",
] as const;

export const RESERVED_EXACT_ROUTES = new Set([
  "/",
  "/services",
  "/regions",
  "/partners",
  "/insights",
  "/careers",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/admin",
  "/login",
  "/contact",
  "/sitemap.xml",
  "/robots.txt",
  "/opengraph-image",
  "/icon",
]);

export function normalizeRoute(input: string) {
  const trimmed = input.trim();
  if (!trimmed || trimmed === "/") return "/";
  const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withSlash.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

export function slugFromRoute(route: string) {
  const parts = normalizeRoute(route).split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export function prefixForPageType(pageType: string) {
  const match = CMS_PAGE_TYPE_OPTIONS.find((opt) => opt.value === pageType);
  return match?.prefix || "/landing";
}

export function kindSegmentForPageType(pageType: string) {
  const prefix = prefixForPageType(pageType);
  return prefix.replace(/^\//, "") || "landing";
}

export function buildCmsRoute(input: {
  pageType: string;
  slug: string;
  regionCode?: string | null;
  customPrefix?: string;
}) {
  const slug = slugify(input.slug);
  if (!slug) throw new Error("A valid slug is required");
  const kind = kindSegmentForPageType(input.pageType);
  const baseRoute = `/${kind}/${slug}`;
  const regionCode = input.regionCode && input.regionCode !== "global" ? input.regionCode : null;
  if (!regionCode) return { route: baseRoute, baseRoute, slug };
  const route = regionalRouteFor(baseRoute, regionCode, input.customPrefix);
  return { route: normalizeRoute(route), baseRoute, slug };
}

export function isReservedRoute(route: string) {
  const normalized = normalizeRoute(route);
  if (RESERVED_EXACT_ROUTES.has(normalized)) return true;
  return RESERVED_PATH_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}

export function codeOwnedRoutes() {
  const routes = new Set<string>(getStaticRegistryPages().map((page) => page.route));
  for (const study of CASE_STUDIES) routes.add(getCaseStudyUrl(study.slug));
  for (const doc of LEGAL_DOCUMENTS) routes.add(doc.path);
  for (const page of SERVICE_PAGES) routes.add(page.path);
  for (const page of REGION_PAGES) routes.add(page.path);
  return routes;
}

export type CollisionCheckInput = {
  route: string;
  ignorePageId?: string | null;
  cmsPages: Array<Pick<CmsPageRow, "id" | "route" | "deleted_at">>;
  articleRoutes?: string[];
  jobRoutes?: string[];
};

export function findRouteCollision({
  route,
  ignorePageId,
  cmsPages,
  articleRoutes = [],
  jobRoutes = [],
}: CollisionCheckInput) {
  const normalized = normalizeRoute(route);

  if (isReservedRoute(normalized)) {
    return `“${normalized}” is a protected system route and cannot be used.`;
  }

  const codeRoutes = codeOwnedRoutes();
  if (codeRoutes.has(normalized)) {
    return `“${normalized}” is already used by a code-defined marketing page. Choose a different slug.`;
  }

  if (articleRoutes.includes(normalized)) {
    return `“${normalized}” collides with a published insight article.`;
  }
  if (jobRoutes.includes(normalized)) {
    return `“${normalized}” collides with a careers route.`;
  }

  const cmsHit = cmsPages.find(
    (page) => !page.deleted_at && page.route === normalized && page.id !== ignorePageId,
  );
  if (cmsHit) {
    return `“${normalized}” is already used by another CMS page.`;
  }

  return null;
}

export function assertRouteAvailable(input: CollisionCheckInput) {
  const error = findRouteCollision(input);
  if (error) throw new Error(error);
}

export function marketingPageToHtml(page: MarketingPage) {
  return page.sections
    .map((section) => {
      const paras = section.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";
      return `<h2>${escapeHtml(section.heading)}</h2>${paras}${bullets}`;
    })
    .join("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function lookupCodeMarketingPage(route: string): MarketingPage | null {
  const normalized = normalizeRoute(route);
  if (normalized.startsWith("/services/")) {
    return getServicePage(normalized.replace("/services/", "")) || null;
  }
  if (normalized.startsWith("/regions/")) {
    return getRegionPage(normalized.replace("/regions/", "")) || null;
  }
  return null;
}

export function defaultCmsFieldsFromName(pageName: string, h1?: string) {
  const heading = (h1 || pageName).trim();
  return {
    seo_title: heading,
    meta_description: heading
      ? `${heading} — Mirai Studios designs and builds AI products, agents and digital twins.`
      : "",
    og_title: heading,
    og_description: "",
  };
}

export function withCmsPageDefaults(
  page: Partial<CmsPageRow> & Pick<CmsPageRow, "id" | "route" | "page_name">,
): CmsPageRow {
  const route = normalizeRoute(page.route);
  const slug = page.slug || slugFromRoute(route);
  return {
    id: page.id,
    route,
    slug,
    base_route: page.base_route || route,
    region_code: page.region_code || "global",
    region_label: page.region_label || "Global",
    page_name: page.page_name,
    page_type: page.page_type || "landing",
    status: (page.status as CmsPageStatus) || "draft",
    source_page_id: page.source_page_id ?? null,
    source_route: page.source_route ?? null,
    source_page_name: page.source_page_name ?? null,
    h1: page.h1 || page.page_name,
    intro: page.intro || "",
    body_html: page.body_html || "",
    cta_heading: page.cta_heading ?? "Ready to talk through a project?",
    cta_copy:
      page.cta_copy ??
      "Tell us what you are building. The Mirai team will follow up to discuss scope, approach and next steps.",
    cta_label: page.cta_label ?? "Request a call",
    cta_href: page.cta_href ?? "/#contact",
    regional_proof: page.regional_proof || "",
    related_services: page.related_services || [],
    related_industries: page.related_industries || [],
    related_case_studies: page.related_case_studies || [],
    primary_topic: page.primary_topic ?? null,
    industry: page.industry ?? null,
    region_served: page.region_served ?? null,
    page_summary: page.page_summary ?? null,
    seo_title: page.seo_title ?? null,
    meta_description: page.meta_description ?? null,
    og_title: page.og_title ?? null,
    og_description: page.og_description ?? null,
    og_image_url: page.og_image_url ?? null,
    canonical_override: page.canonical_override ?? null,
    noindex: page.noindex ?? page.status !== "published",
    include_in_sitemap: page.include_in_sitemap ?? page.status === "published",
    published_at: page.published_at ?? null,
    created_at: page.created_at || new Date().toISOString(),
    updated_at: page.updated_at || new Date().toISOString(),
    created_by: page.created_by ?? null,
    updated_by: page.updated_by ?? null,
    deleted_at: page.deleted_at ?? null,
  };
}

export function isRegionalCmsPage(page: Pick<CmsPageRow, "region_code" | "base_route" | "route">) {
  return Boolean(page.region_code && page.region_code !== "global" && page.route !== page.base_route);
}

export function canDuplicateRoute(route: string, pageType?: string) {
  const normalized = normalizeRoute(route);
  if (isReservedRoute(normalized) && normalized !== "/partners") return false;
  if (["insight-article", "job", "legal", "home", "insights", "careers"].includes(pageType || "")) {
    return false;
  }
  return true;
}

export function canCreateRegionalVariant(route: string, regionCode?: string | null, pageType?: string) {
  if (!canDuplicateRoute(route, pageType)) return false;
  if (regionCode && regionCode !== "global") return false;
  const normalized = normalizeRoute(route);
  if (normalized === "/") return false;
  return true;
}

export function suggestedRegionalSlug(sourceRoute: string, regionCode: string, customPrefix?: string) {
  return regionalRouteFor(normalizeRoute(sourceRoute), regionCode, customPrefix);
}

export function regionOption(code: string) {
  return REGION_VARIANT_OPTIONS.find((option) => option.code === code);
}

export type { CmsManagedPageType };
