"use client";

import { useMemo, useState, useTransition } from "react";
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
import { AdminBackLink } from "@/components/admin/AdminBackLink";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminCopyButton } from "@/components/admin/AdminCopyButton";
import { AdminStickyPanel } from "@/components/admin/AdminStickyPanel";

const fieldClass =
  "mt-1.5 w-full min-w-0 rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors duration-200 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/30";

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
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const suggestedSlug = useMemo(() => slugify(title), [title]);
  const liveSlug = slug || suggestedSlug;

  function payload(id?: string) {
    return {
      id,
      title,
      slug: liveSlug,
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

  function run(label: string, fn: () => Promise<void>) {
    setMessage(null);
    setError(null);
    setBusyAction(label);
    startTransition(async () => {
      try {
        await fn();
      } catch (err) {
        setError(err instanceof Error ? err.message : `${label} failed`);
      } finally {
        setBusyAction(null);
      }
    });
  }

  return (
    <div className="space-y-5">
      <AdminBackLink href="/admin/careers" label="Back to Careers" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">{job ? "Edit Job" : "Create New Job"}</h1>
          {job ? (
            <div className="mt-2">
              <AdminStatusBadge status={job.status} />
            </div>
          ) : null}
        </div>
        {job ? (
          <a
            href={`/admin/preview/careers/${job.slug}`}
            className="inline-flex min-h-11 items-center rounded-full border border-black/10 px-4 py-2 text-sm transition-all duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            target="_blank"
            rel="noreferrer"
          >
            Preview
          </a>
        ) : null}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
        <div className="min-w-0 space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Title
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
              required
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <span className="flex items-center justify-between gap-2">
              Slug
              {liveSlug ? <AdminCopyButton value={liveSlug} /> : null}
            </span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className={fieldClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Summary
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={fieldClass} />
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

        <AdminStickyPanel
          actions={
            <>
              {error ? <p className="text-sm text-rose-700">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-800">{message}</p> : null}
              <AdminButton
                className="w-full"
                loading={pending && busyAction === "Save"}
                loadingLabel="Saving…"
                disabled={pending}
                onClick={() =>
                  run("Save", async () => {
                    const saved = await saveJobDraftAction(payload(job?.id));
                    setMessage("Draft saved.");
                    if (!job) router.replace(`/admin/careers/${saved.id}`);
                    router.refresh();
                  })
                }
              >
                Save draft
              </AdminButton>
              {job ? (
                <>
                  <AdminButton
                    variant="primary"
                    className="w-full"
                    loading={pending && busyAction === "Publish"}
                    loadingLabel="Publishing…"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Publish this role?")) return;
                      run("Publish", async () => {
                        await saveJobDraftAction(payload(job.id));
                        await publishJobAction(job.id);
                        setMessage("Published.");
                        router.refresh();
                      });
                    }}
                  >
                    {job.status === "published" ? "Republish" : "Publish"}
                  </AdminButton>
                  <AdminButton
                    className="w-full"
                    loading={pending && busyAction === "Close"}
                    loadingLabel="Closing…"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Close this role?")) return;
                      run("Close", async () => {
                        await closeJobAction(job.id);
                        setMessage("Role closed.");
                        router.refresh();
                      });
                    }}
                  >
                    Close role
                  </AdminButton>
                  <AdminButton
                    className="w-full"
                    loading={pending && busyAction === "Unpublish"}
                    loadingLabel="Unpublishing…"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Unpublish this role?")) return;
                      run("Unpublish", async () => {
                        await unpublishJobAction(job.id);
                        setMessage("Unpublished.");
                        router.refresh();
                      });
                    }}
                  >
                    Unpublish
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    className="w-full"
                    loading={pending && busyAction === "Delete"}
                    loadingLabel="Deleting…"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Soft-delete this role?")) return;
                      run("Delete", async () => {
                        await softDeleteJobAction(job.id);
                        router.replace("/admin/careers");
                      });
                    }}
                  >
                    Delete
                  </AdminButton>
                </>
              ) : null}
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Department
              <input value={department} onChange={(e) => setDepartment(e.target.value)} className={fieldClass} />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} className={fieldClass} />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Workplace type
              <input
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className={fieldClass}
                placeholder="Remote, Hybrid…"
              />
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Employment type
              <input
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className={fieldClass}
                placeholder="Full-time…"
              />
            </label>
          </div>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application type
            <select
              value={applicationType}
              onChange={(e) => setApplicationType(e.target.value as "email" | "url" | "both")}
              className={fieldClass}
            >
              <option value="email">On-site application form</option>
              <option value="url">External URL</option>
              <option value="both">Form and URL</option>
            </select>
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application email
            <input
              value={applicationEmail}
              onChange={(e) => setApplicationEmail(e.target.value)}
              className={fieldClass}
              placeholder="Optional override; applications still go to careers@"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Application URL
            <input value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Valid through
            <input
              type="date"
              value={validThrough}
              onChange={(e) => setValidThrough(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            SEO title
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Meta description
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className={fieldClass}
            />
          </label>
        </AdminStickyPanel>
      </div>
    </div>
  );
}
