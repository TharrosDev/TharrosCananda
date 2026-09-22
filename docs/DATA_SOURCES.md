# Data source and provenance policy

## Current public integration: Currents Live Monitor

The `/live-monitor` page uses the Currents News API V2 Search endpoint as a current-news discovery layer. Currents is not treated as evidence that a surfaced claim is true; every result links to the original publisher URL returned by the API.

Implementation is split between `src/lib/currents.ts` (query construction, authentication, transport, runtime validation and parsing) and `src/lib/currents-data.ts` (Next.js caching and user-safe failure states). The page streams the data region behind `<Suspense>` so upstream latency cannot block the route shell.

The normal path issues one rolling seven-day Boolean search covering Canada, Europe and the monitor's trade, defence/security, energy/industry and strategic-technology terms. The request uses strict RFC3339 timestamps and `page_size=20`, which stays within the published free-tier result cap while remaining valid on higher plans. One page is fetched per cache refresh to keep quota use bounded. Results are then classified locally into the four Tharros research areas using bounded article title, description and Currents category metadata. Tracking parameters are removed and remaining query parameters are normalized before display.

Authentication uses the server-only `CURRENTS_API_KEY` environment variable and the HTTP Authorization header. The key must never be embedded in a URL, exposed through a `NEXT_PUBLIC_*` variable or committed to the repository. Successful responses are cached for 15 minutes. The adapter distinguishes missing configuration, rejected credentials, quota exhaustion, invalid requests, transient upstream errors, oversized payloads and invalid response shapes. Transient network/5xx failures receive one bounded retry; authentication, quota and invalid-request failures do not.

Currents `published` is displayed as publication time. Records outside the requested seven-day window are discarded from the current snapshot. A valid empty provider response, a visitor-filtered empty view and a provider failure have distinct UI states. Article bodies are not copied and discovered headlines/descriptions are never represented as Tharros analysis or verification. The public interface retains Currents attribution and original-publisher links.

References:

- https://currentsapi.services/en/docs/search
- https://currentsapi.services/en/docs/authentication
- https://currentsapi.services/en/product/price
- https://currentsapi.services/terms

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

If values are transformed, document the transformation in code and tests.

## API failure rules

- Never replace unavailable official data with plausible demonstration values.
- Never silently change a requested classification, topic or time window.
- Return a clear unavailable/error state when a publisher or discovery provider cannot be reached. Live Monitor currently has no degraded or secondary-provider fallback; adding one requires an explicit provenance, rights and UI review.
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
