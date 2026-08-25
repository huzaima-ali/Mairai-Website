import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/cms/auth";
import { listJobsAdmin } from "@/lib/cms/jobs";
import { JobDetailView } from "@/components/careers/JobDetailView";

type Props = { params: { slug: string } };

export const metadata = {
  robots: { index: false, follow: false },
  title: { absolute: "Preview · Role · Mirai Site Ops" },
};

export default async function PreviewJobPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const jobs = await listJobsAdmin();
  const job = jobs.find((j) => j.slug === params.slug) || null;
  if (!job || job.deleted_at) notFound();

  return (
    <div>
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-900">
        Preview only · not public · status: {job.status}
      </div>
      <JobDetailView job={job} preview />
    </div>
  );
}
