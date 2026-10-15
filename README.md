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
   - Lead capture (Batch 4): `RESEND_API_KEY`, `LEAD_FROM_EMAIL` (e.g. `GLI Job Tickets <tickets@your-domain>`; verify the
     domain in Resend for SPF/DKIM/DMARC), `SALES_INBOX` (comma-separated), `NEXT_PUBLIC_TURNSTILE_SITE_KEY` +
     `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile), `CRON_SECRET` (16+ random characters), optional `TEAM_ALERT_WEBHOOK_URL`.
3. Deploy. Every push to `main` redeploys; the migration runs first on every build.
4. Check `https://<site>.netlify.app/api/health` → `{"ok":true,"db":"ok"}`.

The site stays `noindex` until the real domain is live: then set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://<domain>`.

## Lead capture (Batch 4)

- `/quote`: 4-step job ticket (S8). Ticket numbers `GLI-YYMM-####` (Manila month), unique and sequential.
- Uploads: PDF, AI, PSD, JPG, PNG, ZIP · ≤ 25 MB · ≤ 5 files. Netlify functions accept ~6 MB per request, so the browser
  sends 4 MB parts to `/api/upload/...`; the first bytes are checked against the file type. Files live in Netlify Blobs
  (store `quote-uploads`, private) or `./.data/uploads` locally. They are downloadable only from the admin (Batch 5).
- After saving, an outbox queues the auto-reply, sales email and optional team alert in the same transaction. Failed sends
  retry with back-off (on later submissions and every 15 min via `netlify/functions/outbox-retry.mts`). A lead is never lost.
- Without email settings, leads still save and emails wait in the outbox until settings are added.
- `/api/health` shows which integrations are configured (no values).

## Admin (Batch 5)

- Sign in at `/admin/login`. The public footer links there with a deliberately discreet mark (⌖) after the copyright line.
- First account: username `Admin`, temporary password `Admin1234` (or `ADMIN_INITIAL_PASSWORD`), created by `db:migrate`
  on an empty database. It must be changed at first sign-in. Turn on two-step verification under My account.
- Roles: **Sales** (leads, files), **Editor** (case studies, prices and lead times, contact details, style guide; no lead
  data), **Admin** (everything: team, client permissions, Rx clearance, testimonials, redirects, CSV export, erase).
- Leads: overview (new, overdue over 1 business day, follow-ups, by service/source), list with search and filters, detail
  with one-tap Call/Viber/WhatsApp/Email, status/owner/priority/follow-up, notes, private file downloads, email retry,
  CSV export (Admin) and erase for data-subject requests (Admin).
- Publishing changes (permissions, cases, testimonials, prices, contact details, redirects) refresh the public site
  within seconds (cache tag `governance`).
- Locked out after 5 failed sign-ins for 15 minutes. If the only Admin forgets their password, run
  `npm run db:migrate` against an empty `user` table or ask the developer to reset it.

## Structure

```
src/app/                 routes (pages, API, robots, sitemap)
src/app/(site)/[...slug] temporary placeholders for launch URLs not built yet (noindex)
src/components/brand     logo, print-heritage motifs (crop marks, CMYK bar, registration mark, brush underline)
src/components/layout    utility bar, header + mega-menu, footer, chat button, breadcrumbs, CTA band
src/components/consent   cookie banner + consent-gated GTM
src/content/             site facts, navigation, launch routes (typed)
src/lib/server/pool.ts   Neon connection (never throws at import)
db/schema.sql            all tables (idempotent)
scripts/db-migrate.ts    runs schema.sql (on every Netlify build)
```

## Rules

- No secrets in git: `.env.local` is ignored. Set secrets in Netlify only.
- Colours come from tokens in `src/app/globals.css` (`@theme`); no hard-coded hex values in components.
- Contact details marked `pending` in `src/content/site.ts` are never printed or linked until confirmed by GLI.
- Client names/logos render only per the permission register (Batch 2+).
