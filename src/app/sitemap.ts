import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { CASE_STUDIES, getCaseStudyAbsoluteUrl } from "@/lib/case-studies";
import { LEGAL_DOCUMENTS } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...CASE_STUDIES.map((study) => ({
      url: getCaseStudyAbsoluteUrl(study.slug),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...LEGAL_DOCUMENTS.map((doc) => ({
      url: `${SITE.url}${doc.path}`,
      lastModified: new Date("2026-08-15"),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
