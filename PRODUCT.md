# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web.

## Readers

People following Canada–Europe policy and industry questions: researchers, students, journalists, practitioners and interested readers. They come to read a report, check its sources and limitations, find related work, and contact the project about a correction or collaboration.

## Product purpose

Tharros Canada is an independent student research project. It publishes its own reports on questions connecting Canada and Europe, along with data notes that test whether public evidence is fit for a stated use. The project is not a commissioned research service.

The site makes three things easy:
- read and download real published work;
- inspect the sources, methods and limitations behind it;
- find the archive and send editorial questions, corrections or collaboration inquiries.

## Positioning

Tharros is a student research project, not a government body, a legal or regulatory adviser, or a generic consultancy. It does not claim institutional affiliation, fellows, clients, funders, partnerships or policy influence it cannot verify. It names the author of each report without adding a personal profile until verified details are supplied.

Credibility comes from inspectable sources, explicit uncertainty and published work. The current subject scope is Canada–Europe policy and industry broadly; individual reports define their own precise questions. No tighter sector specialty is claimed yet.

## Current public surfaces

- **Home:** the latest real release, archive subjects and the research method.
- **Research:** the searchable archive, report pages at `/research/<slug>`, and stable `/research/id/<reference>` URLs.
- **Methodology:** source selection, human verification, freshness, fitness for use and limitations, shown through a real data note.
- **About:** what the student project is, what it has published, its principles, boundaries and editorial contact.
- **Documents:** Privacy, Accessibility and Copyright. Public research is licensed CC BY 4.0.
- **The 404 page:** an archive search and useful research links.

Primary navigation: Research · Methodology · About. Older service URLs redirect to the archive or methodology; the former request API returns 410 and accepts no submissions.

## Evidence commitments

- Publisher, source, reference period, licence and limitations stay visible wherever data or research is shown.
- When a source is unavailable, the site shows that it is unavailable rather than plausible substitute values.
- Naming a public institution identifies a source only and never implies endorsement.
- The archive holds real work only, with no placeholder reports.
- The owner's PDFs are never edited. Metadata and corrections belong in the site record, subject to `docs/REPORT_REQUIREMENTS.md`.
- Reports remain `indexable: false` until the owner explicitly approves public indexing.

## Brand

The open issue is the owner's latest approved identity: white ground, dark ink, selective ultramarine, neutral grey, and small orange details, with Space Grotesk for confident statements and editorial titles and Schibsted Grotesk for prose and controls. Open asymmetric reading structures, real publication records, native question disclosures, and inspectable evidence foreground the student project. Two editorial frames stay empty until the owner supplies imagery. `DESIGN.md` records the implemented visual system and the earlier Open Questions choice history.

## Product principles

- Lead with the research and let the work establish the project's credibility.
- Organize the archive by the question and the evidence, rather than by a claim of institutional scale.
- Use research and data as the visual material.
- The five research areas are a homepage summary and archive taxonomy, not a claim that each has published work:
  - Trade & Economic Integration
  - Defence & Security
  - Energy, Resources & Industry
  - Technology & Strategic Industries
  - Data Quality & Validity
- Prefer a narrow real capability over a broad simulated one.
- Let published work justify any future expansion of the taxonomy or functionality.

## Quality targets

- **Accessibility:** WCAG 2.2 AA. Semantic structure, keyboard access, visible focus, contrast, labelled controls, error recovery, reduced motion, HTML equivalents for graphics and purposeful mobile layouts.
- **Core Web Vitals:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- **Browser tests:** Playwright covers reading, archive search, report access, responsive layout, axe checks and visual regression.
