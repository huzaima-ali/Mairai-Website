import { ArrowUpRight } from "lucide-react";
import type { MarketingPage } from "@/lib/services";
import { breadcrumbJsonLd, faqPageJsonLd, jsonLdScript, serviceJsonLd, webpageJsonLd } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { RelatedCaseStudyCards, RelatedPagePills } from "@/components/marketing/RelatedLinks";

type MarketingPageViewProps = {
  page: MarketingPage;
  parentLabel: string;
  parentHref: string;
  schemaType?: "service" | "generic";
};

export function MarketingPageView({
  page,
  parentLabel,
  parentHref,
  schemaType = "generic",
}: MarketingPageViewProps) {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: parentLabel, path: parentHref },
    { name: page.title, path: page.path },
  ];

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbJsonLd(breadcrumbs),
    webpageJsonLd({
      name: page.h1,
      description: page.metaDescription,
      path: page.path,
    }),
  ];
  if (schemaType === "service") {
    schemas.push(
      serviceJsonLd({
        name: page.title,
        description: page.metaDescription,
        path: page.path,
      }),
    );
  }
  if (page.faqs?.length) {
    schemas.push(faqPageJsonLd(page.faqs));
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="transition-colors hover:text-foreground">
                Home
              </a>
              <span aria-hidden>/</span>
              <a href={parentHref} className="transition-colors hover:text-foreground">
                {parentLabel}
              </a>
              <span aria-hidden>/</span>
              <span className="text-foreground">{page.title}</span>
            </nav>

            <PageBackLink href={parentHref} label={`Back to ${parentLabel}`} />

            <header className="border-b border-border pb-8">
              <p className="eyebrow">{page.eyebrow}</p>
              <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{page.h1}</h1>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {page.intro}
              </p>
            </header>

            <div className="mt-10 flex flex-col gap-10">
              {page.sections.map((section) => (
                <section key={section.heading} className="scroll-mt-28">
                  <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
                    {section.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets?.length ? (
                      <ul className="list-disc space-y-2 pl-5 marker:text-foreground/35">
                        {section.bullets.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ))}

              <RelatedCaseStudyCards slugs={page.relatedCaseStudies} />

              {page.faqs?.length ? (
                <section>
                  <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug tracking-snug">
                    Questions teams usually ask
                  </h2>
                  <dl className="mt-5 flex flex-col gap-4">
                    {page.faqs.map((faq) => (
                      <div key={faq.question} className="rounded-2xl border border-border bg-surface px-5 py-4">
                        <dt className="text-base font-medium text-foreground sm:text-lg">{faq.question}</dt>
                        <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{faq.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              <RelatedPagePills
                links={[...(page.relatedServices ?? []), ...(page.relatedRegions ?? [])]}
              />

              <div className="rounded-[24px] border border-border bg-surface p-6 sm:p-8">
                <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
                  Ready to talk through a project?
                </h2>
                <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                  Tell us what you are building. The Mirai team will follow up to discuss scope, approach and next steps.
                </p>
                <Button href={page.ctaHref ?? "/#contact"} size="lg" className="mt-6 w-fit">
                  {page.ctaLabel ?? "Start a project"}
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
