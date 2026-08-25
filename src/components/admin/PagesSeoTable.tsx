"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { RegistryPage } from "@/lib/cms/route-registry";
import type { CmsPageRow, PageSeoRow } from "@/lib/cms/types";
import { formatAdminDate } from "@/lib/cms/utils";

function regionBadge(code?: string | null) {
  if (!code || code === "global") return { label: "Global", className: "bg-zinc-100 text-zinc-700" };
  if (code === "us") return { label: "US", className: "bg-blue-50 text-blue-700" };
  if (code === "uk") return { label: "UK", className: "bg-indigo-50 text-indigo-700" };
  if (code === "mena") return { label: "MENA", className: "bg-amber-50 text-amber-800" };
  return { label: code.toUpperCase(), className: "bg-violet-50 text-violet-700" };
}

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-base sm:text-sm";

export function PagesSeoTable({
  pages,
  overrides,
  cmsPages,
}: {
  pages: RegistryPage[];
  overrides: PageSeoRow[];
  cmsPages: CmsPageRow[];
}) {
  const overrideMap = useMemo(() => new Map(overrides.map((row) => [row.route, row])), [overrides]);
  const cmsByRoute = useMemo(() => new Map(cmsPages.map((p) => [p.route, p])), [cmsPages]);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [region, setRegion] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const enriched = pages.map((page) => {
    const override = overrideMap.get(page.route);
    const cms = cmsByRoute.get(page.route);
    const regionCode = override?.region_code || cms?.region_code || "global";
    const status = cms?.status || override?.status || "published";
    const indexed = !(override?.noindex ?? !page.indexable) && status === "published";
    return { page, override, cms, regionCode, status, indexed };
  });

  const filtered = enriched.filter((row) => {
    if (type !== "all" && row.page.pageType !== type) return false;
    if (region !== "all" && row.regionCode !== region) return false;
    if (statusFilter === "draft" && row.status !== "draft") return false;
    if (statusFilter === "published" && row.status !== "published") return false;
    if (statusFilter === "noindex" && row.indexed) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const title = row.override?.seo_title || row.page.defaultTitle;
    return (
      row.page.pageName.toLowerCase().includes(q) ||
      row.page.route.toLowerCase().includes(q) ||
      title.toLowerCase().includes(q)
    );
  });

  const types = Array.from(new Set(pages.map((p) => p.pageType))).sort();

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by route, name, title…"
          className={fieldClass}
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={region} onChange={(e) => setRegion(e.target.value)} className={fieldClass}>
          <option value="all">All regions</option>
          <option value="global">Global</option>
          <option value="us">US</option>
          <option value="uk">UK</option>
          <option value="mena">MENA</option>
          <option value="custom">Custom</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={fieldClass}>
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="noindex">Noindex</option>
        </select>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {filtered.map(({ page, override, cms, regionCode, status, indexed }) => {
          const badge = regionBadge(regionCode);
          return (
            <li key={page.route} className="rounded-2xl border border-black/8 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{page.pageName}</p>
                  <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{page.route}</p>
                </div>
                <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-foreground/80">
                {override?.seo_title || page.defaultTitle}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {status} · {indexed ? "Index" : "noindex"} · {formatAdminDate(override?.updated_at || cms?.updated_at)}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href={`/admin/pages/edit?route=${encodeURIComponent(page.route)}`}
                  className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white"
                >
                  Edit SEO
                </Link>
                {cms ? (
                  <Link
                    href={`/admin/pages/variant/${cms.id}`}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"
                  >
                    Edit variant
                  </Link>
                ) : null}
                <a
                  href={page.route}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"
                >
                  View
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-2xl border border-black/8 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-[#faf9f7] text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">SEO title</th>
              <th className="px-4 py-3 font-medium">Index</th>
              <th className="px-4 py-3 font-medium">Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ page, override, cms, regionCode, status, indexed }) => {
              const badge = regionBadge(regionCode);
              return (
                <tr key={page.route} className="border-b border-black/5 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{page.pageName}</p>
                    <p className="font-mono text-xs text-muted-foreground">{page.route}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {page.pageType} · {status}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p>{override?.seo_title || page.defaultTitle}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {override?.meta_description || page.defaultDescription}
                    </p>
                  </td>
                  <td className="px-4 py-3">{indexed ? "Index" : "noindex"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatAdminDate(override?.updated_at || cms?.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/pages/edit?route=${encodeURIComponent(page.route)}`}
                        className="text-accent hover:underline"
                      >
                        Edit SEO
                      </Link>
                      {cms ? (
                        <Link href={`/admin/pages/variant/${cms.id}`} className="text-foreground/70 hover:underline">
                          Edit variant
                        </Link>
                      ) : null}
                      <a href={page.route} target="_blank" rel="noreferrer" className="text-foreground/70 hover:underline">
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} pages</p>
    </div>
  );
}
