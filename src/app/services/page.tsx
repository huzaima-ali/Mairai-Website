import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/lib/services";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { HubIndexPage } from "@/components/marketing/HubIndexPage";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "AI Product Development & Technology Services",
    description:
      "Explore Mirai Studios services spanning AI product development, AI agents, automation, custom software, digital twins, product design and enterprise engineering.",
    path: "/services",
  });
}

export default function ServicesIndexPage() {
  return (
    <HubIndexPage
      eyebrow="Services"
      title="AI product development and technology services"
      intro="Explore how Mirai Studios designs and builds AI products, agents, automation, software platforms, digital twins and immersive experiences for businesses across the US, UK and Middle East."
      links={SERVICE_PAGES.map((page) => ({
        href: page.path,
        label: page.title,
        description: page.metaDescription,
      }))}
    />
  );
}
