import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllRegionSlugs, getRegionPage } from "@/lib/regions";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";

type RegionPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllRegionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const page = getRegionPage(params.slug);
  if (!page) return {};
  return resolvePageMetadata({
    title: page.metaTitle.replace(" | Mirai Studios", ""),
    description: page.metaDescription,
    path: page.path,
  });
}

export default function RegionDetailPage({ params }: RegionPageProps) {
  const page = getRegionPage(params.slug);
  if (!page) notFound();

  return <MarketingPageView page={page} parentLabel="Regions" parentHref="/regions" />;
}
