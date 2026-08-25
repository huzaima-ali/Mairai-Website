import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { INSIGHT_ARTICLES, getInsightUrl } from "@/lib/insights";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";

export const metadata: Metadata = buildPageMetadata({
  title: "Insights on AI Products, Agents & Digital Twins",
  description:
    "Mirai Studios insights on AI product development, AI agents, automation, digital twins and delivery practices.",
  path: "/insights",
});

export default function InsightsIndexPage() {
  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="max-w-3xl">
          <PageBackLink />
          <p className="eyebrow mb-4">Insights</p>
          <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            Insights on AI products and technology delivery
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical writing on AI product development, agents, automation and digital twins. Early articles
            are placeholders while the publishing pipeline is prepared.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {INSIGHT_ARTICLES.map((article) => (
            <li key={article.slug}>
              <a
                href={getInsightUrl(article.slug)}
                className="group flex h-full flex-col rounded-[24px] border border-border bg-surface p-6 transition-colors hover:border-foreground/25"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.12em] text-accent">
                    {article.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                </div>
                <h2 className="mt-4 text-xl font-medium leading-snug tracking-snug text-foreground">
                  {article.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Read more
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
