import { ArrowUpRight } from "lucide-react";
import { getFeaturedInsight, getInsightUrl } from "@/lib/insights";

export function FeaturedInsightCard() {
  const article = getFeaturedInsight();
  if (!article) return null;

  const href = getInsightUrl(article.slug);

  return (
    <a
      href={href}
      className="group flex h-full flex-col rounded-[24px] border border-border bg-surface p-6 transition-colors hover:border-foreground/25 sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Insights</p>
        <span className="text-xs text-muted-foreground">{article.readTime}</span>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-accent">{article.category}</p>
      <h3 className="mt-2 text-balance text-xl font-medium leading-snug tracking-snug text-foreground sm:text-[1.35rem]">
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">{article.date}</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
          Read more
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}
