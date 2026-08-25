import Link from "next/link";
import { listJobsAdmin } from "@/lib/cms/jobs";
import { formatAdminDate } from "@/lib/cms/utils";
import { AdminStatusBadge } from "@/components/admin/AdminShell";

export default async function AdminCareersIndexPage() {
  const jobs = await listJobsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">Careers</h1>
          <p className="mt-2 text-sm text-muted-foreground">Publish, close and unpublish roles.</p>
        </div>
        <Link href="/admin/careers/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
          New Job
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-[#faf9f7] text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-muted-foreground">
                  No roles yet.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-b border-black/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[job.department, job.location, job.workplace_type].filter(Boolean).join(" · ")}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatAdminDate(job.updated_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/careers/${job.id}`} className="text-accent hover:underline">
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
