import Link from "next/link";
import { listArticlesAdmin } from "@/lib/cms/articles";
import { getHomepageFeaturedArticleId } from "@/lib/cms/ops-store";
import { InsightsArticlesTable } from "@/components/admin/InsightsArticlesTable";

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
        <Link href="/admin/insights/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          New Article
        </Link>
      </div>

      <InsightsArticlesTable articles={articles} homepageFeaturedId={homepageFeaturedId} />
    </div>
  );
}
