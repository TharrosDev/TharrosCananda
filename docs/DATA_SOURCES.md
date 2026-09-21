# Data source and provenance policy

## Current state

The public Market Explorer uses **synthetic sample data only** (`src/data/demo-markets.ts`, `status: "demo"`). No official source is queried by the site. The publishers below are what human research draws on and the candidates for a first adapter.

## Adapter contract

A new source is added by implementing `MarketDataProvider` from `src/types/market.ts` and selecting it in `src/components/market-explorer.tsx`:

- return `status: "live"` results only when the retrieval path and freshness are observable;
- list every publisher used in `sources` (with ISO `lastUpdated` / `retrievedAt`) and reference them from each evidence block's `sourceIds`;
- attach block-level `limitations` where a caveat applies to one metric only;
- return `{ kind: "not-found" }` for unsupported products and `{ kind: "error", message }` for retrieval failures, never a fabricated fallback.

## Initial integration candidates

### Statistics Canada Web Data Service

- **Use:** aggregate time series and metadata.
- **Official entry point:** https://www.statcan.gc.ca/en/developers/wds
- **Integration note:** identify the exact Product ID, coordinates/vectors, unit, scalar factor and revision behavior before publishing a metric.

### Canadian Importers Database (ISED)

- **Use:** importer indicators by product, city or origin country.
- **Official entry point:** https://ised-isde.canada.ca/site/ised/en/research-and-business-intelligence/canadian-importers-database
- **Integration note:** records can include customs brokers, clients and non-resident importers. “Major” has a publisher-defined threshold and must be explained.

### Canada Border Services Agency

- **Use:** tariff classification and commercial importer signposting.
- **Official entry point:** https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html
- **Integration note:** automated signposting is not a tariff ruling or customs opinion.

### Government of Canada Open Data

- **Use:** discover licensed federal datasets and machine-readable resources.
- **Licence:** https://open.canada.ca/en/open-government-licence-canada
- **Integration note:** retain required attribution and never imply official status or endorsement.

## Pre-integration checklist

For each dataset:

1. Verify the official API/download route and acceptable use.
2. Record the licence and exact attribution requirement.
3. Document update frequency, publication lag and revision behavior.
4. Confirm classification scope, units, geography and suppressed data rules.
5. Define retry, timeout, cache and stale-data behavior.
6. Capture publisher, dataset, URL, period, `lastUpdated`, `retrievedAt`, licence and notes in the adapter output.
7. Add a human-readable limitation next to the metric.
8. Test an inaccessible source, a stale source and a changed schema before launch.

## Prohibited shortcuts

- Do not scrape a source when terms, robots policy or an official alternative make the use inappropriate.
- Do not call a value “live” unless the request path and freshness are observable.
- Do not merge distinct classifications without recording the concordance.
- Do not publish importer or company lists without relevance checks and source evidence.
- Do not use public-source names or marks in a way that implies endorsement.
