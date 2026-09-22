# Tharros Canada

Tharros Canada is an independent commercial research and intelligence business focused on the relationship between Canada and Europe. It researches commercial, economic, industrial, technological and strategic developments and accepts commissioned research from organizations working across that relationship.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Current public product

The site is deliberately small and evidence-led:

- **Services** — Canada / Europe Market Scan, Canadian Buyer Intelligence, Competitor Intelligence, Partner & Ecosystem Research, Commissioned Research and White-label Research. Product definitions and prices live in `src/lib/services.ts`.
- **Research archive** — a search/filter-ready archive that stays honest and empty until real Tharros work is published. Its taxonomy preserves the four research areas: Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; and Technology & Strategic Industries. Add verified entries to `src/data/publications.ts`.
- **Live Monitor** — a Currents-powered discovery surface for recent Canada–Europe reporting across the four Tharros research areas. It streams behind the page shell, preserves direct publisher links and publication times, and never presents discovered headlines as Tharros findings.
- **Market Data**: live Canada–CETA merchandise trade from Statistics Canada Table 12-10-0174-01 through the Web Data Service (WDS). Flow, commodity group and period live in the URL; a ranked comparison of every commodity group sits beside the chart; publisher flags, table notes and provenance are shown with the figures. A keyword search of the federal Open Government catalogue is available as a secondary, collapsed "find related datasets" panel.
- **Sources & Methodology** — the provenance standard and core Canada/Europe public-source register.
- **Commission research** — a progressive asynchronous research-intake workflow with strict server validation and an optional monitored-email fallback.
- Dedicated **About**, **Privacy**, **Accessibility**, and **How It Works** pages.

No public page fabricates publications, customers, client logos, testimonials, team members, partnerships, awards, data or research findings. Where content does not yet exist, the interface explains the intended structure instead.

## Navigation and business hierarchy

Primary navigation is:

**Services · Research · Live Monitor · Market Data · About**

with **Commission research** as the primary action.

Commissioned work is the commercial core. Public research, monitoring and data interfaces exist to demonstrate methods, evidence quality and subject expertise—not to imply a think-tank or software business that does not exist.

## Research archive

`src/data/publications.ts` is the single publication registry. It is intentionally empty until the first verified paper or brief ships.

The archive UI in `src/components/research-archive.tsx` already supports:

- text search;
- research-area filtering;
- publication-type filtering;
- publication-date filtering;
- stable publication URLs;
- author/tags/PDF metadata when supplied;
- a reusable `/research/[slug]` article template for executive summary, findings, methodology, sources and limitations.

Planned publication formats are **Intelligence Brief**, **Research Report**, **Market Note**, **Data Note**, and **Sector Analysis**. Search covers titles, summaries and tags.

When a real publication is added, build its article/report page with the actual title, authorship, publication date, executive summary, methodology, sources, limitations and any real visual assets. Do not create dummy entries to make the archive look populated.

## Live Monitor

`src/lib/currents.ts` integrates the Currents V2 Search API. One rolling seven-day Boolean query looks for reporting that connects Canada with Europe across trade, defence, energy/industry and strategic technology. `src/lib/currents-data.ts` owns the 15-minute server cache and explicit failure states. Results are classified into the four research areas locally from article title, description and Currents categories.

The route streams the live panel through `<Suspense>`, so navigating to `/live-monitor` does not wait for Currents before rendering the Tharros page shell.

## Official data integration

### Statistics Canada

`src/lib/statcan.ts` integrates Statistics Canada WDS using WDS Product ID **12100174** and public table/issue **12-10-0174-01** (catalogue/DOI identifier **1210017401**), *Merchandise imports and exports, customs-based, by free trade agreement and by commodity*.

The public interface:

- requests live table metadata and validates it at runtime (envelope, product id, dimensions, members, positions) instead of casting;
- identifies the trade, free-trade-agreement and NAPCS dimensions and the CETA member by name, so renamed, renumbered or terminated members fail closed;
- builds the 10-position coordinate and accepts only publisher-listed commodity groups from the URL;
- validates every series and datapoint (coordinate, vector id, monthly reference period, finite values, scalar factor, unit of measure);
- keeps Statistics Canada symbol, status and suppression codes: flagged values are labelled, withheld months (x, F, `..`) are never charted as numbers;
- requests 37 months per series, plus one batched request for all commodity groups (12-month totals, change and share);
- caches successful retrievals for 6 hours with `unstable_cache` (`src/lib/statcan-data.ts`). Failures are never cached. If a refresh fails, the last good copy keeps serving and is labelled stale after 24 hours using its own `retrievedAt`;
- streams inside `<Suspense>`, so page chrome renders immediately and a slow WDS cannot hang the page;
- uses the required Statistics Canada value-added-product acknowledgement.

No synthetic or fallback values exist anywhere in the site. Tests run against recorded real responses in `tests/fixtures/statcan/` (re-record with `node scripts/record-statcan-fixtures.mjs`). `npm run test:contract` checks the live service, and a weekly workflow runs it.

Official references:

- WDS: https://www.statcan.gc.ca/en/developers/wds
- WDS user guide: https://www.statcan.gc.ca/en/developers/wds/user-guide
- Table 12-10-0174-01: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401
- Statistics Canada Open Licence: https://www.statcan.gc.ca/en/terms-conditions/open-licence

### Government of Canada Open Data

`src/app/api/open-data/search/route.ts` uses the official CKAN `package_search` GET API. The Market Data page calls it only when a visitor opens the collapsed "Find related federal datasets" panel. It is a discovery layer only; a returned record is not evidence for a Tharros conclusion.

Official API entry point:

https://open.canada.ca/en/access-our-application-programming-interface-api

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
npm run test:contract     # live Statistics Canada contract (bash / CI)
npm run smoke -- https://tharros.ca   # deployment smoke test (read-only apart from one rejected POST)
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin used by metadata and sitemap. Defaults to `https://tharros.ca`. |
| `RESEARCH_INTAKE_WEBHOOK_URL` | Required for live intake | Server-only HTTPS endpoint receiving validated research requests. |
| `RESEARCH_INTAKE_WEBHOOK_SECRET` | Required for live intake | Shared secret used to HMAC-sign the exact webhook payload and timestamp. |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional | Minimal same-origin/trusted event endpoint. Nothing is sent when empty or when Global Privacy Control is enabled. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Optional | Overrides the verified contact address (TharrosDev@gmail.com, set in `src/lib/contact.ts`) used in About, footer, privacy, JSON-LD and the intake email fallback. |
| `CURRENTS_API_KEY` | Required for Live Monitor | Server-only Currents API key. Never expose through a `NEXT_PUBLIC_*` variable or commit it to source control. |
| `STATCAN_WDS_BASE_URL`, `OPEN_DATA_BASE_URL`, `CURRENTS_API_BASE_URL` | Tests only | Point the public-source adapters at the Playwright mock (`e2e/mock-sources.mjs`). Never set in a deployment. |

## Architecture

```text
src/
  app/
    api/open-data/search/   Government of Canada CKAN discovery endpoint
    research/               research archive
    live-monitor/           Currents-powered current-coverage monitor
    market-explorer/        live Canada–CETA data interface
  components/              site UI, archive, chart, intake and live-data components
  data/                    publications, verified source registry, organization (accountability) details
  lib/                     services, research request, contact, analytics, Statistics Canada and Currents adapters
  types/                   official-data contracts
docs/
  DATA_SOURCES.md          integration and provenance policy
  PRE_LAUNCH.md            remaining operational/legal launch work
  PRODUCT.md               product/funnel contract
```

## Commercial and evidence boundaries

Tharros provides commercial research, market intelligence, market scans in Canada or Europe, buyer research, competitor and ecosystem research, white-label research capacity and public-source analysis. It does not provide legal, tax, customs brokerage, regulated financial, immigration or formal regulatory-compliance advice.

Public-source names identify publishers only. They must never be used to imply endorsement, partnership, privileged access or government affiliation.


## Browser quality checks

`e2e/` holds functional, responsive, axe accessibility and visual-regression tests (desktop 1440 and Pixel 7). Playwright builds and starts the app against `e2e/mock-sources.mjs`, which serves controlled Statistics Canada, Open Government and Currents responses, so screenshots never depend on live data. Retrieval timestamps and the copyright year are masked; animations are disabled. CI runs the whole suite on every pull request, and a visual difference fails the build.

Baselines are Linux screenshots in `e2e/visual.spec.ts-snapshots/`. After an approved visual change, run the **Update visual baselines** workflow on the branch and review the committed images in the pull request. Local non-Linux snapshots are git-ignored and useful only for local comparison.

### Accountability details

`src/data/organization.ts` holds the research lead, legal entity, company profiles and intake retention period. Every field is empty until verified information is supplied. About, the footer, `/privacy` and the JSON-LD render each item only when it is set.
