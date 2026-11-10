# Deployment

Iqtida cannot be published as a static site. GitHub Pages is the wrong host. Use a Node.js host plus managed PostgreSQL, and do not open it to the public until the hard-coded admin session below is removed.

## What the app actually is

The Next.js 16 application is in `iqtida/` (the repository root is not a Node package). `iqtida/next.config.ts` does not set `output: 'export'`. Leave it that way.

A production build needs a long-running Node server because the app does all of the following:

- **Route handlers.** Fourteen handlers under `iqtida/src/app/api/` serve auth, registration, dashboard, sunnah, hadith, ask, verify, saved items, progress, and the admin CMS. Static export does not run route handlers.
- **Request-time APIs.** `dashboard`, `progress`, and `saved` call `cookies()` from `next/headers`.
- **Server Actions.** `iqtida/src/lib/auth-actions.ts` is marked `"use server"` and registers, signs in, and signs out through Prisma and NextAuth.
- **Auth.** `iqtida/src/lib/auth.ts` configures NextAuth (Auth.js v5) with the Prisma adapter and a credentials provider.
- **Database.** `iqtida/prisma/schema.prisma` uses the PostgreSQL provider and reads `DATABASE_URL`. API routes and the credentials provider query Prisma at request time.

`output: 'export'` would drop those features. Do not add it, and do not delete auth, API routes, or Prisma to force a green Pages build. A normal `next build` (server output, not a static export) already marks every `src/app/api/` route, plus `library/[id]`, as dynamic server routes.

The checked-in Pages workflow failed earlier than the host mismatch: it looked for a lockfile in the repository root. `package-lock.json` is in `iqtida/`, so package-manager detection exited before any build. That workflow is now manual-only and does not deploy. Continuous integration is `.github/workflows/ci.yml`.

## Where to host it

Run `next build` and `next start` (or the host's Next.js builder) on a Node.js service, and point Prisma at managed Postgres.

- **Vercel** (or another Node host that supports Next.js server features) with a managed Postgres database such as Neon, Supabase, or RDS.
- **A container host** that runs the Node server, again with managed Postgres. The database should not live only on the app container's disk.

GitHub Pages serves static files only. It cannot run this server, NextAuth, Prisma, or Postgres.

## Environment variable names

Set values in the host's secret store. Do not commit them.

| Name | Used for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Required by the Prisma schema. |
| `AUTH_SECRET` | Auth.js signing secret. |
| `AUTH_URL` | Public origin of the deployed app. |
| `NEXTAUTH_SECRET` | Legacy name Auth.js still accepts for the signing secret. |
| `NEXTAUTH_URL` | Legacy name Auth.js still accepts for the public origin. |

Application source does not read further names (`NODE_ENV` is the only direct `process.env` use). Auth.js requires `AUTH_SECRET` or `NEXTAUTH_SECRET` in production and throws if both are missing. The credentials provider does not use OAuth client ids.

## Replace the admin guest before any public deploy

`auth()` in `iqtida/src/lib/auth.ts` does not read the NextAuth session. It always returns a guest user whose role is `ADMIN` (`id` `default-guest-id`, email `guest@iqtida.app`). `GET` requests to the NextAuth session route in `iqtida/src/app/api/auth/[...nextauth]/route.ts` return the same stub.

Admin route handlers treat that role as authorized, so every caller passes the admin and reviewer checks. Restore the real NextAuth `auth` function, and stop returning the mock session, before any public deployment.
