import type { Metadata } from "next";
import { getLegalDocument } from "@/lib/legal";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { LegalPage } from "@/components/legal/LegalPage";

const document = getLegalDocument("refund-policy")!;

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: document.title,
    description: document.description,
    path: document.path,
  });
}

export default function RefundPolicyPage() {
  return <LegalPage document={document} />;
}
