import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  INSIGHT_ARTICLES,
  getInsightArticle,
  getInsightUrl,
} from "@/lib/insights";
import { buildPageMetadata, breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";

type InsightPageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return INSIGHT_ARTICLES.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: InsightPageProps): Metadata {
  const article = getInsightArticle(params.slug);
  if (!article) return {};
  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: getInsightUrl(article.slug),
    type: "article",
  });
}

export default function InsightArticlePage({ params }: InsightPageProps) {
  const article = getInsightArticle(params.slug);
  if (!article) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript([
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Insights", path: "/insights" },
            { name: article.title, path: getInsightUrl(article.slug) },
          ]),
        ])}
      />
      <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <Container>
          <div className="max-w-3xl">
            <PageBackLink href="/insights" label="Back to Insights" />
            <p className="eyebrow mb-4">{article.category}</p>
            <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{article.title}</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {article.date} · {article.readTime}
            </p>
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-10 flex flex-col gap-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12 rounded-[24px] border border-border bg-surface p-6 sm:p-8">
              <h2 className="display text-[clamp(1.5rem,2.4vw,2rem)] leading-tight">
                Want to talk through a project?
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Mirai Studios partners with teams building AI products, platforms and digital twins.
              </p>
              <a
                href="/#contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
              >
                Request a call
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
