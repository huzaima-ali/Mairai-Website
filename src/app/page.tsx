import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { CompanyLogos } from "@/components/sections/CompanyLogos";
import { Services } from "@/components/sections/Services";
import { PartnerBar } from "@/components/sections/PartnerBar";
import { Projects } from "@/components/sections/Projects";
import { OurWork } from "@/components/sections/OurWork";
import { Testimonials } from "@/components/sections/Testimonials";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { Contact } from "@/components/sections/Contact";
import { MainCTA } from "@/components/sections/MainCTA";
import { BlueprintFrame } from "@/components/ui/BlueprintFrame";
import { Divider } from "@/components/ui/Divider";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BlueprintFrame>
        <Divider />
        <CompanyLogos />
        <Divider />
        <Services />
        <PartnerBar />
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
        <MainCTA />
        <Divider />
      </BlueprintFrame>
    </>
  );
}
