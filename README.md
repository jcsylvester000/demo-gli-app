# GLI website: Graphics Library, Inc.

Marketing + SEO website with job-ticket lead capture and an admin dashboard.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Neon Postgres · Netlify.

Spec: `6 - Final Documentation/GLI Website Build-Out Guide - 2026-10-15/GLI_Website_Build_Out_Guide.md` (agency folder).

## Local setup (Windows PowerShell or any terminal)

```bash
npm install
copy .env.example .env.local   # then put the real Neon connection string in .env.local
npm run db:migrate             # creates/updates tables in Neon (safe to run again)
npm run dev                    # http://localhost:3000
```

Checks: `npm run check` (lint + types + build).

## Deploy (Netlify, from GitHub)

1. Netlify → Add new site → Import from GitHub → `jcsylvester000/demo-gli-app`. Build settings come from `netlify.toml`
   (build `npm run build:netlify`, publish `.next`, Next.js Runtime plugin). Leave the UI fields empty.
2. Site configuration → Environment variables:
   - `DATABASE_URL` = Neon **pooled** connection string (required)
   - `IP_HASH_SALT` = any long random string (required from Batch 4)
   - `NEXT_PUBLIC_GTM_ID` = GTM container ID (optional; analytics only load after the visitor accepts cookies)
   - Forms: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile spam check). No email or
     cron settings: forms only store leads.
   - Admin (Batch 5): `BETTER_AUTH_SECRET` (32+ random characters), `BETTER_AUTH_URL` (the site's public URL, no trailing
     slash), optional `ADMIN_INITIAL_PASSWORD`.
   - SEO (Batch 6, real domain only): `ALLOW_INDEXING=true`, `NEXT_PUBLIC_SITE_URL=https://<domain>`, optional `INDEXNOW_KEY`.
3. Deploy. Every push to `main` redeploys; the migration runs first on every build.
4. Check `https://<site>.netlify.app/api/health` → `{"ok":true,"db":"ok"}`.

The site stays `noindex` until the real domain is live: then set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://<domain>`.

## Lead capture (forms store leads only)

- `/quote`: 4-step job ticket (S8). Ticket numbers `GLI-YYMM-####` (Manila month), unique and sequential.
- Uploads: PDF, AI, PSD, JPG, PNG, ZIP · ≤ 25 MB · ≤ 5 files. Netlify functions accept ~6 MB per request, so the browser
  sends 4 MB parts to `/api/upload/...`; the first bytes are checked against the file type. Files live in Netlify Blobs
  (store `quote-uploads`, private) or `./.data/uploads` locally. They are downloadable only from the admin (Batch 5).
- Forms **store leads only**: the job ticket, contact form and newsletter sign-up save to Neon and appear in `/admin`.
  No emails are sent and there is no scheduled job. The team checks the admin Overview for new leads.
- Abandoned uploads (never attached to a ticket) are cleaned up after a day, on the next form submission.
- `/api/health` shows which integrations are configured (no values).

## Admin (Batch 5)

- Sign in at `/admin/login`. The public footer links there as "Admin", under Cookie settings in the Legal column.
- First account: username `Admin`, temporary password `Admin1234` (or `ADMIN_INITIAL_PASSWORD`), created by `db:migrate`
  on an empty database. It must be changed at first sign-in. Turn on two-step verification under My account.
- Roles: **Sales** (leads, files), **Editor** (case studies, prices and lead times, contact details, style guide; no lead
  data), **Admin** (everything: team, client permissions, Rx clearance, testimonials, redirects, CSV export, erase).
- Leads: overview (new, overdue over 1 business day, follow-ups, by service/source), list with search and filters, detail
  with one-tap Call/Viber/WhatsApp/Email, status/owner/priority/follow-up, notes, private file downloads,
  CSV export (Admin) and erase for data-subject requests (Admin).
- Publishing changes (permissions, cases, testimonials, prices, contact details, redirects) refresh the public site
  within seconds (cache tag `governance`).
- Locked out after 5 failed sign-ins for 15 minutes.
- **Password reset:** an Admin sets a temporary password for anyone under Team → *Reset password*; share it privately. The person
  must change it at next sign-in. If the only Admin is locked out (or lost their two-step device), set
  `ADMIN_RECOVERY_USERNAME=admin` and `ADMIN_INITIAL_PASSWORD=<temporary>` in Netlify and redeploy: the build resets that
  account once (temporary password, sessions ended, two-step off). Then remove both variables.

## Structure

```
src/app/                 routes (pages, API, robots, sitemap)
src/app/(site)/[...slug] catch-all: admin redirects (308/307) or the branded 404
src/components/brand     logo, print-heritage motifs (crop marks, CMYK bar, registration mark, brush underline)
src/components/layout    utility bar, header + mega-menu, footer, chat button, breadcrumbs, CTA band
src/components/consent   cookie banner + consent-gated GTM
src/content/             all page copy, cases, products, articles (typed; Document 4)
src/app/admin/           admin dashboard (Better Auth, roles, audit log)
src/lib/server/pool.ts   Neon connection (never throws at import)
db/schema.sql            all tables (idempotent)
scripts/db-migrate.ts    runs schema.sql + auth tables, seeds the first Admin (on every Netlify build)
```

## Rules

- No secrets in git: `.env.local` is ignored. Set secrets in Netlify only.
- Colours come from tokens in `src/app/globals.css` (`@theme`); no hard-coded hex values in components.
- Contact details marked `pending` in `src/content/site.ts` are never printed or linked until confirmed by GLI.
- Client names/logos render only per the permission register (Batch 2+).
