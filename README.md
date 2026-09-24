# Tharros Canada

The site for [tharros.ca](https://tharros.ca), an independent research institute working across Canada and Europe. Published research comes first and commissioned research second. Visitors read the research archive, check the methodology and, if they want a focused answer, commission one of three research services.

**Stack.**
- Next.js 16 App Router, React 19, strict TypeScript and native CSS with design tokens.
- Source Serif 4 and Schibsted Grotesk, self-hosted through `next/font`.
- minisearch for archive search and pdf.js for the report viewer.
- Vercel hosting. Supabase runs intake and readership counts, and Resend sends the notification emails.

## Quick start

Requires Node 24.x (`engines` in `package.json`; Vercel and CI both use it).

```bash
npm ci                     # also copies the pdf.js worker into public/
cp .env.example .env.local # everything is optional locally
npm run dev
```

The site runs fully without env vars. The request form returns 503 and offers an email link, and readership counts stay hidden.

## Checks

```bash
npm run lint && npm run typecheck && npm test         # fast gate
npm run build
npx playwright install chromium && npm run test:e2e   # functional, axe and visual tests on a production build
npm run smoke -- https://tharros.ca                   # post-deploy smoke test (read-only apart from one rejected POST)
```

- **Playwright builds and serves the site itself**, on port 3100.
  - Locally it reuses a server already running on that port, so stop any dev server there and delete `.next` before a run.
  - Set `PLAYWRIGHT_BASE_URL` to test a deployed URL instead.
- **CI** (`.github/workflows/ci.yml`) runs two jobs, and both must pass to merge into `main`:
  - `verify`: lint, typecheck, Vitest, `npm audit` and `deno check` on the Edge Function.
  - `browser`: the whole Playwright suite.
- **Visual baselines are Linux screenshots.** After an intended visual change, refresh them with a commit whose message contains `[update-baselines]`, or run the **Update visual baselines** workflow. Then review the images in the PR.

## Environment

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs | Defaults to `https://tharros.ca`. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Contact address | Defaults to TharrosDev@gmail.com (`src/lib/contact.ts`). |
| `RESEARCH_INTAKE_WEBHOOK_URL` | Live intake | Must be https. |
| `RESEARCH_INTAKE_WEBHOOK_SECRET` | Live intake (optional) | Falls back to the Supabase `intake_config` table. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Metrics and the intake secret | Server-only. |
| `METRICS_SECRET` | Readership counts | Random hex. Without it, nothing is counted. |

**Edge Function variables.**
- The function reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, which Supabase sets.
- `INTAKE_NOTIFY_TO` and `INTAKE_NOTIFY_FROM` are optional.
- The webhook secret and the Resend key come from `intake_config`, unless a function secret with the same name is set.

Which variables are set in which Vercel environment: `docs/OPERATIONS.md`.

## Layout

```text
src/app/          routes, llms.txt; api/research-request (intake), api/research-event (readership)
src/components/   UI; report/ holds the pdf.js viewer and the print document
src/data/         publications, source register, organization details, generated report JSON
src/lib/          services, validation, citation, archive search, metrics, site/SEO helpers
supabase/         migrations, research-intake Edge Function, config.toml
scripts/          report-pdf.mjs (report PDF, cover and text), smoke.mjs
e2e/, tests/      Playwright and Vitest
docs/             operations, report intake, evidence policy (index: docs/README.md)
```

`PRODUCT.md` holds the product intent and `DESIGN.md` the visual system. `AGENTS.md` has notes for coding agents, including the checks that commonly fail. `docs/README.md` lists every doc.

## Publishing a report

There are two paths:

- **A PDF supplied by the owner** is served unchanged and never edited. Follow `docs/REPORT_REQUIREMENTS.md`; no build is needed.
- **A house-typeset report** is written as typed `body` blocks and printed by the site. Steps:
  1. Add a record to `publications` in `src/data/publications.ts`:
     - a reference `TC-<YEAR>-<NNN>`;
     - typed `body` blocks;
     - `indexable: true` only for verified, published work.
  2. Run `npm run build && npm run report:pdf -- <slug>`.
     - It prints `/research/<slug>/print` to `public/research/<reference>.pdf`.
     - It also writes the cover, `src/data/report-text.json` and `src/data/report-pdf.json`.
     - Commit all of these, because Vercel cannot run Chromium.
  3. Read the PDF before you commit. `npm test` fails when the record, or any file in `REPORT_SOURCE_PATHS`, changes without regenerating.

**Indexable reports get:**
- Google Scholar `citation_*` tags;
- `Report` JSON-LD;
- sitemap entries;
- a stable URL `/research/id/<reference>`.

The example report `TC-EX-000` is a labelled lorem specimen and stays `indexable: false`. Don't add dummy entries to fill the archive.

## Boundaries

**Tharros provides:**
- commercial research;
- market and buyer research;
- competitor and ecosystem research;
- research capacity for partner firms.

**It doesn't give** legal, tax, customs, regulated financial, immigration or compliance advice.

Public-source publishers are named for attribution only, never to imply endorsement or affiliation.

Security issues: see `SECURITY.md`.
