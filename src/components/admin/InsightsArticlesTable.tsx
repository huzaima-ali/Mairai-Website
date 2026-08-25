"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  publishArticleAction,
  setHomepageFeaturedArticleAction,
  unpublishArticleAction,
} from "@/lib/cms/actions";
import { formatAdminDate } from "@/lib/cms/utils";
import type { ArticleRow } from "@/lib/cms/types";
import { AdminStatusBadge } from "@/components/admin/AdminShell";

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
  const [busyId, setBusyId] = useState<string | null>(null);

  function run(id: string, label: string, fn: () => Promise<void>) {
    setMessage(null);
    setBusyId(id);
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : `${label} failed`);
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <div className="space-y-3">
      {message ? <p className="text-sm text-rose-700">{message}</p> : null}
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
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-muted-foreground">
                  No articles yet.
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const isHome = homepageFeaturedId === article.id;
                const rowBusy = pending && busyId === article.id;
                return (
                  <tr key={article.id} className="border-b border-black/5 align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{article.title}</p>
                      <p className="text-xs text-muted-foreground">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3">
                      {article.status === "published" ? (
                        <button
                          type="button"
                          disabled={rowBusy || (isHome && pending)}
                          className={`rounded-full px-3 py-1 text-xs font-medium disabled:opacity-60 ${
                            isHome
                              ? "bg-accent/10 text-accent"
                              : "border border-black/10 text-muted-foreground hover:bg-black/[0.03]"
                          }`}
                          onClick={() =>
                            run(article.id, "Feature", async () => {
                              await setHomepageFeaturedArticleAction(isHome ? null : article.id);
                              setMessage(isHome ? "Removed from homepage." : "Set as homepage article.");
                            })
                          }
                        >
                          {isHome ? "Homepage" : "Set home"}
                        </button>
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
                          className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:bg-black/[0.03]"
                        >
                          Edit
                        </Link>
                        {article.status === "published" ? (
                          <>
                            <Link
                              href={`/insights/${article.slug}`}
                              target="_blank"
                              className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:bg-black/[0.03]"
                            >
                              View
                            </Link>
                            <button
                              type="button"
                              disabled={rowBusy}
                              className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium disabled:opacity-60"
                              onClick={() => {
                                if (!window.confirm("Unpublish this article?")) return;
                                run(article.id, "Unpublish", async () => {
                                  await unpublishArticleAction(article.id);
                                  setMessage("Unpublished.");
                                });
                              }}
                            >
                              Unpublish
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={rowBusy}
                            className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-white disabled:opacity-60"
                            onClick={() => {
                              if (!window.confirm("Publish this article?")) return;
                              run(article.id, "Publish", async () => {
                                await publishArticleAction(article.id);
                                setMessage("Published.");
                              });
                            }}
                          >
                            Publish
                          </button>
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
