import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/lib/services";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { HubIndexPage } from "@/components/marketing/HubIndexPage";

const HIDDEN_SERVICE_SLUGS = new Set(["immersive-experiences"]);
const SERVICE_HUB_ORDER = [
  "ai-product-development",
  "custom-software-development",
  "ai-automation",
  "product-design",
  "enterprise-engineering",
  "ai-agent-development",
  "digital-twin-development",
];

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "Product Development & AI Consulting Services",
    description:
      "Explore Mirai Studios services spanning MVP and custom software development, SaaS platforms, AI consulting, AI implementation, automation, digital twins, product design and enterprise engineering.",
    path: "/services",
  });
}

export default function ServicesIndexPage() {
  return (
    <HubIndexPage
      eyebrow="Services"
      title="Product development and AI consulting"
      intro="Mirai Studios helps businesses build and scale digital products, from MVP to production, and provides practical AI consulting and implementation. Capabilities include product design, enterprise engineering, agents, automation and digital twins."
      links={SERVICE_PAGES.filter((page) => !HIDDEN_SERVICE_SLUGS.has(page.slug))
        .slice()
        .sort((a, b) => {
          const aIndex = SERVICE_HUB_ORDER.indexOf(a.slug);
          const bIndex = SERVICE_HUB_ORDER.indexOf(b.slug);
          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
        })
        .map((page) => ({
          href: page.path,
          label: page.title,
          description: page.metaDescription,
        }))}
    />
  );
}
