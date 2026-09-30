---
name: Tharros Canada
description: Independent student research across Canada and Europe, with a clear identity and inspectable evidence.
colors:
  red: "#782c3d"
  red-hover: "#55202c"
  sky: "#f6edf0"
  accent: "#9e354c"
  ground: "#ffffff"
  ground-deep: "#f3f3f2"
  white: "#ffffff"
  ink: "#151515"
  ink-soft: "#414141"
  slate: "#606060"
  steel: "#626262"
  blue: "#151515"
  rule: "rgba(21, 21, 21, 0.15)"
  rule-strong: "rgba(21, 21, 21, 0.35)"
typography:
  display:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(100px, 16.5vw, 248px)"
    fontWeight: 650
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  section:
    fontFamily: "Space Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(38px, 4.8vw, 66px)"
    fontWeight: 600
    lineHeight: 1.1
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
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.red-hover}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.square}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  text-link:
    textColor: "{colors.ink}"
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
  publication-entry:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "26px 0"
---

# Design System: Tharros Canada

## Overview

Tharros Canada presents independent student research through a clear name, real published work and evidence readers can inspect. White ground, neutral dark ink, a black introduction band and sparse burgundy details give it a contemporary presence. Space Grotesk carries the identity and titles; Schibsted Grotesk carries prose and controls.

Home opens with an oversized, staggered Tharros Canada wordmark and a large burgundy slash drawn from the existing identity. A full-width black band holds the concise introduction and direct Research and About actions. A compact latest report and three draft upcoming topics follow, then two direct destinations. About introduces Tharros through About, Mission, Why and Contact. Methodology retains the worked evidence trace and five research rules. Research areas now has its own route. Supporting research tools and the supplied PDF reader retain their distinct working layouts.

The owner first selected Open Questions, candidate 7, seed `f037cd34`, then The open issue, chooser `e5ea266c`, seed `df0d4fa0`. Subsequent instructions simplified those compositions, replaced blue with neutral ink and burgundy, suppressed empty imagery frames and selected connecting lines for the homepage animation. The latest homepage instruction asks for a much bolder opening with something different from the map; the owner approved the typographic masthead and requested its final period be removed. This document describes the current system; the earlier choices remain historical context.

Runtime values live in `src/app/globals.css`; route and component styles refine them. Frontmatter describes reused primitives. `.impeccable/design.json` records motion, breakpoints, shadows, preview components and the same direction without claiming completed QA.

## Colors

- **Burgundy** (`red`, `#782c3d`): actions, focus, selected evidence and small identity details.
- **Deep burgundy** (`red-hover`, `#55202c`): action hover and quieter interaction feedback.
- **Muted red** (`accent`, `#9e354c`): small separators and disclosure details.
- **Pale burgundy** (`sky`, `#f6edf0`): selected evidence and the first upcoming topic's status.
- **White** (`ground`, `white`, `#ffffff`): the page and reading surfaces.
- **Neutral grey** (`ground-deep`, `#f3f3f2`): grouped controls, tags and the quoted-claim surface.
- **Ink** (`#151515`), **soft ink** (`#414141`), **slate** (`#606060`) and **steel** (`#626262`): titles, explanatory prose and metadata.
- `rule` and `rule-strong`: neutral row dividers and meaningful section boundaries.

**The White Ground Rule.** Let white space, dark typography and rules carry the page. Use burgundy for specific actions, identity marks and states; broad emphasis and dark surfaces use neutral black. The homepage places its burgundy slash on white, followed by a black introduction band with light prose and controls.

Compatibility names remain in CSS: `--blue` resolves to `var(--ink)`, while `--red` and `--red-dark` now hold burgundy shades. `--ivory*` are white and neutral grey surfaces. `--focus` is burgundy; dark surfaces have a lighter focus token. These names do not justify reintroducing blue.

## Typography

Display: Space Grotesk. Body and controls: Schibsted Grotesk. Both load through `next/font/google` in `src/lib/fonts.ts`, with Helvetica Neue and Arial fallbacks.

- **Home identity:** a staggered two-line Tharros Canada wordmark in neutral ink, with no final period. The homepage deliberately exceeds the supporting-page scale as a local expressive exception: `clamp(100px, 16.5vw, 248px)`, weight 650 and .94 line-height. Tharros aligns left and Canada aligns right. At 760px and below the clamp is `clamp(76px, 16.5vw, 124px)`; at 480px and below it is `clamp(64px, 17.7vw, 84px)`. Keep the full words visible at narrow widths.
- **Page openings:** About and Research areas use concise titles. Methodology uses a compact workshop title. Policy pages remain reference pages.
- **Section headings:** the homepage Latest release and Upcoming research headings use a compact 24px scale. About pairs quiet section labels with prose; Mission has a larger short statement.
- **Publication titles:** the compact homepage report uses 22–28px on larger screens and 20px on narrow phones. Research results preserve their own hierarchy.
- **Body:** global prose starts at 18px and becomes 17px on phones. Evidence fields, topic labels and controls use local scales suited to their task. Screen type stays at least 11.5px, enforced by `tests/css-guard.test.ts`.
- **Comparable figures:** references, dates, counts, page numbers and zoom values use tabular numerals. Labels identify useful fields rather than adding decorative kickers.

Local screen scales are task-specific rather than a universal fixed ramp: 11.5, 12, 13, 14, 15, 16, 17, 18, 20, 22, 23, 24, 25, 26, 28, 29, 30, 34, 36, 38, 48, 49, 50, 54, 58, 60, 64, 66, 76, 84, 96, 100, 124 and 248px appear as explicit sizes or responsive clamp endpoints. The largest three values belong to the homepage identity exception. Preserve the purpose of labels, report controls, titles and identity when changing a local scale.

**The Reading Measure Rule.** Use the shared 64ch measure and purposeful local widths. Avoid stretching short copy across a column; preserve comfortable measures for method explanations and subject scopes.

## Layout

The shared shell caps at 1440px, with safe-area-aware edges and a 12-column base grammar. Local layouts adapt to reading and interaction instead of repeating a banner structure.

Home opens with a full-shell typographic stage: Tharros aligns left, Canada aligns right and a large burgundy slash occupies the space below the first line. The black introduction band spans the viewport while its content aligns to the shared shell. Its copy and actions form two columns, becoming equal flexible columns at 1050px and below and one column at 760px and below. At 480px and below the actions also stack vertically. This adapts the composition from 320px phones to ultrawide screens while retaining the shared 1440px content cap. Latest release and Upcoming research form a compact asymmetric pair. The latest report shows its supplied cover, title, type, date and Read/PDF actions. The three numbered upcoming topics are separate draft ideas; only the first carries In progress, and a visible note says titles and scope may change. Two compact outlined CTA boxes lead to Methodology and Research areas. The report/topic pair stacks at 760px and below; the CTA boxes stack at 480px and below.

About uses a concise title, introduction and Contact action, followed by About, Mission, Why and Contact. Each row pairs a heading with short copy; below 760px, it becomes one reading column. Contact contains one invitation, the editorial email, copying feedback and a manual fallback. Publication ledgers, subject indexes, independence chapters and separate inquiry categories do not appear here.

Research areas (`/research-areas`) holds the five subjects, their scope, questions, evidence to examine and truthful publication availability. Native disclosures keep the first area open by default and permit each area to open independently. Subjects with publications link to the corresponding Research filter; subjects without work say so. This guide is distinct from Home's three provisional upcoming topics.

Methodology gives the real evidence trace full width, followed by a two-item page index and continuous five-rule reading path. The former publisher directory and source-category section are removed. Below 760px, the quoted claim and supporting evidence stack. Rule examples stay adjacent to their explanation on larger layouts and follow it on smaller screens.

Research keeps its white search instrument, neutral facets, open result rows and optional preview. The preview uses a dividing rule. The PDF reader keeps the supplied document and controls central. Existing desktop, inline-preview, disclosure, narrow-toolbar and short-height adaptations remain functional requirements.

Policy pages keep compact titles, horizontal facts, static chapter links and title/body rows. The white footer provides a typographic signature, editorial contact and navigation.

**The Visible Content Rule.** Reading order and explicit controls provide access. Hover and motion may reinforce meaning but never provide the only route.

## Elevation, shapes and imagery

Typography, white space and rules establish depth. Real publication covers and PDF pages retain soft shadows, and covers can lift slightly on hover. Density selections use neutral grey. Citation popovers use a soft overlay shadow that disappears in mobile flow. Open page sections do not receive decorative sheet shadows.

Controls, fields, facets and the two CTA boxes use square geometry. Native disclosures use consistent drawn plus/minus marks. Covers retain the proportions of the supplied report.

**The Owner Imagery Rule.** Real report covers remain visible. The existing `home: null` and `about: null` optional-image configuration is retained, but Home and About do not render its empty frames. Add owner imagery only when supplied, with truthful alt text, dimensions and credit. Do not replace absent imagery with stock or generated placeholders.

## Actions and navigation

Primary actions use burgundy with white labels; neutral outlined secondary actions fill with ink on hover. Shared actions have a 48px minimum height; the homepage primary action uses 56px. Quieter reading links may use neutral ink, while burgundy identifies stronger actions and feedback. The homepage black band uses light secondary-link text and the lighter dark-surface focus token. Arrow icons move 4px on hover; a button press moves down 1px. Focus uses a 2px outline and 3px offset.

Primary navigation remains Research, Methodology and About. Research areas is reached through its compact homepage CTA. Smaller screens retain the full-height navigation sheet, readable descriptions, scroll lock, inert background, focus containment and Escape handling. No-JavaScript navigation exposes destinations directly.

Public copy calls the publication collection **Research**. Use direct phrases such as “Check out our research,” “Look at the research” and “Back to research.” Avoid decorative Record or Archive labels and avoid referring to Tharros as “the project.” Topical uses of record, such as a dataset's metadata record or procurement records, remain appropriate.

## Research and reading tools

Search, clear, research-area options, format/year facets, removable filters, result context, sort, density, suggestions and copying the current view remain one working Research page. Publication rows retain Read, PDF, Cite and Copy link. Wide previews expose metadata, sections, sources and limitations; smaller layouts use inline details. Empty results explain the state and offer recovery. URL state and the complete server-rendered no-JavaScript publication list remain part of `e2e/archive.spec.ts`'s contract; its internal file name is unchanged.

The evidence trace uses real TC-2026-001 passages. Selectable phrases highlight supporting fields and draw leaders where the two-column layout permits. Visible “Traced to” feedback explains the selected relationship at every size. All supporting evidence remains readable before interaction; Enter and Space activate phrase controls. Its heading is Supporting evidence.

The reader retains contents, page navigation, zoom and fit, search and matches, fullscreen with overlay fallback, download, visible loading/error states and citation formats. Clipboard actions retain manual selection when copying is unavailable. The owner's PDF is never edited or restyled.

## Motion

The homepage has one finite authored entrance. Tharros reveals from left to right and Canada from right to left through masked text and opposing 32px translations, each over 900ms with the shared ease-out. Canada's reveal starts 120ms later. The decorative slash unfolds vertically over 1100ms after a 180ms delay, completing the sequence at 1280ms. It runs once, does not loop and is assigned only within `prefers-reduced-motion: no-preference`. The default CSS shows the complete title and slash; reduced motion receives that static final state. The heading remains ordinary HTML, the slash is hidden from assistive technology and the introduction and actions remain static. This CSS-only entrance also works without JavaScript.

Shared state transitions use `--dur-1` (150ms), `--dur-2` (250ms) and `--ease-out` (`cubic-bezier(0.16, 1, 0.3, 1)`). The cover transition lasts 420ms. Evidence leaders draw only after a changed phrase selection (560ms); initial rendering and resize place them without motion.

Scroll-linked progress and rules remain enhancements behind reduced-motion and feature-detection guards. Scroll-linked keyframes may use only transform, translate, scale or stroke-dashoffset. The finite homepage text entrance additionally uses clip-path masks. Reduced motion removes smooth scrolling, collapses ordinary timing, disables view transitions and suppresses animated trace drawing. Report navigation also honours it in JavaScript.

## Quality and truth

Preserve the research tools, report controls, supplied covers and PDFs, indexing choices and no-JavaScript reading paths. Upcoming ideas belong in `src/data/upcoming-research.ts`, separate from verified publications, and remain visibly provisional. A subject taxonomy does not imply completed work.

Do not invent publications, personal details, institutional affiliation, endorsements, data or source retrieval dates. Keep retired intake and live feeds retired. Do not restore removed homepage field/method essays, the methodology source directory or the long About reference sections without a new owner request.

CSS remains one rule per line. Small copy, layout and CSS fixes use source/diff review and relevant targeted lint, with the owner reviewing appearance and reporting tweaks or bugs. Do not add automated visual tests, take screenshots, run whole suites or build by default for these fixes. Behavior changes need meaningful checks for the affected paths; full browser runs are reserved for an explicit request or a significant functional change. Follow AGENTS.md's proportional-check policy and report only the checks actually run. This design record itself does not establish contrast, accessibility, browser or performance results.
