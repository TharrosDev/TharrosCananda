# Tharros Canada

Tharros Canada is an independent commercial research and intelligence business focused on the relationship between Canada and Europe. It researches commercial, economic, industrial, technological and strategic developments and accepts commissioned research from organizations working across that relationship.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Current public product

The site is deliberately small and evidence-led:

- **Services** — Canada / Europe Market Scan, Canadian Buyer Intelligence, Competitor Intelligence, Partner & Ecosystem Research, Commissioned Research and White-label Research. Product definitions and prices live in `src/lib/services.ts`.
- **Research archive** — a search/filter-ready archive that stays honest and empty until real Tharros work is published. Its taxonomy preserves the four research areas: Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; and Technology & Strategic Industries. Add verified entries to `src/data/publications.ts`.
- **Live Monitor** — a Currents-powered discovery surface for recent Canada–Europe reporting across the four Tharros research areas. It streams behind the page shell, preserves direct publisher links and publication times, and never presents discovered headlines as Tharros findings.
- **Sources & Methodology** — the provenance standard and core Canada/Europe public-source register.
- **Commission research** — a progressive asynchronous research-intake workflow with strict server validation and an optional monitored-email fallback.
- Dedicated **About**, **Privacy**, **Accessibility**, and **How It Works** pages.

No public page fabricates publications, customers, client logos, testimonials, team members, partnerships, awards, data or research findings. Where content does not yet exist, the interface explains the intended structure instead.

## Navigation and business hierarchy

Primary navigation is:

**Services · Research · Live Monitor · About**

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

The Live Monitor is a **Currents-only discovery surface**. It is not a publication feed and it has no synthetic or secondary-provider fallback. `src/lib/currents.ts` integrates the Currents V2 Search API and `src/lib/currents-data.ts` owns the server cache and user-safe error state.

The production request contract is deliberately narrow:

- one Boolean search connects Canada with Europe across trade/economy, defence/security, energy/industry and strategic technology;
- the search window is exactly seven days, using second-precision RFC3339 timestamps;
- the adapter requests one page of **20 results**, keeping the request within the documented free-tier result cap and bounding quota use;
- the API key is sent only through the server-side `Authorization: Bearer` header;
- successful snapshots are cached for 15 minutes;
- one bounded retry is allowed for transient network/5xx failures, while 400, authentication and quota failures fail immediately;
- malformed or oversized responses and records outside the requested seven-day window are rejected;
- URL deduplication happens after time validation so an invalid/future copy cannot suppress a valid current article;
- tracking parameters are removed and remaining query parameters are normalized on outgoing publisher URLs;
- article title, description, language and provider responses are bounded before display;
- article title, description and Currents categories are used only for local research-area classification;
- valid provider-empty, visitor-filtered empty and provider-failure states remain distinct and recoverable.

The route streams the panel through `<Suspense>`, so navigating to `/live-monitor` renders the Tharros shell immediately rather than waiting on Currents. Each result keeps its original publisher URL and publication time. Currents is visibly attributed, and discovered headlines/descriptions are never presented as Tharros verification, endorsement or analysis.

Production deployments must provide `CURRENTS_API_KEY` as a server-only environment variable. Do not add article-body storage, persistent republishing, automated customer-facing summaries or a fallback news provider without separately reviewing source rights and updating the provenance policy in `docs/DATA_SOURCES.md`.

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
| `CURRENTS_API_KEY`               | Required for Live Monitor | Server-only Currents API key used in the Bearer authorization header. Never expose through a `NEXT_PUBLIC_*` variable, URL parameter or source control.           |
| `CURRENTS_API_BASE_URL`          | Tests only                | Points the Currents adapter at the Playwright mock (`e2e/mock-sources.mjs`). Never set in a deployment.                                                           |

## Architecture

```text
src/
  app/
    research/               research archive
    live-monitor/           Currents-powered current-coverage monitor
  components/              site UI, archive, intake and Live Monitor components
  data/                    publications, verified source registry, organization (accountability) details
  lib/                     services, research request, contact, analytics and Currents adapter
docs/
  DATA_SOURCES.md          integration and provenance policy
  PRE_LAUNCH.md            remaining operational/legal launch work
  PRODUCT.md               product/funnel contract
```

## Commercial and evidence boundaries

Tharros provides commercial research, market intelligence, market scans in Canada or Europe, buyer research, competitor and ecosystem research, white-label research capacity and public-source analysis. It does not provide legal, tax, customs brokerage, regulated financial, immigration or formal regulatory-compliance advice.

Public-source names identify publishers only. They must never be used to imply endorsement, partnership, privileged access or government affiliation.

## Browser quality checks

`e2e/` holds functional, responsive, axe accessibility and visual-regression tests (desktop 1440 and Pixel 7). Playwright builds and starts the app against `e2e/mock-sources.mjs`, which serves controlled Currents responses, so screenshots never depend on a live provider. Retrieval timestamps and the copyright year are masked; animations are disabled. CI runs the whole suite on every pull request, and a visual difference fails the build.

Baselines are Linux screenshots in `e2e/visual.spec.ts-snapshots/`. After an approved visual change, run the **Update visual baselines** workflow on the branch and review the committed images in the pull request. Local non-Linux snapshots are git-ignored and useful only for local comparison.

### Accountability details

`src/data/organization.ts` holds the research lead, legal entity, company profiles and intake retention period. Every field is empty until verified information is supplied. About, the footer, `/privacy` and the JSON-LD render each item only when it is set.
