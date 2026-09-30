---
name: Tharros Canada
description: Independent student research across Canada and Europe, presented as The Open Issue.
colors:
  blue: "#2447dc"
  blue-hover: "#1736b6"
  sky: "#edf3f8"
  accent: "#e94d30"
  ground: "#ffffff"
  ground-deep: "#f0f2f4"
  white: "#ffffff"
  ink: "#17212f"
  ink-soft: "#3d4b61"
  slate: "#526079"
  steel: "#3152aa"
  rule: "rgba(23, 33, 47, 0.15)"
  rule-strong: "rgba(23, 33, 47, 0.35)"
typography:
  display:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(58px, 7.5vw, 96px)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.04em"
  section:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(38px, 4.2vw, 60px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(23px, 2vw, 29px)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  control:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.25
rounded:
  square: "0px"
spacing:
  gutter: "clamp(20px, 4.2vw, 64px)"
  column-gap: "clamp(16px, 2vw, 32px)"
  page: "clamp(48px, 6vw, 96px)"
  section: "clamp(40px, 5vw, 72px)"
  block: "clamp(24px, 3.5vw, 48px)"
  row: "clamp(16px, 2.5vw, 28px)"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.blue}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
  text-link:
    textColor: "{colors.blue}"
    typography: "{typography.control}"
    padding: "12px 0"
  facet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.square}"
    padding: "8px 12px"
  facet-selected:
    backgroundColor: "{colors.ground-deep}"
    textColor: "{colors.ink}"
  publication-record:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "26px 0"
  empty-image-frame:
    backgroundColor: "{colors.ground-deep}"
    rounded: "{rounded.square}"
    width: "100%"
---

# Design System: Tharros Canada

## Overview

**Creative North Star: "The Open Issue"**

Tharros presents independent student research as an open editorial issue: a confident statement, real published work, questions to explore, and evidence to inspect. White space, dark ink, selective blue, asymmetric composition, and precise rules create its contemporary character. Space Grotesk provides the display voice; Schibsted Grotesk keeps the research and its controls readable.

The identity continues across distinct tasks instead of repeating a hero composition. Home opens into an unboxed publication and project spread; About reads as a project portrait; Methodology operates as an evidence workshop and source directory; policy pages are compact references. Publication covers and source records remain the principal visual material. Two intentionally empty editorial frames reserve space for imagery the owner will supply.

**Key Characteristics:**

- A white page, dark ink, confident sans-serif type, blue emphasis, and restrained grey grouping.
- Open asymmetric spreads and ruled records rather than repeated boxed editorial panels.
- Native question and subject disclosures, a working evidence trace, and a searchable source register.
- Exactly two owner-controlled editorial image slots, currently empty; real report covers remain visible.
- Task-specific hierarchy, progressive enhancement, and purposeful motion that never gates reading.

The owner first selected Open Questions, candidate 7, seed `f037cd34`. The later direct approval of **The open issue**, chooser key `e5ea266c`, seed `df0d4fa0`, establishes the current composition and imagery policy. The surface brief retains this choice history; the tokens and rules here describe the latest built revision.

Runtime values live in `src/app/globals.css`; route and component styles refine them. The frontmatter owns reused primitives. `.impeccable/design.json` adds motion, breakpoints, shadows, and component previews; its tonal ramps are preview metadata, not runtime palette additions.

## Colors

The page remains white. Blue identifies an action, selected evidence, a destination, or a deliberate statement; neutral grey groups an instrument without turning the page into a banded poster.

### Primary

- **Ultramarine** (`blue`): wordmark, statement emphasis, links, actions, selection, trace leaders, and source-map nodes.
- **Deeper ultramarine** (`blue-hover`): primary-action hover and quieter link feedback.
- **Pale blue** (`sky`): selected evidence and restrained supporting instrument surfaces.

### Secondary

- **Orange** (`accent`): the slanted wordmark separator and selected disclosure details. It is a small identity accent.
- **Steel blue** (`steel`): publication references and supporting record information.

### Neutral

- **White ground** (`ground`, `white`): the shared page and reading surfaces.
- **Neutral grey** (`ground-deep`): empty editorial frames, the published-claim surface, grouped controls, tags, and selected-record feedback.
- **Ink**, **soft ink**, and **slate** distinguish principal text, explanatory prose, and metadata.
- `rule` and `rule-strong` distinguish row dividers from instrument and chapter boundaries.

**The White Ground Rule.** Let the white page and its typography carry the composition; use blue and grey to clarify specific statements, actions, and working states.

CSS compatibility names remain: `--red` is blue, `--red-dark` its hover shade, and `--ivory*` the white and grey surfaces. Their old names do not define current colour roles. `--focus` shares the primary blue. Other legacy colour declarations are not a requirement to add dark chapter bands.

## Typography

**Display Font:** Space Grotesk, with Helvetica Neue and Arial sans-serif fallbacks.

**Body Font:** Schibsted Grotesk, with Helvetica Neue and Arial sans-serif fallbacks.

Both families are loaded through `next/font/google` in `src/lib/fonts.ts`. Medium-weight editorial titles and a stronger opening statement give the issue hierarchy; prose and functional labels keep the instruments clear.

### Hierarchy

- **Opening statement:** Home uses the frontmatter display role, with dark ink followed by a blue line. The maximum measure and responsive size are defined in `home.css`; the narrowest layout uses a smaller explicit size.
- **Page openings:** About uses a compact purpose statement, Methodology a compact workshop title, and policy pages a reference title. Each has its own measure and scale; they do not inherit the homepage statement's prominence.
- **Chapter headings:** Home's question index uses the frontmatter section role. About and Methodology use smaller chapter scales where reading is denser.
- **Publication titles:** the lead homepage report is larger than an archive result. About's publication index uses a quieter weight and more open line spacing. Preserve each task's hierarchy.
- **Body:** global prose starts at 18px and becomes 17px on phones. Publication summaries, instrument records, contact rows, and source descriptions use local 15–17px sizes. Policy reference prose uses 17px with a generous line height (1.7).
- **Controls and metadata:** shared actions use 16px semibold type; labels and metadata use task-appropriate 12–15px sizes. Screen type stays at least 11.5px, enforced by `tests/css-guard.test.ts`.
- **Comparable figures:** references, dates, counts, page numbers, and zoom values use tabular numerals. Labels identify actual fields or groups; they do not add promotional kickers.

**The Reading Measure Rule.** Use the shared 64ch reading measure and local measures suited to summaries and source descriptions; do not stretch prose simply to fill a column.

## Layout

The shared shell caps at 1440px and subtracts the larger safe-area-aware edge from both sides. Its base grid uses 12 columns, with the frontmatter gutter and column gap. Major surfaces adapt that grammar to their own task; adjacent sections avoid stacking duplicate full gaps.

Home starts with a full-width statement and supporting introduction/actions. An open spread follows: approximately eight parts publication to four parts project context, with an actual report cover beside its title and one 16:9 editorial frame below the lead publication. Earlier releases remain linked records. The native question index follows, then one full-width invitation to inspect the method. Below 980px the spread stacks; its project column briefly becomes two columns before stacking at 640px.

About pairs a factual project ledger with a publication-title index, follows with subject disclosures, then pairs independence and principles. Its single 3:2 frame sits within the independence chapter. Operational contact rows close the page. These paired layouts stack at their local responsive thresholds.

Methodology gives the evidence instrument full width before a continuous five-rule reading path. The source directory pairs orientation and native region links with searchable publisher records. Its geographic inset is supporting context, not an editorial image slot. Below 980px the directory stacks and the inset is hidden; below 760px the claim and evidence record stack.

Policy pages have a compact white title, horizontal facts, a static horizontal chapter rail, and title/body reference rows. Rows stack below 800px; facts and chapters stack on phones. The white footer uses a large typographic signature and compact project/contact and navigation columns.

The archive keeps its framed white search instrument, neutral facets, open results, and optional preview distinct. The preview uses a dividing rule instead of a filled panel. The report reader keeps the PDF and its controls central. Their existing desktop, inline-preview, disclosure, narrow-toolbar, and short-height adaptations remain functional requirements.

**The Visible Content Rule.** Reading order and explicit controls provide access to content; hover and motion may reinforce meaning but never provide its only route.

## Elevation & Depth

Typography, white space, and rules establish depth. The homepage spread, project portrait, source register, and policy rows remain open and flat. Actual publication covers and PDF pages retain soft shadows to distinguish the document itself. Covers can lift slightly on hover. Density and preview selections use neutral grey rather than elevation. Citation popovers use an overlay shadow that disappears when the panel enters mobile flow.

Do not add a sheet shadow to the open homepage publication and project spread. Exact document and overlay shadows live in the source and sidecar.

## Shapes

Controls, fields, facets, and editorial frames use square geometry. Dividers follow meaningful rows and chapters. Covers retain their supplied proportions; native disclosures use drawn plus/minus shapes. Empty editorial frames are quiet rectangles with no icon, invitation, placeholder photograph, or caption.

## Components

### Actions and navigation

Shared primary actions are blue with white text; secondary actions are outlined and fill on hover. Standard actions have a 48px minimum height and frontmatter padding. Editorial reading links instead use a stronger blue underline and open horizontal space. Supporting text links may use dark ink when the composition calls for a quieter destination.

Arrow icons move on hover (4px), and a button press moves down (1px). A visible focus outline remains distinct (2px outline, 3px offset). Primary navigation contains Research, Methodology, and About, with a blue underline for hover and current-route feedback. On smaller screens it becomes a full-height sheet with descriptions, background scroll lock and inert content, focus containment, and Escape handling. No-JavaScript navigation exposes the destinations directly.

### Publication records and the open question index

The lead report uses its real reference, type, date, supplied cover, full registry summary, reading action, and PDF metadata. It remains an open record on the page; earlier releases are quieter ruled links. Report-cover view transitions connect discovery with reading.

The homepage question index uses native `details` and `summary`. Its collapsed state shows the subject, actual publication status, first question, and disclosure shape. Opening it exposes scope, further questions, and a relevant destination. Fields with no publications say so and link to their About disclosure. About's subject guide uses the same native mechanism at a scale suited to a project portrait.

### Owner-controlled editorial frames

**The Owner Imagery Rule.** Keep the two editorial slots empty until the owner supplies images; a null slot renders its frame without an image or caption.

The configuration is `src/data/editorial-images.ts`: exactly `home: null` and `about: null`. Home has one 16:9 frame; About has one 3:2 frame. There is no Methodology editorial slot. Existing report covers remain actual report artifacts and are not part of this optional-image registry.

`EditorialImageSlot` marks an empty frame as hidden from assistive technology. When an owner-supplied image is configured later, the record provides its source, alt text, intrinsic width and height, and optional credit. A credit caption appears only when that configured image has a credit. The frame's crop uses `object-fit: cover`; select images with those proportions in mind. Do not insert generated imagery, substitute stock photographs, or add caption copy while the entries are null.

### Archive instruments

Search, clear, research-area options, format/year facets, individually removable active filters, result context, sort, density, suggestions, and copying the current view form one working archive. Publication rows retain Read, PDF, Cite, Copy link, and record details. A wide-screen preview exposes metadata, sections, sources, and limitations; smaller layouts use inline details. Empty results explain the state and provide useful corrections or clearing actions. URL state and the server-rendered no-JavaScript publication list remain part of the contract.

### Evidence workshop and source register

The worked trace uses real TC-2026-001 passages. Selectable phrases highlight supporting record fields and draw leaders where the two-column layout allows. Its visible “Traced to” feedback names the selected relationship at every size. The source record remains readable and complete; keyboard Enter and Space activate phrase controls.

The source directory progressively enhances the complete publisher register with text search and region selection. Search covers publisher, purpose, access type, and city. Result counts, clearing filters, empty matches, and external-link context remain explicit. Native region anchors and all ten registered publishers remain available without JavaScript. Source-hover or focus can emphasise the corresponding geographic node on suitable layouts.

### References, contact, and report reading

Policy facts and the static chapter rail lead into title/body rows. About contact provides the editorial address, copy feedback and manual fallback, then useful report-question, correction, and contribution routes. The footer repeats compact project/contact and research/utility destinations.

The reader retains contents, page navigation, zoom and fit, search and matches, fullscreen with an overlay fallback, and PDF download. Contents identify current location; loading and errors have visible state areas. Citation tools retain format selection, readable citation text, licence context, and copying with manual selection when necessary. The owner's PDF is not restyled or edited.

### Motion

Shared state transitions use `--dur-1` (150ms), `--dur-2` (250ms), and `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`). The shared cover transition lasts 420ms. Evidence leaders draw after an actual phrase selection (560ms), while initial rendering and resize place them without motion. Source nodes and disclosure marks reinforce user interaction.

Scroll-linked progress and rules are enhancements behind reduced-motion and feature-detection guards. Keyframes may use only transform, translate, scale, or stroke-dashoffset. Reduced motion removes smooth scrolling, collapses ordinary timing, disables view transitions, and suppresses animated trace drawing; report navigation also honours it in JavaScript.

## Do's and Don'ts

### Do:

- **Do** sustain the identity through white ground, confident type, blue emphasis, asymmetric reading structures, and precise rules.
- **Do** use real publication covers, questions, source records, and reference information as the visual material.
- **Do** keep the home and About image slots null until the owner supplies imagery.
- **Do** preserve native disclosures, source-region anchors, complete no-JavaScript records, archive tools, and report controls.
- **Do** keep CSS to one rule per line and update the system record with intentional changes.

### Don't:

- **Don't** restore the former warm-paper and serif identity or the first revision's repeated coloured chapter bands.
- **Don't** populate the empty frames with generated or stock images, captions, icons, or upload prompts.
- **Don't** invent publications, institutional scale, endorsements, source dates, or decorative data.
- **Don't** alter the owner's PDF or redraw its content to match the website identity.
- **Don't** make evidence, reading controls, or essential destinations depend on hover or motion.
