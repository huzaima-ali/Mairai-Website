"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  closeJobAction,
  publishJobAction,
  saveJobDraftAction,
  softDeleteJobAction,
  unpublishJobAction,
} from "@/lib/cms/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminStatusBadge } from "@/components/admin/AdminShell";
import { slugify } from "@/lib/cms/utils";
import type { JobRow } from "@/lib/cms/types";

export function JobEditor({ job }: { job?: JobRow | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(job?.title || "");
  const [slug, setSlug] = useState(job?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(job?.slug));
  const [department, setDepartment] = useState(job?.department || "");
  const [location, setLocation] = useState(job?.location || "");
  const [workplaceType, setWorkplaceType] = useState(job?.workplace_type || "");
  const [employmentType, setEmploymentType] = useState(job?.employment_type || "");
  const [summary, setSummary] = useState(job?.summary || "");
  const [description, setDescription] = useState(job?.description || "");
  const [requirements, setRequirements] = useState(job?.requirements || "");
  const [niceToHave, setNiceToHave] = useState(job?.nice_to_have || "");
  const [applicationType, setApplicationType] = useState<"email" | "url" | "both">(
    job?.application_type || "email",
  );
  const [applicationUrl, setApplicationUrl] = useState(job?.application_url || "");
  const [applicationEmail, setApplicationEmail] = useState(job?.application_email || "");
  const [validThrough, setValidThrough] = useState(job?.valid_through?.slice(0, 10) || "");
  const [seoTitle, setSeoTitle] = useState(job?.seo_title || "");
  const [metaDescription, setMetaDescription] = useState(job?.meta_description || "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const suggestedSlug = useMemo(() => slugify(title), [title]);

  function payload(id?: string) {
    return {
      id,
      title,
      slug: slug || suggestedSlug,
      department,
      location,
      workplace_type: workplaceType,
      employment_type: employmentType,
      summary,
      description,
      requirements,
      nice_to_have: niceToHave,
      application_type: applicationType,
      application_url: applicationUrl || null,
      application_email: applicationEmail || null,
      valid_through: validThrough ? new Date(validThrough).toISOString() : null,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
    };
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">{job ? "Edit role" : "New role"}</h1>
          {job ? <div className="mt-2"><AdminStatusBadge status={job.status} /></div> : null}
        </div>
        {job ? (
          <Link
            href={`/admin/preview/careers/${job.slug}`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            target="_blank"
          >
            Preview
          </Link>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Title
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Slug
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Department
              <input value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Workplace type
              <input value={workplaceType} onChange={(e) => setWorkplaceType(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" placeholder="Remote, Hybrid…" />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Employment type
              <input value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" placeholder="Full-time…" />
            </label>
          </div>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Summary
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Description</p>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Requirements</p>
            <RichTextEditor value={requirements} onChange={setRequirements} />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Nice to have</p>
            <RichTextEditor value={niceToHave} onChange={setNiceToHave} />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 self-start">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application type
            <select
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value as "email" | "url" | "both")}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            >
              <option value="email">Email</option>
              <option value="url">URL</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application email
            <input value={applicationEmail} onChange={(e) => setApplicationEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application URL
            <input value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Valid through
            <input type="date" value={validThrough} onChange={(e) => setValidThrough(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            SEO title
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Meta description
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
        </div>
      </div>

      {message ? <p className="text-sm">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending}
          className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium"
          onClick={() => {
            startTransition(async () => {
              try {
                const saved = await saveJobDraftAction(payload(job?.id));
                setMessage("Draft saved.");
                if (!job) router.replace(`/admin/careers/${saved.id}`);
                router.refresh();
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Save failed");
              }
            });
          }}
        >
          Save draft
        </button>
        {job ? (
          <>
            <button
              type="button"
              disabled={pending}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
              onClick={() => {
                if (!window.confirm("Publish this role?")) return;
                startTransition(async () => {
                  try {
                    await saveJobDraftAction(payload(job.id));
                    await publishJobAction(job.id);
                    setMessage("Published.");
                    router.refresh();
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Publish failed");
                  }
                });
              }}
            >
              Publish
            </button>
            <button
              type="button"
              disabled={pending}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm"
              onClick={() => {
                if (!window.confirm("Close this role?")) return;
                startTransition(async () => {
                  try {
                    await closeJobAction(job.id);
                    setMessage("Role closed.");
                    router.refresh();
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Close failed");
                  }
                });
              }}
            >
              Close role
            </button>
            <button
              type="button"
              disabled={pending}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm"
              onClick={() => {
                if (!window.confirm("Unpublish this role?")) return;
                startTransition(async () => {
                  try {
                    await unpublishJobAction(job.id);
                    setMessage("Unpublished.");
                    router.refresh();
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Unpublish failed");
                  }
                });
              }}
            >
              Unpublish
            </button>
            <button
              type="button"
              disabled={pending}
              className="rounded-full border border-rose-200 px-5 py-2.5 text-sm text-rose-700"
              onClick={() => {
                if (!window.confirm("Soft-delete this role?")) return;
                startTransition(async () => {
                  try {
                    await softDeleteJobAction(job.id);
                    router.replace("/admin/careers");
                  } catch (err) {
                    setMessage(err instanceof Error ? err.message : "Delete failed");
                  }
                });
              }}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
