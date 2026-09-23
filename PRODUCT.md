# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web.

## Users

Businesses and organizations working across the Canada–Europe relationship. That includes European companies assessing Canada, Canadian companies assessing Europe, and partner firms that need research capacity behind their own client work.

What they come to do:
- enter or evaluate a market
- find buyers, distributors or partners
- understand competitors
- track a sector, policy or industrial development
- check the evidence before commissioning
- commission a focused answer without a mandatory sales call

## Product purpose

Tharros Canada is an independent commercial research business, and commissioned human research is its commercial core. The site makes it easy to see what Tharros can research, to inspect its source discipline and published work, and to commission a scoped answer asynchronously.

## Positioning

Tharros is not a government body, think tank, legal or regulatory adviser, or generic consultancy. Its credibility comes from sources a reader can inspect, explicit limitations and real published work. The site never implies scale, clients, team members, partnerships or findings that are not verified.

## Current public surfaces

- Home
- Services
- Research archive and report pages
- Methodology
- How It Works
- About
- Commission Research
- Privacy, Accessibility and Copyright (public research is licensed CC BY 4.0)

## Commercial products

Three services are defined in `src/lib/services.ts`:
- **Custom & Partner Research** (the flagship): a client-defined Canada–Europe question, or research capacity behind a partner firm's client work.
- **Market Assessment**
- **Buyer & Partner Research**

No prices are published. Every engagement is scoped and priced per case, in writing, before work starts.

## Evidence commitments

- Publisher, source, reference period, licence and limitations stay visible wherever data or research is shown.
- When a source is unavailable, the site shows that it is unavailable rather than plausible substitute values.
- Naming a public institution identifies a source only and never implies endorsement.
- The archive holds real work only. The example report is labelled as a specimen.

## Brand

Warm ivory, graphite and soft black, slate, a muted Canadian red for actions, steel for data, and green for positive states. Source Serif 4 is the editorial voice and Schibsted Grotesk the interface and data voice. The site should read like a rigorous research publication, not a startup dashboard or a consultancy template. `DESIGN.md` has the details.

## Product principles

- Start with the client's decision, then the subject area.
- Use research and data as the visual material.
- The five research areas are a homepage summary and archive taxonomy, not destinations:
  - Trade & Economic Integration
  - Defence & Security
  - Energy, Resources & Industry
  - Technology & Strategic Industries
- Prefer a narrow real capability over a broad simulated one.
- Keep commissioning possible without an account or a call.
- Let demand justify new capability. Accounts, billing, CRM, AI chat and automated report generation have not been built because nothing needs them yet, not because they are ruled out.

## Quality targets

- **Accessibility:** WCAG 2.2 AA. That means semantic structure, keyboard access, visible focus, contrast, labelled controls, error recovery, reduced motion, HTML equivalents for graphics, and mobile layouts designed on purpose.
- **Core Web Vitals:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- **Browser tests:** Playwright covers responsive layout, the commissioning journey, axe checks and visual regression.
