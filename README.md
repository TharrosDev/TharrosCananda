# Tharros Canada

Tharros Canada researches commercial, economic, industrial, technological and strategic developments connecting Canada and Europe, while providing commissioned research and commercial intelligence to businesses and organizations operating across that relationship.

Four research areas organize the work: Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; Technology & Strategic Industries (defined once in `src/lib/research-areas.ts`). Commissioned human research is the commercial core; Canada market entry (market scan, buyer and distributor intelligence, competitor intelligence) is one major use case alongside custom commissioned research. Tharros also publishes independent research, labelled "Independent research by Tharros Canada" and never presented as commissioned.

The production domain is intended to be [tharros.ca](https://tharros.ca).

## Version 1 scope

- A five-section homepage: identity, the four research areas, commissioned research (example subjects plus the four products), independent research, and a commission call to action.
- `/research`: the independent-research index. Publication types and entries live in `src/data/publications.ts`; the list is empty until the first piece ships and the page shows an honest in-preparation state.
- `/research-areas`: one page with an anchored section per area, each with example questions and a prefilled commission link.
- Navigation: Research · Research Areas · Services · Data · About, with Commission research as the single filled action.
- A **sample-mode** Market Explorer (nav label "Data", no longer on the homepage): two synthetic scenarios behind a `MarketDataProvider` boundary, with sources, provenance and limitations shown. It is not a self-service search over Canadian data; unmatched products are carried into a research request.
- Commissioned-research services (Canada Market Scan, Buyer & Distributor Intelligence, Competitor Intelligence with their existing indicative prices, plus Commissioned Research quoted per scope), defined once in `src/lib/services.ts`; service links preselect the matching need in the request form.
- A progressive, asynchronous research-request workflow with strict server-side validation, a honeypot and an optional email fallback.
- A cross-border route-questions checklist (channel-driven only; no product- or country-specific determinations).
- Dedicated Sources & Methodology, How It Works and About pages.
- Sitemap, robots, canonical metadata, a generated Open Graph image, an SVG icon and factual organization data.
- CI (`.github/workflows/ci.yml`): `npm ci`, lint, typecheck, tests and build on pull requests and pushes to `main`.
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
npm ci
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
| `RESEARCH_INTAKE_WEBHOOK_URL` | Required for live intake | **Server-only secret.** HTTPS endpoint that receives validated request JSON. Non-https values are treated as unset. |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Optional | Same-origin or trusted endpoint for minimal business-event beacons. No events are sent when empty or when Global Privacy Control is enabled. |
| `NEXT_PUBLIC_RESEARCH_EMAIL` | Recommended | Verified public contact address. When set it appears on About/Request pages and in JSON-LD, and the form offers a prefilled email if online delivery fails. Inlined at build time. The site never invents one. |

Without a valid webhook the API logs the problem server-side and returns a generic delivery error; the visitor keeps their answers and (if configured) gets the email fallback. It never shows a false success.

## Architecture

```text
src/
  app/                 Routes, metadata, sitemap, robots and the intake API
  components/          Shared site, explorer, chart and workflow components
  data/                Demo adapter records and source registry
  lib/                 Services (single source of truth), request parsing/prefill, formatting, analytics, contact
  types/               Provider contract and provenance-aware market types
docs/
  PRODUCT.md           Product model, funnel and roadmap
  DATA_SOURCES.md      Integration and provenance policy
  PRE_LAUNCH.md        Open operational and legal items
```

### Market Explorer data boundary

`src/types/market.ts` defines the contract: `MarketDataProvider` (`listSamples()`, async `search()` returning a `found` / `not-found` / `error` outcome) and `MarketResult`. A result has a `status` (`demo` | `live`), evidence blocks (`trend`, `provinces`, `routes`, `resources`) that each reference one or more `sourceIds` and may carry their own `limitations`, a `sources` list and result-level limitations. `src/data/demo-markets.ts` exports `demoProvider`, the only implementation today. `MarketExplorer` selects the provider in one line; a Statistics Canada or ISED adapter implementing the same contract replaces it.

Each `SourceMetadata` record holds:

- publisher;
- dataset;
- URL;
- period;
- `lastUpdated` / `retrievedAt` as ISO dates, or `null` when not applicable (formatted in the UI by `src/lib/format.ts`);
- licence;
- limitations/notes.

### Demo versus live data

The sample numbers are synthetic and labelled in the interface. They demonstrate trend, province and route-to-market output structures. They are not current Canadian statistics and must not be reused as evidence.

Before a source is integrated, verify its API or download path, terms, attribution, update frequency, classification coverage and known limitations. See [docs/DATA_SOURCES.md](docs/DATA_SOURCES.md).

### Research intake

`parseResearchRequest` (`src/lib/research-request.ts`) is the runtime parser for untrusted input: it checks primitive types, whitelists research needs and objectives, validates email, optional website and HS code, enforces per-field maximum lengths, requires `consent === true`, trims strings and drops unknown keys. The route also rejects bodies over 16 KB and silently discards submissions that fill the hidden honeypot field. Valid requests are forwarded to the https webhook with an eight-second timeout.

There is deliberately **no in-memory rate limiting**: it would give false security on serverless instances. Rate limiting and authentication belong at the platform (e.g. a firewall rule on `/api/research-request`) or the receiving endpoint. See [docs/PRE_LAUNCH.md](docs/PRE_LAUNCH.md).

URL prefill is explicit: `/request-research?service=<slug>&product=&hs=&context=` (built with `requestResearchHref`, read with `prefillFromSearchParams`).

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
5. Confirm HTTPS and the headers set in `next.config.ts` (HSTS, `X-Frame-Options: DENY`, `nosniff`, referrer and permissions policies; no CSP yet), sitemap and robots output.
6. Run accessibility and performance checks against the deployed environment.

The code does not assume Vercel. Any host supporting the current stable Next.js runtime and server route handlers is suitable.

## Commercial boundaries

Tharros provides commercial research, market intelligence, data aggregation, buyer research, competitor research and public-source analysis. It does not provide legal, tax, customs brokerage, regulated financial, immigration or formal regulatory-compliance advice. Automated outputs are informational signposting and should direct users to official sources and qualified professionals.

## Design and evidence policy

The product earns credibility through transparent sources, clear methods, useful interaction and honest limitations. Do not add fabricated testimonials, clients, partnerships, awards, user counts, proprietary-data claims or unverified performance statements. References to public institutions identify data publishers only and must never imply endorsement.
