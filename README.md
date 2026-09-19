# Jirat Sitthiwetkiat — Portfolio Platform

A full-stack, production-oriented personal portfolio: a public portfolio site backed by a real database, plus an admin CMS dashboard to manage every piece of content (projects, skills, experience, achievements, certificates, blog posts, messages, profile, and site settings) with no code changes required.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, TanStack Query, Lucide React
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT + bcrypt password hashing, role-based access control (ADMIN/EDITOR), protected admin routes
- **i18n:** Centralized EN/TH translation system (`client/src/locales`) + bilingual DB fields (`*_en` / `*_th`)

## Project structure

```
Portfolio/
├── server/          Express API + Prisma schema + seed script
├── client/          React (Vite) public site + admin dashboard
└── docker-compose.yml   Local PostgreSQL for development
```

## Prerequisites

- Node.js 20+
- A PostgreSQL database (local via Docker, or a hosted instance e.g. Supabase/Railway/Render)

## 1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env`:
- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a long random string (never reuse the example value)
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — credentials created for you by the seed script

`client/.env` only needs `VITE_API_URL` (defaults to `http://localhost:4000/api`, already proxied by Vite in dev).

## 3. Start PostgreSQL (local dev)

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with the credentials already matching the default `DATABASE_URL` in `server/.env.example`. If you're using a hosted database instead, just point `DATABASE_URL` at it and skip this step.

## 4. Run Prisma migrations

```bash
cd server
npx prisma migrate dev --name init
```

This creates all tables (`User`, `Profile`, `Project`, `ProjectImage`, `Skill`, `Experience`, `Achievement`, `Certificate`, `BlogPost`, `BlogTag`, `ContactMessage`, `Media`, `SiteSetting`).

## 5. Seed the database

```bash
npm run seed
```

This creates:
- An admin user (email/password from `.env`, printed to the console when the seed finishes)
- A profile, site settings, skills, projects (Anonymous Talk, CID Hotel Wallet, Campus Event Finder), experience, one achievement (ETDA Bootcamp 2026), two certificates, and five blog posts.

## 6. Run in development

In two terminals:

```bash
# terminal 1
cd server && npm run dev     # http://localhost:4000

# terminal 2
cd client && npm run dev     # http://localhost:5173
```

Visit `http://localhost:5173` for the public site and `http://localhost:5173/admin/login` for the admin dashboard (log in with the seeded admin credentials).

## Production build

```bash
# server
cd server
npm run build
npm run start

# client
cd client
npm run build     # outputs static files to client/dist
npm run preview   # optional local preview
```

## Deployment

- **Frontend (`client/`)** → Vercel or Netlify. Build command `npm run build`, output directory `dist`. Set `VITE_API_URL` to your deployed API URL.
- **Backend (`server/`)** → Render or Railway. Build command `npm run build`, start command `npm run start`. Set all variables from `server/.env.example`, run `npx prisma migrate deploy` as a release step, and mount a persistent volume for `uploads/` (or swap the upload middleware for S3/Supabase Storage in production).
- **Database** → managed PostgreSQL (Render/Railway Postgres, or Supabase).

Never commit `.env` files — only the `.env.example` templates are tracked.

## Security notes

- Passwords are hashed with bcrypt; JWTs are signed with `JWT_SECRET` and expire per `JWT_EXPIRES_IN`.
- All write endpoints (`POST`/`PUT`/`PATCH`/`DELETE`) under `/api/*` (except `/api/contact` and `/api/auth/login`) require a valid `Authorization: Bearer <token>` header.
- The contact form and login endpoint are rate-limited (`express-rate-limit`).
- File uploads are restricted by MIME type and size (`server/src/middleware/upload.ts`).
- All request bodies are validated with `zod` schemas before touching the database.
- `helmet` and a `cors` allowlist (`CLIENT_URL`) are applied to every request.

## Notes on scope

- The rich text editor for blog posts uses `react-quill-new` and is lazy-loaded so it never ships in the public bundle.
- Draft projects/blog posts are only visible to authenticated admin requests (verified server-side via JWT), never exposed publicly.
- The sitemap (`client/public/sitemap.xml`) ships with the static routes; wire it up to a server-generated endpoint if you want it to include every project/blog slug automatically.
