import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN, absoluteUrl } from "@/lib/seo";
import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { SERVICE_PAGES } from "@/lib/services";
import { REGION_PAGES } from "@/lib/regions";
import { INSIGHT_ARTICLES, getInsightUrl } from "@/lib/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: CANONICAL_ORIGIN,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...SERVICE_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.85,
    })),
    {
      url: absoluteUrl("/regions"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...REGION_PAGES.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/partners"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/insights"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...INSIGHT_ARTICLES.map((article) => ({
      url: absoluteUrl(getInsightUrl(article.slug)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
    {
      url: absoluteUrl("/careers"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    },
    ...CASE_STUDIES.map((study) => ({
      url: absoluteUrl(getCaseStudyUrl(study.slug)),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...LEGAL_DOCUMENTS.map((doc) => ({
      url: absoluteUrl(doc.path),
      lastModified: new Date("2026-08-15"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
