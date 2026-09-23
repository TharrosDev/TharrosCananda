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

## Live data

The site currently has no live data integrations; earlier StatCan and news feeds were removed. If one is added:

- Show an unavailable state when the publisher can't be reached; never substitute plausible values.
- Never silently change the requested classification, topic or time window.
- Cache only for a period that matches the publisher's update cadence, and don't cache error responses.
- Treat schema changes as failures until inspected.
- Call a value current only when the retrieval time is observable.
- Prefer official APIs or downloads over scraping, and respect terms of use.

Candidates: Eurostat trade and industry, CanadaBuys and TED procurement data, and further Statistics Canada tables with a clearly defined series.
