import type { Metadata } from "next";
import { getLegalDocument } from "@/lib/legal";
import { SITE } from "@/lib/content";
import { LegalPage } from "@/components/legal/LegalPage";

const document = getLegalDocument("terms")!;

export const metadata: Metadata = {
  title: document.title,
  description: document.description,
  alternates: { canonical: `${SITE.url}${document.path}` },
};

export default function TermsPage() {
  return <LegalPage document={document} />;
}
