# Tharros Canada

The site for [tharros.ca](https://tharros.ca), an independent student research project publishing sourced reports on Canada–Europe questions. Visitors read the research archive, inspect the methodology and contact the project about questions, corrections or collaboration.

**Stack.**
- Next.js 16 App Router, React 19, strict TypeScript and native CSS with design tokens.
- Space Grotesk and Schibsted Grotesk, self-hosted through `next/font`.
- minisearch for archive search and pdf.js for the report viewer.
- Vercel hosting. Supabase supports readership counts; the retired intake data remains under its retention policy.

## Quick start

Requires Node 24.x (`engines` in `package.json`; Vercel and CI both use it).

```bash
npm ci                     # also copies the pdf.js worker into public/
cp .env.example .env.local # everything is optional locally
npm run dev
```

The site runs without env vars. Readership counts stay hidden when their server credentials are absent.

## Checks

Keep checks proportional to the change. For small copy, layout or CSS fixes, inspect the source and diff and run targeted lint when relevant; the owner reviews appearance and reports tweaks or bugs. Do not add tests, take automated screenshots, run whole suites or build by default for these fixes. Behavior, routing, data and security changes need meaningful checks for the affected paths and a build when warranted. Full browser runs are reserved for an explicit request or a significant functional change.

Available checks, selected as needed:

```bash
npx eslint src/app/page.tsx                          # example: lint an affected TS/TSX file
npx vitest run tests/publications.test.ts             # example: a relevant contract test
npm run lint && npm run typecheck && npm test         # broader code checks when warranted
npm run build                                       # when production compilation matters
npx playwright install chromium && npm run test:e2e  # opt-in behavior and accessibility checks
npm run smoke -- https://tharros.ca                   # post-deploy smoke check (includes one rejected POST)
```

- **Playwright builds and serves the site itself**, on port 3100.
  - It refuses to reuse a server already running on that port, so stop any dev server there and delete `.next` before a run.
  - Set `PLAYWRIGHT_BASE_URL` to test a deployed URL instead.
- **CI** (`.github/workflows/ci.yml`):
  - `verify`: lint, typecheck, Vitest, `npm audit` and `deno check` on the Edge Function.
  - `browser`: the retained Playwright behavior and accessibility suite, run only through manual CI dispatch; routine pushes and PRs skip it.
  - The required `verify` check must pass before merge. Small fixes do not need its whole gate repeated locally.
- Appearance is reviewed by the owner. Automated screenshot comparisons and visual-baseline update workflows have been removed.

## Environment

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs | Defaults to `https://tharros.ca`. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Contact address | Defaults to TharrosDev@gmail.com (`src/lib/contact.ts`). |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Readership counts | Server-only. |
| `METRICS_SECRET` | Readership counts | Random hex. Without it, nothing is counted. |

Which variables are set in which Vercel environment: `docs/OPERATIONS.md`.

## Layout

```text
src/app/          routes, llms.txt; api/research-request (retired), api/research-event (readership)
src/components/   UI; report/ holds the pdf.js viewer and the print document
src/data/         publications, source register, organization details, generated report JSON
src/lib/          citation, archive search, metrics, site/SEO helpers
supabase/         migrations and the legacy research-intake Edge Function pending retirement
scripts/          report-pdf.mjs (report PDF, cover and text), smoke.mjs
e2e/, tests/      Playwright and Vitest
docs/             operations, report intake, evidence policy (index: docs/README.md)
```

`PRODUCT.md` holds the product intent and `DESIGN.md` the visual system. `AGENTS.md` has notes for coding agents, including the checks that commonly fail. `docs/README.md` lists every doc.

## Publishing a report

Every report is a PDF the owner supplies, served unchanged and never edited. Follow `docs/REPORT_REQUIREMENTS.md`; no build is needed.

**Indexable reports get:**
- Google Scholar `citation_*` tags;
- `Report` JSON-LD;
- sitemap entries;
- a stable URL `/research/id/<reference>`.

Don't add dummy or placeholder entries to fill the archive.

## Boundaries

**Tharros publishes:** independently produced reports and data notes on Canada–Europe questions.

**It doesn't give** legal, tax, customs, regulated financial, immigration or compliance advice.

Public-source publishers are named for attribution only, never to imply endorsement or affiliation.

Security issues: see `SECURITY.md`.
