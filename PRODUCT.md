# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web.

## Readers

Tharros Undergraduate Publishing is preparing to serve Canadian university undergraduates across disciplines. Authors want to turn strong university work into publications they can share in a portfolio, on a résumé or LinkedIn profile, and in internship, scholarship or graduate-school applications. Readers come to inspect the published work, its sources, methods and limitations.

The initial audience is Canadian university students. International expansion is a future possibility, not a current service or partnership claim.

## Product purpose

Tharros Undergraduate Publishing transforms strong undergraduate work into professionally published research students can showcase beyond the classroom. Eligible work includes original research papers, essays, policy briefs, data-analysis projects, literature reviews, case studies, honours research and interdisciplinary work.

The platform is preparing for launch. Submissions are closed and publication pricing is forthcoming. The site explains the planned service, helps students prepare their work and preserves access to existing owner-supplied reports. There is no active upload form, payment flow or submission backend.

The site makes three things easy:

- understand the planned publishing service and prepare eligible work;
- read and download existing publications and inspect their evidence;
- contact Tharros with a publishing question or editorial correction.

## Positioning

Tharros is a professional undergraduate publishing platform. Editorial screening and professional presentation provide the service's value. Publication may become a useful portfolio piece; the platform makes no employment, admission, scholarship, accreditation or academic-prestige guarantee.

The planned process is Submit → Review → Refine → Publish. Its operational stages are submission, screening, decision, payment, preparation and publication. Screening checks academic quality, citations and sourcing, originality, writing quality, suitability and formatting. Decisions are accepted, accepted with revisions or rejected. Payment follows acceptance; a fee never replaces an editorial decision.

The planned publication includes a professional PDF, a stable public publication page and URL, a publication date and a recommended citation. Author profiles are optional and require consent. New profile details, affiliations and biographies are published only when supplied, verified and approved. `organization.lead` remains `null`.

Tharros claims no incorporation, institutional affiliation, endorsement, partnerships, clients, funders or formal peer-review status without verified evidence. Existing publication bylines and facts remain intact.

## Current public surfaces

- **Home:** preserve the existing Tharros Canada hero exactly, including the masthead, burgundy slash, opposing text reveals, slash animation and opening introduction/action band. The undergraduate publishing pivot begins below that opening. Launch content introduces the service, eligible work, planned process and forthcoming submissions and pricing.
- **Publications:** searchable publications at `/research`, report pages at `/research/<slug>` and stable `/research/id/<reference>` URLs. Existing references, slugs, dates, citations, PDFs and indexing settings remain unchanged. Search, facets, URL state, sort, density, suggestions, Cite, PDF, Copy link and the no-JavaScript list stay available.
- **Author profile:** `/authors/magnus-abdelnour` lists the existing reports under their supplied Magnus Abdelnour byline. No university affiliation, biography or external profile links have been supplied or added. The profile is `indexable: false`; profile indexing requires separate approval.
- **Submission guidelines:** `/submit` gives eligibility, preparation guidance, quality standards and the planned service. It clearly states that submissions are forthcoming and pricing is undecided. It has no upload form or payment control.
- **How it works:** `/how-it-works` explains the four-part journey and all six operational stages, with launch status visible.
- **About:** mission, author value, planned editorial standards and the real contact at `/about#contact`. No personal profile or invented organization details.
- **Research areas and Methodology:** existing evidence and subject guides remain available as supporting resources. Existing reports retain their stated Canada–Europe questions; that scope does not limit the new undergraduate publishing service.
- **Documents:** Privacy, Accessibility and Copyright describe the current site. Existing reports keep their recorded licences. Future submission and publication terms must be approved before intake opens.
- **The 404 page:** publication search and useful destinations.

Primary navigation is Publications · How it works · About · Submission guidelines. The publication archive remains at `/research` to preserve existing links. Retired service URLs retain their redirects, and the former research-request API returns 410 and accepts no submissions.

## Evidence and launch commitments

- Publisher, source, reference period, licence and limitations stay visible where research or data is shown.
- When a source is unavailable, show that it is unavailable rather than plausible substitute values.
- Naming a public institution identifies a source or a verified author detail and never implies endorsement.
- Publications contain real work only, with no placeholders, invented authors or fabricated data.
- Existing owner-supplied PDFs are never edited, including metadata and bookmarks. Metadata and corrections belong in the site record, subject to `docs/REPORT_REQUIREMENTS.md`.
- Existing report references, slugs, dates, facts, citations, licence records and private-by-link status remain intact through the pivot.
- Reports remain `indexable: false` until the owner explicitly approves external search-engine indexing. They stay excluded from the sitemap, llms.txt and readership totals. They remain listed and searchable in the onsite `/research` archive, with its tools available.
- No source retrieval or access dates appear in records or public copy. Retired research intake and removed live feeds remain retired.
- Future contributed manuscripts require owner-supplied material and approved intake, editorial, payment, privacy and publication terms before a real submission flow opens.
- Do not publish a fee, submission opening date, review turnaround, acceptance rate, optional package or external partnership without owner approval and implementation evidence.

## Brand and language

The service name is **Tharros Undergraduate Publishing**. The supplied slogan is **Your résumé looks better when you’re published.** The supporting line is **Turn your strongest undergraduate work into a professional publication.** These express the intended service; surrounding copy explains its actual launch state and editorial process.

Use white ground, neutral dark ink and black surfaces, with sparse burgundy (`#782c3d`), deep burgundy hover (`#55202c`) and muted red details (`#9e354c`). Space Grotesk carries the identity and titles; Schibsted Grotesk carries prose and controls. The homepage's existing Tharros Canada opening stays exactly as before at the owner's request. Its opposing text reveals and slash unfold run once when motion is permitted. Reduced motion shows the complete composition. Real supplied covers remain the principal publication imagery.

Public navigation wording is **Publications**. Use direct actions such as “Browse publications,” “Prepare your submission” and “Ask a publishing question.” A submission CTA leads to the closed-status guidance at `/submit` until intake opens. Do not imply that a student can upload or pay now.

`DESIGN.md` records the implemented visual system. `docs/PUBLISHING-LAUNCH.md` records the launch boundary and the work required before submissions can open.

## Product principles

- Lead with legitimate undergraduate work and a clear explanation of the publishing service.
- Keep the retained homepage opening intact and put the pivot content below it.
- Distinguish current launch preparation from future operational services.
- Organize publications around their actual questions and evidence; future disciplines, universities and authors require verified publication records.
- Preserve every existing publication tool, URL and evidence record.
- Keep About focused on mission and contact, Submit on preparation and launch status, and How it works on the planned publishing process.
- Publish author information with consent, without inferring affiliation, biography or credentials.
- Let real accepted work establish credibility and justify any future taxonomy or service expansion.

## Quality targets

- **Accessibility:** WCAG 2.2 AA. Semantic structure, keyboard access, visible focus, contrast, labelled controls, error recovery, reduced motion, HTML equivalents for graphics and purposeful mobile layouts.
- **Core Web Vitals:** LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.
- **Verification:** proportional checks follow `AGENTS.md` and `README.md`. Appearance is reviewed by the owner. Retained opt-in Playwright tests cover behavior and accessibility; screenshot comparisons and visual-baseline refreshes are outside the current workflow. Targets do not imply completed checks for a revision.
