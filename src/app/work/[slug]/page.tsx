import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy, getCaseStudyUrl } from "@/lib/case-studies";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { CaseStudyPage } from "@/components/case-studies/CaseStudyPage";

interface WorkPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const study = getCaseStudy(params.slug);

  if (!study) {
    return {};
  }

  return resolvePageMetadata({
    title: study.title,
    description: study.summary,
    path: getCaseStudyUrl(study.slug),
    ogImage: study.heroImage?.src ?? study.cardImage.src,
    type: "article",
  });
}

export default function WorkPage({ params }: WorkPageProps) {
  const study = getCaseStudy(params.slug);

  if (!study) {
    notFound();
  }

  return <CaseStudyPage study={study} />;
}
