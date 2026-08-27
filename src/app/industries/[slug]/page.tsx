import type { Metadata } from "next";
import { cmsPageMetadata, cmsPublicRoute, renderPublishedCmsPage } from "@/lib/cms/public-page";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cmsPageMetadata(cmsPublicRoute("industries", params.slug));
}

export default async function IndustryCmsPage({ params }: Props) {
  return renderPublishedCmsPage(cmsPublicRoute("industries", params.slug));
}
