import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";
import { CASE_STUDIES, getCaseStudyAbsoluteUrl } from "@/lib/case-studies";

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
  ];
}
