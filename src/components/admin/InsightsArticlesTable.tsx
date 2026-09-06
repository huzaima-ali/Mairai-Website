"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  publishArticleAction,
  setHomepageFeaturedArticleAction,
  unpublishArticleAction,
} from "@/lib/cms/actions";
import { formatAdminDate } from "@/lib/cms/utils";
import type { ArticleRow } from "@/lib/cms/types";
import { AdminStatusBadge } from "@/components/admin/AdminShell";
import { AdminButton } from "@/components/admin/AdminButton";
import { homepageFeatureFlags } from "@/lib/cms/homepage-featured";

export function InsightsArticlesTable({
  articles,
  homepageFeaturedId,
}: {
  articles: ArticleRow[];
  homepageFeaturedId: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [featuredId, setFeaturedId] = useState(homepageFeaturedId);

  useEffect(() => {
    setFeaturedId(homepageFeaturedId);
  }, [homepageFeaturedId]);

  const flags = homepageFeatureFlags(
    articles.map((article) => article.id),
    featuredId,
  );

  function run(id: string, label: string, fn: () => Promise<void>) {
    setMessage(null);
    setError(null);
    setBusyId(id);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : `${label} failed`);
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-800">{message}</p> : null}
      <div className="overflow-x-auto rounded-2xl border border-black/8 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-[#faf9f7] text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Home</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody key={featuredId || "none"}>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  No articles yet.
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const isHome = Boolean(flags[article.id]);
                const rowBusy = pending && busyId === article.id;
                return (
                  <tr
                    key={article.id}
                    className="border-b border-black/5 align-top transition-colors duration-200 hover:bg-black/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3">
                      {article.status === "published" ? (
                        <AdminButton
                          type="button"
                          disabled={pending}
                          loading={rowBusy}
                          loadingLabel={isHome ? "Updating…" : "Setting…"}
                          className={`min-h-8 px-3 py-1 text-xs ${
                            isHome
                              ? "border-accent/20 bg-accent/10 text-accent"
                              : ""
                          }`}
                          aria-pressed={isHome}
                          onClick={() =>
                            run(article.id, "Feature", async () => {
                              const previous = featuredId;
                              try {
                                const next = await setHomepageFeaturedArticleAction(isHome ? null : article.id);
                                setFeaturedId(next);
                                setMessage(next === article.id ? "Set as homepage article." : "Removed from homepage.");
                              } catch (err) {
                                setFeaturedId(previous);
                                throw err;
                              }
                            })
                          }
                        >
                          {isHome ? "Homepage" : "Set home"}
                        </AdminButton>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatAdminDate(article.updated_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/insights/${article.id}`}
                          className="inline-flex min-h-8 items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium transition-all duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Edit
                        </Link>
                        {article.status === "published" ? (
                          <>
                            <a
                              href={`/insights/${article.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-8 items-center rounded-full border border-black/10 px-3 py-1 text-xs font-medium transition-all duration-200 hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              View
                            </a>
                            <AdminButton
                              className="min-h-8 px-3 py-1 text-xs"
                              disabled={pending}
                              loading={rowBusy && busyId === article.id}
                              loadingLabel="Unpublishing…"
                              onClick={() => {
                                if (!window.confirm("Unpublish this article?")) return;
                                run(article.id, "Unpublish", async () => {
                                  await unpublishArticleAction(article.id);
                                  if (featuredId === article.id) setFeaturedId(null);
                                  setMessage("Unpublished.");
                                });
                              }}
                            >
                              Unpublish
                            </AdminButton>
                          </>
                        ) : (
                          <AdminButton
                            variant="primary"
                            className="min-h-8 px-3 py-1 text-xs"
                            disabled={pending}
                            loading={rowBusy}
                            loadingLabel="Publishing…"
                            onClick={() => {
                              if (!window.confirm("Publish this article?")) return;
                              run(article.id, "Publish", async () => {
                                await publishArticleAction(article.id);
                                setMessage("Published.");
                              });
                            }}
                          >
                            Publish
                          </AdminButton>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
