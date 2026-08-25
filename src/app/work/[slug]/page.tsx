import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy, getCaseStudyUrl } from "@/lib/case-studies";
import { buildPageMetadata } from "@/lib/seo";
import { CaseStudyPage } from "@/components/case-studies/CaseStudyPage";

interface WorkPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({ slug: study.slug }));
}

export function generateMetadata({ params }: WorkPageProps): Metadata {
  const study = getCaseStudy(params.slug);

  if (!study) {
    return {};
  }

  return buildPageMetadata({
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
