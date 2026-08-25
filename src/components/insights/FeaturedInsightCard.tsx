import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getHomepageFeaturedArticle, articlePublicUrl } from "@/lib/cms/articles";
import { formatAdminDate } from "@/lib/cms/utils";

export async function FeaturedInsightCard() {
  const article = await getHomepageFeaturedArticle();
  if (!article) return null;

  const href = articlePublicUrl(article.slug);

  return (
    <a
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-surface transition-colors hover:border-foreground/25"
    >
      {article.featured_image_url ? (
        <div className="relative aspect-[16/10] bg-[#eee]">
          <Image
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 40vw"
            unoptimized={article.featured_image_url.startsWith("http")}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Insights</p>
          <span className="text-xs text-muted-foreground">{formatAdminDate(article.published_at)}</span>
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-accent">
          {article.category || "Insights"}
        </p>
        <h3 className="mt-2 text-balance text-xl font-medium leading-snug tracking-snug text-foreground sm:text-[1.35rem]">
          {article.title}
        </h3>
        <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">{article.author_name || "Mirai Studios"}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
            Read more
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
