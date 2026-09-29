---
name: Tharros Canada
description: Independent student research across Canada and Europe, presented as an evidence ledger.
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
  red-on-dark: "#e0a39c"
  steel: "#46677f"
  steel-on-dark: "#8fb0c7"
  green: "#4f6e58"
  green-on-dark: "#9bbfa4"
  error: "#8a312d"
  focus: "#2f6fae"
  focus-on-dark: "#8fb8e0"
typography:
  display: "Source Serif 4, Georgia, serif"
  body: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
spacing:
  page: "clamp(48px, 6vw, 96px)"
  section: "clamp(40px, 5vw, 72px)"
  block: "clamp(24px, 3.5vw, 48px)"
  readingMeasure: "64ch"
---

# Design System: Tharros Canada

The tokens above mirror `:root` in `src/app/globals.css`, which is the source of truth. Each page's styles live next to it (`home.css`, `research/research.css`, `about/about.css` and so on).

## North star: the evidence ledger

The site should feel like a rigorous research publication whose evidence can be inspected.
- **Colour roles:**
  - warm ivory carries graphite ink;
  - dark bands create hierarchy;
  - muted Canadian red marks actions;
  - steel carries data.
- **What it must not look like:** a government portal, a generic consultancy, a startup dashboard or an experimental portfolio.

The visual material is **research itself**: source registers, archival metadata, tables, report covers and pages. Never fill space with stock photography or decorative charts.

## Core rules

- **Evidence before ornament.**
  - A prominent data point names its source context.
  - Real publisher data may be transformed for display only when the transformation is documented.
  - If a source fails, show the failure, never synthetic values.
- **Red means act.** Red is for primary actions and interactive selection, never for headings or data series. The wordmark slash is the only standing exception.
- **Steel means data.** Steel carries every trace, connector, count, page number and match highlight.
- **Green means a positive state**, such as the Received stamp, and never editorial approval.
- **One rule per boundary.**
  - Lists and registers use a strong opening rule and quiet row dividers.
  - No boxed cards, pills or nested surfaces.
  - Rules mark real structure. When spacing already groups things, don't add a rule.
- **Sheets, not cards.** Documents and instruments sit on ivory-light sheets with a soft page shadow, often under a dark running-head bar.
- **Square geometry.** Buttons, fields, registers and panels are square. Radio controls stay circular because the shape carries meaning.
- **Dense by default.** The owner dislikes empty bands and floating side text: stack notes under headings, and use two-up grids for short lists.
- **Controlled reading width.** Long prose caps near 64ch, and large interpretive copy near 44ch. Never stretch paragraphs to fill the 12-column shell.

## Typography

- **Source Serif 4** is the editorial voice: page titles, section headings, report titles and interpretive statements.
- **Schibsted Grotesk** is the operating voice: navigation, prose, controls, metadata and tabular readouts. Tabular values use tabular numerals.

**Scale:**
- **Body:** 18px / 1.6, and 17px at 640px and below.
- **Section headings:** the shared scale is `--type-section`, clamp(40px, 4.4vw, 64px). About's field guide uses the section hierarchy described below.
- **Statement H1s (openings):**
  - Home: clamp(56px, 6.4vw, 96px);
  - About: clamp(52px, 5.9vw, 92px), weight 350, line-height 1, with three explicit lines that can wrap within each line;
  - Methodology: clamp(46px, 4.6vw, 72px);
  - the 404: clamp(52px, 6.4vw, 96px).
  - Home tightens to about clamp(46px, 13.5vw, 64–72px) on phones.
  - About uses clamp(48px, 5.8vw, 70px) through 1180px, clamp(52px, 7.6vw, 76px) through 980px, then clamp(33px, 9.2vw, 58px) through 640px.
- **About field-guide hierarchy:** light section headings use clamp(36px, 3.8vw, 56px), line-height 1.08; the dark standards heading uses clamp(40px, 4.2vw, 64px). Field titles use clamp(25px, 2.4vw, 34px), becoming 27px on phones. Question lists use the editorial serif at clamp(21px, 1.9vw, 27px), becoming 23px on phones. Sans evidence and principle prose stays at 17px; phone field summaries use 16px. Datum labels are 13px, and operational links are 14–15px.
- **Document H1** (`PageHero`): clamp(44px, 4.8vw, 72px).
- **Slim banners:**
  - Research: clamp(34px, 3.2vw, 46px);
  - the report page: clamp(34px, 3.4vw, 50px).
- **Minimum screen size:** 11.5px, enforced by `tests/css-guard.test.ts`.
- **Labels:** field labels are compact sans, uppercase only when the label names a datum. Context labels are compact uppercase sans, used sparingly.

## Layout and responsive rules

- **Shell:** a 12-column grid capped at 1440px. Its width subtracts the start and end gutters from the containing block, rather than using `100vw`, so a scrollbar never enlarges the page. Each gutter respects the device's safe-area inset.
  - The construction grid is visible only behind the Home front page.
- **Around 1020px:** the primary navigation collapses into a labelled **Menu** control.
- **1180px:** the archive's three zones (rail, results, record pane) appear side by side.
- **1180px and below:** the report title and record stack; from 641px the record and actions share a two-column row. Methodology margin notes move beneath their clause rather than squeezing beside it.
  - About's opening changes from an eight/four-column split to seven/five; principle and contact rows stack their internal title, prose and link, and the boundary lists stack within their right-hand column.
- **980px:**
  - major split layouts stack;
  - the archive filters fold behind a **Filters** disclosure;
  - About's H1 spans the shell; its deck and actions share a two-column row. The standards, independence and contact chapters retain two columns until 640px.
- **760px:** the Methodology trace stacks its claim over the record.
- **640px:** indexes, controls and ledgers become single-column, and the body text drops to 17px.
- **641–980px:** the homepage field ledger and method notes use two columns, as does the Methodology publisher register. About's field questions and evidence stay side by side; at 640px they stack, as do its three live records and chapter columns. The disclosure symbol stays beside the field title, with the scope beneath it.
- **560px and below:** the PDF toolbar has explicit rows in the same order as keyboard focus: page, zoom, find, full screen and download. At 380px and below page and zoom each receive a row.
- **420px:** the wordmark tightens to preserve the labelled Menu button; contents links become one column. Footer navigation stays two columns.

No page may scroll horizontally at a 320 CSS px viewport. Mobile keeps the reading order, the actions, HTML equivalents for graphics, and keyboard access.

Page, section, block and row spacing have distinct fluid roles: 48–96px, 40–72px, 24–48px and 16–28px. Phone sections should not inherit desktop-sized empty bands. Reading measures stay bounded on ultrawide screens; full-width dark bands carry the background, not stretched paragraphs. Landscape viewports at 600px high and below release contents rails, maps and PDF toolbars from sticky positioning so the reading area remains usable.

Standalone PDF and citation controls have 44px targets at every width, including touch tablets. Search inputs in the PDF use at least 16px type. Phone archive entries retain the cover beside the title but place the summary, tags, actions and inline record across the entry's full width; an open citation grows in normal flow. Citation URLs and metadata can wrap without widening the page.

## Page openings

Pages don't share one hero. Each opens with the surface that suits its job:

| Page | Opening |
| --- | --- |
| Home | Ivory front page: H1 and actions beside the latest-release sheet. |
| Research | Slim ivory "Published Research" banner, then the reading room. |
| Report page | Dark running head, then the title beside the record ledger. |
| Methodology | Light ivory opening led by the provenance trace. |
| About | Ivory identity statement and purpose beside the archive action, then the live record and field-guide index. |
| Privacy, Accessibility, Copyright | `PageHero variant="document"`: a light document header. |
| 404 | Statement H1 beside an archive search. |

Dark surfaces are the Home field plate, About's research-standards chapter, the report running head, the dark sheet bars and the footer. Never use a large dark hero on every page. `PageHero` still has `home`, `standard` and `task` variants, but no page uses them today.

## Pages

### Home (`src/app/page.tsx`, `home.css`)

1. **Front page (ivory).**
   - Cols 1–6: the H1, the deck, and the actions Read the research and How the research is made.
   - Cols 7–12: the **latest release**, which is the newest publication or a `featured` one. It has:
     - a dark bar reading "Latest release", with the reference and format;
     - an ivory-light sheet with the real cover, the title and the summary's first sentence ending "… Read more" (the owner wants it compact; the full summary lives on the report page);
     - a one-row ledger: published date only;
     - Read the report and Download PDF.
   - Up to two earlier releases follow as ruled rows.
   - With nothing published, the bar reads "Public research." over one calm line.
2. **Field plate (dark, full width).** "Five connected fields." and the Atlantic map fill cols 1–7. Beside them, the five research areas form a ledger:
   - an area with publications links to its archive filter and shows a steel count;
   - an area without any shows only its scope, so no link leads to an empty filter.
3. **Method notes.** A light closing section explains source selection, the separation of interpretation and stated limitations, with a link to Methodology.

Proof comes first. An empty state is never the loudest heading, and the page never pretends that unfinished research is published. The visual tests hide the latest release and the area counts, because both change with every publication.

### Research: the reading room (`src/components/research-archive.tsx`, `research/research.css`)

`/research` is the most important page, and it must never regress in tools. `e2e/archive.spec.ts` is its contract.

**When empty,** it states the absence once, calmly, and shows the five formats, with no defensive anti-fabrication copy.

**When populated,** it sits under the slim "Published Research" banner, with the sources-and-limitations line and the Methodology link beneath it. The **search bar** spans the full width on top: full-text search across titles, summaries, tags, references and the text inside every PDF, with fuzzy and prefix matching. "/" focuses it. From 1180px, three zones sit side by side below it:

- **Rail** (cols 1–3; sticky on screens at least 820px tall when the panel fits below the header):
  - the research areas as ruled rows with steel counts. The pressed row fills with ink and shows its scope;
  - Format and Year chips;
  - every facet counts against the query and the other filters, and disables at zero.
- **Results** (cols 4–12, or 4–8 with the record pane open):
  - the aria-live count, sort (relevance while searching), density, Preview and Clear all;
    - density is Compact by default, and the choice is remembered per browser;
    - Preview (1180px and up) opens the record pane. It is off by default and remembered per browser; while it is off, each Expanded entry carries the **Record** disclosure instead;
  - ruled entries, each with its cover, metadata, a highlighted snippet or the summary, and tags;
  - actions on each entry: Cite, PDF (counted as a read) and Copy link (with a visible fallback field);
  - with the pane open, the selected entry lifts onto an ivory-light sheet; ↑/↓ step between titles.
- **Record pane** (cols 9–12, when Preview is on; sticky only when its measured height fits below the header; otherwise in normal page flow, with no inner scroll). A ResizeObserver updates this as the content or viewport changes. For the selected publication it shows:
  - the title, Read the report and PDF;
  - a ledger: reference, published, author, area and readership;
  - the abstract, when the entry isn't already showing it;
  - **Matches in this report**: the first match on each page, linking to `/research/<slug>#page=N&search=<word>`. Without a search, it shows **In this report** instead: the PDF's contents, with page links;
  - its sources (publisher, document) and its limitations.

**Narrower widths:**
- From 980 to 1180px, the pane gives way to a **Record** disclosure under each entry.
- Below 980px, the filters fold behind a **Filters** disclosure that shows the active-filter count. On wide screens they are forced open through `::details-content`, falling back to the disclosure where that isn't supported.

**State:**
- Every view is in the URL (`?q=&area=&type=&year=&sort=`), written with `replaceState`. Garbage parameters fall back to the full archive.
- A failed search offers "Did you mean" suggestions and Clear all filters.
- Without JavaScript, the default list still renders and links to every report.

**Formats:** Intelligence Brief, Research Report, Market Note, Data Note and Sector Analysis.

The five research areas are archive taxonomy and a homepage summary, not a public route.

### Report page (`src/app/research/[slug]/page.tsx`)

Top to bottom:
1. A dark running head: the format, the area (linked to its filter) and the reference.
2. The title, subtitle and abstract, beside the record ledger and actions.
3. The PDF viewer.
   - It shows the cover image on page 1 until pdf.js draws it.
   - It honours `#page=N&search=word`, the same fragment a browser's own PDF viewer understands: it scrolls to the page and starts its find on the first match there.
4. Sources as a register across the page: publisher, document. No retrieval dates (owner decision).
5. Limitations beside the citation panel, then a three-up Continue row.

The viewer's fullscreen fallback contains keyboard focus, makes the surrounding page inert, and returns focus to its trigger on exit. Find results are cleared while a new query is being searched so the count and highlight always belong to the current query.

### Methodology (`/methodology`)

1. **Opening:** the H1 and deck (cols 1–4) beside the **provenance trace** (`src/components/provenance-trace.tsx`).
   - The trace quotes passages verbatim from TC-2026-001 (`src/data/trace-example.ts`). `tests/methodology.test.ts` checks them against the extracted PDF text.
   - Their phrases are inline toggle buttons. The active phrase highlights its record fields (publisher, dataset, period, licence, notes).
   - A square-elbow steel leader is measured and drawn from the phrase's line to each field.
   - Below 760px, the claim stacks over the record, and a "Traced to" line replaces the leaders.
2. **Rule by rule:** a sticky contents rail (`MethodRail`) beside five clauses, each with a steel "In TC-2026-001" margin note.
   - At 980px and below the contents stay visible as an "On this page" index above the clauses, two-up until 420px, then single-column. Short landscape screens keep the rail in normal flow.
   - The rail marks the current clause with an IntersectionObserver.
   - Its steel progress bar fills on a named view timeline.
3. **Source atlas:** publisher seats plotted on the Atlantic line drawing, inverted to ink, beside the register.
   - The seats come from `seatPlaces` in `src/data/sources.ts`, and each circle's area is proportional to the number of sources.
   - Pointing at a publisher lights its city.
4. Source categories, then a closing CTA to the research.

### About (`/about`)

The question-led field guide keeps the established ivory, graphite, serif/sans pairing and ruled registers. Its visual material is the research area's questions and evidence; it uses no map or raster illustration.
1. **Opening:** a large identity statement beside the purpose, Read the research and Explore the questions. Below, a compact three-column ledger is counted from the site's data:
   - published research;
   - research areas;
   - sources in the register;
   Steel serif counts use tabular numerals. The publication record includes the latest report's reference and date, or a plain empty state; publication-dependent details carry `data-volatile` for visual tests. Each record has a route to inspect it.
2. **On this page:** plain anchor links to Research fields, Research principles, Independence and Contact, in normal flow.
3. **Research fields:** five independent native disclosures from the research-area registry. The first opens by default. Each summary pairs the serif area title with its sans scope and a red SVG plus/minus. Opening a field exposes two ruled columns: questions in serif, evidence in sans, then a source-selection link and a full-width publication-state row. A field with published work links to its archive filter; an empty field links to the full archive. Questions describe scope, not completed publications. Disclosures and links work without JavaScript.
4. **Research principles:** a full-width graphite chapter, with a bounded introductory column beside four ruled principles. Each principle links to the archive or a specific methodology passage. On phones the introduction precedes the principles.
5. **Independence boundary:** the statement sits beside two plain ruled lists, What Tharros publishes and Outside the boundary. The lists stack within the right column below 1180px and follow the statement on phones.
6. **Editorial contact:** a mail link and enhanced Copy email address control beside three intent-specific mail routes: research questions, corrections and collaboration. Copy success is announced inline. Clipboard failure adds a labelled, focused and selected read-only address field in normal flow; its square ivory-light surface uses 16px type and the shared focus ring. Without JavaScript the email and purpose-specific mail links remain available, while the copy control is hidden. Field, section-index and contact controls have targets of at least 44px.

About states that Tharros is an independent student research project. No personal profile appears until the owner supplies and approves accurate details.

### Documents (Privacy, Accessibility, Copyright)

These read as documents, not as marketing landings.
- **Header:** a light `PageHero` that carries the document's own record: updated, contact, and the standard or licence where one applies.
- **Body:** one ivory-light sheet of numbered clauses beside a sticky contents rail.
  - At 980px and below the contents become an "On this page" index above the sheet, retaining plain anchor links and the no-JavaScript path.
  - The rail is the Methodology `MethodRail`, labelled "Sections", and its steel bar fills on the `--clauses` view timeline.
  - The clause numbers are steel, so a clause can be referred to.
  - Short lists sit two-up (`ul.is-grid`).
- **Wording:** it stays as the statement of record, and the treatment stays tame.

### 404 (`src/app/not-found.tsx`)

- A statement H1 beside a plain GET search form into the archive, which works without JavaScript.
- Three ruled rows follow, in this order: Research archive, Methodology, About Tharros.

## Components

- **Navigation** (`src/components/header.tsx`):
  - a 76px ruled bar with the serif wordmark and Research · Methodology · About;
  - the active destination gets a one-pixel underline;
  - at compact widths, the labelled **Menu** control traps focus and returns it on Escape.
- **Buttons and links:**
  - primary actions are square muted-red fields with a trailing arrow;
  - secondary actions are square ink outlines that invert on hover;
  - text links carry a single underline, and their arrows move on hover while the layout stays fixed;
  - every variant uses the shared visible focus ring.
- **Atlantic map** (`src/components/atlantic-map.tsx`, on the field plate): an orthographic line drawing of the North Atlantic.
  - It shows Natural Earth coastlines, a faint 10° graticule, and the real Ottawa–Brussels great-circle route in red, with the endpoint coordinates and the distance.
  - The edges fade through a radial mask.
  - Labels are HTML overlays, so they keep true type sizes.
  - It is geography only, never an implied dataset.
  - The coastlines and graticule are the static file `public/atlantic-map.svg`. The route stays inline so it can animate.
- **Research areas:** a durable classification with no page of its own. They appear only as:
  - the homepage ledger;
  - the About question-and-evidence field guide;
  - area metadata on publications;
  - archive filters;
  - links into relevant research and methodology.
  Evidence artifacts may make an area distinctive once real work exists. Never invent a chart, map or project for decoration.

## Motion

Scroll-linked motion may move or draw things, but never reveal them.
- Section-opening rules (`.ruled`) draw in on a `view()` timeline.
- The contents-rail progress bars fill on named view timelines.
- A scroll-driven keyframe may animate only transform, translate, scale or stroke-dashoffset.
  - It always starts from an already-drawn static state.
  - It runs only inside `@media (prefers-reduced-motion: no-preference)`.
  - `tests/css-guard.test.ts` enforces this.

**Interaction-led motion:**
- The Atlantic map's route draws into an already-readable map.
- The trace leaders draw with WAAPI after a phrase is chosen.
- A report cover on Home or in the archive morphs into the report's first page.
  - Both ends use React `<ViewTransition name="cover-<slug>" share="cover">`.
  - Only one element per page carries a given name.
- Hover transitions may move arrows and underlines.
- About's disclosure changes the SVG plus to a minus by rotating its vertical stroke (250ms, `--dur-2`, `--ease-out`); opening content stays in normal flow without a reveal animation. Its link arrows use the same duration and a 4px translation. The inherited reduced-motion rule collapses these transitions to 0.01ms.

Avoid ornamental motion. All motion collapses under `prefers-reduced-motion`.

## Do

- Use real source metadata as visual content.
- Keep source periods, retrieval context and limitations explicit.
- Keep the archive honest when empty.
- Make states and controls understandable without colour alone.
- Keep the research archive and method easy to find.
- Keep strong focus states and full keyboard navigation.

## Don't

- Add fabricated reports, clients, partners, awards, experts or testimonials.
- Substitute synthetic data when a source is unavailable.
- Add stock photography to make a page feel "full".
- Use government logos or marks in a way that suggests affiliation.
- Build decorative dashboard cards.
- Open every page with a large dark hero.
