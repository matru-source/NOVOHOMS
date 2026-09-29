# NOVOHOMS website and admin panel

This is the complete Vercel-ready Next.js source for the NOVOHOMS public website and its opportunity-management dashboard.

## Features

- Premium responsive NOVOHOMS website and motion system
- Secure `/admin` login with an HTTP-only session cookie
- Add, edit, publish, unpublish, feature, order, preview, and delete opportunities
- Public home, Opportunities, and project-detail pages read from the managed database
- Existing NOVOHOMS WhatsApp and “Check details” actions

## Deploy on Vercel

1. Extract this archive and push the folder to a Git repository.
2. Import that repository into Vercel as a Next.js project.
3. Add a Neon Postgres database from the Vercel Marketplace, or use any Neon database. This provides `DATABASE_URL`.
4. Run `pnpm admin:secrets -- "your-admin-password"` locally.
5. Add these Production, Preview, and Development environment variables in Vercel:

   - `DATABASE_URL` — the Neon/Postgres connection string
   - `ADMIN_EMAIL` — `Jigyashasingh.07@gmail.com`
   - `ADMIN_PASSWORD_HASH` — output from the secrets command
   - `SESSION_SECRET` — output from the secrets command

6. Deploy. Open `/admin` on the deployed domain and sign in.

The database table is created automatically on the first request. If empty, the three existing NOVOHOMS opportunities are imported automatically.

## Local development

```bash
pnpm install
copy .env.example .env.local
pnpm admin:secrets -- "your-admin-password"
pnpm dev
```

Copy the generated values into `.env.local`, then open `http://localhost:3000/admin`.

Never commit `.env.local` or plain-text passwords.
