import { notFound, permanentRedirect } from "next/navigation";
import { CMS_PUBLIC_KINDS } from "@/lib/cms/public-page";
import { regionalRouteFor } from "@/lib/cms/seo-helpers";

export const dynamic = "force-dynamic";

type Props = {
  params: { region: string; kind: string; slug: string };
};

export default function LegacyRegionalCmsPage({ params }: Props) {
  if (!CMS_PUBLIC_KINDS.has(params.kind)) notFound();
  if (!["us", "uk", "mena"].includes(params.region)) notFound();
  permanentRedirect(regionalRouteFor(`/${params.kind}/${params.slug}`, params.region));
}
