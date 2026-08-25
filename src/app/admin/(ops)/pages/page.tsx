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
      pageType: (page.page_type as RegistryPage["pageType"]) || "service-detail",
      defaultTitle: page.h1 || page.page_name,
      defaultDescription: page.page_summary || page.intro,
      indexable: page.status === "published",
    })),
  ];

  const pages = [...getStaticRegistryPages(), ...dynamicPages];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Pages & SEO</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Code defaults plus admin overrides. Create regional variants from service pages — drafts stay noindex until
          reviewed.
        </p>
      </div>
      <PagesSeoTable pages={pages} overrides={overrides} cmsPages={cmsPages} />
    </div>
  );
}
