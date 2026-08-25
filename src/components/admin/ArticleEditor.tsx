"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
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
  const [pending, startTransition] = useTransition();

  const wasPublished = article?.status === "published";
  const suggestedSlug = useMemo(() => slugify(title), [title]);

  function payload(id?: string) {
    const split = (value: string) => value.split(",").map((v) => v.trim()).filter(Boolean);
    return {
      id,
      title,
      slug: slug || suggestedSlug,
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">{article ? "Edit article" : "New article"}</h1>
          {article ? <div className="mt-2"><AdminStatusBadge status={article.status} /></div> : null}
        </div>
        {article ? (
          <Link
            href={`/admin/preview/insights/${article.slug}`}
            className="rounded-full border border-black/10 px-4 py-2 text-sm"
            target="_blank"
          >
            Preview
          </Link>
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
            {wasPublished ? (
              <span className="mt-1 block text-[11px] normal-case tracking-normal text-amber-700">
                Changing a published slug has SEO impact. Prefer redirects if this goes live.
              </span>
            ) : null}
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Excerpt
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Content
            </p>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        <aside className="space-y-4 rounded-2xl border border-black/8 bg-white p-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Category
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Tags (comma-separated)
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Author
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Featured image URL
            <input
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          {featuredImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featuredImageUrl} alt="" className="h-28 w-full rounded-xl object-cover" />
          ) : null}
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Featured image alt
            <input
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Schedule publish (optional)
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Canonical override
            <input
              value={canonicalOverride}
              onChange={(e) => setCanonicalOverride(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
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
            Related articles (slugs)
            <input value={relatedArticles} onChange={(e) => setRelatedArticles(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Related case studies
            <input value={relatedCaseStudies} onChange={(e) => setRelatedCaseStudies(e.target.value)} className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm" />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            SEO title
            <input
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Meta description
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            OG image URL
            <input
              value={ogImageUrl}
              onChange={(e) => setOgImageUrl(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} />
            noindex
          </label>

          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}

          <div className="sticky bottom-0 -mx-5 mt-2 space-y-2 border-t border-black/8 bg-white px-5 py-4">
            <button
              type="button"
              disabled={pending}
              className="w-full rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-medium disabled:opacity-60"
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
            </button>
            {article ? (
              <>
                {article.status === "published" ? (
                  <>
                    <button
                      type="button"
                      disabled={pending}
                      className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                      onClick={() => {
                        if (!window.confirm("Save changes and republish this article?")) return;
                        run("Republish", async () => {
                          await saveArticleDraftAction(payload(article.id));
                          await publishArticleAction(article.id);
                          setMessage("Republished.");
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
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                    onClick={() => {
                      if (!window.confirm("Publish this article to the public site?")) return;
                      run("Publish", async () => {
                        await saveArticleDraftAction(payload(article.id));
                        await publishArticleAction(article.id);
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
                    if (!window.confirm("Soft-delete this article?")) return;
                    run("Delete", async () => {
                      await softDeleteArticleAction(article.id);
                      router.replace("/admin/insights");
                    });
                  }}
                >
                  Delete
                </button>
              </>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
