import type { Metadata } from "next";
import { getLegalDocument } from "@/lib/legal";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { LegalPage } from "@/components/legal/LegalPage";

const document = getLegalDocument("terms")!;

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    title: document.title,
    description: document.description,
    path: document.path,
  });
}

export default function TermsPage() {
  return <LegalPage document={document} />;
}
