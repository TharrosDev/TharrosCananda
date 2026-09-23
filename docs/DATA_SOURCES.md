# Data source and provenance policy

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
- Return a clear unavailable/error state when a publisher cannot be reached. Any fallback source requires an explicit provenance, rights and UI review.
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
