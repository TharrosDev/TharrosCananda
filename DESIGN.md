---
name: Tharros Canada
description: Canada–Europe commercial intelligence presented as an evidence ledger.
colors:
  ivory: "#f4f1ea"
  ivory-deep: "#ebe6db"
  ivory-light: "#faf8f3"
  ink: "#1c1d1f"
  ink-soft: "#45484d"
  slate: "#5d6166"
  soft-black: "#161719"
  graphite: "#232528"
  on-dark: "#ece8df"
  on-dark-soft: "#aeaba3"
  red: "#9e3a35"
  red-dark: "#7f2c28"
  steel: "#46677f"
  green: "#4f6e58"
  error: "#8a312d"
  focus: "#2f6fae"
typography:
  display: "Source Serif 4 Variable, Georgia, serif"
  body: "Schibsted Grotesk Variable, Helvetica Neue, Arial, sans-serif"
spacing:
  page: "clamp(64px, 7vw, 104px)"
  section: "clamp(52px, 5.5vw, 80px)"
  block: "clamp(32px, 4vw, 56px)"
  readingMeasure: "64ch"
---

# Design System: Tharros Canada

## North star — The Evidence Ledger

The interface should feel like a rigorous commercial-research publication whose evidence can be inspected. Warm ivory carries graphite ink; dark chapter bands create hierarchy; muted Canadian red marks actions; steel carries quantitative series. The system should not look like a government portal, generic consultancy, startup dashboard or experimental portfolio.

The visual material is **research itself**: source registers, live charts, archival metadata, tables, procurement/document references and report artifacts as real work is produced. Do not fill empty space with generic stock photography or decorative charts.

## Core rules

### Evidence before ornament

A visually prominent data point must identify its source context. Real publisher data may be transformed for display only when the transformation is documented. If the source fails, show failure—not synthetic replacement values.

### Red means act

Red is used for primary actions and interactive selection, not for decorative headings or data series. The wordmark slash is the sole standing brand-mark exception.

### One rule per boundary

Lists and registers use strong opening rules and quiet row dividers. Avoid boxed cards, shadows, pills and unnecessary surface nesting.

### Square geometry

Buttons, fields, registers and data panels remain square. Radio controls may remain circular because their shape communicates function.

### Controlled reading width

Long prose is normally capped around 64ch. Large interpretive copy can use approximately 44ch. Do not stretch paragraphs merely to fill the 12-column shell.

## Typography

**Source Serif 4** is the editorial voice: page titles, section headings, report titles and interpretive statements.

**Schibsted Grotesk** is the operating voice: navigation, prose, controls, metadata and tabular readouts.

- Home hero: clamp(50px, 6vw, 88px)
- Standard dark hero: clamp(44px, 4.8vw, 72px)
- Compact task hero: clamp(42px, 4.2vw, 64px)
- Light document hero: standard display scale on ivory
- Body: 18px / 1.6; 17px on small screens
- Field labels: compact sans, uppercase only where the label names a datum

## Hero hierarchy

There are four purposeful hero modes.

### Home

The strongest brand moment. Dark full-bleed surface, large proposition and action-led index.

### Standard

For major commercial pages where a dark chapter opening is useful.

### Task

Compact dark hero for a working interface such as Market Data or Commission Research. The task should begin quickly below it.

### Document

Light ivory editorial header for Expertise, Research Archive, About, Methodology, How It Works, Privacy and Accessibility. These pages should read like documents rather than repeated marketing landings.

## Primary navigation

Desktop order:

**Services · Expertise · Research · Market Data · About**

Primary action:

**Commission research**

The navigation tightens before collapsing. Around 1020px it becomes a labelled **Menu** control rather than an icon-only hamburger.

Use the same destination name everywhere. In particular, do not call Market Data “Data” in one surface and “Market Explorer” in another.

## Homepage architecture

1. Brand proposition and Commission Research
2. Decision-oriented client questions
3. Canada–Europe expertise
4. Live official-data proof
5. Commissioned services
6. Research archive / methodology links
7. Final commission CTA

The homepage proves the operation with live source material. It must not pretend unfinished research is already published.

## Research archive

The archive is a permanent structure for real work.

When empty, it states the absence once, calmly, and shows the publication formats without defensive anti-fabrication copy.

When populated, it supports:

- search;
- expertise-area filter;
- publication-type filter;
- publication date/type metadata;
- tags;
- stable report/article links.

A real report page should eventually include verified authorship, date, executive summary, key findings, charts/tables, methodology, sources, limitations, related research and a commission CTA.

## Official Market Data

The public data interface currently uses Statistics Canada Table 12-10-0174-01 through WDS.

Visual hierarchy:

1. publisher/data-status line;
2. trade-flow and NAPCS commodity controls;
3. latest value / annual change / CETA grouping;
4. accessible time-series chart;
5. source/provenance record;
6. limitations;
7. related Government of Canada dataset discovery.

Statistics Canada attribution must remain visible. No government logos may be used.

Charts use steel. Green may communicate a positive change/state, but never imply that an increase is commercially “good.”

## Expertise

Each of the four expertise areas should combine:

- concise scope;
- evidence types commonly examined;
- example questions;
- commission route.

As real work is produced, evidence artifacts may be added to make areas visually distinctive, but never invent a chart/map/project solely for decoration.

## Services

Pricing is secondary product information, not hero-level positioning. Lead with the decision/question the work answers and explain the outputs and exclusions. Canadian Buyer Intelligence is the flagship entry product; higher tiers increase coverage, not research quality.

## About

About explains the focus, method, research accountability and independence. It must not invent founder/team profiles. Add verified people only when accurate public biographical information is approved.

Privacy and Accessibility remain separate utility pages.

## Motion

The chart registration is the only authored data motion. Hover transitions may move arrows/underlines. Avoid scroll-triggered reveals and ornamental motion. All motion must collapse under `prefers-reduced-motion`.

## Responsive rules

- Wide/desktop: 12-column shell
- Compact desktop: navigation compresses, service grids can drop from four to two columns
- Around 1020px: primary navigation collapses
- At 980px: major split layouts stack; hero indexes may become two-column registers
- At 640px: indexes, controls and KPI rows become single-column
- At 420px: footer becomes one column

No page should require horizontal scrolling at an equivalent 320 CSS px viewport.

## Do

- Use real source metadata as visual content.
- Preserve explicit source periods, retrieval context and limitations.
- Keep the research archive honest when empty.
- Make data interfaces readable without charts through semantic text/table equivalents.
- Keep Commission Research visible but not repeated excessively.
- Maintain strong focus states and keyboard navigation.

## Do not

- Add fabricated reports, clients, partners, awards, experts or testimonials.
- Reintroduce synthetic market figures as a fallback for unavailable official data.
- Add stock photography merely to make pages feel “full.”
- Use government logos or visual marks in a way that suggests affiliation.
- Create decorative dashboard cards.
- Use large dark heroes on every page.
- Let pricing dominate the first impression of the business.


## Density and rules

Use three pacing modes rather than applying one section rhythm everywhere:

- **Compact** for archives, supporting evidence and secondary editorial sections.
- **Standard** for normal commercial and expertise content.
- **Feature** only for major brand transitions.

Horizontal rules should communicate actual structure. If proximity and whitespace already establish a relationship, do not add another rule. The 12-column construction grid may be exposed as texture only in the homepage hero; elsewhere it should remain invisible.
