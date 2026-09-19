<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Karang Taruna (Indonesian youth community) website. Fresh `create-next-app` scaffold — no tests, no backend yet.

- Stack: Next.js 16.3.5 (App Router, `/app`), React 19.2.8, TypeScript strict, ESLint 9, Tailwind CSS v4.
- Roadmap in `README.md` drives the build: design system → pages (Beranda, Tentang Kami, Kegiatan, Berita, Galeri, Kontak) → Supabase → Admin Dashboard → testing → deploy. Site content/copy is Indonesian; Supabase is the planned backend (env-driven, `.env*` is gitignored).

## Commands

- `npm run dev` / `npm run build` / `npm run start` / `npm run lint`
- No typecheck or test scripts exist and no test framework is installed. `next build` runs type checking; run `npx tsc --noEmit` for a standalone typecheck.

## Conventions that differ from defaults

- Tailwind v4 is CSS-first: theme lives in `app/globals.css` via `@import "tailwindcss"` and `@theme inline`. Do NOT create a `tailwind.config.*` file; configure fonts/colors in CSS.
- Path alias: `@/*` maps to the repo root (e.g. `@/components/x` → `./components/x`).
- Next.js 16 default bundler is Turbopack (`--webpack` to opt out). The `middleware` file convention is deprecated/renamed to `proxy` — check `node_modules/next/dist/docs/` before using either.
- Note: after the scaffold grows, `next dev` re-writes the generated block above; keep it intact in any commit.
