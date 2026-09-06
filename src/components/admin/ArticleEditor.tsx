"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  publishArticleAction,
  saveArticleDraftAction,
  softDeleteArticleAction,
  unpublishArticleAction,
} from "@/lib/cms/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { slugify } from "@/lib/cms/utils";
import type { ArticleRow } from "@/lib/cms/types";
import { AdminStatusBadge } from "@/components/admin/AdminShell";
import { AdminBackLink } from "@/components/admin/AdminBackLink";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminCopyButton } from "@/components/admin/AdminCopyButton";
import { AdminStickyPanel } from "@/components/admin/AdminStickyPanel";

const fieldClass =
  "mt-1.5 w-full min-w-0 rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors duration-200 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-ring/30";

export function ArticleEditor({ article }: { article?: ArticleRow | null }) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [category, setCategory] = useState(article?.category || "");
  const [tags, setTags] = useState((article?.tags || []).join(", "));
  const [authorName, setAuthorName] = useState(article?.author_name || "Mirai Studios");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(article?.featured_image_alt || "");
  const [seoTitle, setSeoTitle] = useState(article?.seo_title || "");
  const [metaDescription, setMetaDescription] = useState(article?.meta_description || "");
  const [ogImageUrl, setOgImageUrl] = useState(article?.og_image_url || "");
  const [noindex, setNoindex] = useState(article?.noindex || false);
  const [scheduledAt, setScheduledAt] = useState(article?.scheduled_at?.slice(0, 16) || "");
  const [canonicalOverride, setCanonicalOverride] = useState(article?.canonical_override || "");
  const [relatedServices, setRelatedServices] = useState((article?.related_services || []).join(", "));
  const [relatedIndustries, setRelatedIndustries] = useState((article?.related_industries || []).join(", "));
  const [relatedArticles, setRelatedArticles] = useState((article?.related_articles || []).join(", "));
  const [relatedCaseStudies, setRelatedCaseStudies] = useState((article?.related_case_studies || []).join(", "));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const wasPublished = article?.status === "published";
  const suggestedSlug = useMemo(() => slugify(title), [title]);
  const liveSlug = slug || suggestedSlug;

  function payload(id?: string) {
    const split = (value: string) => value.split(",").map((v) => v.trim()).filter(Boolean);
    return {
      id,
      title,
      slug: liveSlug,
      excerpt,
      content,
      category,
      author_name: authorName,
      featured_image_url: featuredImageUrl || null,
      featured_image_alt: featuredImageAlt || null,
      seo_title: seoTitle || null,
      meta_description: metaDescription || null,
      og_image_url: ogImageUrl || featuredImageUrl || null,
      noindex,
      tags: split(tags),
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      canonical_override: canonicalOverride || null,
      related_services: split(relatedServices),
      related_industries: split(relatedIndustries),
      related_articles: split(relatedArticles),
      related_case_studies: split(relatedCaseStudies),
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
      <AdminBackLink href="/admin/insights" label="Back to Insights" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">{article ? "Edit Insight" : "Create New Insight"}</h1>
          {article ? (
            <div className="mt-2">
              <AdminStatusBadge status={article.status} />
            </div>
          ) : null}
        </div>
        {article ? (
          <a
            href={`/admin/preview/insights/${article.slug}`}
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
            {wasPublished ? (
              <span className="mt-1 block text-[11px] normal-case tracking-normal text-amber-700">
                Changing a published slug has SEO impact. Prefer redirects if this goes live.
              </span>
            ) : null}
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Excerpt
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className={fieldClass} />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Content</p>
            <RichTextEditor value={content} onChange={setContent} />
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
                    const saved = await saveArticleDraftAction(payload(article?.id));
                    setMessage("Draft saved.");
                    if (!article) router.replace(`/admin/insights/${saved.id}`);
                    router.refresh();
                  })
                }
              >
                Save draft
              </AdminButton>
              {article ? (
                <>
                  {article.status === "published" ? (
                    <>
                      <AdminButton
                        variant="primary"
                        className="w-full"
                        loading={pending && busyAction === "Republish"}
                        loadingLabel="Publishing…"
                        disabled={pending}
                        onClick={() => {
                          if (!window.confirm("Save changes and republish this article?")) return;
                          run("Republish", async () => {
                            await publishArticleAction({ ...payload(article.id), id: article.id });
                            setMessage("Republished.");
                            router.refresh();
                          });
                        }}
                      >
                        Republish
                      </AdminButton>
                      <AdminButton
                        className="w-full"
                        loading={pending && busyAction === "Unpublish"}
                        loadingLabel="Unpublishing…"
                        disabled={pending}
                        onClick={() => {
                          if (!window.confirm("Unpublish this article?")) return;
                          run("Unpublish", async () => {
                            await unpublishArticleAction(article.id);
                            setMessage("Unpublished.");
                            router.refresh();
                          });
                        }}
                      >
                        Unpublish
                      </AdminButton>
                    </>
                  ) : (
                    <AdminButton
                      variant="primary"
                      className="w-full"
                      loading={pending && busyAction === "Publish"}
                      loadingLabel="Publishing…"
                      disabled={pending}
                      onClick={() => {
                        if (!window.confirm("Publish this article to the public site?")) return;
                        run("Publish", async () => {
                          await publishArticleAction({ ...payload(article.id), id: article.id });
                          setMessage("Published.");
                          router.refresh();
                        });
                      }}
                    >
                      Publish
                    </AdminButton>
                  )}
                  <AdminButton
                    variant="danger"
                    className="w-full"
                    loading={pending && busyAction === "Delete"}
                    loadingLabel="Deleting…"
                    disabled={pending}
                    onClick={() => {
                      if (!window.confirm("Soft-delete this article?")) return;
                      run("Delete", async () => {
                        await softDeleteArticleAction(article.id);
                        router.replace("/admin/insights");
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
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Category
            <input value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Tags (comma-separated)
            <input value={tags} onChange={(e) => setTags(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Author
            <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Featured image URL
            <input value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)} className={fieldClass} />
          </label>
          {featuredImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featuredImageUrl} alt="" className="h-28 w-full rounded-xl object-cover" />
          ) : null}
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Featured image alt
            <input value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Schedule publish (optional)
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Canonical override
            <input value={canonicalOverride} onChange={(e) => setCanonicalOverride(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related services
            <input value={relatedServices} onChange={(e) => setRelatedServices(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related industries
            <input value={relatedIndustries} onChange={(e) => setRelatedIndustries(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related articles (slugs)
            <input value={relatedArticles} onChange={(e) => setRelatedArticles(e.target.value)} className={fieldClass} />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related case studies
            <input value={relatedCaseStudies} onChange={(e) => setRelatedCaseStudies(e.target.value)} className={fieldClass} />
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
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            OG image URL
            <input value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} className={fieldClass} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} />
            noindex
          </label>
        </AdminStickyPanel>
      </div>
    </div>
  );
}
