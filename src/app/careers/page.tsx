import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/content";
import { buildPageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageBackLink } from "@/components/ui/PageBackLink";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers at Mirai Studios",
  description:
    "Explore careers at Mirai Studios. We hire product, design and engineering talent to build AI products, software platforms and digital twin experiences. No open roles right now.",
  path: "/careers",
});

export default function CareersPage() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
          breadcrumbJsonLd(breadcrumbs),
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Mirai Studios LLC",
            url: "https://miraistudios.co",
            email: SITE.email,
          },
        ])}
      />
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <PageBackLink />
            <p className="eyebrow mb-4">Careers</p>
            <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
              Build AI products and technology with Mirai
            </h1>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Mirai Studios is an AI product development and technology engineering company. We work across
              product strategy, design and engineering to ship AI products, agents, platforms, digital twins
              and immersive experiences for clients in the US, UK and Middle East.
            </p>

            <section className="mt-10">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug">Open roles</h2>
              <div className="mt-5 rounded-2xl border border-border bg-surface px-5 py-6">
                <p className="text-base font-medium text-foreground">No open positions right now</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  We are not actively hiring at the moment. When roles open, they will be listed here. If you
                  want to introduce yourself for future opportunities, email us with your background and the
                  kind of work you care about.
                </p>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)] leading-snug">Who we usually look for</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-muted-foreground marker:text-foreground/35">
                <li>Product designers and UX specialists for complex AI and software experiences</li>
                <li>Full-stack engineers comfortable with modern web product delivery</li>
                <li>People who enjoy real-time 3D, digital twins or immersive interfaces</li>
                <li>Pragmatic builders who care about clarity, craft and shipped outcomes</li>
              </ul>
            </section>

            <div className="mt-10 rounded-[24px] border border-border bg-surface p-6 sm:p-8">
              <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">Get in touch</h2>
              <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
                Send a short note to {SITE.email}. We read every message, even when we are not hiring.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={`mailto:${SITE.email}`} size="lg" className="w-fit">
                  Email Mirai Studios
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button href="/#contact" variant="outline" size="lg" className="w-fit">
                  Client enquiry
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
