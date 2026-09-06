import { listArticlesAdmin } from "@/lib/cms/articles";
import { getHomepageFeaturedArticleId } from "@/lib/cms/ops-store";
import { InsightsArticlesTable } from "@/components/admin/InsightsArticlesTable";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function AdminInsightsIndexPage() {
  const [articles, homepageFeaturedId] = await Promise.all([
    listArticlesAdmin(),
    getHomepageFeaturedArticleId(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Insights</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, publish, unpublish, and choose the homepage featured article.
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]"
        >
          New Article
        </Link>
      </div>

      <InsightsArticlesTable articles={articles} homepageFeaturedId={homepageFeaturedId} />
    </div>
  );
}
