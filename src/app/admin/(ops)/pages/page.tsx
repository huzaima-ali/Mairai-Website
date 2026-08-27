import Link from "next/link";
import { PagesSeoTable } from "@/components/admin/PagesSeoTable";
import { listPublishedArticles, articlePublicUrl } from "@/lib/cms/articles";
import { listOpenJobs, jobPublicUrl } from "@/lib/cms/jobs";
import { getAllPageSeoOverrides } from "@/lib/cms/seo-overrides";
import { listCmsPages } from "@/lib/cms/ops-store";
import { getStaticRegistryPages, type RegistryPage } from "@/lib/cms/route-registry";

export default async function AdminPagesPage() {
  const [overrides, articles, jobs, cmsPages] = await Promise.all([
    getAllPageSeoOverrides(),
    listPublishedArticles(),
    listOpenJobs(),
    listCmsPages(),
  ]);

  const dynamicPages: RegistryPage[] = [
    ...articles.map((article) => ({
      route: articlePublicUrl(article.slug),
      pageName: article.title,
      pageType: "insight-article" as const,
      defaultTitle: article.seo_title || article.title,
      defaultDescription: article.meta_description || article.excerpt,
      defaultOgImage: article.og_image_url || article.featured_image_url || undefined,
      indexable: !article.noindex,
    })),
    ...jobs.map((job) => ({
      route: jobPublicUrl(job.slug),
      pageName: job.title,
      pageType: "job" as const,
      defaultTitle: job.seo_title || job.title,
      defaultDescription: job.meta_description || job.summary,
      indexable: true,
    })),
    ...cmsPages.map((page) => ({
      route: page.route,
      pageName: page.page_name,
      pageType: (page.page_type as RegistryPage["pageType"]) || "landing",
      defaultTitle: page.seo_title || page.h1 || page.page_name,
      defaultDescription: page.meta_description || page.page_summary || page.intro,
      defaultOgImage: page.og_image_url || undefined,
      indexable: page.status === "published" && !page.noindex,
    })),
  ];

  const byRoute = new Map<string, RegistryPage>();
  for (const page of [...getStaticRegistryPages(), ...dynamicPages]) {
    byRoute.set(page.route, page);
  }
  const pages = Array.from(byRoute.values());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Pages & SEO</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, duplicate and publish landing pages without a code deploy. Drafts stay noindex until reviewed.
          </p>
        </div>
        <Link href="/admin/pages/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          Create New Page
        </Link>
      </div>
      <PagesSeoTable pages={pages} overrides={overrides} cmsPages={cmsPages} />
    </div>
  );
}
