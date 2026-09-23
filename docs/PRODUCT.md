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
4. **Methodology** — source selection, verification, freshness and limitations.
5. **About** — purpose, method, accountability and independence.
6. **Commission research** — progressive intake workflow.

## Commercial products

Defined only in `src/lib/services.ts`:

- Custom & Partner Research (flagship)
- Market Assessment
- Buyer & Partner Research

No prices are published. Every engagement is scoped and priced per case, in writing, before work starts.

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
