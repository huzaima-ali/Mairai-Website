import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CMS_PUBLIC_KINDS, cmsPageMetadata, cmsPublicRoute, renderPublishedCmsPage } from "@/lib/cms/public-page";

export const dynamic = "force-dynamic";

type Props = {
  params: { region: string; kind: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!CMS_PUBLIC_KINDS.has(params.kind)) return {};
  return cmsPageMetadata(cmsPublicRoute(params.kind, params.slug, params.region));
}

export default async function RegionalCmsPage({ params }: Props) {
  if (!CMS_PUBLIC_KINDS.has(params.kind)) notFound();
  return renderPublishedCmsPage(cmsPublicRoute(params.kind, params.slug, params.region));
}
