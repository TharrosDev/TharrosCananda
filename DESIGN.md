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
  page: "clamp(64px, 7vw, 104px)"
  section: "clamp(52px, 5.5vw, 80px)"
  block: "clamp(32px, 4vw, 56px)"
  readingMeasure: "64ch"
---

# Design System: Tharros Canada

The tokens above mirror `:root` in `src/app/globals.css`, which is the source of truth. Each page's styles live next to it (`home.css`, `research/research.css`, `research-services/services.css` and so on).

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
- **Section headings:** all share `--type-section`, clamp(40px, 4.4vw, 64px), so no chapter out-shouts the next.
- **Statement H1s (openings):**
  - Home: clamp(56px, 6.4vw, 104px);
  - About: clamp(52px, 6.2vw, 98px);
  - Research Services: clamp(50px, 5.6vw, 88px);
  - Request Research: clamp(46px, 5vw, 76px);
  - Methodology: clamp(46px, 4.6vw, 72px);
  - the 404: clamp(52px, 6.4vw, 96px).
  - Home and About tighten to about clamp(46px, 13.5vw, 64–72px) on phones.
- **Document H1** (`PageHero`): clamp(44px, 4.8vw, 72px).
- **Slim banners:**
  - Research: clamp(34px, 3.2vw, 46px);
  - the report page: clamp(34px, 3.4vw, 50px).
- **Minimum screen size:** 11.5px outside `report.css`, enforced by `tests/css-guard.test.ts`.
- **Labels:** field labels are compact sans, uppercase only when the label names a datum. Context labels are compact uppercase sans, used sparingly.

## Layout and responsive rules

- **Shell:** a 12-column grid, `--shell: min(1440px, 100vw − 2 × gutter)`.
  - The construction grid is visible only behind the Home front page.
- **Around 1020px:** the primary navigation collapses into a labelled **Menu** control.
- **1180px:** the archive's three zones (rail, results, record pane) appear side by side.
- **980px:**
  - major split layouts stack;
  - the archive filters fold behind a **Filters** disclosure;
  - the request brief folds.
- **760px:** the Methodology trace stacks its claim over the record.
- **640px:** indexes, controls and ledgers become single-column, and the body text drops to 17px.
- **420px:** the footer becomes one column.

No page may scroll horizontally at a 320 CSS px viewport. Mobile keeps the reading order, the actions, HTML equivalents for graphics, and keyboard access.

## Page openings

Pages don't share one hero. Each opens with the surface that suits its job:

| Page | Opening |
| --- | --- |
| Home | Ivory front page: H1 and actions beside the latest-release sheet. |
| Research | Slim ivory "Published Research" banner, then the reading room. |
| Report page | Dark running head, then the title beside the record ledger. |
| Research Services, Methodology, About | Light ivory opening led by the page's instrument. |
| Request Research | Compact dark task hero (`.request-hero`) with the three-step sequence. |
| How it works, Privacy, Accessibility, Copyright | `PageHero variant="document"`: a light document header. |
| 404 | Statement H1 beside an archive search. |

Dark surfaces are the Home field plate, the Request hero, the report running head, the dark sheet bars and the footer. Never use a large dark hero on every page. `PageHero` still has `home`, `standard` and `task` variants, but no page uses them today.

## Pages

### Home (`src/app/page.tsx`, `home.css`)

1. **Front page (ivory).**
   - Cols 1–6: the H1, the deck, and the actions Read the research and Commission research.
   - Cols 7–12: the **latest release**, which is the newest publication or a `featured` one. The specimen never appears here. It has:
     - a dark bar reading "Latest release", with the reference and format;
     - an ivory-light sheet with the real cover, the title and the summary's first sentence ending "… Read more" (the owner wants it compact; the full summary lives on the report page);
     - a one-row ledger: published date only;
     - Read the report and Download PDF.
   - Up to two earlier releases follow as ruled rows.
   - With nothing published, the bar reads "Public research." over one calm line and the example report link.
2. **Field plate (dark, full width).** "Five connected fields." and the Atlantic map fill cols 1–7. Beside them, the five research areas form a ledger:
   - an area with publications links to its archive filter and shows a steel count;
   - an area without any shows only its scope, so no link leads to an empty filter.
3. **Commissioned research.** Cols 1–4 hold the heading, the copy and `commissionPrivacy`. Beside them are the three services, each led by the question it answers:
   - the flagship spans the row, and the other two sit side by side;
   - this section closes the page, so there is no separate closing CTA.

Proof comes first. An empty state is never the loudest heading, and the page never pretends that unfinished research is published. The visual tests hide the latest release and the area counts, because both change with every publication.

### Research: the reading room (`src/components/research-archive.tsx`, `research/research.css`)

`/research` is the most important page, and it must never regress in tools. `e2e/archive.spec.ts` is its contract.

**When empty,** it states the absence once, calmly, and shows the five formats, with no defensive anti-fabrication copy.

**When populated,** it sits under the slim "Published Research" banner, with the sources-and-limitations line and the Methodology link beneath it. The **search bar** spans the full width on top: full-text search across titles, summaries, tags, references and the text inside every PDF, with fuzzy and prefix matching. "/" focuses it. From 1180px, three zones sit side by side below it:

- **Rail** (cols 1–3; sticky on screens at least 820px tall):
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
- **Record pane** (cols 9–12, when Preview is on; sticky; runs its full length with no inner scroll). For the selected publication it shows:
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

### Research Services (`/research-services`, `services.css`)

- **Opening:** the H1 and the research-first deck, beside a **Private by default.** notice (`commissionPrivacy`).
- **Specimen shelf:** each service stands as the real cover of its sample document at thumbnail scale, beside:
  - its name;
  - the question it answers;
  - an open "You receive" list;
  - its Request link.
  - Custom & Partner Research is the flagship. It gets a full-width row at a larger scale and the only primary button. The other two share the next row and use text links.
- **Process strip:** the four steps, shared with How it works through `commissionSteps`. The no-account/no-purchase line and the further-reading links sit on one row.
- **No prices or tiers.** Scope and price are set in the written proposal.

**Sample documents** (`src/components/sample-document.tsx`):
- They open in a native modal `<dialog>` styled as a PDF reader: A4 pages in the house report style (red section numbers, ink rules, steel data marks).
- The text is lorem only, labelled "Sample · placeholder text" on every page, and never downloadable. The owner approved them as placeholders. Replace them with real redacted samples once work exists.
- **Opening morphs the shelf cover into the reader's first page** with a same-document View Transition. The two share a `view-transition-name` only while the transition runs. Closing folds it back while the cover is still in view.
- Without View Transitions, or under reduced motion, the dialog simply opens.
- The shelf covers are aria-hidden pictures scaled with `zoom`. They are exempt from the type minimum, because the dialog is their readable form.

### Methodology (`/methodology`)

1. **Opening:** the H1 and deck (cols 1–4) beside the **provenance trace** (`src/components/provenance-trace.tsx`).
   - The trace quotes passages verbatim from TC-2026-001 (`src/data/trace-example.ts`). `tests/methodology.test.ts` checks them against the extracted PDF text.
   - Their phrases are inline toggle buttons. The active phrase highlights its record fields (publisher, dataset, period, licence, notes).
   - A square-elbow steel leader is measured and drawn from the phrase's line to each field.
   - Below 760px, the claim stacks over the record, and a "Traced to" line replaces the leaders.
2. **Rule by rule:** a sticky contents rail (`MethodRail`) beside five clauses, each with a steel "In TC-2026-001" margin note.
   - The rail marks the current clause with an IntersectionObserver.
   - Its steel progress bar fills on a named view timeline.
3. **Source atlas:** publisher seats plotted on the Atlantic line drawing, inverted to ink, beside the register.
   - The seats come from `seatPlaces` in `src/data/sources.ts`, and each circle's area is proportional to the number of sources.
   - Pointing at a publisher lights its city.
4. Source categories, then a closing CTA to the research.

### About (`/about`)

Dense, at the owner's request.
1. **Opening:** a full-width statement H1, then the deck beside the Ottawa–Brussels great-circle route drawn as the masthead rule. It is the homepage map's path, static, captioned as the route between the two capitals.
2. **The institute, on the record:** a two-up ledger counted live from the site's data:
   - published research;
   - research areas;
   - sources in the register;
   - research services.
   Counts that grow with each publication carry `data-volatile` for the visual tests.
3. **Research principles:** a two-up grid, each principle linking to where it shows on the site.
4. **Independence boundary:**
   - the statement and contact line;
   - beside them, a square ink frame holding what Tharros provides;
   - below it, what lies outside the boundary.
   The lists are shared with How it works through `provides` / `doesNotProvide`.

No founder or team profiles until the owner approves accurate, verified details.

### Request Research (`/request-research`)

A task-led desk:
- **Hero:** the compact dark hero, with the three-step sequence in its foot.
- **Form and brief:** the progressive intake form beside the **live brief** (`src/components/request-brief.tsx`).
- **The brief** is a document sheet that writes itself as the visitor types:
  - the subject as the title;
  - the question, organization and question blocks;
  - what they would receive for the chosen service;
  - indicative public sources from `objectiveSources`, labelled as indicative.
- **It is also the review step.** Its Edit buttons return only to completed steps. It runs its full length with no inner scroll.
- **Below 980px,** it folds under a "Preview your brief" toggle. It opens itself on review and on receipt, when it takes a green "Received" stamp with the reference.
- **The purchase terms and `commissionPrivacy`** stay visible under the form actions at every width.
- **Submission is a request for review, not a checkout.** No account or call is required, and work begins only after written scope approval.

### Documents (How it works, Privacy, Accessibility, Copyright)

These read as documents, not as marketing landings.
- **Header:** a light `PageHero` that carries the document's own record: updated, contact, and the standard or licence where one applies.
- **Body:** one ivory-light sheet of numbered clauses beside a sticky contents rail.
  - The rail is the Methodology `MethodRail`, labelled "Sections", and its steel bar fills on the `--clauses` view timeline.
  - The clause numbers are steel, so a clause can be referred to.
  - Short lists sit two-up (`ul.is-grid`).
- **Wording:** it stays as the statement of record, and the treatment stays tame.

### 404 (`src/app/not-found.tsx`)

- A statement H1 beside a plain GET search form into the archive, which works without JavaScript.
- Three ruled rows follow, in this order: Research archive, Methodology, Commission research.

## Components

- **Navigation** (`src/components/header.tsx`):
  - a 76px ruled bar with the serif wordmark, Research · Methodology · About, and one red **Commission** action to Research Services;
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
  - area metadata on publications;
  - archive filters;
  - links into relevant services.
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
- A sample cover morphs into the reader.
- A report cover on Home or in the archive morphs into the report's first page.
  - Both ends use React `<ViewTransition name="cover-<slug>" share="cover">`.
  - Only one element per page carries a given name.
- The request brief's Received stamp settles once.
- Hover transitions may move arrows and underlines.

Avoid ornamental motion. All motion collapses under `prefers-reduced-motion`.

## Do

- Use real source metadata as visual content.
- Keep source periods, retrieval context and limitations explicit.
- Keep the archive honest when empty.
- Make states and controls understandable without colour alone.
- Keep Commission visible, without repeating it excessively.
- Keep strong focus states and full keyboard navigation.

## Don't

- Add fabricated reports, clients, partners, awards, experts or testimonials.
- Substitute synthetic data when a source is unavailable.
- Add stock photography to make a page feel "full".
- Use government logos or marks in a way that suggests affiliation.
- Build decorative dashboard cards.
- Open every page with a large dark hero.
- Publish prices. Engagements are priced per case, in writing.
