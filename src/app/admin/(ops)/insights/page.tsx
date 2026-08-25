import Link from "next/link";
import { listArticlesAdmin } from "@/lib/cms/articles";
import { formatAdminDate } from "@/lib/cms/utils";
import { AdminStatusBadge } from "@/components/admin/AdminShell";

export default async function AdminInsightsIndexPage() {
  const articles = await listArticlesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Insights</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create, preview, publish and unpublish articles.</p>
        </div>
        <Link href="/admin/insights/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          New Article
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-[#faf9f7] text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-muted-foreground">
                  No articles yet.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="border-b border-black/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-muted-foreground">/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatAdminDate(article.updated_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/insights/${article.id}`} className="text-accent hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
