# Tharros Canada: Version 1 Product Brief

## Target user

Businesses and organizations operating across the Canada–Europe relationship: European companies assessing Canada, Canadian companies assessing Europe, and organizations that need sourced intelligence on trade, defence-industrial links, energy and critical minerals, supply chains, industrial policy or technology. They need focused, sourced answers to support a commercial or strategic decision.

Tharros Canada researches commercial, economic, industrial, technological and strategic developments connecting Canada and Europe, while providing commissioned research and commercial intelligence to businesses and organizations operating across that relationship.

Four research areas organize the work: Trade & Economic Integration; Defence & Security; Energy, Resources & Industry; Technology & Strategic Industries (defined once in `src/lib/research-areas.ts`).

## Jobs to be done

- Commission focused research on a commercially relevant Canada–Europe question.
- Read independent Tharros research to judge its quality before commissioning.

- Understand whether measurable Canadian trade activity exists for a product or classification.
- See where commercial activity may be concentrated and which route to market could fit.
- Identify relevant Canadian buyers, importers, distributors, retailers or partners.
- Understand competitors and observable positioning in Canada.
- Find official resources for tariff, tax, customs and market-access questions.
- Purchase focused research without sitting through a sales call.

## Core funnel

1. **Explore:** read the research areas, independent research or the sample data view without an account.
2. **Understand:** inspect sources, dates, methods and limitations.
3. **Decide:** choose whether the evidence is sufficient or a human-verified question remains.
4. **Request:** submit a concise brief and receive a written scope, price and timeline.

## Product layers

### Layer 1 — Free self-service

Tharros Market Explorer. In Version 1 it is a sample-mode demonstration: two synthetic scenarios behind a `MarketDataProvider` boundary, with provenance and limitations shown. It does not search Canadian data; a product that is not a sample becomes a prefilled research request. Real official-data integration comes only after research requests show which data actually matters.

### Layer 2 — Low-touch intelligence

Tharros Market Snapshot. A possible future structured output (internal working range C$29–99). It is not sold, shown or implemented in Version 1.

### Layer 3 — Human-verified research

Manually scoped work that adds verification, context and judgment:

- Canada Market Scan: indicative C$250–400.
- Buyer & Distributor Intelligence: indicative C$300–750.
- Competitor Intelligence: indicative C$300–600.
- Commissioned Research: any other Canada–Europe question, quoted per scope.

Prices are indicative and defined in `src/lib/services.ts`. Scope, price and timeline are confirmed in writing before work starts. Internally these ranges are still being tested against real requests; that is not customer-facing language.

## Research standards

Every material factual block should identify the publisher, dataset, URL, period, update/retrieval date, licence and limitations. Automated information and human interpretation must remain distinguishable. Inference must not be presented as fact.

## Measures of learning

- Market Explorer starts and completed demo queries.
- Which demo/product questions visitors attempt.
- Research service views.
- Research-request starts and submissions.
- Selected research need and Canadian objective.
- Recurring data or source requests that justify the next integration.

## Future roadmap

1. Validate research-service demand through human research and refine scope/pricing.
2. Once requests show which data matters, add one licensed, maintained official-data adapter behind `MarketDataProvider`.
3. Only then consider source-health monitoring and freshness displays.
4. Prototype a generated Market Snapshot only after repeatable inputs are proven.
5. Accounts, subscriptions, CRM, admin systems and report infrastructure stay deferred until manual volume warrants them.

## Intentionally excluded from Version 1

Accounts, subscriptions, full SaaS billing, complex authentication, AI chat, a proprietary data warehouse, CRM, automated legal/customs analysis, report-generation infrastructure, marketplace integrations and a large admin system.
