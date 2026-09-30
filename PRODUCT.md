# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web.

## Readers

People following Canada–Europe policy and industry questions: researchers, students, journalists, practitioners and interested readers. They come to read a report, check its sources and limitations, find related work and send editorial questions or corrections.

## Product purpose

Tharros Canada is an independent student research initiative. It publishes its own reports on questions connecting Canada and Europe, along with data notes that test whether public evidence is fit for a stated use. It does not offer commissioned research services.

The site makes three things easy:

- read and download real published work;
- inspect the sources, methods and limitations behind it;
- explore research interests and contact Tharros about a question, correction or future topic.

## Positioning

Tharros presents independent student research without claiming government status, legal or regulatory advice, institutional affiliation, fellows, clients, funders, partnerships or policy influence it cannot verify. It names the author of each report without adding a personal profile until verified details are supplied and approved.

Credibility comes from inspectable sources, explicit uncertainty and published work. The current scope is Canada–Europe policy and industry broadly; each report defines its own precise question. No narrower sector specialty is claimed yet.

## Current public surfaces

- **Home:** a large Tharros Canada identity and quiet connecting-line diagram, the compact latest real release, three draft upcoming topics and two direct CTAs to Methodology and Research areas.
- **Research:** searchable publications at `/research`, report pages at `/research/<slug>` and stable `/research/id/<reference>` URLs. Search, facets, URL state, sort, density, suggestions, Cite, PDF, Copy link and the no-JavaScript list stay available.
- **Research areas:** a dedicated `/research-areas` guide to the five subjects, scope, questions, useful evidence and actual publication availability. Native disclosures work without JavaScript.
- **Methodology:** source selection, human verification, freshness, fitness for use and limitations, demonstrated through the real worked evidence trace. The public publisher directory and source-category section have been removed.
- **About:** short About, Mission, Why and Contact sections. The editorial address and copying fallback are available without a publication ledger, source directory or separate inquiry categories.
- **Documents:** Privacy, Accessibility and Copyright. Public research is licensed CC BY 4.0.
- **The 404 page:** Research search and useful destinations.

Primary navigation remains Research · Methodology · About. Research areas is reached through the compact homepage CTA. Older service URLs redirect to Research or Methodology; the former request API returns 410 and accepts no submissions.

## Evidence commitments

- Publisher, source, reference period, licence and limitations stay visible where research or data is shown.
- When a source is unavailable, show that it is unavailable rather than plausible substitute values.
- Naming a public institution identifies a source and never implies endorsement.
- Published work contains real reports only, with no placeholders.
- The owner's PDFs are never edited. Metadata and corrections belong in the site record, subject to `docs/REPORT_REQUIREMENTS.md`.
- Reports remain `indexable: false` until the owner explicitly approves public indexing.
- No source retrieval or access dates appear in records or public copy. Retired intake and removed live feeds remain retired.
- Home's upcoming topics are owner-requested draft ideas in `src/data/upcoming-research.ts`, separate from the publication registry. The first shows In progress; a visible note says titles and scope may change. They do not claim completed research, findings, delivery dates or confirmed external activity.

## Brand and language

Use white ground, neutral dark ink and black surfaces, with sparse burgundy (`#782c3d`), deep burgundy hover (`#55202c`) and muted red details (`#9e354c`). Space Grotesk carries the identity and titles; Schibsted Grotesk carries prose and controls. The Canada–Europe diagram draws once when motion is permitted and is complete in reduced-motion mode. Real supplied covers remain the principal report imagery; empty Home and About editorial frames are not rendered.

Public wording is Research. Prefer direct actions such as “Check out our research” and “Look at the research.” Do not use Archive, decorative Record headings or “the project” to refer to Tharros. Topical uses of record remain useful for source metadata, procurement evidence and similar contexts.

`DESIGN.md` records the implemented system and a brief history of the earlier Open Questions and The open issue choices. The latest direct owner instructions govern the simplified composition and burgundy palette.

## Product principles

- Lead with the identity and research; let real work establish credibility.
- Organize publications by question and evidence rather than institutional scale.
- Keep About focused on purpose and invitation. Methodology explains verification, Research areas explains subject interests and Research holds published work.
- Keep the homepage compact after its opening: latest release, three provisional upcoming topics and two navigation boxes.
- The five research areas describe interest and provide Research taxonomy; each does not imply published work:
  - Trade & Economic Integration
  - Defence & Security
  - Energy, Resources & Industry
  - Technology & Strategic Industries
  - Data Quality & Validity
- Let published work justify any future expansion of taxonomy or functionality.

## Quality targets

- **Accessibility:** WCAG 2.2 AA. Semantic structure, keyboard access, visible focus, contrast, labelled controls, error recovery, reduced motion, HTML equivalents for graphics and purposeful mobile layouts.
- **Core Web Vitals:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- **Browser tests:** Playwright covers discovery, research search, report access, responsive layout, axe checks and visual regression. These targets do not imply completed checks for a revision.
