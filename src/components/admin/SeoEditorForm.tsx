"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createRegionalVariantAction, upsertPageSeoAction } from "@/lib/cms/actions";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import type { RegistryPage } from "@/lib/cms/route-registry";
import type { CmsPageRow, PageSeoRow } from "@/lib/cms/types";
import { REGION_VARIANT_OPTIONS } from "@/lib/cms/types";
import { buildSeoWarnings, inferActiveSchemas } from "@/lib/cms/seo-helpers";
import { SERVICE_PAGES } from "@/lib/services";
import { CASE_STUDIES } from "@/lib/case-studies";

function csv(values?: string[]) {
  return (values || []).join(", ");
}
function fromCsv(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function SeoEditorForm({
  page,
  override,
  cmsPage,
  allOverrides = [],
}: {
  page: RegistryPage;
  override: PageSeoRow | null;
  cmsPage?: CmsPageRow | null;
  allOverrides?: PageSeoRow[];
}) {
  const router = useRouter();
  const [seoTitle, setSeoTitle] = useState(override?.seo_title || page.defaultTitle);
  const [metaDescription, setMetaDescription] = useState(
    override?.meta_description || page.defaultDescription,
  );
  const [ogTitle, setOgTitle] = useState(override?.og_title || "");
  const [ogDescription, setOgDescription] = useState(override?.og_description || "");
  const [ogImage, setOgImage] = useState(override?.og_image_url || page.defaultOgImage || "");
  const [twitterTitle, setTwitterTitle] = useState(override?.twitter_title || "");
  const [twitterDescription, setTwitterDescription] = useState(override?.twitter_description || "");
  const [twitterImage, setTwitterImage] = useState(override?.twitter_image_url || "");
  const [twitterCard, setTwitterCard] = useState(override?.twitter_card || "summary_large_image");
  const [noindex, setNoindex] = useState(override?.noindex ?? false);
  const [nofollow, setNofollow] = useState(override?.nofollow ?? false);
  const [breadcrumbLabel, setBreadcrumbLabel] = useState(override?.breadcrumb_label || page.pageName);
  const [includeInSitemap, setIncludeInSitemap] = useState(override?.include_in_sitemap ?? true);
  const [sitemapPriority, setSitemapPriority] = useState(
    override?.sitemap_priority != null ? String(override.sitemap_priority) : "",
  );
  const [canonicalOverride, setCanonicalOverride] = useState(override?.canonical_override || "");
  const [showAdvancedCanonical, setShowAdvancedCanonical] = useState(Boolean(override?.canonical_override));
  const [pageSummary, setPageSummary] = useState(override?.page_summary || cmsPage?.page_summary || "");
  const [primaryTopic, setPrimaryTopic] = useState(override?.primary_topic || cmsPage?.primary_topic || "");
  const [industry, setIndustry] = useState(override?.industry || cmsPage?.industry || "");
  const [regionServed, setRegionServed] = useState(override?.region_served || cmsPage?.region_served || "");
  const [relatedServices, setRelatedServices] = useState(csv(override?.related_services || cmsPage?.related_services));
  const [relatedIndustries, setRelatedIndustries] = useState(
    csv(override?.related_industries || cmsPage?.related_industries),
  );
  const [relatedCaseStudies, setRelatedCaseStudies] = useState(
    csv(override?.related_case_studies || cmsPage?.related_case_studies),
  );
  const [schemaAreaServed, setSchemaAreaServed] = useState(override?.schema_area_served || "");
  const [schemaServiceName, setSchemaServiceName] = useState(override?.schema_service_name || "");
  const [schemaTypes, setSchemaTypes] = useState(csv(override?.schema_types));
  const [advancedSchema, setAdvancedSchema] = useState(override?.advanced_schema_json || "");
  const [showAdvancedSchema, setShowAdvancedSchema] = useState(Boolean(override?.advanced_schema_json));
  const [regionCode, setRegionCode] = useState<"us" | "uk" | "mena" | "custom">("us");
  const [customPrefix, setCustomPrefix] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const defaultCanonical = `${CANONICAL_ORIGIN}${page.route === "/" ? "" : page.route}`;
  const canonical = canonicalOverride.trim() || defaultCanonical;
  const previewTitle = useMemo(
    () => (seoTitle.includes("Mirai Studios") ? seoTitle : `${seoTitle} | Mirai Studios`),
    [seoTitle],
  );

  const schemas = inferActiveSchemas({
    route: page.route,
    pageType: page.pageType,
    override,
    cmsPage,
  });

  const warnings = buildSeoWarnings({
    seoTitle,
    metaDescription,
    canonical,
    ogImage,
    h1: cmsPage?.h1,
    noindex,
    bodyHtml: cmsPage?.body_html,
    allTitles: allOverrides.map((o) => o.seo_title || "").concat([seoTitle]),
    allDescriptions: allOverrides.map((o) => o.meta_description || "").concat([metaDescription]),
    baseRoute: cmsPage?.base_route || override?.base_route,
    regionalBody: cmsPage?.body_html,
    baseBodySample: page.defaultDescription,
  });

  const isRegionalEligible =
    page.route.startsWith("/services/") && !page.route.split("/").includes("us") && !override?.region_code;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Page</p>
          <h1 className="mt-1 text-2xl font-medium">{page.pageName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {page.pageType}
            {override?.region_code ? ` · ${String(override.region_code).toUpperCase()} variant` : " · Global"} ·{" "}
            <code>{page.route}</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={page.route} target="_blank" rel="noreferrer" className="rounded-full border border-black/10 px-4 py-2 text-sm">
            View page
          </a>
          {cmsPage ? (
            <Link href={`/admin/pages/variant/${cmsPage.id}`} className="rounded-full border border-black/10 px-4 py-2 text-sm">
              Edit regional content
            </Link>
          ) : null}
        </div>
      </div>

      {cmsPage || override?.base_route ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Regional pages should contain unique regional context and should not simply duplicate another page with
          location keywords replaced.
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <form
          className="space-y-6 rounded-2xl border border-black/8 bg-white p-4 sm:p-5 lg:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setMessage(null);
            startTransition(async () => {
              try {
                await upsertPageSeoAction({
                  route: page.route,
                  page_name: page.pageName,
                  page_type: page.pageType,
                  seo_title: seoTitle,
                  meta_description: metaDescription,
                  og_title: ogTitle || null,
                  og_description: ogDescription || null,
                  og_image_url: ogImage || null,
                  twitter_title: twitterTitle || null,
                  twitter_description: twitterDescription || null,
                  twitter_image_url: twitterImage || null,
                  twitter_card: twitterCard || null,
                  noindex,
                  nofollow,
                  breadcrumb_label: breadcrumbLabel || null,
                  include_in_sitemap: includeInSitemap,
                  sitemap_priority: sitemapPriority ? Number(sitemapPriority) : null,
                  canonical_override: canonicalOverride || null,
                  page_summary: pageSummary || null,
                  primary_topic: primaryTopic || null,
                  industry: industry || null,
                  region_served: regionServed || null,
                  related_services: fromCsv(relatedServices),
                  related_industries: fromCsv(relatedIndustries),
                  related_case_studies: fromCsv(relatedCaseStudies),
                  schema_area_served: schemaAreaServed || null,
                  schema_service_name: schemaServiceName || null,
                  schema_types: fromCsv(schemaTypes),
                  advanced_schema_json: advancedSchema || null,
                  region_code: override?.region_code || null,
                  base_route: override?.base_route || null,
                  status: override?.status || "published",
                });
                setMessage("SEO override saved.");
                router.refresh();
              } catch (err) {
                setMessage(err instanceof Error ? err.message : "Save failed");
              }
            });
          }}
        >
          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Basic SEO</h2>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              SEO title
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
              <span className="mt-1 block text-[11px] normal-case tracking-normal">{seoTitle.length} chars · aim ~50–60</span>
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Meta description
              <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
              <span className="mt-1 block text-[11px] normal-case tracking-normal">{metaDescription.length} chars · aim ~140–160</span>
            </label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Breadcrumb label
              <input value={breadcrumbLabel} onChange={(e) => setBreadcrumbLabel(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
            </label>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} /> Noindex</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={nofollow} onChange={(e) => setNofollow(e.target.checked)} /> Nofollow</label>
              <label className="inline-flex items-center gap-2"><input type="checkbox" checked={includeInSitemap} onChange={(e) => setIncludeInSitemap(e.target.checked)} /> Include in sitemap</label>
            </div>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Sitemap priority (0–1)
              <input value={sitemapPriority} onChange={(e) => setSitemapPriority(e.target.value)} placeholder="0.8" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
            </label>
            <div>
              <p className="text-xs text-muted-foreground">Canonical (auto): {defaultCanonical}</p>
              <button type="button" className="mt-1 text-xs text-accent hover:underline" onClick={() => setShowAdvancedCanonical((v) => !v)}>
                {showAdvancedCanonical ? "Hide" : "Advanced"} canonical override
              </button>
              {showAdvancedCanonical ? (
                <input value={canonicalOverride} onChange={(e) => setCanonicalOverride(e.target.value)} placeholder="Only if required — full URL or path" className="mt-2 w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 text-sm" />
              ) : null}
            </div>
          </section>

          <section className="space-y-3 border-t border-black/8 pt-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Social metadata</h2>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">OG title<input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">OG description<textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} rows={2} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">OG image URL<input value={ogImage} onChange={(e) => setOgImage(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Twitter/X title<input value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Twitter/X description<textarea value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} rows={2} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Twitter/X image<input value={twitterImage} onChange={(e) => setTwitterImage(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Twitter card
              <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm">
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </label>
          </section>

          <section className="space-y-3 border-t border-black/8 pt-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">AIO / entity fields</h2>
            <p className="text-xs text-muted-foreground">Semantic fields for clarity and schema — not invisible keyword spam.</p>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Page summary<textarea value={pageSummary} onChange={(e) => setPageSummary(e.target.value)} rows={2} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Primary service / topic<input value={primaryTopic} onChange={(e) => setPrimaryTopic(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Industry<input value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Region served<input value={regionServed} onChange={(e) => setRegionServed(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Related services (paths, comma-separated)<input value={relatedServices} onChange={(e) => setRelatedServices(e.target.value)} list="svc-paths" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <datalist id="svc-paths">{SERVICE_PAGES.map((s) => <option key={s.path} value={s.path} />)}</datalist>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Related industries<input value={relatedIndustries} onChange={(e) => setRelatedIndustries(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Related case studies (slugs)<input value={relatedCaseStudies} onChange={(e) => setRelatedCaseStudies(e.target.value)} list="case-slugs" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <datalist id="case-slugs">{CASE_STUDIES.map((c) => <option key={c.slug} value={c.slug} />)}</datalist>
          </section>

          <section className="space-y-3 border-t border-black/8 pt-5">
            <h2 className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">Structured data</h2>
            <ul className="space-y-1 text-sm">
              {schemas.map((s) => (
                <li key={`${s.type}-${s.source}`} className="flex justify-between gap-3 rounded-lg bg-[#faf9f7] px-3 py-2">
                  <span className="font-medium">{s.type}</span>
                  <span className="text-xs text-muted-foreground">{s.note}</span>
                </li>
              ))}
            </ul>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Schema service name<input value={schemaServiceName} onChange={(e) => setSchemaServiceName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Schema areaServed<input value={schemaAreaServed} onChange={(e) => setSchemaAreaServed(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Additional schema types (comma-separated)<input value={schemaTypes} onChange={(e) => setSchemaTypes(e.target.value)} placeholder="Service, BreadcrumbList" className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" /></label>
            <button type="button" className="text-xs text-accent hover:underline" onClick={() => setShowAdvancedSchema((v) => !v)}>
              {showAdvancedSchema ? "Hide" : "Show"} advanced schema override
            </button>
            {showAdvancedSchema ? (
              <textarea value={advancedSchema} onChange={(e) => setAdvancedSchema(e.target.value)} rows={5} placeholder='Optional JSON object with "@type" — validated before use' className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2.5 font-mono text-xs" />
            ) : null}
          </section>

          {message ? <p className="text-sm">{message}</p> : null}
          <button type="submit" disabled={pending} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60">
            {pending ? "Saving…" : "Save SEO override"}
          </button>
        </form>

        <div className="space-y-4">
          <div className="rounded-2xl border border-black/8 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Google-style preview</p>
            <p className="mt-3 text-lg text-[#1a0dab]">{previewTitle}</p>
            <p className="mt-1 text-sm text-[#006621]">{canonical}</p>
            <p className="mt-1 text-sm text-[#4d5156]">{metaDescription}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
            <p className="border-b border-black/8 px-4 py-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">Social preview</p>
            {ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={ogImage} alt="" className="aspect-[1.91/1] w-full bg-zinc-100 object-cover" />
            ) : (
              <div className="flex aspect-[1.91/1] items-center justify-center bg-zinc-100 text-sm text-muted-foreground">No OG image</div>
            )}
            <div className="p-4">
              <p className="text-xs uppercase text-muted-foreground">miraistudios.co</p>
              <p className="mt-1 font-medium">{ogTitle || previewTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">{ogDescription || metaDescription}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-black/8 bg-white p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">SEO status</p>
            {warnings.length === 0 ? (
              <p className="mt-3 text-sm text-emerald-700">No warnings</p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
                {warnings.map((w) => (
                  <li key={w}>• {w}</li>
                ))}
              </ul>
            )}
          </div>

          {isRegionalEligible ? (
            <div className="rounded-2xl border border-black/8 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Create regional variant</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Creates a draft/noindex page under /us|/uk|/mena — independently editable. Does not auto-publish.
              </p>
              <select value={regionCode} onChange={(e) => setRegionCode(e.target.value as typeof regionCode)} className="mt-3 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm">
                {REGION_VARIANT_OPTIONS.map((r) => (
                  <option key={r.code} value={r.code}>{r.label}</option>
                ))}
              </select>
              {regionCode === "custom" ? (
                <input value={customPrefix} onChange={(e) => setCustomPrefix(e.target.value)} placeholder="custom-path-prefix" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
              ) : null}
              <button
                type="button"
                disabled={pending}
                className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white"
                onClick={() => {
                  startTransition(async () => {
                    try {
                      const created = await createRegionalVariantAction({
                        baseRoute: page.route,
                        regionCode,
                        customPrefix: customPrefix || undefined,
                      });
                      router.push(`/admin/pages/variant/${created.id}`);
                    } catch (err) {
                      setMessage(err instanceof Error ? err.message : "Could not create variant");
                    }
                  });
                }}
              >
                Create regional variant
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
