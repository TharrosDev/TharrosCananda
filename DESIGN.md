---
name: Tharros Canada
description: Independent research across Canada and Europe, presented as an evidence ledger.
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

The visual material is **research itself**: source registers, archival metadata, tables, procurement/document references and report artifacts as real work is produced. Do not fill empty space with generic stock photography or decorative charts.

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

Compact dark hero for a working interface such as Request Research. The task should begin quickly below it.

### Document

Light ivory editorial header for Research Archive, How It Works, Privacy and Accessibility. These pages should read like documents rather than repeated marketing landings. Methodology, About and Research Services open on light ivory too, but each leads with its own instrument (below); Request Research uses the task hero and a desk.

### Instruments

Methodology, About, Research Services and Request Research each run one working instrument built from real material, instead of heading, prose and a ruled list. Documents and instruments sit on ivory-light sheets with a soft page shadow; steel carries every trace, connector, count and data mark.

## Primary navigation

Desktop order:

**Services · Research · Methodology · About**

Primary action:

**Commission research**

The navigation tightens before collapsing. Around 1020px it becomes a labelled **Menu** control rather than an icon-only hamburger.

## Homepage architecture

1. Atlantic map first viewport, brand proposition and Commission Research
2. "Start with a question": the three services as a ruled list, each led by the question it answers
3. Four-area Canada–Europe research summary
4. Public research (selected releases, or one calm empty-state line plus the example report)
5. Ivory closing CTA (shared `.closing-cta`), so the footer is the only dark block at the foot of the page

Section headings share one size (`--type-section`); no chapter out-shouts the next, and an empty state is never the loudest heading on the page.

The homepage uses the Atlantic route between Canada and Europe as its opening visual material, then alternates large editorial statements with working registers. It proves the operation through method and source registers and must not pretend unfinished research is already published.

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

The planned formats are Intelligence Brief, Research Report, Market Note, Data Note and Sector Analysis. The five research areas are archive taxonomy and a homepage summary, not a dedicated public route.

A real report page should eventually include verified authorship, date, executive summary, key findings, charts/tables, methodology, sources, limitations, related research and a commission CTA.

## Research areas

The five research areas remain a durable classification system for the homepage and Research archive. They do not require a standalone page. Their public expression is limited to:

- a concise scope in the homepage ledger;
- area metadata on real publications;
- a clear archive filter;
- links into relevant commissioned services where useful.

As real work is produced, evidence artifacts may be added to make areas visually distinctive, but never invent a chart, map or project solely for decoration.

## Services

Research Services (`/research-services`) opens with the H1 and research-first deck beside a **Private by default.** notice (`commissionPrivacy`). Below it sits the **specimen shelf**: each service stands as the real cover of its sample document at thumbnail scale, beside its name, the question it answers, an open "You receive" list and its Request link. Custom & Partner Research is the flagship: a full-width row at a larger scale with the only primary button; the other two share the next row with text links. The four-step process strip (shared with How it works via `commissionSteps`) follows, with the no-account/no-purchase line and the further-reading links on one row. No prices or tiers: scope is set in the written proposal. Styles live in `src/app/research-services/services.css`.

**Sample documents** (`src/components/sample-document.tsx`) open in a native modal `<dialog>` styled as a PDF reader: A4 pages in the house report style (red section numbers, ink rules, steel data marks), lorem text only, labelled "Sample · placeholder text" on every page, never downloadable. Opening a sample morphs the shelf cover into the reader's first page with a same-document View Transition (the two share a `view-transition-name` only while the transition runs); closing folds it back while the cover is still in view. Without View Transitions, or under reduced motion, the dialog simply opens. The shelf covers are aria-hidden pictures scaled with `zoom`, exempt from the type minimum because the dialog is their readable form. Replace the samples with real redacted ones once work exists.

## About

About is dense by the owner's request: no floating side notes or empty bands. It opens with a full-width statement H1, then the deck beside the Ottawa–Brussels great-circle route drawn as the masthead rule (the homepage map's path, static, captioned as the route between the two capitals). **The institute, on the record** is a two-up ledger counted live from the site's data: published research, the archive's research areas, sources in the register and research services. Counts that grow with each publication carry `data-volatile` for the visual tests. **Research principles** follow as a two-up grid, each linking to where it shows on the site. The **independence boundary** puts the statement and contact line beside a square ink frame holding what Tharros provides, with what lies outside the boundary listed below it (shared with How it works via `provides` / `doesNotProvide`). It must not invent founder/team profiles. Add verified people only when accurate public biographical information is approved.

Privacy and Accessibility remain separate utility pages.

## Methodology

Methodology opens with the H1 and deck (cols 1–4) beside the **provenance trace** (`src/components/provenance-trace.tsx`). The trace quotes passages verbatim from TC-2026-001 (`src/data/trace-example.ts`, checked against the extracted PDF text by `tests/methodology.test.ts`), and their phrases are inline toggle buttons. The active phrase's record fields (publisher, dataset, period, retrieved, licence, notes) highlight, and a square-elbow steel leader is measured and drawn from the phrase's line to each field. Below 760px the claim stacks over the record and a "Traced to" line replaces the leaders. Then comes the method **rule by rule**: a sticky contents rail beside five clauses, each with a steel "In TC-2026-001" margin note. The rail marks the current clause with an IntersectionObserver, and its steel progress bar fills on a named view timeline. Then the **source atlas**: publisher seats plotted on the Atlantic line drawing, inverted to ink (`seatPlaces` in `src/data/sources.ts`, circle area proportional to the number of sources), beside the register. Pointing at a publisher lights its city. Source categories and a closing CTA to the research follow.

## Request Research

Request Research (`/request-research`) is a task-led desk: a compact dark hero with the three-step sequence in its foot, then the progressive intake form beside the **live brief** (`src/components/request-brief.tsx`). The brief is a document sheet that writes itself as the visitor types: the subject as title, the question, organization and question blocks, what they would receive for the chosen service, and indicative public sources from `objectiveSources`, labelled indicative. It is the review step, and its Edit buttons return only to completed steps. It runs its full length with no inner scroll. Below 980px it folds under a "Preview your brief" toggle and opens itself on review and receipt, when it takes a green "Received" stamp with the reference. The purchase terms and `commissionPrivacy` stay visible under the form actions at every width. Submission remains a request for review, not a checkout; no account or mandatory call is required, and work begins only after written scope approval.

## Motion

The homepage evidence route is the primary authored data motion. It draws the evidence path into an already-readable static composition. Hover transitions may move arrows/underlines. Scroll-linked motion may move or draw things, never reveal them. Section-opening rules (`.ruled`) draw in on a `view()` timeline, and the Methodology rail's progress bar fills on a named view timeline. A scroll-driven keyframe may animate only transform, translate, scale or stroke-dashoffset, always from an already-drawn static state, and only inside `@media (prefers-reduced-motion: no-preference)` (`tests/css-guard.test.ts` enforces this). Interaction-led motion: the trace leaders draw with WAAPI after a phrase is chosen, the sample cover morphs into the reader, and the request brief's Received stamp settles once. Avoid ornamental motion. All motion must collapse under `prefers-reduced-motion`.

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

The 76px ruled navigation uses the serif wordmark, the primary destinations and one red Commission action (to Research Services). The active destination is shown with a one-pixel underline. At compact widths it becomes a labelled **Menu** control with focus trapping and Escape-key return rather than an icon-only trigger.

### Buttons and text links

Primary actions are square muted-red fields with a trailing arrow. Secondary actions are square ink outlines that invert on hover. Editorial text links carry a single underline rule; arrows move on hover while the surrounding layout remains fixed. Every variant uses the shared visible focus ring.

### Atlantic map

The homepage map (`src/components/atlantic-map.tsx`) is an orthographic line drawing of the North Atlantic: Natural Earth coastlines, a faint 10° graticule and the real great-circle route from Ottawa to Brussels in red, with endpoint coordinates and the route distance. Edges fade through a radial mask. Labels are HTML overlays so they keep true type sizes at every width. It is geography only, never an implied dataset. The coastline and graticule paths were generated once and are served as the cached static file `public/atlantic-map.svg`; the route stays inline so it can animate. The route draw is disabled under reduced motion.

### Research archive

The empty archive shows a truthful zero count and the five supported formats. Once publications exist, a square control row provides title/summary/tag search plus research-area, publication-type and year filters, followed by a newest-first result count and ruled publication entries.

### Research scope desk

The request form sits flat on the page with three-step progress, explicit field requirements, point-of-need guidance (what not to send sits with the question), validation recovery and a non-purchase success state. The live brief beside it is the review surface (see Request Research).

## Do

- Use real source metadata as visual content.
- Preserve explicit source periods, retrieval context and limitations.
- Keep the research archive honest when empty.
- Keep interface states and controls understandable without relying on colour alone.
- Keep Commission Research visible but not repeated excessively.
- Maintain strong focus states and keyboard navigation.

## Do not

- Add fabricated reports, clients, partners, awards, experts or testimonials.
- Substitute synthetic data when a source is unavailable.
- Add stock photography merely to make pages feel “full.”
- Use government logos or visual marks in a way that suggests affiliation.
- Create decorative dashboard cards.
- Use large dark heroes on every page.
- Publish prices; engagements are priced per case in writing.

## Density and rules

Use three pacing modes rather than applying one section rhythm everywhere:

- **Compact** for archives, supporting evidence and secondary editorial sections.
- **Standard** for normal commercial and expertise content.
- **Feature** only for major brand transitions.

Horizontal rules should communicate actual structure. If proximity and whitespace already establish a relationship, do not add another rule. The 12-column construction grid may be exposed as texture only in the homepage hero; elsewhere it should remain invisible.
