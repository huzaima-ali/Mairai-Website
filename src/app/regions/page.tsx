import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { RegionsPageContent } from "@/components/regions/RegionsPageContent";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Development Partners by Region",
  description:
    "Mirai Studios works with companies across the United States, United Kingdom and Middle East as an AI product and technology engineering partner, with a delivery studio in Pakistan.",
  path: "/regions",
});

export default function RegionsIndexPage() {
  return <RegionsPageContent />;
}
