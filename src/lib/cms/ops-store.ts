import {
  createServiceSupabaseClient,
  createServerSupabaseClient,
  hasServiceRole,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { CmsPageRow, PageSeoRow } from "@/lib/cms/types";

const SEO_EXTRAS_PATH = "ops/seo-overrides.json";
const CMS_PAGES_PATH = "ops/cms-pages.json";

type SeoExtrasMap = Record<string, Partial<PageSeoRow>>;

async function downloadJson<T>(path: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured() || !hasServiceRole()) return fallback;
  try {
    const supabase = createServiceSupabaseClient();
    const { data, error } = await supabase.storage.from("website-media").download(path);
    if (error || !data) return fallback;
    const text = await data.text();
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

async function uploadJson(path: string, value: unknown) {
  if (!isSupabaseConfigured() || !hasServiceRole()) {
    throw new Error("Supabase service role required to persist Site Ops data");
  }
  const supabase = createServiceSupabaseClient();
  const body = Buffer.from(JSON.stringify(value, null, 2), "utf8");
  // Prefer text/plain — some buckets only allow image MIME types by default.
  const { error } = await supabase.storage.from("website-media").upload(path, body, {
    contentType: "text/plain",
    upsert: true,
  });
  if (error) {
    const retry = await supabase.storage.from("website-media").upload(path, body, {
      contentType: "application/json",
      upsert: true,
    });
    if (retry.error) throw new Error(retry.error.message);
  }
}

export async function getSeoExtrasMap(): Promise<SeoExtrasMap> {
  return downloadJson<SeoExtrasMap>(SEO_EXTRAS_PATH, {});
}

export async function getSeoExtras(route: string): Promise<Partial<PageSeoRow>> {
  const map = await getSeoExtrasMap();
  return map[route] || {};
}

export async function upsertSeoExtras(route: string, extras: Partial<PageSeoRow>) {
  const map = await getSeoExtrasMap();
  map[route] = {
    ...(map[route] || {}),
    ...extras,
    route,
    updated_at: new Date().toISOString(),
  };
  await uploadJson(SEO_EXTRAS_PATH, map);
  return map[route];
}

export async function listCmsPages(): Promise<CmsPageRow[]> {
  const pages = await downloadJson<CmsPageRow[]>(CMS_PAGES_PATH, []);
  return pages.filter((p) => !p.deleted_at);
}

export async function getCmsPageByRoute(route: string): Promise<CmsPageRow | null> {
  const pages = await listCmsPages();
  return pages.find((p) => p.route === route) || null;
}

export async function getPublishedCmsPageByRoute(route: string): Promise<CmsPageRow | null> {
  const page = await getCmsPageByRoute(route);
  if (!page || page.status !== "published") return null;
  return page;
}

export async function listPublishedCmsPages(): Promise<CmsPageRow[]> {
  const pages = await listCmsPages();
  return pages.filter((p) => p.status === "published");
}

export async function saveCmsPage(page: CmsPageRow) {
  const pages = await downloadJson<CmsPageRow[]>(CMS_PAGES_PATH, []);
  const idx = pages.findIndex((p) => p.id === page.id);
  if (idx >= 0) pages[idx] = page;
  else pages.push(page);
  await uploadJson(CMS_PAGES_PATH, pages);
  return page;
}

export async function softDeleteCmsPage(id: string, userId: string) {
  const pages = await downloadJson<CmsPageRow[]>(CMS_PAGES_PATH, []);
  const idx = pages.findIndex((p) => p.id === id);
  if (idx < 0) throw new Error("Page not found");
  const current = pages[idx];
  if (!current) throw new Error("Page not found");
  pages[idx] = {
    ...current,
    deleted_at: new Date().toISOString(),
    status: "unpublished",
    updated_at: new Date().toISOString(),
    updated_by: userId,
  };
  await uploadJson(CMS_PAGES_PATH, pages);
  return pages[idx] as CmsPageRow;
}

/** Admin-session write path for extras when service role unavailable on mutation edge — prefer service. */
export async function upsertSeoExtrasAsAdmin(route: string, extras: Partial<PageSeoRow>) {
  if (hasServiceRole()) return upsertSeoExtras(route, extras);
  // Fallback: attempt via user client (storage policy requires admin)
  const supabase = createServerSupabaseClient();
  const map = await getSeoExtrasMap();
  map[route] = { ...(map[route] || {}), ...extras, route, updated_at: new Date().toISOString() };
  const body = Buffer.from(JSON.stringify(map, null, 2), "utf8");
  const { error } = await supabase.storage.from("website-media").upload(SEO_EXTRAS_PATH, body, {
    contentType: "application/json",
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return map[route];
}
