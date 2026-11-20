import type { Metadata } from "next";
import { cmsPageMetadata, renderPublishedCmsPage } from "@/lib/cms/public-page";

export const dynamic = "force-dynamic";

type Props = {
  params: { slug: string; pageSlug: string };
};

function regionPageRoute(params: Props["params"]) {
  return `/regions/${params.slug}/${params.pageSlug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cmsPageMetadata(regionPageRoute(params));
}

export default async function RegionNestedCmsPage({ params }: Props) {
  return renderPublishedCmsPage(regionPageRoute(params));
}
