# Tharros Canada

Tharros Canada is an early-stage Canadian market-intelligence venture for European businesses. It combines a self-service commercial-intelligence interface with focused human research so companies can investigate Canadian demand, buyers, competitors, channels and trade signals before committing significant resources.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Version 1 scope

- A product-led homepage with an inspectable Market Explorer preview.
- A clearly labelled demonstration dataset behind a replaceable data adapter.
- Research service pages for market, buyer/distributor and competitor intelligence.
- A progressive, asynchronous research-request workflow.
- An informational Canada E-Commerce Readiness checker.
- Dedicated Sources & Methodology, How It Works and About pages.
- Sitemap, robots metadata, canonical metadata and structured organization data.
- Privacy-conscious event hooks with no analytics vendor required.

Version 1 intentionally excludes accounts, payments, subscriptions, a CRM, automated legal/customs analysis, a chatbot, a proprietary data warehouse and report-generation infrastructure.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 6 in strict mode (the current TypeScript 7 release is not yet supported by the Next.js ESLint toolchain)
- Native CSS with centralized design tokens
- Self-hosted Manrope Variable and Newsreader Variable font packages
- Vitest for focused domain tests
- ESLint using Next.js Core Web Vitals rules

The project avoids a component framework and runtime animation dependency. The initial product benefits more from explicit UI boundaries and a small JavaScript surface than from a large abstraction layer.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

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
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical origin used by metadata and the sitemap. Defaults to `https://tharros.ca`. |
| `RESEARCH_INTAKE_WEBHOOK_URL` | Required for live intake | Server-side HTTPS endpoint that receives validated request JSON. |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional | Same-origin or trusted endpoint for minimal business-event beacons. No events are sent when empty or when Global Privacy Control is enabled. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Optional | Reserved for a confirmed public contact address. The site does not invent one. |

The request form deliberately returns a clear configuration error until a secure intake webhook is supplied. This avoids creating the appearance of a successful submission when no delivery destination exists.

## Architecture

```text
src/
  app/                 Routes, metadata, sitemap, robots and the intake API
  components/          Shared site, explorer, chart and workflow components
  data/                Demo adapter records and source registry
  lib/                 Analytics boundary and request validation
  types/               Provenance-aware market domain types
docs/
  PRODUCT.md           Product model, funnel and roadmap
  DATA_SOURCES.md      Integration and provenance policy
```

### Market Explorer data boundary

`src/types/market.ts` defines the view model. `src/data/demo-markets.ts` is the V1 adapter and contains only explicitly synthetic examples. UI components consume `DemoMarketResult`; a future Statistics Canada, ISED or Open Data adapter can return the same structure without changing the page hierarchy.

Every result includes a `SourceMetadata` record:

- publisher;
- dataset;
- URL;
- period;
- last updated;
- retrieved at;
- licence;
- limitations/notes.

### Demo versus live data

The V1 numbers are synthetic and labelled in the interface. They demonstrate trend, province and route-to-market output structures. They are not current Canadian statistics and must not be reused as evidence.

Before a source is integrated, verify its API or download path, terms, attribution, update frequency, classification coverage and known limitations. See [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).

### Research intake

The client validates each progressive step and the server validates the complete payload again. The server forwards valid requests to `RESEARCH_INTAKE_WEBHOOK_URL` with an eight-second timeout. Authentication, rate limiting, anti-spam controls, retention policy and a privacy review should be added at the receiving endpoint before public launch.

### Analytics

`src/lib/analytics.ts` owns event emission. The current events are:

- `market_explorer_started`
- `market_explorer_completed`
- `research_service_viewed`
- `research_request_started`
- `research_request_submitted`

No third-party SDK, cookies or cross-site identifiers are installed.

## Deployment

1. Create a Node-compatible deployment for this repository.
2. Set `NEXT_PUBLIC_SITE_URL=https://tharros.ca`.
3. Configure a secure research-intake webhook and test success/failure delivery.
4. Add the `tharros.ca` and `www.tharros.ca` domains and choose one canonical redirect.
5. Confirm HTTPS, security headers, sitemap and robots output.
6. Run accessibility and performance checks against the deployed environment.

The code does not assume Vercel. Any host supporting the current stable Next.js runtime and server route handlers is suitable.

## Commercial boundaries

Tharros provides commercial research, market intelligence, data aggregation, buyer research, competitor research and public-source analysis. It does not provide legal, tax, customs brokerage, regulated financial, immigration or formal regulatory-compliance advice. Automated outputs are informational signposting and should direct users to official sources and qualified professionals.

## Design and evidence policy

The product earns credibility through transparent sources, clear methods, useful interaction and honest limitations. Do not add fabricated testimonials, clients, partnerships, awards, user counts, proprietary-data claims or unverified performance statements. References to public institutions identify data publishers only and must never imply endorsement.
