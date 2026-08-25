import { notFound } from "next/navigation";
import { SeoEditorForm } from "@/components/admin/SeoEditorForm";
import { getAllPageSeoOverrides, getPageSeoOverride } from "@/lib/cms/seo-overrides";
import { getRegistryPage, getStaticRegistryPages, type RegistryPage } from "@/lib/cms/route-registry";
import { listPublishedArticles, articlePublicUrl } from "@/lib/cms/articles";
import { listOpenJobs, jobPublicUrl } from "@/lib/cms/jobs";
import { getCmsPageByRoute, listCmsPages } from "@/lib/cms/ops-store";

type Props = { searchParams: { route?: string } };

export default async function AdminSeoEditPage({ searchParams }: Props) {
  const route = searchParams.route;
  if (!route) notFound();

  let page: RegistryPage | undefined = getRegistryPage(route);
  const cmsPage = await getCmsPageByRoute(route);

  if (!page) {
    const [articles, jobs, cmsPages] = await Promise.all([
      listPublishedArticles(),
      listOpenJobs(),
      listCmsPages(),
    ]);
    const article = articles.find((a) => articlePublicUrl(a.slug) === route);
    const job = jobs.find((j) => jobPublicUrl(j.slug) === route);
    const cms = cmsPages.find((p) => p.route === route) || cmsPage;
    if (article) {
      page = {
        route,
        pageName: article.title,
        pageType: "insight-article",
        defaultTitle: article.seo_title || article.title,
        defaultDescription: article.meta_description || article.excerpt,
        defaultOgImage: article.og_image_url || article.featured_image_url || undefined,
        indexable: !article.noindex,
      };
    } else if (job) {
      page = {
        route,
        pageName: job.title,
        pageType: "job",
        defaultTitle: job.seo_title || job.title,
        defaultDescription: job.meta_description || job.summary,
        indexable: true,
      };
    } else if (cms) {
      page = {
        route,
        pageName: cms.page_name,
        pageType: (cms.page_type as RegistryPage["pageType"]) || "service-detail",
        defaultTitle: cms.h1 || cms.page_name,
        defaultDescription: cms.page_summary || cms.intro,
        indexable: cms.status === "published",
      };
    }
  }

  if (!page) {
    void getStaticRegistryPages;
    notFound();
  }

  const [override, allOverrides] = await Promise.all([getPageSeoOverride(route), getAllPageSeoOverrides()]);

  return <SeoEditorForm page={page} override={override} cmsPage={cmsPage} allOverrides={allOverrides} />;
}
