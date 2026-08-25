import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ArticleRow } from "@/lib/cms/types";
import { formatAdminDate } from "@/lib/cms/utils";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageBackLink } from "@/components/ui/PageBackLink";
import { articlePublicUrl } from "@/lib/cms/articles";

export function InsightArticleView({
  article,
  preview = false,
  related = [],
}: {
  article: ArticleRow;
  preview?: boolean;
  related?: ArticleRow[];
}) {
  return (
    <Section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="max-w-3xl">
          {!preview ? <PageBackLink href="/insights" label="Back to Insights" /> : null}
          <p className="eyebrow mb-4">{article.category || "Insights"}</p>
          <h1 className="display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">{article.title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {article.author_name || "Mirai Studios"}
            {article.published_at ? ` · ${formatAdminDate(article.published_at)}` : ""}
            {article.updated_at && article.published_at && article.updated_at !== article.published_at
              ? ` · Updated ${formatAdminDate(article.updated_at)}`
              : ""}
          </p>
          {article.excerpt ? (
            <p className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              {article.excerpt}
            </p>
          ) : null}

          {article.featured_image_url ? (
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[24px] bg-surface">
              <Image
                src={article.featured_image_url}
                alt={article.featured_image_alt || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                unoptimized={article.featured_image_url.startsWith("http")}
              />
            </div>
          ) : null}

          <div
            className="prose-mirai mt-10 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [&_a]:text-foreground [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-accent/40 [&_blockquote]:pl-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-foreground [&_img]:my-6 [&_img]:rounded-2xl [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

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

          {related.length > 0 ? (
            <div className="mt-12">
              <h2 className="display text-[clamp(1.35rem,2.2vw,1.85rem)]">Related insights</h2>
              <ul className="mt-4 space-y-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <a href={articlePublicUrl(item.slug)} className="text-sm font-medium hover:text-accent">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
