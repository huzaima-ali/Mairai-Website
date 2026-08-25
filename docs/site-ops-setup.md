# Mirai Site Ops — setup

## 1. Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/20260825_site_ops_cms.sql` in the SQL editor.
3. Optionally run `supabase/migrations/20260825_seo_aio_upgrade.sql` (extended SEO also works via Storage JSON without this).
4. Confirm the `website-media` bucket exists and is public.

## 2. Environment variables

### Required for Site Ops / CMS hubs

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon/public JWT key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** — never prefix with `NEXT_PUBLIC_` |

### Keep for contact / partners forms

| Variable | Notes |
|----------|--------|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Inbox for submissions |
| `CONTACT_FROM_EMAIL` | Verified from-address |

## 3. Render

In the Render web service → **Environment**:

1. Add the three Supabase variables above (mark the service role as secret).
2. Keep Resend/contact vars so forms keep working.
3. Save and **redeploy**.
4. In Supabase → Authentication → URL configuration, allow your production origin (and `/admin/**` redirect URLs if Auth asks).

Without `SUPABASE_SERVICE_ROLE_KEY`, CMS SEO merges and some published-content reads fall back to code defaults.

## 4. Admin user

```sql
update public.profiles
set is_admin = true
where email = 'you@miraistudios.co';
```

## 5. Local

```bash
npm install
npm run dev
```

Open http://localhost:3000/admin/login

Never commit real keys. Do not apply production migrations without approval.
