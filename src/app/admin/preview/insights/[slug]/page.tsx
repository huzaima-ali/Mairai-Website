import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/cms/auth";
import { getArticleBySlugAdmin } from "@/lib/cms/articles";
import { InsightArticleView } from "@/components/insights/InsightArticleView";

type Props = { params: { slug: string } };

export const metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Preview · Insight · Mirai Site Ops" },
};

export default async function PreviewInsightPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const article = await getArticleBySlugAdmin(params.slug);
  if (!article || article.deleted_at) notFound();

  return (
    <div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
        Preview only · not public · status: {article.status}
      </div>
      <InsightArticleView article={article} preview />
    </div>
  );
}
