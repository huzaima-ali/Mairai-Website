import type { ArticleRow, JobRow } from "@/lib/cms/types";
import { absoluteUrl } from "@/lib/seo";
import { articlePublicUrl } from "@/lib/cms/articles";
import { jobPublicUrl } from "@/lib/cms/jobs";
import { SITE } from "@/lib/content";

export function articleJsonLd(article: ArticleRow) {
  const url = absoluteUrl(articlePublicUrl(article.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.og_image_url || article.featured_image_url || undefined,
    datePublished: article.published_at || undefined,
    dateModified: article.updated_at || undefined,
    author: {
      "@type": "Organization",
      name: article.author_name || "Mirai Studios",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon"),
    },
    mainEntityOfPage: url,
    url,
  };
}

export function jobPostingJsonLd(job: JobRow) {
  if (job.status !== "published") return null;

  const posting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.summary,
    datePosted: job.published_at || undefined,
    validThrough: job.valid_through || undefined,
    employmentType: job.employment_type || undefined,
    hiringOrganization: {
      "@type": "Organization",
      name: "Mirai Studios LLC",
      sameAs: absoluteUrl("/"),
      logo: absoluteUrl("/icon"),
    },
    jobLocation: job.location
      ? {
          "@type": "Place",
          address: job.location,
        }
      : undefined,
    url: absoluteUrl(jobPublicUrl(job.slug)),
  };

  if (job.workplace_type) {
    posting.jobLocationType =
      job.workplace_type.toLowerCase().includes("remote") ? "TELECOMMUTE" : undefined;
  }

  if (job.application_url) {
    posting.directApply = true;
  } else if (job.application_email || SITE.email) {
    posting.directApply = true;
  }

  return posting;
}
