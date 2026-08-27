import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServicePage } from "@/lib/services";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";
import { getPublishedCmsPageByRoute } from "@/lib/cms/ops-store";
import { cmsPageMetadata } from "@/lib/cms/public-page";
import { CmsPageView } from "@/components/cms/CmsPageView";

export const dynamic = "force-dynamic";

type ServicePageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const page = getServicePage(params.slug);
  if (page) {
    return resolvePageMetadata({
      title: page.metaTitle.replace(" | Mirai Studios", ""),
      description: page.metaDescription,
      path: page.path,
    });
  }
  return cmsPageMetadata(`/services/${params.slug}`);
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const page = getServicePage(params.slug);
  if (page) {
    return (
      <MarketingPageView
        page={page}
        parentLabel="Services"
        parentHref="/services"
        schemaType="service"
      />
    );
  }

  const cms = await getPublishedCmsPageByRoute(`/services/${params.slug}`);
  if (!cms) notFound();
  return <CmsPageView page={cms} />;
}
