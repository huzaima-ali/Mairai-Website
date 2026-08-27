"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCmsPageAction } from "@/lib/cms/actions";
import { CMS_PAGE_TYPE_OPTIONS, REGION_VARIANT_OPTIONS } from "@/lib/cms/types";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/cms/utils";

export function CreatePageForm() {
  const router = useRouter();
  const [pageType, setPageType] = useState<(typeof CMS_PAGE_TYPE_OPTIONS)[number]["value"]>("landing");
  const [pageName, setPageName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [h1, setH1] = useState("");
  const [intro, setIntro] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [ctaHeading, setCtaHeading] = useState("Ready to talk through a project?");
  const [ctaCopy, setCtaCopy] = useState(
    "Tell us what you are building. The Mirai team will follow up to discuss scope, approach and next steps.",
  );
  const [ctaHref, setCtaHref] = useState("/#contact");
  const [ctaLabel, setCtaLabel] = useState("Request a call");
  const [regionCode, setRegionCode] = useState<"global" | "us" | "uk" | "mena" | "custom">("global");
  const [customPrefix, setCustomPrefix] = useState("");
  const [relatedServices, setRelatedServices] = useState("");
  const [relatedIndustries, setRelatedIndustries] = useState("");
  const [relatedCaseStudies, setRelatedCaseStudies] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const prefix = CMS_PAGE_TYPE_OPTIONS.find((opt) => opt.value === pageType)?.prefix || "/landing";
  const previewSlug = slug || slugify(pageName);
  const regionPrefix =
    regionCode === "global" ? "" : regionCode === "custom" ? `/${slugify(customPrefix) || "custom"}` : `/${regionCode}`;
  const previewRoute = `${regionPrefix}${prefix}/${previewSlug || "…"}`;

  const split = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium">Create New Page</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Draft + noindex until you explicitly publish. Uses the existing marketing page layout.
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">Route preview: {previewRoute}</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Page type
            <select
              value={pageType}
              onChange={(e) => setPageType(e.target.value as typeof pageType)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            >
              {CMS_PAGE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Page name
            <input
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
                if (!h1) setH1(e.target.value);
              }}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
              required
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
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            H1
            <input
              value={h1}
              onChange={(e) => setH1(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Intro / hero copy
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={4}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Main page content
            </p>
            <RichTextEditor value={bodyHtml} onChange={setBodyHtml} />
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-black/8 bg-white p-5">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Region
            <select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value as typeof regionCode)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            >
              <option value="global">Global</option>
              {REGION_VARIANT_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {regionCode === "custom" ? (
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Custom region prefix
              <input
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="apac"
                className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
              />
            </label>
          ) : null}
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA heading
            <input value={ctaHeading} onChange={(e) => setCtaHeading(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA copy
            <textarea value={ctaCopy} onChange={(e) => setCtaCopy(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA button label
            <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            CTA destination
            <input value={ctaHref} onChange={(e) => setCtaHref(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
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
            SEO title
            <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Defaults from page name / H1" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Meta description
            <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
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
          <p className="text-xs text-muted-foreground">Index: Noindex · Sitemap: excluded until published.</p>
        </div>
      </div>

      {message ? <p className="text-sm text-rose-700">{message}</p> : null}

      <button
        type="button"
        disabled={pending || !pageName.trim()}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        onClick={() => {
          setMessage(null);
          startTransition(async () => {
            try {
              const created = await createCmsPageAction({
                page_name: pageName,
                slug: previewSlug,
                page_type: pageType,
                h1: h1 || pageName,
                intro,
                body_html: bodyHtml,
                cta_heading: ctaHeading,
                cta_copy: ctaCopy,
                cta_label: ctaLabel,
                cta_href: ctaHref,
                region_code: regionCode,
                custom_prefix: customPrefix || undefined,
                related_services: split(relatedServices),
                related_industries: split(relatedIndustries),
                related_case_studies: split(relatedCaseStudies),
                seo_title: seoTitle || null,
                meta_description: metaDescription || null,
                og_title: ogTitle || null,
                og_description: ogDescription || null,
                og_image_url: ogImage || null,
                noindex: true,
                include_in_sitemap: false,
              });
              router.push(`/admin/pages/variant/${created.id}`);
            } catch (err) {
              setMessage(err instanceof Error ? err.message : "Could not create page");
            }
          });
        }}
      >
        {pending ? "Creating…" : "Create draft"}
      </button>
    </div>
  );
}
