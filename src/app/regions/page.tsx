import type { Metadata } from "next";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { RegionsPageContent } from "@/components/regions/RegionsPageContent";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: "AI Development Partners by Region",
    description:
      "Mirai Studios works with companies across the United States, United Kingdom and Middle East as an AI product and technology engineering partner, with a delivery studio in Pakistan.",
    path: "/regions",
  });
}

export default function RegionsIndexPage() {
  return <RegionsPageContent />;
}
