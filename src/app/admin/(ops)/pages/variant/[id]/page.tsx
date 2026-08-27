import { notFound } from "next/navigation";
import { CmsPageEditor } from "@/components/admin/CmsPageEditor";
import { getCmsPageById, listCmsPages } from "@/lib/cms/ops-store";

type Props = { params: { id: string } };

export default async function AdminCmsPageEditorPage({ params }: Props) {
  const page = await getCmsPageById(params.id);
  if (!page) notFound();
  const pages = await listCmsPages();
  const source =
    (page.source_page_id ? pages.find((item) => item.id === page.source_page_id) : null) ||
    (page.source_route ? pages.find((item) => item.route === page.source_route) : null) ||
    null;
  return <CmsPageEditor page={page} sourcePage={source} />;
}
