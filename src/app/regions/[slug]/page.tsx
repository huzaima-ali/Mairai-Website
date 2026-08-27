import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRegionPage } from "@/lib/regions";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { getPublishedCmsPageByRoute } from "@/lib/cms/ops-store";
import { cmsPageMetadata } from "@/lib/cms/public-page";
import { CmsPageView } from "@/components/cms/CmsPageView";

export const dynamic = "force-dynamic";

type RegionPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const page = getRegionPage(params.slug);
  if (page) {
    return resolvePageMetadata({
      title: page.metaTitle.replace(" | Mirai Studios", ""),
      description: page.metaDescription,
      path: page.path,
    });
  }
  return cmsPageMetadata(`/regions/${params.slug}`);
}

export default async function RegionDetailPage({ params }: RegionPageProps) {
  const page = getRegionPage(params.slug);
  if (page) {
    return <MarketingPageView page={page} parentLabel="Regions" parentHref="/regions" />;
  }
  const cms = await getPublishedCmsPageByRoute(`/regions/${params.slug}`);
  if (!cms) notFound();
  return <CmsPageView page={cms} />;
}
