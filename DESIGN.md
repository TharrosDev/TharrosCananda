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
  atlas-black: "#191b1d"
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

- Home hero: clamp(58px, 7.5vw, 116px), tightening to the mobile display scale below 700px
- Standard dark hero: clamp(44px, 4.8vw, 72px)
- Compact task hero: clamp(42px, 4.2vw, 64px)
- Light document hero: standard display scale on ivory
- Body: 18px / 1.6; 17px on small screens
- Field labels: compact sans, uppercase only where the label names a datum
- Context labels: compact sans, uppercase, used sparingly to identify the operating context of statement-scale page openings

## Hero hierarchy

There are four purposeful hero modes.

### Home

The strongest brand moment. Dark full-bleed surface, large proposition and action-led index.

### Standard

For major commercial pages where a dark chapter opening is useful.

### Task

Compact dark hero for a working interface such as Market Data or Commission Research. The task should begin quickly below it.

### Document

Light ivory editorial header for Research Archive, Methodology, How It Works, Privacy and Accessibility. These pages should read like documents rather than repeated marketing landings. About uses its own restrained statement composition; Commission Research uses a task-led scope desk.

## Primary navigation

Desktop order:

**Services · Research · Live Monitor · Market Data · About**

Primary action:

**Commission research**

The navigation tightens before collapsing. Around 1020px it becomes a labelled **Menu** control rather than an icon-only hamburger.

Use the same destination name everywhere. In particular, do not call Market Data “Data” in one surface and “Market Explorer” in another.

## Homepage architecture

1. Evidence-atlas first viewport, brand proposition and Commission Research
2. Statement-scale, decision-oriented client questions
3. Four-area Canada–Europe research summary
4. Live official-data proof
5. Commissioned services
6. Research archive / methodology links
7. Final commission CTA

The homepage uses the evidence route between Canada and Europe as its opening visual material, then alternates large editorial statements with working registers. It proves the operation with live source material and must not pretend unfinished research is already published.

## Research archive

The archive is a permanent structure for real work.

When empty, it states the absence once, calmly, and shows the publication formats without defensive anti-fabrication copy.

When populated, it supports:

- search across titles, summaries and tags;
- research-area filter;
- publication-type filter;
- publication-date filter and date/type metadata;
- tags;
- stable report/article links.

The planned formats are Intelligence Brief, Research Report, Market Note, Data Note and Sector Analysis. The four research areas are archive taxonomy and a homepage summary, not a dedicated public route.

A real report page should eventually include verified authorship, date, executive summary, key findings, charts/tables, methodology, sources, limitations, related research and a commission CTA.

## Live Monitor

Live Monitor is a working editorial discovery surface, not a dashboard and not a Tharros publication feed. It should visually belong to the same ruled evidence-led system as Research and Market Data.

Visual hierarchy:

1. compact task hero with the four research areas;
2. brief provenance/interpretation boundary;
3. streamed loading state that clearly communicates an external-source lookup;
4. source status and retrieval time;
5. search, research-area and time-window controls;
6. ruled publisher-linked article entries;
7. explicit unavailable state when Currents cannot return usable coverage.

Currents attribution must remain visible and usable as a link. Original publisher links and publication times remain part of each record. Do not visually imply that inclusion means verification, endorsement or a Tharros finding.

The loading state may use restrained motion to communicate retrieval, but it must collapse under `prefers-reduced-motion`. Failure states must replace the live-results region rather than populate it with substitute headlines.

## Official Market Data

The public data interface currently uses Statistics Canada Table 12-10-0174-01 through WDS.

Visual hierarchy:

1. task framing, official-source status and a three-step use guide;
2. trade-flow and NAPCS commodity controls;
3. latest value / annual change / CETA grouping;
4. accessible time-series chart;
5. source/provenance record;
6. limitations and an explicit interpretation boundary;
7. related Government of Canada dataset discovery.

Statistics Canada attribution must remain visible. No government logos may be used.

Charts use steel. Green may communicate a positive change/state, but never imply that an increase is commercially “good.”

## Research areas

The four research areas remain a durable classification system for the homepage and Research archive. They do not require a standalone page. Their public expression is limited to:

- a concise scope in the homepage ledger;
- area metadata on real publications;
- a clear archive filter;
- links into relevant commissioned services where useful.

As real work is produced, evidence artifacts may be added to make areas visually distinctive, but never invent a chart, map or project solely for decoration.

## Services

Pricing is secondary product information, not hero-level positioning. Lead with the decision/question the work answers and explain the outputs and exclusions. Canadian Buyer Intelligence is the flagship entry product; higher tiers increase coverage, not research quality.

## About

About uses a spacious Canada–Europe relationship statement, an operating-principles ledger and a clear independence boundary to explain focus, method and research accountability. It must not invent founder/team profiles. Add verified people only when accurate public biographical information is approved.

Privacy and Accessibility remain separate utility pages.

## Commission Research

Commission Research is a task-led scope desk: a concise opening statement, a three-step commissioning sequence, the progressive intake form and adjacent trust/boundary guidance. Submission remains a request for review, not a checkout; no account or mandatory call is required, and work begins only after written scope approval.

## Motion

The homepage evidence route and the chart registration are the two authored data motions. Both draw evidence paths into an already-readable static composition. Hover transitions may move arrows/underlines. Avoid scroll-triggered reveals and ornamental motion. All motion must collapse under `prefers-reduced-motion`.

## Responsive rules

- Wide/desktop: 12-column shell
- Compact desktop: navigation compresses, service grids can drop from four to two columns
- Around 1020px: primary navigation collapses
- At 980px: major split layouts stack; hero indexes may become two-column registers
- At 640px: indexes, controls and KPI rows become single-column
- At 420px: footer becomes one column

No page should require horizontal scrolling at an equivalent 320 CSS px viewport.

## Components

### Navigation

The 76px ruled navigation uses the serif wordmark, five primary destinations and one red Commission Research action. The active destination is shown with a one-pixel underline. At compact widths it becomes a labelled **Menu** control with focus trapping and Escape-key return rather than an icon-only trigger.

### Buttons and text links

Primary actions are square muted-red fields with a trailing arrow. Secondary actions are square ink outlines that invert on hover. Editorial text links carry a single underline rule; arrows move on hover while the surrounding layout remains fixed. Every variant uses the shared visible focus ring.

### Evidence atlas

The homepage atlas is a dark, ruled evidence plate connecting Canada and Europe through a single red route, steel verification node and four source classes. It is semantic SVG geometry with a text alternative, not a decorative map or an implied dataset. The route draw is disabled under reduced motion.

### Live Monitor entry

The Live Monitor keeps provider attribution, retrieval time, query controls and publisher-linked coverage in one continuous ruled surface. Result rows use the same editorial-list language as Research rather than card UI. The error state remains explicit and source-specific; never disguise provider failure with substitute content.

### Official data entry

The Market Data instrument keeps source status, publisher table, query controls, KPI readouts, accessible chart/table, provenance, limitations and discovery records in one continuous ruled surface. Loading and error states replace the selected series rather than leaving stale values presented as current.

### Research archive

The empty archive shows a truthful zero count and the five supported formats. Once publications exist, a square control row provides title/summary/tag search plus research-area, publication-type and year filters, followed by a newest-first result count and ruled publication entries.

### Research scope desk

The Commission Research form sits on one light editorial sheet with a small operating label, three-step progress, explicit field requirements, validation recovery, review/edit state and a non-purchase success state. The adjacent sidebar carries only information needed to submit safely.

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
