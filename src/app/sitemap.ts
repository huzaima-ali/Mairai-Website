import type { MetadataRoute } from "next";
import { CANONICAL_ORIGIN, absoluteUrl } from "@/lib/seo";
import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import { LEGAL_DOCUMENTS } from "@/lib/legal";
import { SERVICE_PAGES } from "@/lib/services";
import { REGION_PAGES } from "@/lib/regions";
import { listPublishedArticles, articlePublicUrl } from "@/lib/cms/articles";
import { listOpenJobs, jobPublicUrl } from "@/lib/cms/jobs";
import { listPublishedCmsPages } from "@/lib/cms/ops-store";
import { getPageSeoOverride } from "@/lib/cms/seo-overrides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [articles, jobs, cmsPages] = await Promise.all([
    listPublishedArticles(),
    listOpenJobs(),
    listPublishedCmsPages(),
  ]);

  async function entry(
    path: string,
    defaults: {
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority: number;
      lastModified?: Date;
    },
  ) {
    const override = await getPageSeoOverride(path);
    if (override?.include_in_sitemap === false || override?.noindex || override?.status === "draft") {
      return null;
    }
    return {
      url: path === "/" ? CANONICAL_ORIGIN : absoluteUrl(path),
      lastModified: override?.updated_at ? new Date(override.updated_at) : defaults.lastModified || now,
      changeFrequency: defaults.changeFrequency,
      priority: override?.sitemap_priority ?? defaults.priority,
    };
  }

  const staticPaths = [
    await entry("/", { changeFrequency: "weekly", priority: 1 }),
    await entry("/services", { changeFrequency: "monthly", priority: 0.9 }),
    ...(await Promise.all(
      SERVICE_PAGES.map((page) => entry(page.path, { changeFrequency: "monthly", priority: 0.85 })),
    )),
    await entry("/regions", { changeFrequency: "monthly", priority: 0.8 }),
    ...(await Promise.all(
      REGION_PAGES.map((page) => entry(page.path, { changeFrequency: "monthly", priority: 0.8 })),
    )),
    await entry("/partners", { changeFrequency: "monthly", priority: 0.85 }),
    await entry("/insights", { changeFrequency: "weekly", priority: 0.5 }),
    await entry("/careers", { changeFrequency: "weekly", priority: 0.55 }),
    ...(await Promise.all(
      CASE_STUDIES.map((study) =>
        entry(getCaseStudyUrl(study.slug), { changeFrequency: "monthly", priority: 0.75 }),
      ),
    )),
    ...(await Promise.all(
      LEGAL_DOCUMENTS.map((doc) =>
        entry(doc.path, {
          changeFrequency: "yearly",
          priority: 0.3,
          lastModified: new Date("2026-08-15"),
        }),
      ),
    )),
  ];

  const articleEntries = await Promise.all(
    articles
      .filter((article) => !article.noindex)
      .map((article) =>
        entry(articlePublicUrl(article.slug), {
          changeFrequency: "monthly",
          priority: 0.55,
          lastModified: new Date(article.updated_at || article.published_at || now),
        }),
      ),
  );

  const jobEntries = await Promise.all(
    jobs.map((job) =>
      entry(jobPublicUrl(job.slug), {
        changeFrequency: "weekly",
        priority: 0.6,
        lastModified: new Date(job.updated_at || job.published_at || now),
      }),
    ),
  );

  const cmsEntries = await Promise.all(
    cmsPages.map((page) =>
      entry(page.route, {
        changeFrequency: "monthly",
        priority: 0.75,
        lastModified: new Date(page.updated_at || now),
      }),
    ),
  );

  return [...staticPaths, ...articleEntries, ...jobEntries, ...cmsEntries].filter(
    Boolean,
  ) as MetadataRoute.Sitemap;
}
