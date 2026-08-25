import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { listPublishedArticles, articlePublicUrl } from "@/lib/cms/articles";
import { resolvePageMetadata } from "@/lib/cms/seo-overrides";
import { formatAdminDate } from "@/lib/cms/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return resolvePageMetadata({
    path: "/insights",
    title: "Insights on AI Products, Agents & Digital Twins",
    description:
      "Mirai Studios insights on AI product development, AI agents, automation, digital twins and delivery practices.",
  });
}

export default async function InsightsIndexPage() {
  const articles = await listPublishedArticles();

  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <PageBackLink />
          </div>
          <p className="eyebrow mb-4">Insights</p>
          <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            Insights on AI products and technology delivery
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Practical writing on AI product development, agents, automation and digital twins from the Mirai
            Studios team.
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">No published insights yet.</p>
        ) : (
          <ul className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <li key={article.id || article.slug}>
                <a
                  href={articlePublicUrl(article.slug)}
                  className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface transition-colors hover:border-foreground/25"
                >
                  {article.featured_image_url ? (
                    <div className="relative aspect-[16/10] bg-[#eee]">
                      <Image
                        src={article.featured_image_url}
                        alt={article.featured_image_alt || article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={article.featured_image_url.startsWith("http")}
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-accent">
                        {article.category || "Insights"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatAdminDate(article.published_at)}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-medium leading-snug tracking-snug text-foreground">
                      {article.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      Read more
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  );
}
