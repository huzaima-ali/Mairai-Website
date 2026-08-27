import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedCmsPageByRoute } from "@/lib/cms/ops-store";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { CmsPageView } from "@/components/cms/CmsPageView";
import type { CmsPageRow } from "@/lib/cms/types";

export const CMS_PUBLIC_KINDS = new Set(["services", "industries", "landing", "regions"]);

export function cmsPublicRoute(kind: string, slug: string, region?: string | null) {
  const path = `/${kind}/${slug}`;
  return region ? `/${region}${path}` : path;
}

export async function cmsPageMetadata(route: string): Promise<Metadata> {
  const page = await getPublishedCmsPageByRoute(route);
  if (!page) return { robots: { index: false, follow: false } };
  return resolvePageMetadata({
    path: route,
    title: page.seo_title || page.h1 || page.page_name,
    description: page.meta_description || page.page_summary || page.intro,
    ogImage: page.og_image_url || undefined,
    index: !page.noindex,
    ogTitle: page.og_title || undefined,
    ogDescription: page.og_description || undefined,
  });
}

export async function renderPublishedCmsPage(route: string) {
  const page = await getPublishedCmsPageByRoute(route);
  if (!page) notFound();
  return <CmsPageView page={page} />;
}

export function publishedCmsPageOrNull(page: CmsPageRow | null) {
  if (!page || page.status !== "published") return null;
  return page;
}
