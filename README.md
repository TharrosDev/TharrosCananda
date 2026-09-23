# Tharros Canada

The site for [tharros.ca](https://tharros.ca), an independent commercial research business covering the Canada–Europe relationship. Visitors can read about three services, browse the research archive and check the methodology. Their main action is to commission a scoped piece of research.

Stack: Next.js 16 App Router, React 19, TypeScript (strict) and native CSS with design tokens. Fonts are Source Serif 4 and Schibsted Grotesk. Search uses minisearch and the report viewer uses pdf.js. Hosting is Vercel. Intake and readership counts run on Supabase, and Resend sends the notification emails.

## Quick start

```bash
npm ci                     # also copies the pdf.js worker into public/
cp .env.example .env.local # everything is optional locally
npm run dev
```

Without env vars, the site runs fully. The request form returns 503 and offers an email link, and readership counts stay hidden.

## Checks

```bash
npm run lint && npm run typecheck && npm test
npm run build
npx playwright install chromium && npm run test:e2e   # functional, axe and visual tests on a production build
npm run smoke -- https://tharros.ca                   # post-deploy smoke test (read-only apart from one rejected POST)
```

CI (`.github/workflows/ci.yml`) runs two jobs:
- **`verify`:** lint, typecheck, Vitest, `npm audit` and `deno check` on the Edge Function.
- **`browser`:** the whole Playwright suite.

Both are required to merge into `main`. Visual baselines are Linux screenshots. After an intended visual change, refresh them with a commit containing `[update-baselines]` or the **Update visual baselines** workflow, then review the images in the PR.

## Environment

| Variable | Needed for | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs | Defaults to `https://tharros.ca`. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Contact address | Defaults to TharrosDev@gmail.com (`src/lib/contact.ts`). |
| `RESEARCH_INTAKE_WEBHOOK_URL` | Live intake | Must be https. |
| `RESEARCH_INTAKE_WEBHOOK_SECRET` | Live intake (optional) | Falls back to the Supabase `intake_config` table. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Metrics and intake secret | Server-only. |
| `METRICS_SECRET` | Readership counts | Random hex. Without it, nothing is counted. |

The Edge Function reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Supabase sets both). `INTAKE_NOTIFY_TO` and `INTAKE_NOTIFY_FROM` are optional. The webhook secret and Resend key come from `intake_config` unless a function secret with the same name is set.

## Layout

```text
src/app/          routes; api/research-request (intake), api/research-event (readership)
src/components/   UI; report/ holds the pdf.js viewer and the print document
src/data/         publications, source register, organization details, generated report JSON
src/lib/          services, validation, citation, archive search, metrics, site/SEO helpers
supabase/         migrations, research-intake Edge Function, config.toml
scripts/          report-pdf.mjs (print → PDF), smoke.mjs
e2e/, tests/      Playwright and Vitest
docs/             OPERATIONS.md (infra and runbooks), DATA_SOURCES.md (evidence policy)
```

`PRODUCT.md` holds product intent and `DESIGN.md` the visual system. `AGENTS.md` has notes for coding agents, including the checks that commonly fail.

## Publishing a report

1. Add a record to `publications` in `src/data/publications.ts`:
   - reference `TC-<YEAR>-<NNN>`
   - typed `body` blocks
   - `indexable: true` only for verified, published work
2. Run `npm run build && npm run report:pdf -- <slug>`. It prints `/research/<slug>/print` to `public/research/<reference>.pdf` and writes the cover, `src/data/report-text.json` and `src/data/report-pdf.json`. Commit all of these; Vercel cannot run Chromium.
3. Read the PDF before you commit. `npm test` fails when the record or any file in `REPORT_SOURCE_PATHS` changes without regenerating.
4. Indexable reports get:
   - Google Scholar `citation_*` tags
   - `Report` JSON-LD
   - sitemap entries
   - a stable URL `/research/id/<reference>`

The example report `TC-EX-000` is a labelled lorem specimen and stays `indexable: false`. Do not add dummy entries to fill the archive.

## Boundaries

Tharros provides commercial research, market and buyer research, competitor and ecosystem research, and research capacity for partner firms. It does not give legal, tax, customs, regulated financial, immigration or compliance advice. Public-source publishers are named for attribution only, never to imply endorsement or affiliation.
