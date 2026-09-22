# Data source and provenance policy

## Current public integration

The public Market Data interface uses **real Statistics Canada data**. It does not contain synthetic fallback values.

### Statistics Canada: Table 12-10-0174-01

- **WDS Product ID:** 12100174\n- **Catalogue/issue ID:** 1210017401
- **Table:** 12-10-0174-01
- **Title:** Merchandise imports and exports, customs-based, by free trade agreement and by commodity
- **Frequency:** monthly
- **Basis:** customs basis, not seasonally adjusted
- **Classification:** NAPCS section/division/group values exposed by Statistics Canada
- **Integration:** Statistics Canada Web Data Service (WDS)
- **Use in Tharros:** imports/exports for the CETA/EU agreement grouping, with selectable commodity groups derived from live cube metadata
- **Licence:** Statistics Canada Open Licence

Implementation: `src/lib/statcan.ts`.

The adapter calls `getCubeMetadata`, `getSeriesInfoFromCubePidCoord`, and `getDataFromCubePidCoordAndLatestNPeriods`. Coordinates are built from the publisher's dimension/member metadata rather than relying on undocumented hard-coded coordinates. Required semantic members must be positively identified; an unrecognized dimension is allowed to default only when it has exactly one active member. The WDS base PID is used for metadata/series calls; the public table view and DOI use the catalogue/issue identifier ending in `01`.

The table publishes values with scalar-factor metadata. The adapter applies `10 ** scalarFactorCode` before presenting Canadian-dollar values, and rejects a series whose datapoints mix scales or disagree with the series information, or whose unit is not dollars.

### Validation, quality flags and failure behaviour

- Every WDS response is checked at runtime: the `SUCCESS` envelope, product id, dimension positions, member ids and names, coordinate echo, vector id, monthly reference periods, finite values and the scalar factor. Any mismatch throws `StatcanDriftError`, and the page shows its explicit "no figures" state.
- Symbol codes (p, r), status codes (A to F, `..`, `...`, `0s`, `<LOD`) and suppression (`x`) are kept per observation. Flagged values are labelled; withheld months are listed as not published and never charted or summed.
- Table notes that apply to the table or to the selected members are shown beside the figures.
- Successful responses are cached for 6 hours (`src/lib/statcan-data.ts`); failures are never cached. A copy older than 24 hours means refreshes are failing, and it is labelled with its retrieval time.
- Fixture tests (`tests/statcan.test.ts`) run against recorded real responses and mutated copies (schema drift, missing dimensions, renamed or terminated members, invalid datapoints, flags, timeouts and HTTP errors). `npm run test:contract` checks the live service weekly in CI.

### Statistics Canada acknowledgement

Because the Tharros interface is a value-added product, every live result must retain a notice in the form required by the Statistics Canada Open Licence:

> Adapted from Statistics Canada, [product], [reference date]. This does not constitute an endorsement by Statistics Canada of this product.

Do not use Statistics Canada or Government of Canada logos/wordmarks.

## Currents Live Monitor

The `/live-monitor` page uses the Currents News API V2 Search endpoint as a current-news discovery layer. Currents is not treated as evidence that a surfaced claim is true; every result links to the original publisher URL returned by the API.

Implementation is split between `src/lib/currents.ts` (query construction, authentication, transport, runtime validation and parsing) and `src/lib/currents-data.ts` (Next.js caching and user-safe failure states). The page streams the data region behind `<Suspense>` so upstream latency cannot block the route shell.

The normal path issues one rolling seven-day Boolean search covering Canada, Europe and the monitor's trade, defence/security, energy/industry and strategic-technology terms. The request uses strict RFC3339 timestamps and `page_size=20`, which stays within the published free-tier result cap while remaining valid on higher plans. One page is fetched per cache refresh to keep quota use bounded. Results are then classified locally into the four Tharros research areas using article title, description and Currents category metadata. Tracking parameters are removed from publisher URLs before display.

Authentication uses the server-only `CURRENTS_API_KEY` environment variable and the HTTP Authorization header. The key must never be embedded in a URL, exposed through a `NEXT_PUBLIC_*` variable or committed to the repository. Successful responses are cached for 15 minutes. The adapter distinguishes missing configuration, rejected credentials, quota exhaustion, invalid requests, transient upstream errors and invalid response shapes. Transient network/5xx failures receive one bounded retry; authentication, quota and invalid-request failures do not.

Currents `published` is displayed as publication time. Future-dated records are discarded from the current snapshot. Article bodies are not copied and discovered headlines/descriptions are never represented as Tharros analysis or verification. The public interface retains Currents attribution and original-publisher links.

References:
- https://currentsapi.services/en/docs/search
- https://currentsapi.services/en/docs/authentication
- https://currentsapi.services/en/product/price
- https://currentsapi.services/terms

## Government of Canada Open Data

The Market Data page offers a collapsed, secondary "Find related federal datasets" panel that queries the official Open Government CKAN Action API (`package_search`) only when opened.

Implementation: `src/app/api/open-data/search/route.ts`.

Purpose: run a keyword discovery search of the federal catalogue and link users back to official records. Results are labelled as discovery leads, not automatically treated as evidence, and are not merged into Statistics Canada values.

The CKAN service supports GET requests; query parameters are placed in the request URL.

## Core research source register

`src/data/sources.ts` maintains public starting points for human research. It currently includes Canadian and European sources such as Statistics Canada, ISED, CBSA, CanadaBuys, Government of Canada Open Data, Eurostat, TED and Access2Markets.

A listing in the register means only that the source is a relevant public research route. It does **not** mean Tharros has integrated the source into the application or that the publisher endorses Tharros.

## Evidence rules

For any factual block, record as much of the following as the source supports:

1. publisher;
2. exact dataset, notice, filing, document or table;
3. stable source URL or identifier;
4. reference period;
5. publication/update date;
6. retrieval date when material;
7. licence or reuse terms;
8. classification and unit;
9. transformations performed by Tharros;
10. material limitations.

If values are transformed (for example, Statistics Canada's scalar-factor codes), document the transformation in code and tests.

## API failure rules

- Never replace unavailable official data with plausible demonstration values.
- Never silently change a requested classification, flow, commodity or country grouping.
- Return a clear unavailable/error state when a publisher or discovery provider cannot be reached; any degraded discovery fallback must be visibly labelled.
- Cache official responses only for a bounded period appropriate to the publisher's update frequency.
- Treat schema changes as failures until inspected.
- Do not call a value current/live unless the request path and retrieval time are observable.

## Future integrations

Good candidates include:

- Eurostat trade/industry APIs for a European-side comparison;
- CanadaBuys procurement open data;
- TED procurement search API;
- other Statistics Canada tables where the commercial question has a clearly defined official series;
- ISED public databases where access terms and machine-readable paths support reliable use.

Each future integration must be independently documented, tested and attributed. Do not scrape a source when an official API/download exists or when use terms make scraping inappropriate.
