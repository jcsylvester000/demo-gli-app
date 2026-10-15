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
3. Deploy. Every push to `main` redeploys; the migration runs first on every build.
4. Check `https://<site>.netlify.app/api/health` → `{"ok":true,"db":"ok"}`.

The site stays `noindex` until the real domain is live: then set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://<domain>`.

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
