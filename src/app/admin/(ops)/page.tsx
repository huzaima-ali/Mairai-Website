import Link from "next/link";
import { listArticlesAdmin } from "@/lib/cms/articles";
import { listJobsAdmin } from "@/lib/cms/jobs";
import { getStaticRegistryPages } from "@/lib/cms/route-registry";
import { formatAdminDate } from "@/lib/cms/utils";
import { AdminStatusBadge } from "@/components/admin/AdminShell";

export default async function AdminDashboardPage() {
  let articles: Awaited<ReturnType<typeof listArticlesAdmin>> = [];
  let jobs: Awaited<ReturnType<typeof listJobsAdmin>> = [];
  try {
    [articles, jobs] = await Promise.all([listArticlesAdmin(), listJobsAdmin()]);
  } catch (error) {
    console.error("[admin] dashboard data failed", error);
  }
  const pages = getStaticRegistryPages();

  const publishedInsights = articles.filter((a) => a.status === "published").length;
  const draftInsights = articles.filter((a) => a.status === "draft").length;
  const openJobs = jobs.filter((j) => j.status === "published").length;
  const draftJobs = jobs.filter((j) => j.status === "draft").length;

  const recent = [
    ...articles.map((a) => ({
      id: a.id,
      label: a.title,
      kind: "Article",
      status: a.status,
      updated_at: a.updated_at,
      href: `/admin/insights/${a.id}`,
    })),
    ...jobs.map((j) => ({
      id: j.id,
      label: j.title,
      kind: "Job",
      status: j.status,
      updated_at: j.updated_at,
      href: `/admin/careers/${j.id}`,
    })),
  ]
    .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
    .slice(0, 8);

  const cards = [
    { label: "Public pages", value: pages.length },
    { label: "Published insights", value: publishedInsights },
    { label: "Draft insights", value: draftInsights },
    { label: "Open jobs", value: openJobs },
    { label: "Draft jobs", value: draftJobs },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mirai Site Ops — SEO, Insights and Careers without redeploying for content changes.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-black/8 bg-white px-4 py-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/admin/insights/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          New Article
        </Link>
        <Link href="/admin/careers/new" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
          New Job
        </Link>
        <Link href="/admin/pages" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium">
          Manage SEO
        </Link>
      </div>

      <section className="rounded-2xl border border-black/8 bg-white">
        <div className="border-b border-black/8 px-4 py-3">
          <h2 className="font-medium">Recent edits</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No CMS edits yet.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {recent.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <Link href={item.href} className="font-medium hover:text-accent">
                    {item.label}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.kind} · {formatAdminDate(item.updated_at)}
                  </p>
                </div>
                <AdminStatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
