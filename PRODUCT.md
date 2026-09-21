# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: current stable Next.js with the App Router, React, TypeScript, and a maintainable CSS system. The implementation should remain deployable on a conventional Node-compatible host; no specific deployment provider is confirmed.

## Users

The primary users are businesses and organizations operating across the Canada–Europe relationship: European companies evaluating Canada, Canadian companies evaluating Europe, and organizations needing sourced intelligence on trade, defence-industrial links, energy and critical minerals, supply chains, industrial policy and technology.

Secondary evaluators include mentors, incubators, employers, and potential commercial partners assessing the quality and credibility of the venture.

## Product Purpose

Tharros Canada researches commercial, economic, industrial, technological and strategic developments connecting Canada and Europe, while providing commissioned research and commercial intelligence to businesses and organizations operating across that relationship. The site must establish the subjects Tharros researches, the four research areas, examples of commissioned services, independent research, and a clear path to commission custom research asynchronously.

Success means visitors understand the scope quickly, read the research, and submit qualified commissions. The product is deliberately designed to learn which services and data users value before heavier infrastructure is built.

## Positioning

Tharros Canada is an independent commercial research and intelligence company focused on Canada–Europe relations. It is not a consultancy, think tank, blog or government body, and it does not provide legal, tax, regulatory, lobbying or investment advice. Its credibility comes from source traceability, clear methodology, useful tools, professional presentation, and honest limitations—not implied scale or invented social proof.

## Operating Context

The visitor journey is Understand the scope → Read the research → Commission focused research. Users should be able to research independently without creating an account or booking a call. Human involvement becomes available where commercial judgment, verification, and contextual research are valuable.

The business has two public layers: independent research published by Tharros (Intelligence Briefs, Research Reports, Market Notes, Data Notes, Sector Analyses) and commissioned research (standard market-entry products plus custom commissions). A sample data view demonstrates presentation standards.

## Capabilities and Constraints

- Version 1 includes Home, Market Explorer, Research Services, How It Works, About, Request Research, and Sources / Methodology.
- The Market Explorer accepts a product description or HS code and optional country, then presents a clearly labelled demonstration result behind a replaceable data-adapter boundary.
- Demonstration values must never be presented as current Canadian statistics. Real factual modules require publisher, dataset, URL, period, last-updated or retrieved date, licence, and limitations where applicable.
- The research request is a short progressive workflow with useful validation and a clear explanation of what happens after submission.
- Research products are Canada Market Scan, Buyer & Distributor Intelligence, and Competitor Intelligence. Prices shown are indicative (see `src/lib/services.ts`); scope, price and timeline are confirmed in writing before work starts.
- The site supports e-commerce, marketplace, wholesale, retail, distribution, and direct B2B scenarios, with informational signposting rather than automated legal, tax, customs, or regulatory advice.
- No accounts, billing, complex authentication, CRM, chatbot, proprietary-data claims, automated legal/customs analysis, large database, or admin system in Version 1.
- Privacy-conscious analytics must be separated from application logic and limited to meaningful funnel events.
- Performance targets are LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1 where practical.

## Brand Commitments

The name is Tharros Canada and the core proposition is “Understand the Canadian market before you enter it.” The voice is objective, concrete, concise, and research-oriented. The identity should feel confident, analytical, Canadian, precise, premium, institutional, modern, and international, with only restrained Canadian cues. It must not resemble a lifestyle startup, generic agency, crypto product, government portal, or experimental portfolio.

Visual commitments from the brief include warm off-white, deep ink or navy, slate neutrals, muted data colours, a restrained Canadian red accent, strong modern sans-serif typography, low visual complexity, clear hierarchy, and data visible early. Red is a signal, not a dominant field.

## Evidence on Hand

There are no confirmed customers, testimonials, case studies, partnerships, awards, proprietary datasets, user counts, or performance claims. Future work must not fabricate them. Version 1 may reference official Canadian publishers only as public data sources and must state that data remains the property of its respective publishers; no endorsement or partnership is implied.

## Product Principles

- Prove value through inspectable product interactions and source evidence rather than promotional claims.
- Reduce uncertainty by showing outputs, methods, pricing ranges, boundaries, and next steps.
- Make useful self-service exploration available before any sales interaction.
- Preserve provenance as a first-class part of the data model and interface.
- Stay technically lean so the venture can evolve from real demand rather than early assumptions.

## Accessibility & Inclusion

Target WCAG 2.2 AA with semantic structure, keyboard access, visible focus states, sufficient contrast, labelled controls, useful errors, reduced-motion support, accessible chart equivalents, appropriate target sizes, responsive zoom and text scaling, and deliberate mobile layouts.
