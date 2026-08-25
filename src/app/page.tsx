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
import { VIDEO_SECTION, SITE } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Development & Product Engineering Company",
  description: SITE.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
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
                  Teams work with Mirai for AI product development, AI agents, custom software and
                  enterprise platforms, intelligent automation, product design, digital twins and
                  immersive experiences across the United States, United Kingdom and Middle East.
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Explore our{" "}
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
                  </a>{" "}
                  if you need Mirai as a technical delivery partner.
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
        <Contact />
      </BlueprintFrame>
    </>
  );
}
