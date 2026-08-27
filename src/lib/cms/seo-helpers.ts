import type { PageSeoRow, CmsPageRow } from "@/lib/cms/types";
import { CANONICAL_ORIGIN } from "@/lib/seo";

export type SchemaHint = {
  type: string;
  source: "site" | "page" | "cms";
  note: string;
};

export function inferActiveSchemas(input: {
  route: string;
  pageType: string;
  override?: PageSeoRow | null;
  cmsPage?: CmsPageRow | null;
}): SchemaHint[] {
  const schemas: SchemaHint[] = [
    { type: "Organization", source: "site", note: "Sitewide from root layout" },
    { type: "WebSite", source: "site", note: "Sitewide from root layout" },
    { type: "BreadcrumbList", source: "page", note: "Emitted on detail/hub pages" },
  ];

  const type = input.pageType;
  if (type === "service" || type === "service-detail") {
    schemas.push({ type: "Service", source: "page", note: "Service schema from page fields / areaServed" });
  }
  if (type === "industry" || type === "landing" || type === "region" || type === "region-detail") {
    schemas.push({ type: "WebPage", source: "page", note: "WebPage schema for industry, region and landing pages" });
  }
  if (type === "insight-article") {
    schemas.push({ type: "Article", source: "page", note: "Article JSON-LD on insight pages" });
  }
  if (type === "case-study") {
    schemas.push({ type: "CreativeWork", source: "page", note: "Case study CreativeWork" });
  }
  if (type === "job") {
    schemas.push({ type: "JobPosting", source: "page", note: "Only for published open roles" });
  }
  if (input.override?.schema_types?.length) {
    for (const t of input.override.schema_types) {
      if (!schemas.some((s) => s.type === t)) {
        schemas.push({ type: t, source: "cms", note: "Enabled via Site Ops schema fields" });
      }
    }
  }
  return schemas;
}

export function buildSeoWarnings(input: {
  seoTitle: string;
  metaDescription: string;
  canonical: string;
  ogImage: string;
  h1?: string;
  noindex?: boolean;
  bodyHtml?: string;
  allTitles?: string[];
  allDescriptions?: string[];
  baseRoute?: string | null;
  regionalBody?: string;
  baseBodySample?: string;
}): string[] {
  const warnings: string[] = [];
  if (!input.seoTitle.trim()) warnings.push("Missing SEO title");
  if (!input.metaDescription.trim()) warnings.push("Missing meta description");
  if (!input.canonical.trim()) warnings.push("Missing canonical");
  if (!input.ogImage.trim()) warnings.push("Missing OG image");
  if (input.h1 !== undefined && !input.h1.trim()) warnings.push("Missing H1");
  if (input.noindex) warnings.push("Page set to Noindex");
  if (input.bodyHtml !== undefined) {
    const hasInternalLink = /href=["']\//.test(input.bodyHtml);
    if (input.bodyHtml.length > 40 && !hasInternalLink) {
      warnings.push("No internal links detected in body");
    }
  }
  const titleCount = (input.allTitles || []).filter((t) => t && t === input.seoTitle).length;
  if (titleCount > 1) warnings.push("Duplicate title across pages");
  const descCount = (input.allDescriptions || []).filter((d) => d && d === input.metaDescription).length;
  if (descCount > 1) warnings.push("Duplicate description across pages");

  if (input.baseRoute && input.regionalBody && input.baseBodySample) {
    const a = input.regionalBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
    const b = input.baseBodySample.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
    if (a.length > 80 && b.length > 80) {
      const overlap = similarity(a, b);
      if (overlap > 0.85) {
        warnings.push("Regional variant looks too similar to the source page");
      }
    }
  }

  if (input.seoTitle.length > 0 && (input.seoTitle.length < 30 || input.seoTitle.length > 65)) {
    warnings.push("Title length outside typical 30–65 range");
  }
  if (input.metaDescription.length > 0 && (input.metaDescription.length < 70 || input.metaDescription.length > 170)) {
    warnings.push("Description length outside typical 70–170 range");
  }

  void CANONICAL_ORIGIN;
  return warnings;
}

export function contentSimilarity(a: string, b: string) {
  const na = a.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const nb = b.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  return similarity(na, nb);
}

export function similarity(a: string, b: string) {
  const ta = new Set(a.split(" ").filter((w) => w.length > 3));
  const tb = new Set(b.split(" ").filter((w) => w.length > 3));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter += 1;
  return inter / Math.max(ta.size, tb.size);
}

export function regionalRouteFor(baseRoute: string, regionCode: string, customSlug?: string) {
  if (regionCode === "custom") {
    const slug = customSlug?.replace(/^\/+|\/+$/g, "") || "custom";
    return `/${slug}${baseRoute.startsWith("/") ? baseRoute : `/${baseRoute}`}`;
  }
  const prefix = regionCode === "us" ? "/us" : regionCode === "uk" ? "/uk" : regionCode === "mena" ? "/mena" : "";
  return `${prefix}${baseRoute.startsWith("/") ? baseRoute : `/${baseRoute}`}`;
}
