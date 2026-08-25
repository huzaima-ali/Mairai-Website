import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getPublishedCmsPageByRoute, listPublishedCmsPages } from "@/lib/cms/ops-store";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, jsonLdScript, serviceJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { getCaseStudyUrl } from "@/lib/case-studies";

type Props = {
  params: { region: string; slug: string };
};

const REGIONS = new Set(["us", "uk", "mena"]);

export async function generateStaticParams() {
  const pages = await listPublishedCmsPages();
  return pages
    .map((page) => {
      const parts = page.route.split("/").filter(Boolean);
      // /us/services/slug
      if (parts.length >= 3 && parts[0] && REGIONS.has(parts[0]) && parts[1] === "services" && parts[2]) {
        return { region: parts[0], slug: parts[2] };
      }
      return null;
    })
    .filter(Boolean) as Array<{ region: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!REGIONS.has(params.region)) return {};
  const route = `/${params.region}/services/${params.slug}`;
  const page = await getPublishedCmsPageByRoute(route);
  if (!page) return { robots: { index: false, follow: false } };
  return resolvePageMetadata({
    path: route,
    title: page.h1 || page.page_name,
    description: page.page_summary || page.intro,
  });
}

export default async function RegionalServicePage({ params }: Props) {
  if (!REGIONS.has(params.region)) notFound();
  const route = `/${params.region}/services/${params.slug}`;
  const page = await getPublishedCmsPageByRoute(route);
  if (!page) notFound();

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: page.page_name, path: route },
    ]),
    serviceJsonLd({
      name: page.h1 || page.page_name,
      description: page.page_summary || page.intro,
      path: route,
    }),
  ];

  // Enrich areaServed if present via extras is handled in metadata; keep Service schema valid
  if (page.region_served) {
    schemas[1] = {
      ...schemas[1],
      areaServed: page.region_served,
    };
  }

  // Advanced override only if safe JSON with @type
  // (loaded from page_seo extras in resolve path separately if needed)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <PageBackLink href={page.base_route} label="Back to global page" />
            <p className="eyebrow mb-4">{page.region_label}</p>
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
              className="mt-10 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground [&_li]:my-1 [&_p]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(page.body_html) }}
            />

            {(page.related_services.length > 0 || page.related_case_studies.length > 0) && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {page.related_services.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-medium">Related services</h2>
                    <ul className="mt-3 space-y-2">
                      {page.related_services.map((href) => (
                        <li key={href}>
                          <a href={href} className="text-sm hover:text-accent">
                            {href}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {page.related_case_studies.length > 0 ? (
                  <div>
                    <h2 className="text-lg font-medium">Related work</h2>
                    <ul className="mt-3 space-y-2">
                      {page.related_case_studies.map((slug) => (
                        <li key={slug}>
                          <a href={getCaseStudyUrl(slug)} className="text-sm hover:text-accent">
                            {slug}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}

            {page.cta_href ? (
              <a
                href={page.cta_href}
                className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent"
              >
                {page.cta_label || "Request a call"}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </Container>
      </Section>
    </>
  );
}
