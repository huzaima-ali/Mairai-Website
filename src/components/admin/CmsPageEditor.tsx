"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCmsPageAction, saveCmsPageAction } from "@/lib/cms/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminStatusBadge } from "@/components/admin/AdminShell";
import type { CmsPageRow } from "@/lib/cms/types";
import { buildSeoWarnings, contentSimilarity } from "@/lib/cms/seo-helpers";
import { CANONICAL_ORIGIN } from "@/lib/seo";

export function CmsPageEditor({
  page,
  sourcePage,
}: {
  page: CmsPageRow;
  sourcePage?: CmsPageRow | null;
}) {
  const router = useRouter();
  const [pageName, setPageName] = useState(page.page_name);
  const [slug, setSlug] = useState(page.slug);
  const [h1, setH1] = useState(page.h1);
  const [intro, setIntro] = useState(page.intro);
  const [bodyHtml, setBodyHtml] = useState(page.body_html);
  const [ctaHeading, setCtaHeading] = useState(page.cta_heading || "");
  const [ctaCopy, setCtaCopy] = useState(page.cta_copy || "");
  const [ctaLabel, setCtaLabel] = useState(page.cta_label || "");
  const [ctaHref, setCtaHref] = useState(page.cta_href || "");
  const [regionalProof, setRegionalProof] = useState(page.regional_proof || "");
  const [relatedServices, setRelatedServices] = useState((page.related_services || []).join(", "));
  const [relatedCaseStudies, setRelatedCaseStudies] = useState((page.related_case_studies || []).join(", "));
  const [relatedIndustries, setRelatedIndustries] = useState((page.related_industries || []).join(", "));
  const [pageSummary, setPageSummary] = useState(page.page_summary || "");
  const [regionServed, setRegionServed] = useState(page.region_served || "");
  const [seoTitle, setSeoTitle] = useState(page.seo_title || "");
  const [metaDescription, setMetaDescription] = useState(page.meta_description || "");
  const [ogTitle, setOgTitle] = useState(page.og_title || "");
  const [ogDescription, setOgDescription] = useState(page.og_description || "");
  const [ogImage, setOgImage] = useState(page.og_image_url || "");
  const [canonicalOverride, setCanonicalOverride] = useState(page.canonical_override || "");
  const [noindex, setNoindex] = useState(page.noindex);
  const [includeInSitemap, setIncludeInSitemap] = useState(page.include_in_sitemap);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isRegional = page.region_code && page.region_code !== "global";
  const similarity = useMemo(() => {
    if (!sourcePage) return 0;
    return contentSimilarity(
      `${h1} ${intro} ${bodyHtml}`,
      `${sourcePage.h1} ${sourcePage.intro} ${sourcePage.body_html}`,
    );
  }, [sourcePage, h1, intro, bodyHtml]);

  const warnings = buildSeoWarnings({
    seoTitle: seoTitle || h1,
    metaDescription: metaDescription || intro,
    canonical: canonicalOverride || `${CANONICAL_ORIGIN}${page.route}`,
    ogImage,
    h1,
    noindex,
    bodyHtml,
    baseRoute: isRegional ? page.base_route : null,
    regionalBody: bodyHtml,
    baseBodySample: sourcePage?.body_html,
  });

  function split(value: string) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  function payload(status?: CmsPageRow["status"]) {
    return {
      id: page.id,
      page_name: pageName,
      slug,
      h1,
      intro,
      body_html: bodyHtml,
      cta_heading: ctaHeading,
      cta_copy: ctaCopy,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      regional_proof: regionalProof,
      related_services: split(relatedServices),
      related_industries: split(relatedIndustries),
      related_case_studies: split(relatedCaseStudies),
      page_summary: pageSummary,
      region_served: regionServed,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
      og_title: ogTitle || null,
      og_description: ogDescription || null,
      og_image_url: ogImage || null,
      canonical_override: canonicalOverride || null,
      noindex,
      include_in_sitemap: includeInSitemap,
      ...(status ? { status } : {}),
    };
  }

  function run(label: string, fn: () => Promise<void>) {
    setMessage(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : `${label} failed`);
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
            {isRegional ? "Regional variant" : "CMS page"}
          </p>
          <h1 className="mt-1 text-2xl font-medium">{page.page_name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {page.page_type} · {page.region_label} · <code>{page.route}</code>
          </p>
          {page.source_page_name || page.source_route ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Duplicated from: <span className="font-medium text-foreground">{page.source_page_name || page.source_route}</span>
              {page.source_route ? (
                <>
                  {" "}
                  <code>{page.source_route}</code>
                </>
              ) : null}
            </p>
          ) : null}
          <div className="mt-2">
            <AdminStatusBadge status={page.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/pages/edit?route=${encodeURIComponent(page.route)}`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
          >
            Advanced SEO
          </Link>
          <Link
            href={`/admin/preview/pages/${page.id}`}
            target="_blank"
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
          >
            Preview
          </Link>
        </div>
      </div>

      {isRegional ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Regional landing pages should contain meaningful region-specific content, proof and positioning. Do not
          publish pages that only replace the country/region name.
          {similarity > 0.85 ? (
            <span className="mt-1 block font-medium">
              This draft is still very similar to the source page ({Math.round(similarity * 100)}% overlap). This is a
              warning, not a blocker.
            </span>
          ) : null}
        </div>
      ) : page.source_route ? (
        <div className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-muted-foreground">
          This copy is independent of the source page. Canonicals are not linked automatically.
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <ul className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {warnings.map((warning) => (
            <li key={warning}>• {warning}</li>
          ))}
        </ul>
      ) : null}

      <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Page name
            <input value={pageName} onChange={(e) => setPageName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Slug
            <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            H1
            <input value={h1} onChange={(e) => setH1(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Intro
            <textarea value={intro} onChange={(e) => setIntro(e.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Content</p>
            <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
          </div>
          {isRegional ? (
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Regional proof
              <textarea
                value={regionalProof}
                onChange={(e) => setRegionalProof(e.target.value)}
                rows={3}
                placeholder="Local delivery notes, market proof, timezone collaboration…"
                className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
              />
            </label>
          ) : null}
        </div>

        <aside className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA heading
            <input value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA copy
            <textarea value={ctaCopy} onChange={(e) => setCtaCopy(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA button
            <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA destination
            <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
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
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Page summary
            <textarea value={pageSummary} onChange={(e) => setPageSummary(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            SEO title
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Meta description
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            OG title
            <input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            OG description
            <textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            OG image
            <input value={ogImage} onChange={(e) => setOgImage(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Canonical override
            <input value={canonicalOverride} onChange={(e) => setCanonicalOverride(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} />
            Noindex
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeInSitemap}
              onChange={(e) => setIncludeInSitemap(e.target.checked)}
            />
            Include in sitemap
          </label>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

          <div className="sticky bottom-0 -mx-5 space-y-2 border-t border-black/8 bg-white px-5 py-4">
            <button
              type="button"
              disabled={pending}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium disabled:opacity-60"
              onClick={() =>
                run("Save", async () => {
                  await saveCmsPageAction(payload());
                  setMessage(page.status === "published" ? "Saved." : "Draft saved (noindex until published).");
                  router.refresh();
                })
              }
            >
              Save draft
            </button>
            {page.status === "published" ? (
              <>
                <button
                  type="button"
                  disabled={pending}
                  className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                  onClick={() => {
                    if (!window.confirm("Save and keep this page published?")) return;
                    run("Publish", async () => {
                      await saveCmsPageAction(payload("published"));
                      setMessage("Published.");
                      router.refresh();
                    });
                  }}
                >
                  Republish
                </button>
                <button
                  type="button"
                  disabled={pending}
                  className="w-full rounded-full border border-black/10 px-5 py-2.5 text-sm disabled:opacity-60"
                  onClick={() =>
                    run("Unpublish", async () => {
                      await saveCmsPageAction(payload("unpublished"));
                      setMessage("Unpublished.");
                      router.refresh();
                    })
                  }
                >
                  Unpublish
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={pending}
                className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                onClick={() => {
                  if (isRegional && !window.confirm("Publish this regional page? Confirm it has unique regional content.")) {
                    return;
                  }
                  run("Publish", async () => {
                    await saveCmsPageAction({ ...payload("published"), noindex: false, include_in_sitemap: true });
                    setNoindex(false);
                    setIncludeInSitemap(true);
                    setMessage("Published.");
                    router.refresh();
                  });
                }}
              >
                Publish
              </button>
            )}
            <button
              type="button"
              disabled={pending}
              className="w-full rounded-full border border-rose-200 px-5 py-2.5 text-sm text-rose-700 disabled:opacity-60"
              onClick={() => {
                if (!window.confirm("Soft-delete this page?")) return;
                run("Delete", async () => {
                  await deleteCmsPageAction(page.id);
                  router.replace("/admin/pages");
                });
              }}
            >
              Delete
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
