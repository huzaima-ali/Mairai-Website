"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCmsPageAction, saveCmsPageAction } from "@/lib/cms/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminStatusBadge } from "@/components/admin/AdminShell";
import type { CmsPageRow } from "@/lib/cms/types";

export function RegionalVariantEditor({ page }: { page: CmsPageRow }) {
  const router = useRouter();
  const [h1, setH1] = useState(page.h1);
  const [intro, setIntro] = useState(page.intro);
  const [bodyHtml, setBodyHtml] = useState(page.body_html);
  const [ctaLabel, setCtaLabel] = useState(page.cta_label || "");
  const [ctaHref, setCtaHref] = useState(page.cta_href || "");
  const [regionalProof, setRegionalProof] = useState(page.regional_proof || "");
  const [relatedServices, setRelatedServices] = useState((page.related_services || []).join(", "));
  const [relatedCaseStudies, setRelatedCaseStudies] = useState((page.related_case_studies || []).join(", "));
  const [relatedIndustries, setRelatedIndustries] = useState((page.related_industries || []).join(", "));
  const [pageSummary, setPageSummary] = useState(page.page_summary || "");
  const [regionServed, setRegionServed] = useState(page.region_served || "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function split(value: string) {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Regional variant</p>
          <h1 className="mt-1 text-2xl font-medium">{page.page_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {page.region_label} · <code>{page.route}</code> · base <code>{page.base_route}</code>
          </p>
          <div className="mt-2"><AdminStatusBadge status={page.status} /></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/pages/edit?route=${encodeURIComponent(page.route)}`} className="rounded-full border border-black/10 px-4 py-2 text-sm">
            Edit SEO
          </Link>
          <a href={page.route} target="_blank" rel="noreferrer" className="rounded-full border border-black/10 px-4 py-2 text-sm">
            Preview route
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Regional pages should contain unique regional context and should not simply duplicate another page with
        location keywords replaced. Keep draft/noindex until the content is meaningfully differentiated.
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            H1
            <input value={h1} onChange={(e) => setH1(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Intro
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Page body</p>
            <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
          </div>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Regional proof
            <textarea value={regionalProof} onChange={(e) => setRegionalProof(e.target.value)} rows={3} placeholder="Local delivery notes, market proof, timezone collaboration…" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
        </div>
        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 self-start">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA label
            <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA href
            <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Page summary
            <textarea value={pageSummary} onChange={(e) => setPageSummary(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Region served
            <input value={regionServed} onChange={(e) => setRegionServed(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related services
            <input value={relatedServices} onChange={(e) => setRelatedServices(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related industries
            <input value={relatedIndustries} onChange={(e) => setRelatedIndustries(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related case studies
            <input value={relatedCaseStudies} onChange={(e) => setRelatedCaseStudies(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
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
                await saveCmsPageAction({
                  id: page.id,
                  h1,
                  intro,
                  body_html: bodyHtml,
                  cta_label: ctaLabel,
                  cta_href: ctaHref,
                  regional_proof: regionalProof,
                  related_services: split(relatedServices),
                  related_industries: split(relatedIndustries),
                  related_case_studies: split(relatedCaseStudies),
                  page_summary: pageSummary,
                  region_served: regionServed,
                  status: "draft",
                });
                setMessage("Draft saved (still noindex until published).");
                router.refresh();
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Save failed");
              }
            });
          }}
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={pending}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white"
          onClick={() => {
            if (!window.confirm("Publish this regional page? Confirm it has unique regional content.")) return;
            startTransition(async () => {
              try {
                await saveCmsPageAction({
                  id: page.id,
                  h1,
                  intro,
                  body_html: bodyHtml,
                  cta_label: ctaLabel,
                  cta_href: ctaHref,
                  regional_proof: regionalProof,
                  related_services: split(relatedServices),
                  related_industries: split(relatedIndustries),
                  related_case_studies: split(relatedCaseStudies),
                  page_summary: pageSummary,
                  region_served: regionServed,
                  status: "published",
                });
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
            startTransition(async () => {
              try {
                await saveCmsPageAction({
                  id: page.id,
                  h1,
                  intro,
                  body_html: bodyHtml,
                  status: "unpublished",
                });
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
            if (!window.confirm("Soft-delete this regional variant?")) return;
            startTransition(async () => {
              try {
                await deleteCmsPageAction(page.id);
                router.replace("/admin/pages");
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Delete failed");
              }
            });
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
