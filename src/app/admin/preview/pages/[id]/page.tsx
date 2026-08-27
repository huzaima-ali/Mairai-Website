import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/cms/auth";
import { getCmsPageById } from "@/lib/cms/ops-store";
import { CmsPageView } from "@/components/cms/CmsPageView";

type Props = { params: { id: string } };

export const metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Preview · Page · Mirai Site Ops" },
};

export default async function PreviewCmsPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const page = await getCmsPageById(params.id);
  if (!page || page.deleted_at) notFound();

  return (
    <div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
        Preview only · not public · not in sitemap · status: {page.status}
      </div>
      <CmsPageView page={page} preview />
    </div>
  );
}
