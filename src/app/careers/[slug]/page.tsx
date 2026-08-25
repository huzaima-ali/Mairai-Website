import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicJobBySlug, jobPublicUrl, listOpenJobs } from "@/lib/cms/jobs";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { jobPostingJsonLd } from "@/lib/cms/schema";
import { sanitizeArticleHtml } from "@/lib/cms/sanitize";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { JobDetailView } from "@/components/careers/JobDetailView";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const jobs = await listOpenJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublicJobBySlug(params.slug);
  if (!job) return {};
  const closed = job.status === "closed";
  return resolvePageMetadata({
    path: jobPublicUrl(job.slug),
    title: job.seo_title || `${job.title} · Careers`,
    description: job.meta_description || job.summary || `Join Mirai Studios as ${job.title}.`,
    index: !closed,
  });
}

export default async function CareerDetailPage({ params }: Props) {
  const job = await getPublicJobBySlug(params.slug);
  if (!job) notFound();

  const safe = {
    ...job,
    description: sanitizeArticleHtml(job.description),
    requirements: sanitizeArticleHtml(job.requirements),
    nice_to_have: sanitizeArticleHtml(job.nice_to_have),
  };

  const schemas: Array<Record<string, unknown>> = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Careers", path: "/careers" },
      { name: job.title, path: jobPublicUrl(job.slug) },
    ]),
  ];
  const posting = jobPostingJsonLd(job);
  if (posting) schemas.push(posting);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(schemas)} />
      <JobDetailView job={safe} />
    </>
  );
}
