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
import { VIDEO_SECTION, SITE, HOME_FAQS } from "@/lib/content";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { faqPageJsonLd, jsonLdScript, webpageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Mirai Studios | AI Development & Product Engineering",
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
            name: "Mirai Studios | AI Development & Product Engineering",
            description: SITE.description,
            path: "/",
          }),
          faqPageJsonLd([...HOME_FAQS]),
        ])}
      />
      <Hero />
      <BlueprintFrame>
        <Divider />
        <Section className="py-8 sm:py-10 lg:py-12" aria-label="About Mirai Studios">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-10">
              <div className="max-w-3xl">
                <p className="eyebrow">AI Product & Technology Partner</p>
                <h2 className="display mt-3 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.08]">
                  What Mirai Studios builds
                </h2>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {SITE.positioning}
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Delivery is product-led: we define the workflow, design the experience, then
                  engineer systems operators can trust. That includes agentic AI, intelligent
                  automation and AI-native software with human-supervised controls. Super
                  Intelligence remains a longer-term industry topic, not a product we claim to
                  ship.
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  See{" "}
                  <a href="/#services" className="underline underline-offset-2 hover:text-foreground">
                    services
                  </a>
                  ,{" "}
                  <a href="/#work" className="underline underline-offset-2 hover:text-foreground">
                    selected work
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
        <CompanyLogos />
        <Divider />
        <Services />
        <Divider />
        <Projects />
        <Divider />
        <OurWork />
        <Divider />
        <Testimonials />
        <Divider />
        <EngagementModels />
        <Divider />
        <Section className="py-8 sm:py-10 lg:py-12" aria-labelledby="home-faqs">
          <Container>
            <div className="max-w-3xl">
              <p className="eyebrow">Questions</p>
              <h2 id="home-faqs" className="display mt-3 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.08]">
                Common questions
              </h2>
            </div>
            <dl className="mt-8 grid gap-4 lg:grid-cols-2">
              {HOME_FAQS.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-surface px-5 py-4">
                  <dt className="text-lg font-medium text-foreground">{faq.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </Section>
        <Divider />
        <Contact />
      </BlueprintFrame>
    </>
  );
}
