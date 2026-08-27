import { ArrowUpRight } from "lucide-react";
import type { CmsPageRow } from "@/lib/cms/types";
import { cmsPageJsonLd } from "@/lib/cms/schema";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { CASE_STUDIES, getCaseStudyUrl } from "@/lib/case-studies";
import { SERVICE_PAGES } from "@/lib/services";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageBackLink } from "@/components/ui/PageBackLink";

function parentFor(page: CmsPageRow) {
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

export function CmsPageView({
  page,
  preview = false,
}: {
  page: CmsPageRow;
  preview?: boolean;
}) {
  const parent = parentFor(page);
  const backHref = page.base_route && page.base_route !== page.route ? page.base_route : parent.href;
  const backLabel =
    page.base_route && page.base_route !== page.route ? "Back to global page" : `Back to ${parent.label}`;

  const relatedStudies = CASE_STUDIES.filter((study) => page.related_case_studies.includes(study.slug));
  const relatedServiceLinks = page.related_services.map((href) => {
    const match = SERVICE_PAGES.find((service) => service.path === href);
    return { href, label: match?.title || href };
  });

  const breadcrumbs = [
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
          <div className="mx-auto max-w-3xl">
            <PageBackLink href={backHref} label={backLabel} />
            <p className="eyebrow mb-4">
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

            {relatedServiceLinks.length > 0 || page.related_industries.length > 0 || relatedStudies.length > 0 ? (
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {relatedServiceLinks.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-medium">Related services</h2>
                    <ul className="mt-3 space-y-2">
                      {relatedServiceLinks.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} className="text-sm hover:text-accent">
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {page.related_industries.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-medium">Related industries</h2>
                    <ul className="mt-3 space-y-2">
                      {page.related_industries.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {relatedStudies.length > 0 ? (
                  <div className="sm:col-span-2">
                    <h2 className="text-lg font-medium">Related work</h2>
                    <ul className="mt-3 space-y-2">
                      {relatedStudies.map((study) => (
                        <li key={study.slug}>
                          <a href={getCaseStudyUrl(study.slug)} className="text-sm hover:text-accent">
                            {study.cardTitle || study.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-12 rounded-[24px] border border-border bg-surface p-6 sm:p-8">
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
        </Container>
      </Section>
    </>
  );
}
