import { notFound } from "next/navigation";
import { RegionalVariantEditor } from "@/components/admin/RegionalVariantEditor";
import { listCmsPages } from "@/lib/cms/ops-store";

type Props = { params: { id: string } };

export default async function AdminVariantPage({ params }: Props) {
  const pages = await listCmsPages();
  const page = pages.find((p) => p.id === params.id);
  if (!page) notFound();
  return <RegionalVariantEditor page={page} />;
}
