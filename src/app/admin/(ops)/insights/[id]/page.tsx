import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { getArticleByIdAdmin } from "@/lib/cms/articles";

type Props = { params: { id: string } };

export default async function AdminEditInsightPage({ params }: Props) {
  const article = await getArticleByIdAdmin(params.id);
  if (!article || article.deleted_at) notFound();
  return <ArticleEditor article={article} />;
}
