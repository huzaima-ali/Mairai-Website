import type { Metadata } from "next";
import { getLegalDocument } from "@/lib/legal";
import { buildPageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

const document = getLegalDocument("refund-policy")!;

export const metadata: Metadata = buildPageMetadata({
  title: document.title,
  description: document.description,
  path: document.path,
});

export default function RefundPolicyPage() {
  return <LegalPage document={document} />;
}
