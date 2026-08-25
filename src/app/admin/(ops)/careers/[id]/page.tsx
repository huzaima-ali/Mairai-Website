import { notFound } from "next/navigation";
import { JobEditor } from "@/components/admin/JobEditor";
import { getJobByIdAdmin } from "@/lib/cms/jobs";

type Props = { params: { id: string } };

export default async function AdminEditJobPage({ params }: Props) {
  const job = await getJobByIdAdmin(params.id);
  if (!job || job.deleted_at) notFound();
  return <JobEditor job={job} />;
}
