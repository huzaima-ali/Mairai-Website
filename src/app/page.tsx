import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { VideoShowcase } from "@/components/sections/VideoShowcase";
import { CompanyLogos } from "@/components/sections/CompanyLogos";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { OurWork } from "@/components/sections/OurWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { Contact } from "@/components/sections/Contact";
import { BlueprintFrame } from "@/components/ui/BlueprintFrame";
import { Divider } from "@/components/ui/Divider";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { FeaturedInsightCard } from "@/components/insights/FeaturedInsightCard";
import { HomeFaqs } from "@/components/sections/HomeFaqs";
import { VIDEO_SECTION, SITE, HOME_FAQS, HOME_ABOUT, FOUNDERS } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { faqPageJsonLd, jsonLdScript, webpageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Mirai Studios | Product Development & AI Consulting",
    description: SITE.description,
    path: "/",
  });
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
          webpageJsonLd({
            name: "Mirai Studios | Product Development & AI Consulting",
            description: SITE.description,
            path: "/",
          }),
          faqPageJsonLd([...HOME_FAQS]),
        ])}
      />
      <Hero />
      <BlueprintFrame>
        <Divider />
        <Section className="py-10 sm:py-12 lg:py-16" aria-label="About Mirai Studios">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-12">
              <div className="max-w-3xl">
                <h2 className="display text-[clamp(1.85rem,3.2vw,2.95rem)] leading-[1.06]">
                  {HOME_ABOUT.title}
                </h2>
                <p className="mt-5 text-pretty text-lg font-medium leading-snug tracking-snug text-foreground sm:text-xl">
                  {HOME_ABOUT.kicker}
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {SITE.positioning}
                </p>
                <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  See{" "}
                  <a href="/#products" className="underline underline-offset-2 hover:text-foreground">
                    products
                  </a>
                  ,{" "}
                  <a href="/#work" className="underline underline-offset-2 hover:text-foreground">
                    client work
                  </a>
                  ,{" "}
                  <a href="/#services" className="underline underline-offset-2 hover:text-foreground">
                    services
                  </a>
                  ,{" "}
                  <a href="/regions" className="underline underline-offset-2 hover:text-foreground">
                    regions
                  </a>
                  , or{" "}
                  <a href="/partners" className="underline underline-offset-2 hover:text-foreground">
                    partner with us
                  </a>
                  .
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  Meet{" "}
                  <a
                    href={FOUNDERS.people[0]?.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {FOUNDERS.people[0]?.name.split(" ")[0]}
                  </a>{" "}
                  and{" "}
                  <a
                    href={FOUNDERS.people[1]?.href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    {FOUNDERS.people[1]?.name.split(" ")[0]}
                  </a>
                  , cofounders of Mirai.
                </p>
              </div>

              <FeaturedInsightCard />
            </div>
          </Container>
        </Section>
        <Divider />
        {VIDEO_SECTION.youtubeUrl ? (
          <>
            <VideoShowcase />
            <Divider />
          </>
        ) : null}
        <Projects />
        <Divider />
        <OurWork />
        <Divider />
        <Services />
        <Divider />
        <EngagementModels />
        <Divider />
        <CompanyLogos />
        <Divider />
        <Testimonials />
        <Divider />
        <HomeFaqs />
        <Divider />
        <Contact />
      </BlueprintFrame>
    </>
  );
}
