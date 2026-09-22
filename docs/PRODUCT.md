# Tharros Canada product brief

## Purpose

Tharros Canada is an independent commercial research and intelligence business focused on Canada–Europe questions. Commissioned human research is the commercial core. Public research and public-source data tools demonstrate research quality and make the methods inspectable.

## Primary user jobs

- enter or evaluate a market;
- identify buyers, distributors, partners or relevant organizations;
- understand competitors and observable positioning;
- track a sector, policy, procurement or industrial development;
- inspect public evidence before commissioning deeper work;
- commission a focused answer without a mandatory sales call.

## Public information architecture

1. **Services** — what can be commissioned.
2. **Expertise** — the four Canada–Europe subject areas.
3. **Research** — archive of real Tharros publications as they are released.
4. **Live Monitor** — current Canada–Europe reporting discovered through GDELT and linked to original publishers.
5. **Market Data** — live public-source evidence, currently Statistics Canada Canada–CETA trade data.
6. **About** — purpose, method, accountability and independence.
7. **Commission research** — progressive intake workflow.

## Commercial products

Defined only in `src/lib/services.ts`:

- Canada / Europe Market Scan
- Canadian Buyer Intelligence
- Competitor Intelligence
- Partner & Ecosystem Research
- Commissioned Research
- White-label Research

Indicative prices are visible in service detail, not used as the lead brand proposition. Canadian Buyer Intelligence is the flagship entry product with Core, Expanded and Comprehensive coverage tiers; higher tiers expand coverage rather than changing the research standard. Scope, price, exclusions and timing are confirmed in writing before work starts.

## Research archive

The archive is infrastructure for real work, not content theatre. It remains empty until research is genuinely published. A reusable `/research/[slug]` route renders complete structured publications as they are added.

Publication registry: `src/data/publications.ts`.

Archive capabilities:

- text search;
- expertise filtering;
- publication-format filtering;
- stable URLs;
- structured executive summary, findings, methodology, limitations and source records;
- optional tags/PDF metadata.

The research article template requires actual authorship, date, origin (independent or genuinely commissioned), executive summary, key findings, methodology, sources, limitations and a suggested citation. No placeholder publication may be represented as completed research.

## Live Monitor

The Live Monitor is an automated discovery surface, not a Tharros publication stream. The page shell renders immediately and the GDELT-backed panel streams behind `<Suspense>`, so a slow source cannot make navigation appear broken.

The monitor searches a rolling seven-day window across the four Tharros research areas. Results preserve original publisher links, publisher domain, source country, language and GDELT index time. Article bodies are not copied and automated summaries are not presented as Tharros findings.

Topic requests are cached for 15 minutes, retry transient upstream failures once and fail closed. If all topic-specific requests fail, one broader Canada–Europe discovery query may be shown with an explicit degraded-state notice; it never invents headlines.

## Market Data

The former synthetic Market Explorer has been retired.

The current interface exposes live Statistics Canada Table 12-10-0174-01 data through WDS and related Government of Canada dataset discovery through the Open Government CKAN API. It is deliberately narrow rather than pretending to answer arbitrary market questions.

The tool must always distinguish:

- official values supplied by publishers;
- transformations made by Tharros;
- descriptive interface copy;
- human interpretation.

It must never manufacture missing data.

## Core funnel

**Understand proposition → inspect service/expertise/evidence → evaluate methods → commission research.**

Public research becomes an additional proof route as the archive grows.

## Deferred capabilities

Do not build until justified by real demand:

- accounts or subscriptions;
- SaaS billing;
- CRM/admin suite;
- AI chat;
- proprietary-data claims;
- automated legal/customs determinations;
- large data warehouse;
- automated report generation;
- fake case studies, testimonials or team scale.

## Accessibility and performance

Target WCAG 2.2 AA. Keep HTML equivalents for data graphics, keyboard access, visible focus, reduced motion, good target sizing and responsive layouts.

Performance targets remain LCP ≤ 2.5 s, INP ≤ 200 ms and CLS ≤ 0.1 where practical. External source API calls use explicit timeouts and bounded caching, and live interfaces must stream or otherwise keep upstream latency from blocking page navigation.


## Browser quality

Core responsive and interaction paths are exercised with Playwright/Chromium and automated axe checks. Visual-regression specs are tagged separately so baselines are reviewed rather than silently rewritten.
