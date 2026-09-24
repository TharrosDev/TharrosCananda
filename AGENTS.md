<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tharros Canada

The site of an independent research institute working across Canada and Europe, served at https://tharros.ca.
- **Stack:** Next.js 16 App Router, React 19, strict TypeScript and native CSS, deployed on Vercel.
- **Backend:** the Supabase project `tharros-canada` (ref `kgiptvgefhnwxktzncui`, ca-central-1).
- **Email:** Resend sends the notification emails.
- **Positioning and product rules:** `PRODUCT.md`.

This file describes how the project works **today** and why, not how it must always work. If a better approach fits the product, change the code, its tests and the relevant doc together, in the same PR. Every doc is listed in `docs/README.md`.

## Commands

The everyday checks are in `README.md` (Checks). Commands you will also need:

```bash
npx playwright test e2e/site.spec.ts             # one spec; the full e2e suite takes about 30 min locally
npm run build && npm run report:pdf -- <slug>    # regenerate a house report's PDF, cover and extracted text
npm run report:pdf -- <slug>                     # supplied PDFs: reads the file only, no build needed
npx -y deno@2 check supabase/functions/research-intake/index.ts
```

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes. Most pages are static. Readership counts are fetched with a 10-minute revalidate (`src/lib/metrics.ts`). |
| `src/app/api/research-request` | Intake POST handler. It validates the form, HMAC-signs the payload and forwards it to the Edge Function. |
| `src/app/api/research-event` | Records readership events (reads and citations). Always answers 204. |
| `src/data/` | Content registries: `publications.ts`, `sources.ts`, `organization.ts`, plus the generated `report-*.json`. |
| `src/lib/` | Domain logic: services, research-request validation, citation, archive search (minisearch), metrics, `site.ts` (siteUrl, `pageMetadata()`, JSON-LD, locale-free dates). |
| `src/components/report/` | Report viewer (pdf.js), print document and toolbar. |
| `supabase/` | Migrations, the `research-intake` Edge Function and `config.toml` (`verify_jwt = false`). |
| `e2e/` | Playwright functional, axe and visual tests, with Linux baselines in `visual.spec.ts-snapshots/`. |
| `tests/` | Vitest unit and contract tests, including the guard tests described below. |

## Things that will bite you

**Tests and CI**
- **Report source hash.** `npm test` fails if a publication record, or any file in `REPORT_SOURCE_PATHS` (`src/lib/report-source.ts`), changes without the PDF being regenerated.
  - The files are `report.css`, `report-document.tsx`, `research/[slug]/print/page.tsx` and `citation.ts`.
  - Running prettier on them counts as a change.
  - Regenerate locally, because Vercel cannot run Chromium, and commit the outputs.
- **Visual baselines are Linux-only.** Any visible change fails CI `browser` until the baselines are refreshed.
  - Push a branch commit whose message contains `[update-baselines]`, or run `gh workflow run "Update visual baselines" --ref <branch>`.
  - Then review the committed images.
  - The baselines workflow starts CI on its own commit, so no empty commit is needed.
- **`e2e/archive.spec.ts` is the contract for `/research`**, the most important page. It must never lose a tool: search, facets, URL state, density, sort, suggestions, Cite, PDF, Copy link and the no-JS list.
- **No prices.** An e2e test fails on any "C$" on a page, including the lorem sample documents.
- **Playwright reuses a running server.** Locally, it serves on port 3100 and reuses whatever is already there, so a leftover dev server gets tested instead of a production build. Stop it and delete `.next` before e2e runs.
  - Playwright's webServer also rebuilds `.next`, so rebuild before taking manual screenshots.
- **`tests/css-guard.test.ts` enforces the motion and type rules.** Update the guard if the design changes on purpose.
  - It checks the motion tokens `--dur-1` and `--dur-2`.
  - Scroll-linked `animation-timeline` is allowed only behind `prefers-reduced-motion: no-preference`, and only for transform, translate, scale or stroke-dashoffset keyframes (see DESIGN.md, Motion).
  - Outside `report.css`, screen font sizes must be at least 11.5px.
- **Occasional flake.** The site.spec focus-ring test sometimes fails; re-run it.

**Code**
- **CSS formatting.** The CSS keeps one rule per line on purpose, so don't run prettier on it. TS/TSX follows prettier: double quotes, width 100.
- **`::highlight()` rules** live in the inline `<style>` in `src/components/report/report-viewer.tsx`. Turbopack's CSS parser rejects them in a stylesheet.
- **`pageMetadata()`** must be used by every page. A child `openGraph` replaces the layout's wholesale.
- **`src/lib/supabase.ts`** is `server-only`. It holds the service-role key and must never be imported from a client component.
- **Unknown `/research/<slug>` URLs** render on demand, then 404. Setting `dynamicParams = false` on that page breaks nav highlighting on the 404 page, which the e2e tests check.

**Tooling**
- **Install scripts.** `allowScripts` in `package.json` pins the approval for `unrs-resolver@1.12.2`. A dependency bump that changes it needs `npx npm@11 install-scripts approve <pkg>`.
- **Line endings.** The Windows working tree is CRLF (autocrlf), and prettier writes LF. Use `git diff --ignore-cr-at-eol` to see the real changes.
- **Worktrees.** Agent worktrees under `.claude/worktrees` break `eslint .`. Delete them when you are done.

## Content truth

- **Never invent** publications, clients, people, prices, testimonials or data.
- **The business is pre-incorporation.**
  - `organization.ts` fields stay empty until the owner supplies verified values, and the UI hides empty fields.
  - `organization.lead` stays `null`.
- **Published research.** The first real report, `TC-2026-001`, was published 2026-09-16.
- **The example report `TC-EX-000`** is a labelled lorem specimen. It must stay `indexable: false`, and it is the only research document you may edit.
- **Sample documents** on Research Services are lorem placeholders approved by the owner. Keep them labelled as placeholders.
- **Live data feeds** (the monitor and StatCan market data) were removed at the owner's request. Don't bring them back unasked.

**Rule #1 for supplied reports: never edit the owner's PDF**, not even its metadata or bookmarks. Anything missing goes in the record, and drafted values are flagged in the PR. See `docs/REPORT_REQUIREMENTS.md`.

## Workflow

- **`main` is protected.** The CI checks `verify` and `browser` must pass, so land changes through a PR.
- **The repo is public.** Commit messages and PR text stay neutral, with no AI attribution.
- **Deploys.** Vercel deploys `main` automatically but occasionally misses a merge. For the check and the fix, see `docs/OPERATIONS.md` (Runbooks).
- **Backend changes** to Supabase SQL or the Edge Function are deployed separately after merge, also covered in `docs/OPERATIONS.md`.
- **Docs.** When the infrastructure changes, update `docs/OPERATIONS.md`. When the visual system changes, update `DESIGN.md`.
