-- Mirai Site Ops CMS schema (local / staging only — do not apply to production without approval)
-- Requires: auth schema from Supabase Auth

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (admin authorization)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_is_admin_idx on public.profiles (is_admin) where is_admin = true;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    false
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Page SEO overrides
-- ---------------------------------------------------------------------------
create table if not exists public.page_seo (
  id uuid primary key default gen_random_uuid(),
  route text not null unique,
  page_name text not null,
  page_type text not null,
  seo_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image_url text,
  noindex boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists page_seo_page_type_idx on public.page_seo (page_type);
create index if not exists page_seo_updated_at_idx on public.page_seo (updated_at desc);

-- ---------------------------------------------------------------------------
-- Articles (Insights)
-- ---------------------------------------------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  featured_image_url text,
  featured_image_alt text,
  category text not null default '',
  tags text[] not null default '{}',
  author_name text not null default 'Mirai Studios',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'unpublished')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image_url text,
  noindex boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  deleted_at timestamptz
);

create index if not exists articles_status_idx on public.articles (status) where deleted_at is null;
create index if not exists articles_published_at_idx on public.articles (published_at desc nulls last)
  where status = 'published' and deleted_at is null;
create index if not exists articles_slug_live_idx on public.articles (slug) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Jobs (Careers)
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  department text not null default '',
  location text not null default '',
  workplace_type text not null default '',
  employment_type text not null default '',
  summary text not null default '',
  description text not null default '',
  requirements text not null default '',
  nice_to_have text not null default '',
  application_type text not null default 'email'
    check (application_type in ('email', 'url', 'both')),
  application_url text,
  application_email text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'closed', 'unpublished')),
  published_at timestamptz,
  valid_through timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  meta_description text,
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  deleted_at timestamptz
);

create index if not exists jobs_status_idx on public.jobs (status) where deleted_at is null;
create index if not exists jobs_published_at_idx on public.jobs (published_at desc nulls last)
  where status = 'published' and deleted_at is null;
create index if not exists jobs_slug_live_idx on public.jobs (slug) where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Media assets
-- ---------------------------------------------------------------------------
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  public_url text not null,
  file_name text not null,
  mime_type text not null,
  byte_size integer not null,
  alt_text text not null default '',
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  deleted_at timestamptz
);

create index if not exists media_assets_created_at_idx on public.media_assets (created_at desc)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- Storage bucket (run via dashboard or storage API if create_bucket unavailable)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-media',
  'website-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.page_seo enable row level security;
alter table public.articles enable row level security;
alter table public.jobs enable row level security;
alter table public.media_assets enable row level security;

-- Profiles: users can read own row; admins can read all
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- page_seo: public read (for SSR via anon optional); admin write
drop policy if exists "page_seo_select_all" on public.page_seo;
create policy "page_seo_select_all" on public.page_seo
  for select to anon, authenticated
  using (true);

drop policy if exists "page_seo_admin_write" on public.page_seo;
create policy "page_seo_admin_write" on public.page_seo
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- articles: public can read published; admins full access
drop policy if exists "articles_public_read_published" on public.articles;
create policy "articles_public_read_published" on public.articles
  for select to anon, authenticated
  using (
    (status = 'published' and deleted_at is null)
    or public.is_admin()
  );

drop policy if exists "articles_admin_all" on public.articles;
create policy "articles_admin_all" on public.articles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- jobs: public can read published open roles; admins full; closed readable but noindex handled in app
drop policy if exists "jobs_public_read" on public.jobs;
create policy "jobs_public_read" on public.jobs
  for select to anon, authenticated
  using (
    (status in ('published', 'closed') and deleted_at is null)
    or public.is_admin()
  );

drop policy if exists "jobs_admin_all" on public.jobs;
create policy "jobs_admin_all" on public.jobs
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- media: public read non-deleted; admin write
drop policy if exists "media_public_read" on public.media_assets;
create policy "media_public_read" on public.media_assets
  for select to anon, authenticated
  using (deleted_at is null or public.is_admin());

drop policy if exists "media_admin_all" on public.media_assets;
create policy "media_admin_all" on public.media_assets
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Storage policies for website-media
drop policy if exists "website_media_public_read" on storage.objects;
create policy "website_media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'website-media');

drop policy if exists "website_media_admin_insert" on storage.objects;
create policy "website_media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'website-media' and public.is_admin());

drop policy if exists "website_media_admin_update" on storage.objects;
create policy "website_media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'website-media' and public.is_admin())
  with check (bucket_id = 'website-media' and public.is_admin());

drop policy if exists "website_media_admin_delete" on storage.objects;
create policy "website_media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'website-media' and public.is_admin());
