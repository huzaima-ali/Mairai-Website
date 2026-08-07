import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy, getCaseStudyAbsoluteUrl } from "@/lib/case-studies";
import { SITE } from "@/lib/content";
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

  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: getCaseStudyAbsoluteUrl(study.slug) },
    openGraph: {
      title: `${study.title} · ${SITE.name}`,
      description: study.summary,
      url: getCaseStudyAbsoluteUrl(study.slug),
      images: study.heroImage ? [{ url: study.heroImage.src, alt: study.heroImage.alt }] : undefined,
    },
  };
}

export default function WorkPage({ params }: WorkPageProps) {
  const study = getCaseStudy(params.slug);

  if (!study) {
    notFound();
  }

  return <CaseStudyPage study={study} />;
}
