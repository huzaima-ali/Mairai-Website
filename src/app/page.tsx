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
import { VIDEO_SECTION } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BlueprintFrame>
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
        <Divider />
      </BlueprintFrame>
    </>
  );
}
