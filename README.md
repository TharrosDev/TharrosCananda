# Tharros Canada

Tharros Canada is an independent commercial research and intelligence business focused on the relationship between Canada and Europe. It researches commercial, economic, industrial, technological and strategic developments and accepts commissioned research from organizations working across that relationship.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Current public product

The site is deliberately small and evidence-led:

- **Services** — Canada / Europe Market Scan, Canadian Buyer Intelligence, Competitor Intelligence, Partner & Ecosystem Research, Commissioned Research and White-label Research. Product definitions and prices live in `src/lib/services.ts`.
- **Expertise** — Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; Technology & Strategic Industries.
- **Research archive** — a search/filter-ready archive that stays honest and empty until real Tharros work is published. Add verified entries to `src/data/publications.ts`.
- **Market Data** — a live Canada–CETA merchandise-trade interface backed by Statistics Canada Table 12-10-0174-01 through the Statistics Canada Web Data Service (WDS). Related federal datasets are discovered through the Government of Canada Open Data CKAN API.
- **Sources & Methodology** — the provenance standard and core Canada/Europe public-source register.
- **Commission research** — a progressive asynchronous research-intake workflow with strict server validation and an optional monitored-email fallback.
- Dedicated **About**, **Privacy**, **Accessibility**, and **How It Works** pages.

No public page fabricates publications, customers, client logos, testimonials, team members, partnerships, awards, data or research findings. Where content does not yet exist, the interface explains the intended structure instead.

## Navigation and business hierarchy

Primary navigation is:

**Services · Expertise · Research · Market Data · About**

with **Commission research** as the primary action.

Commissioned work is the commercial core. Public research and data interfaces exist to demonstrate methods, evidence quality and subject expertise—not to imply a think-tank or software business that does not exist.

## Research archive

`src/data/publications.ts` is the single publication registry. It is intentionally empty until the first verified paper or brief ships.

The archive UI in `src/components/research-archive.tsx` already supports:

- text search;
- expertise-area filtering;
- publication-type filtering;
- stable publication URLs;
- author/tags/PDF metadata when supplied;\n- a reusable `/research/[slug]` article template for executive summary, findings, methodology, sources and limitations.

When a real publication is added, build its article/report page with the actual title, authorship, publication date, executive summary, methodology, sources, limitations and any real visual assets. Do not create dummy entries to make the archive look populated.

## Official data integration

### Statistics Canada

`src/lib/statcan.ts` integrates Statistics Canada WDS using WDS Product ID **12100174** and public table/issue **12-10-0174-01** (catalogue/DOI identifier **1210017401**), *Merchandise imports and exports, customs-based, by free trade agreement and by commodity*.

The public interface:

- requests live table metadata;
- identifies the imports/exports, free-trade-agreement and NAPCS commodity dimensions from publisher metadata;
- selects the CETA/EU agreement member from that metadata;
- builds the 10-position Statistics Canada coordinate;
- requests the latest 24 periods;
- applies the publisher scalar-factor code before displaying Canadian-dollar values;
- exposes release/retrieval metadata and limitations;
- uses the required Statistics Canada value-added-product acknowledgement;
- fails closed if the publisher is unavailable or the table structure no longer matches expectations.

No synthetic values are substituted.

Official references:

- WDS: https://www.statcan.gc.ca/en/developers/wds
- WDS user guide: https://www.statcan.gc.ca/en/developers/wds/user-guide
- Table 12-10-0174-01: https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1210017401
- Statistics Canada Open Licence: https://www.statcan.gc.ca/en/terms-conditions/open-licence

### Government of Canada Open Data

`src/app/api/open-data/search/route.ts` uses the official CKAN `package_search` GET API to discover related federal datasets. It is a discovery layer only; a returned record is not automatically evidence for a Tharros conclusion.

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
npm test
npm run build
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin used by metadata and sitemap. Defaults to `https://tharros.ca`. |
| `RESEARCH_INTAKE_WEBHOOK_URL` | Required for live intake | Server-only HTTPS endpoint receiving validated research requests. |\n| `RESEARCH_INTAKE_WEBHOOK_SECRET` | Required for live intake | Shared secret used to HMAC-sign the exact webhook payload and timestamp. |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional | Minimal same-origin/trusted event endpoint. Nothing is sent when empty or when Global Privacy Control is enabled. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Recommended | Verified monitored contact address used in About/footer/intake fallback. |

## Architecture

```text
src/
  app/
    api/market-data/trade/  Statistics Canada-backed public data endpoint
    api/open-data/search/   Government of Canada CKAN discovery endpoint
    research/               research archive
    market-explorer/        live Canada–CETA data interface
  components/              site UI, archive, chart, intake and live-data components
  data/                    publications and verified source registry
  lib/                     services, research request, contact, analytics, Statistics Canada adapter
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

Browser-level responsive, interaction and automated accessibility checks live in `e2e/`. CI installs pinned browser-test tooling without adding runtime dependencies to the product bundle.

To run locally after installing the QA-only packages:

```bash
npm install --no-save --package-lock=false @playwright/test@1.55.0 @axe-core/playwright@4.10.2
npx playwright install chromium
npx playwright test --grep-invert @visual
```

Visual-regression specs are tagged `@visual` and deliberately excluded from normal CI until an approved baseline is captured. Generate or refresh the baseline only during an intentional design review:

```bash
npx playwright test --grep @visual --update-snapshots
```
