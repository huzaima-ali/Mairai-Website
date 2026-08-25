import type { Metadata } from "next";
import { PARTNER_PAGE } from "@/lib/partners";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PartnerForm } from "@/components/partners/PartnerForm";
import { PageBackLink } from "@/components/ui/PageBackLink";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: PARTNER_PAGE.metaTitle.replace(" | Mirai Studios", ""),
    description: PARTNER_PAGE.metaDescription,
    path: PARTNER_PAGE.path,
  });
}

export default function PartnersPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Partner With Us", path: "/partners" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(breadcrumbs))}
      />
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <div>
              <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <a href="/" className="transition-colors hover:text-foreground">
                  Home
                </a>
                <span aria-hidden>/</span>
                <span className="text-foreground">Partner With Us</span>
              </nav>

              <PageBackLink />

              <p className="eyebrow mb-4">{PARTNER_PAGE.eyebrow}</p>
              <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{PARTNER_PAGE.h1}</h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {PARTNER_PAGE.intro}
              </p>

              <section className="mt-10">
                <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug">Who this is for</h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground marker:text-foreground/35 sm:text-lg">
                  {PARTNER_PAGE.whoFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="mt-10">
                <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug">Partnership models</h2>
                <div className="mt-5 flex flex-col gap-4">
                  {PARTNER_PAGE.models.map((model) => (
                    <div key={model.title} className="rounded-2xl border border-border bg-surface px-5 py-4">
                      <h3 className="text-lg font-medium text-foreground">{model.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{model.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <ul className="mt-8 flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                {PARTNER_PAGE.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div id="partner-form" className="scroll-mt-28 lg:sticky lg:top-28">
              <PartnerForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
