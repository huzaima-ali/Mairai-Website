"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RegistryPage } from "@/lib/cms/route-registry";
import type { CmsPageRow, PageSeoRow } from "@/lib/cms/types";
import { REGION_VARIANT_OPTIONS } from "@/lib/cms/types";
import { formatAdminDate } from "@/lib/cms/utils";
import { slugify } from "@/lib/cms/utils";
import { createRegionalVariantAction, duplicateCmsPageAction } from "@/lib/cms/actions";
import { canCreateRegionalVariant, canDuplicateRoute } from "@/lib/cms/page-routes";

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
  const [indexFilter, setIndexFilter] = useState("all");

  const enriched = pages.map((page) => {
    const override = overrideMap.get(page.route);
    const cms = cmsByRoute.get(page.route);
    const regionCode = override?.region_code || cms?.region_code || "global";
    const status = cms?.status || override?.status || "published";
    const indexed = !(override?.noindex ?? cms?.noindex ?? !page.indexable) && status === "published";
    return { page, override, cms, regionCode, status, indexed };
  });

  const filtered = enriched.filter((row) => {
    if (type !== "all" && row.page.pageType !== type) return false;
    if (region !== "all" && row.regionCode !== region) return false;
    if (statusFilter === "draft" && row.status !== "draft") return false;
    if (statusFilter === "published" && row.status !== "published") return false;
    if (indexFilter === "index" && !row.indexed) return false;
    if (indexFilter === "noindex" && row.indexed) return false;
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
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
          <option value="all">Draft / Published</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select value={indexFilter} onChange={(e) => setIndexFilter(e.target.value)} className={fieldClass}>
          <option value="all">Indexed / Noindex</option>
          <option value="index">Indexed</option>
          <option value="noindex">Noindex</option>
        </select>
      </div>

      <ul className="space-y-3 md:hidden">
        {filtered.map((row) => (
          <li key={row.page.route} className="rounded-2xl border border-black/8 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium leading-snug">{row.page.pageName}</p>
                <p className="mt-1 break-all font-mono text-[11px] text-muted-foreground">{row.page.route}</p>
              </div>
              <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${regionBadge(row.regionCode).className}`}>
                {regionBadge(row.regionCode).label}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {row.page.pageType} · {row.status} · {row.indexed ? "Index" : "noindex"}
            </p>
            {row.cms?.source_page_name ? (
              <p className="mt-1 text-xs text-muted-foreground">From: {row.cms.source_page_name}</p>
            ) : null}
            <RowActions row={row} />
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-black/8 bg-white md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/8 bg-[#faf9f7] text-xs uppercase tracking-[0.1em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Index State</th>
              <th className="px-4 py-3 font-medium">Source Page</th>
              <th className="px-4 py-3 font-medium">Last Updated</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const badge = regionBadge(row.regionCode);
              return (
                <tr key={row.page.route} className="border-b border-black/5 align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.page.pageName}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.page.route}</td>
                  <td className="px-4 py-3 text-xs">{row.page.pageType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{row.status}</td>
                  <td className="px-4 py-3">{row.indexed ? "Index" : "noindex"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {row.cms?.source_page_name || row.cms?.source_route || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatAdminDate(row.override?.updated_at || row.cms?.updated_at)}
                  </td>
                  <td className="px-4 py-3">
                    <RowActions row={row} compact />
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

function RowActions({
  row,
  compact = false,
}: {
  row: {
    page: RegistryPage;
    cms?: CmsPageRow;
    regionCode: string;
    status: string;
  };
  compact?: boolean;
}) {
  const duplicable = canDuplicateRoute(row.page.route, row.page.pageType);
  const regionalEligible = canCreateRegionalVariant(row.page.route, row.regionCode, row.page.pageType);
  const editHref = row.cms
    ? `/admin/pages/variant/${row.cms.id}`
    : `/admin/pages/edit?route=${encodeURIComponent(row.page.route)}`;

  return (
    <div className={compact ? "flex flex-col gap-1" : "mt-3 flex flex-wrap gap-2"}>
      <Link
        href={editHref}
        className={compact ? "text-accent hover:underline" : "rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white"}
      >
        {row.cms ? "Edit" : "Edit SEO"}
      </Link>
      {duplicable ? (
        <DuplicateButton
          route={row.page.route}
          pageId={row.cms?.id}
          compact={compact}
        />
      ) : null}
      {regionalEligible ? (
        <RegionalButton
          route={row.page.route}
          pageId={row.cms?.id}
          compact={compact}
        />
      ) : null}
      <a
        href={row.cms ? `/admin/preview/pages/${row.cms.id}` : row.page.route}
        target="_blank"
        rel="noreferrer"
        className={compact ? "text-foreground/70 hover:underline" : "rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"}
      >
        {row.cms ? "Preview" : "View"}
      </a>
    </div>
  );
}

function DuplicateButton({
  route,
  pageId,
  compact,
}: {
  route: string;
  pageId?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState(`${slugify(route.split("/").filter(Boolean).pop() || "page")}-copy`);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        className={compact ? "text-left text-foreground/70 hover:underline" : "rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"}
        onClick={() => setOpen(true)}
      >
        Duplicate
      </button>
      {open ? (
        <Modal title="Duplicate Page" onClose={() => setOpen(false)}>
          <p className="text-sm text-muted-foreground">
            Copies content and SEO into a new draft/noindex page. Source: <code>{route}</code>
          </p>
          <label className="mt-3 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            New slug
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
          </label>
          {message ? <p className="mt-2 text-sm text-rose-700">{message}</p> : null}
          <button
            type="button"
            disabled={pending || !slug}
            className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            onClick={() => {
              setMessage(null);
              startTransition(async () => {
                try {
                  const created = await duplicateCmsPageAction({
                    sourceRoute: route,
                    slug,
                    sourcePageId: pageId,
                  });
                  router.push(`/admin/pages/variant/${created.id}`);
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Duplicate failed");
                }
              });
            }}
          >
            {pending ? "Duplicating…" : "Create draft copy"}
          </button>
        </Modal>
      ) : null}
    </>
  );
}

function RegionalButton({
  route,
  pageId,
  compact,
}: {
  route: string;
  pageId?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [regionCode, setRegionCode] = useState<"us" | "uk" | "mena" | "custom">("us");
  const [customPrefix, setCustomPrefix] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const suggested =
    regionCode === "custom"
      ? `/${slugify(customPrefix) || "custom"}${route}`
      : `/${regionCode}${route}`;

  return (
    <>
      <button
        type="button"
        className={compact ? "text-left text-foreground/70 hover:underline" : "rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium"}
        onClick={() => setOpen(true)}
      >
        Create Regional Variant
      </button>
      {open ? (
        <Modal title="Create Regional Variant" onClose={() => setOpen(false)}>
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            Regional landing pages should contain meaningful region-specific content, proof and positioning. Do not
            publish pages that only replace the country/region name.
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Source: <code>{route}</code>
          </p>
          <label className="mt-3 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Region
            <select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value as typeof regionCode)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            >
              {REGION_VARIANT_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          {regionCode === "custom" ? (
            <label className="mt-3 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Custom prefix
              <input
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="apac"
                className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm"
              />
            </label>
          ) : null}
          <p className="mt-2 font-mono text-xs text-muted-foreground">Suggested route: {suggested}</p>
          {message ? <p className="mt-2 text-sm text-rose-700">{message}</p> : null}
          <button
            type="button"
            disabled={pending}
            className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            onClick={() => {
              setMessage(null);
              startTransition(async () => {
                try {
                  const created = await createRegionalVariantAction({
                    baseRoute: route,
                    regionCode,
                    customPrefix: customPrefix || undefined,
                    sourcePageId: pageId,
                  });
                  router.push(`/admin/pages/variant/${created.id}`);
                } catch (err) {
                  setMessage(err instanceof Error ? err.message : "Could not create variant");
                }
              });
            }}
          >
            {pending ? "Creating…" : "Create draft variant"}
          </button>
        </Modal>
      ) : null}
    </>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-medium">{title}</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
