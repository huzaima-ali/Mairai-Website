import { ArrowUpRight } from "lucide-react";
import type { CmsPageRow } from "@/lib/cms/types";
import { cmsPageJsonLd } from "@/lib/cms/schema";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { CASE_STUDIES } from "@/lib/case-studies";
import { SERVICE_PAGES, type RelatedLink } from "@/lib/services";
import { getRegionPage } from "@/lib/regions";
import { regionHubPath } from "@/lib/cms/seo-helpers";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { RelatedCaseStudyCards, RelatedPagePills } from "@/components/marketing/RelatedLinks";

function parentFor(page: CmsPageRow) {
  const hub = regionHubPath(page.region_code);
  if (hub) {
    return { label: page.region_label || "Regions", href: hub };
  }
  if (page.page_type === "service-detail" || page.page_type === "service") {
    return { label: "Services", href: "/services" };
  }
  if (page.page_type === "industry") {
    return { label: "Industries", href: "/services" };
  }
  if (page.page_type === "region-detail" || page.page_type === "region") {
    return { label: "Regions", href: "/regions" };
  }
  return { label: "Home", href: "/" };
}

function relatedServiceLinks(page: CmsPageRow): RelatedLink[] {
  return page.related_services
    .map((value) => {
      const path = value.startsWith("/") ? value : `/services/${value}`;
      const match = SERVICE_PAGES.find((service) => service.path === path || service.slug === value);
      return { href: match?.path || path, label: match?.title || value };
    })
    .filter((link) => link.href && link.label);
}

function relatedStudySlugs(values: string[]) {
  const slugs: string[] = [];
  for (const value of values) {
    const normalized = value.replace(/^\/work\//, "").replace(/^\//, "").trim().toLowerCase();
    if (!normalized) continue;
    const match = CASE_STUDIES.find(
      (study) =>
        study.slug === normalized ||
        study.cardTitle.toLowerCase() === normalized ||
        study.title.toLowerCase() === normalized,
    );
    if (match && !slugs.includes(match.slug)) slugs.push(match.slug);
  }
  return slugs;
}

export function CmsPageView({
  page,
  preview = false,
}: {
  page: CmsPageRow;
  preview?: boolean;
}) {
  const parent = parentFor(page);
  const hub = regionHubPath(page.region_code);
  const backHref = hub || parent.href;
  const backLabel = hub ? `Back to ${page.region_label || "region"}` : `Back to ${parent.label}`;
  const hubPage = hub ? getRegionPage(hub.split("/").filter(Boolean).pop() || "") : undefined;
  const serviceLinks = relatedServiceLinks(page);
  const resolvedServices = serviceLinks.length ? serviceLinks : hubPage?.relatedServices ?? [];
  const explicitStudies = relatedStudySlugs(page.related_case_studies);
  const studySlugs = explicitStudies.length ? explicitStudies : hubPage?.relatedCaseStudies ?? [];

  const breadcrumbs = hub
    ? [
        { name: "Home", path: "/" },
        { name: "Regions", path: "/regions" },
        { name: page.region_label || "Region", path: hub },
        { name: page.page_name, path: page.route },
      ]
    : [
        { name: "Home", path: "/" },
        { name: parent.label, path: parent.href },
        { name: page.page_name, path: page.route },
      ];

  return (
    <>
      {!preview ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript([breadcrumbJsonLd(breadcrumbs), cmsPageJsonLd(page)])}
        />
      ) : null}
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <PageBackLink href={backHref} label={backLabel} />
            <p className="eyebrow">
              {page.region_code && page.region_code !== "global" ? page.region_label : parent.label}
            </p>
            <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{page.h1}</h1>
            {page.intro ? (
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {page.intro}
              </p>
            ) : null}

            {page.regional_proof ? (
              <div className="mt-8 rounded-2xl border border-border bg-surface px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                {page.regional_proof}
              </div>
            ) : null}

            <div
              className="prose-mirai mt-10 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [&_a]:text-foreground [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground [&_img]:my-6 [&_img]:rounded-2xl [&_li]:my-1 [&_li>p]:my-0 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page.body_html) }}
            />

            <div className="mt-12 flex flex-col gap-10">
              <RelatedCaseStudyCards slugs={studySlugs} />
              <RelatedPagePills links={resolvedServices} />
              {page.related_industries.length > 0 ? (
                <section>
                  <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
                    Related industries
                  </h2>
                  <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {page.related_industries.join(", ")}
                  </p>
                </section>
              ) : null}

              <div className="rounded-[24px] border border-border bg-surface p-6 sm:p-8">
                <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
                  {page.cta_heading || "Ready to talk through a project?"}
                </h2>
                {page.cta_copy ? (
                  <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                    {page.cta_copy}
                  </p>
                ) : null}
                <Button href={page.cta_href || "/#contact"} size="lg" className="mt-6 w-fit">
                  {page.cta_label || "Request a call"}
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
