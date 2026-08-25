-- Site Ops SEO / AIO upgrade (apply in Supabase SQL editor — local/staging only)
-- Extends page_seo, articles; adds cms_pages for regional variants.

-- ---------------------------------------------------------------------------
-- page_seo expansions
-- ---------------------------------------------------------------------------
alter table public.page_seo
  add column if not exists nofollow boolean not null default false,
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text,
  add column if not exists twitter_card text default 'summary_large_image',
  add column if not exists breadcrumb_label text,
  add column if not exists include_in_sitemap boolean not null default true,
  add column if not exists sitemap_priority numeric(3,2),
  add column if not exists canonical_override text,
  add column if not exists page_summary text,
  add column if not exists primary_topic text,
  add column if not exists industry text,
  add column if not exists region_served text,
  add column if not exists related_services text[] not null default '{}',
  add column if not exists related_industries text[] not null default '{}',
  add column if not exists related_case_studies text[] not null default '{}',
  add column if not exists schema_area_served text,
  add column if not exists schema_service_name text,
  add column if not exists schema_types text[] not null default '{}',
  add column if not exists advanced_schema_json text,
  add column if not exists region_code text,
  add column if not exists base_route text,
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published', 'unpublished'));

create index if not exists page_seo_region_code_idx on public.page_seo (region_code);
create index if not exists page_seo_base_route_idx on public.page_seo (base_route);
create index if not exists page_seo_status_idx on public.page_seo (status);

-- ---------------------------------------------------------------------------
-- CMS-managed regional / content pages (independent of code marketing pages)
-- ---------------------------------------------------------------------------
create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  route text not null unique,
  base_route text not null,
  region_code text not null,
  region_label text not null,
  page_name text not null,
  page_type text not null default 'service-detail',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished')),
  h1 text not null default '',
  intro text not null default '',
  body_html text not null default '',
  cta_label text,
  cta_href text,
  regional_proof text not null default '',
  related_services text[] not null default '{}',
  related_industries text[] not null default '{}',
  related_case_studies text[] not null default '{}',
  primary_topic text,
  industry text,
  region_served text,
  page_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  deleted_at timestamptz
);

create index if not exists cms_pages_base_route_idx on public.cms_pages (base_route) where deleted_at is null;
create index if not exists cms_pages_region_idx on public.cms_pages (region_code) where deleted_at is null;
create index if not exists cms_pages_status_idx on public.cms_pages (status) where deleted_at is null;

alter table public.cms_pages enable row level security;

drop policy if exists "cms_pages_public_read_published" on public.cms_pages;
create policy "cms_pages_public_read_published" on public.cms_pages
  for select to anon, authenticated
  using (
    (status = 'published' and deleted_at is null)
    or public.is_admin()
  );

drop policy if exists "cms_pages_admin_all" on public.cms_pages;
create policy "cms_pages_admin_all" on public.cms_pages
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- articles expansions
-- ---------------------------------------------------------------------------
alter table public.articles
  add column if not exists scheduled_at timestamptz,
  add column if not exists canonical_override text,
  add column if not exists related_services text[] not null default '{}',
  add column if not exists related_industries text[] not null default '{}',
  add column if not exists related_articles text[] not null default '{}',
  add column if not exists related_case_studies text[] not null default '{}',
  add column if not exists twitter_title text,
  add column if not exists twitter_description text,
  add column if not exists twitter_image_url text;
