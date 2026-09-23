# Tharros Canada

Tharros Canada is an independent commercial research and intelligence business focused on the relationship between Canada and Europe. It researches commercial, economic, industrial, technological and strategic developments and accepts commissioned research from organizations working across that relationship.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Current public product

The site is deliberately small and evidence-led:

- **Services** — Canada / Europe Market Scan, Canadian Buyer Intelligence, Competitor Intelligence, Partner & Ecosystem Research, Commissioned Research and White-label Research. Product definitions and prices live in `src/lib/services.ts`.
- **Research archive** — a search/filter-ready archive that stays honest and empty until real Tharros work is published. Its taxonomy preserves the four research areas: Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; and Technology & Strategic Industries. Add verified entries to `src/data/publications.ts`.
- **Sources & Methodology** — the provenance standard and core Canada/Europe public-source register.
- **Commission research** — a progressive asynchronous research-intake workflow with strict server validation and an optional monitored-email fallback.
- Dedicated **About**, **Privacy**, **Accessibility**, and **How It Works** pages.

No public page fabricates publications, customers, client logos, testimonials, team members, partnerships, awards, data or research findings. Where content does not yet exist, the interface explains the intended structure instead.

## Navigation and business hierarchy

Primary navigation is:

**Services · Research · Methodology · About**

with **Commission research** as the primary action.

Commissioned work is the commercial core. Public research and methodology pages exist to demonstrate methods, evidence quality and subject expertise—not to imply a think-tank or software business that does not exist.

## Research archive

`src/data/publications.ts` is the single publication registry. It is intentionally empty until the first verified paper or brief ships.

The archive UI in `src/components/research-archive.tsx` already supports:

- text search;
- research-area filtering;
- publication-type filtering;
- publication-date filtering;
- stable publication URLs;
- author/tags/PDF metadata when supplied;
- a `/research/[slug]` report page that embeds the real PDF (drawn with pdf.js as paper sheets), with Cite / Download / Copy link / Share;
- a stable citation URL per report: `/research/id/<reference>` (308 to the slug).

Planned publication formats are **Intelligence Brief**, **Research Report**, **Market Note**, **Data Note**, and **Sector Analysis**.

The example report (`TC-EX-000`) is a clearly labelled lorem-ipsum specimen. It runs through the whole pipeline but has `indexable: false`, so it is noindex, has no Scholar tags, stays out of the sitemap and its PDF is served with `X-Robots-Tag: noindex`. Do not create dummy entries to make the archive look populated.

### Publishing a report

1. Add a record to `publications` in `src/data/publications.ts`: `reference` `TC-<YEAR>-<NNN>`, typed `body` blocks, and `indexable: true` only for verified, published work.
2. `npm run build && npm run report:pdf -- <slug>` prints `/research/<slug>/print` to `public/research/<reference>.pdf` and writes the cover, the extracted text (`src/data/report-text.json`) and `src/data/report-pdf.json`. Commit all of them; Vercel builds cannot run Chromium.
3. Read the PDF before committing. `npm test` fails when the record or `src/components/report/report.css` changes without regenerating.
4. Indexable reports get Highwire `citation_*` tags (Google Scholar), `Report` JSON-LD, sitemap entries for the page and PDF, and the stable URL.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 6 strict mode
- Native CSS with centralized design tokens
- Source Serif 4 Variable + Schibsted Grotesk Variable
- Vitest
- ESLint / Next.js Core Web Vitals rules

The project intentionally avoids a component framework and runtime animation dependency.

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test                  # unit and fixture-based contract tests
npm run build
npx playwright install chromium
npm run test:e2e          # functional, axe and visual tests on a production build with mocked sources
npm run smoke -- https://tharros.ca   # deployment smoke test (read-only apart from one rejected POST)
```

## Environment variables

| Variable                         | Required                  | Purpose                                                                                                                                                           |
| -------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Recommended               | Canonical origin used by metadata and sitemap. Defaults to `https://tharros.ca`.                                                                                  |
| `RESEARCH_INTAKE_WEBHOOK_URL`    | Required for live intake  | Server-only HTTPS endpoint receiving validated research requests.                                                                                                 |
| `RESEARCH_INTAKE_WEBHOOK_SECRET` | Required for live intake  | Shared secret used to HMAC-sign the exact webhook payload and timestamp.                                                                                          |
| `NEXT_PUBLIC_RESEARCH_EMAIL`     | Optional                  | Overrides the verified contact address (TharrosDev@gmail.com, set in `src/lib/contact.ts`) used in About, footer, privacy, JSON-LD and the intake email fallback. |

## Architecture

```text
src/
  app/
    research/               research archive
  components/              site UI, archive, report viewer and intake components
  data/                    publications, verified source registry, organization (accountability) details
  lib/                     services, research request, contact, citation, archive search and analytics
docs/
  DATA_SOURCES.md          integration and provenance policy
  PRE_LAUNCH.md            remaining operational/legal launch work
  PRODUCT.md               product/funnel contract
```

## Commercial and evidence boundaries

Tharros provides commercial research, market intelligence, market scans in Canada or Europe, buyer research, competitor and ecosystem research, white-label research capacity and public-source analysis. It does not provide legal, tax, customs brokerage, regulated financial, immigration or formal regulatory-compliance advice.

Public-source names identify publishers only. They must never be used to imply endorsement, partnership, privileged access or government affiliation.

## Browser quality checks

`e2e/` holds functional, responsive, axe accessibility and visual-regression tests (desktop 1440 and Pixel 7). Playwright builds and starts the app from a production build. The copyright year is masked; animations are disabled. CI runs the whole suite on every pull request, and a visual difference fails the build.

Baselines are Linux screenshots in `e2e/visual.spec.ts-snapshots/`. After an approved visual change, run the **Update visual baselines** workflow on the branch and review the committed images in the pull request. Local non-Linux snapshots are git-ignored and useful only for local comparison.

### Accountability details

`src/data/organization.ts` holds the research lead, legal entity, company profiles and intake retention period. Every field is empty until verified information is supplied. About, the footer, `/privacy` and the JSON-LD render each item only when it is set.
