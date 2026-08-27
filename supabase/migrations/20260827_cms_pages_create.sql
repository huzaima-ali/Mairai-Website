-- Local / staging only — do not apply to production without approval.
-- Extends cms_pages for create / duplicate / regional landing pages.

alter table public.cms_pages
  add column if not exists slug text,
  add column if not exists source_page_id uuid,
  add column if not exists source_route text,
  add column if not exists source_page_name text,
  add column if not exists cta_heading text,
  add column if not exists cta_copy text,
  add column if not exists seo_title text,
  add column if not exists meta_description text,
  add column if not exists og_title text,
  add column if not exists og_description text,
  add column if not exists og_image_url text,
  add column if not exists canonical_override text,
  add column if not exists noindex boolean not null default true,
  add column if not exists include_in_sitemap boolean not null default false,
  add column if not exists published_at timestamptz;

update public.cms_pages
set slug = regexp_replace(route, '^.*/', '')
where slug is null or slug = '';

create unique index if not exists cms_pages_slug_live_idx
  on public.cms_pages (route)
  where deleted_at is null;

create index if not exists cms_pages_source_idx
  on public.cms_pages (source_page_id)
  where deleted_at is null;
