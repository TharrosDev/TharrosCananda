<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tharros Canada

The marketing and research site for a small Canada–Europe commercial research business, served at https://tharros.ca. It is built with Next.js 16 App Router, React 19, strict TypeScript and native CSS, and deployed on Vercel. The backend is the Supabase project `tharros-canada` (ref `kgiptvgefhnwxktzncui`, ca-central-1), and Resend sends the notification emails.

This file describes how the project works **today** and why, not how it must always work. If a better approach fits the product, change the code, its tests and the relevant doc together.

## Commands

```bash
npm run lint && npm run typecheck && npm test   # fast gate; CI "verify" also runs npm audit and deno check
npm run build                                    # production build
npx playwright test e2e/site.spec.ts             # functional + axe against a production build (full e2e ~30 min locally)
npm run smoke -- https://tharros.ca              # post-deploy smoke test
npm run build && npm run report:pdf -- <slug>    # regenerate a report's PDF, cover and extracted text
npx -y deno@2 check supabase/functions/research-intake/index.ts
```

## Where things live

| Path | What |
| --- | --- |
| `src/app/` | Routes. Most pages are static. `/research` revalidates readership counts every 10 min. |
| `src/app/api/research-request` | Intake POST handler. It validates the form, HMAC-signs the payload and forwards it to the Edge Function. |
| `src/app/api/research-event` | Records readership events (reads and citations). Always answers 204. |
| `src/data/` | Content registries: `publications.ts`, `sources.ts`, `organization.ts`, plus generated `report-*.json`. |
| `src/lib/` | Domain logic: services, research-request validation, citation, archive search (minisearch), metrics, `site.ts` (siteUrl, `pageMetadata()`, JSON-LD, locale-free dates). |
| `src/components/report/` | Report viewer (pdf.js), print document and toolbar. |
| `supabase/` | Migrations, the `research-intake` Edge Function and `config.toml` (`verify_jwt = false`). |
| `e2e/` | Playwright functional, axe and visual tests, with Linux baselines in `visual.spec.ts-snapshots/`. |
| `tests/` | Vitest unit and contract tests, including the guard tests described below. |

Product intent: `PRODUCT.md`. Visual system: `DESIGN.md`. Infrastructure and runbooks: `docs/OPERATIONS.md`. Source and evidence policy: `docs/DATA_SOURCES.md`.

## Things that will bite you

- **Report source hash.** `npm test` fails if any file in `REPORT_SOURCE_PATHS` (`src/lib/report-source.ts`) or a publication record changes without the PDF being regenerated. Those files are `report.css`, `report-document.tsx`, `research/[slug]/print/page.tsx` and `citation.ts`. Regenerate locally (Vercel cannot run Chromium) and commit the outputs. Prettier on these files counts as a change.
- **Visual baselines are Linux-only.** Any visible change fails CI "browser" until the baselines are refreshed. Push a branch commit whose message contains `[update-baselines]`, or run `gh workflow run "Update visual baselines" --ref <branch>`. Then review the committed images.
- **`tests/css-guard.test.ts`** checks the motion tokens (`--dur-1`, `--dur-2`), bans `animation-timeline` (scroll-driven reveals are a design decision, see DESIGN.md) and sets an 11.5px minimum screen font size outside `report.css`. Update the guard if the design intentionally changes.
- **CSS formatting.** The CSS uses one rule per line on purpose, so don't run prettier on it. TS/TSX follows prettier: double quotes, width 100.
- **`pageMetadata()`** must be used by every page. A child `openGraph` replaces the layout's wholesale.
- **`src/lib/supabase.ts`** is `server-only`. It holds the service-role key and must never be imported from a client component.
- **Unknown `/research/<slug>` URLs** render on demand, then 404. Setting `dynamicParams = false` there breaks nav highlighting on the 404 page, which the e2e tests check.

## Content truth

The business is pre-incorporation, with no published research yet. Never invent publications, clients, people, prices, testimonials or data. `organization.ts` fields stay empty until the owner supplies verified values, and the UI hides empty fields. The example report `TC-EX-000` is a labelled lorem specimen and must stay `indexable: false`.

## Workflow

- `main` is protected: the CI checks `verify` and `browser` must pass, so land changes through a PR.
- Vercel deploys `main` automatically, but occasionally misses a merge. Check `vercel ls`; if no new Production build appeared, run `vercel deploy --prod --yes` from `main`.
- Changes to Supabase SQL or the Edge Function are deployed separately after merge (see `docs/OPERATIONS.md`).
