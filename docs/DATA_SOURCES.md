# Data source and provenance policy

## Current public integration

The public Market Data interface uses **real Statistics Canada data**. It does not contain synthetic fallback values.

### Statistics Canada — Table 12-10-0174-01

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

The table publishes values with scalar-factor metadata. The adapter applies `10 ** scalarFactorCode` before presenting Canadian-dollar values.

### Statistics Canada acknowledgement

Because the Tharros interface is a value-added product, every live result must retain a notice in the form required by the Statistics Canada Open Licence:

> Adapted from Statistics Canada, [product], [reference date]. This does not constitute an endorsement by Statistics Canada of this product.

Do not use Statistics Canada or Government of Canada logos/wordmarks.

## Government of Canada Open Data

The Market Data page also queries the official Open Government CKAN Action API using `package_search`.

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
- Return a clear unavailable/error state when the publisher cannot be reached.
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
