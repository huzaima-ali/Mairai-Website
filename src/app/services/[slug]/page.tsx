import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllServiceSlugs, getServicePage } from "@/lib/services";
import { buildPageMetadata } from "@/lib/seo";
import { MarketingPageView } from "@/components/marketing/MarketingPageView";

type ServicePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const page = getServicePage(params.slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.metaTitle.replace(" | Mirai Studios", ""),
    description: page.metaDescription,
    path: page.path,
  });
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const page = getServicePage(params.slug);
  if (!page) notFound();

  return (
    <MarketingPageView
      page={page}
      parentLabel="Services"
      parentHref="/services"
      schemaType="service"
    />
  );
}
