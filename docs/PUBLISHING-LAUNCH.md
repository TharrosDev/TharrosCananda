# Undergraduate publishing launch

The September 30, 2026 pivot prepares Tharros Undergraduate Publishing to serve Canadian university undergraduates across disciplines. The site describes a planned service while retaining the existing publication archive and evidence infrastructure.

## Current state

- Submissions are closed: `publishing.submissionsOpen` is `false` in `src/data/publishing.ts`.
- Publication pricing is forthcoming: `publishing.fee` is `null`. No publication fee has been supplied or approved.
- `/submit` provides eligibility and preparation guidance. It has no upload form, account requirement, payment control or manuscript submission endpoint.
- `/how-it-works` explains the planned publishing process. Its descriptions are launch preparation, not evidence of an operating review service.
- `/about#contact` provides the existing editorial contact for publishing questions and corrections. It is not a manuscript intake channel.
- `/authors/magnus-abdelnour` groups existing reports under their supplied Magnus Abdelnour byline. No university affiliation, biography or external profile links have been supplied or added. The author record is `indexable: false`; profile indexing is approved separately from publication indexing.
- The retired research-request API remains closed with HTTP 410. Legacy request retention and separate backend retirement remain governed by [`OPERATIONS.md`](OPERATIONS.md).
- No opening date, review turnaround, acceptance rate, optional service package or institutional partnership has been approved.

The homepage retains its existing Tharros Canada hero exactly, including the masthead, slash, animation and opening introduction/action band. Undergraduate publishing content begins below it. Primary navigation is Publications · How it works · About · Submission guidelines; `/research` remains the archive URL.

## Planned service

The product turns accepted original undergraduate work into a professionally presented, publicly accessible publication. Work may include research papers, essays, policy briefs, data-analysis projects, literature reviews, case studies, honours research and interdisciplinary work.

The concise journey is **Submit → Review → Refine → Publish**. The operational stages are:

1. **Submit:** an author supplies a complete original manuscript and basic author information through a future approved intake process.
2. **Screening:** assess academic quality, citations and sourcing, originality, writing quality, suitability and formatting.
3. **Decision:** accepted, accepted with revisions or rejected. Required revisions must be addressed before the work proceeds.
4. **Payment:** request the approved publication fee only after acceptance. Payment does not replace editorial screening.
5. **Preparation:** format and prepare the accepted work, with accurate authorship and source attribution.
6. **Publish:** provide a professional PDF, a stable publication page and URL, a publication date and a recommended citation. An author profile is optional and requires consent.

Plagiarism, fabricated research, unsupported claims and incomplete work do not meet the stated standard. No submission is guaranteed publication. Publication can provide a portfolio piece; no job, admission, scholarship or prestige outcome is promised.

## Existing research remains intact

The product pivot does not reinterpret an existing report as a new student submission or paid publication. Preserve:

- original PDFs, including their bytes, metadata and bookmarks;
- references, slugs, dates, publication facts, bylines and evidence;
- existing recommended citations and publisher attribution;
- licence records and any restrictions attached to supplied material;
- `/research/<slug>` and `/research/id/<reference>` links;
- archive search, facets, URL state, density, sort, suggestions, Cite, PDF, Copy link and the no-JavaScript list;
- `indexable: false` until the owner explicitly approves public indexing.

The pivot keeps external search-engine indexing disabled and preserves the reports' exclusion from the sitemap, llms.txt and readership totals. Reports remain listed and searchable in the onsite `/research` archive, with its existing tools available. No placeholders or invented authors are added to make the new service appear populated. Source retrieval and access dates remain absent. See [`REPORT_REQUIREMENTS.md`](REPORT_REQUIREMENTS.md) and [`DATA_SOURCES.md`](DATA_SOURCES.md).

## Author information

Keep existing publication bylines as supplied. New author names, university or program details, biographies and external links need owner-supplied, verified and approved records. A student's university identifies their own supplied affiliation; it does not imply a partnership or endorsement of Tharros.

Author profiles are optional and require explicit publication consent. The new positioning does not authorize publishing a founder profile or personal details. `organization.lead` remains `null`; other organization fields remain empty until verified values are supplied and approved.

## Before opening submissions

The owner must approve the actual service and its terms before the launch status changes. Required decisions and implementation include:

- eligible authors and work, file requirements, contributor permissions and originality rules;
- screening responsibility, revision handling, decision communication and the limits of editorial review;
- exact publication pricing, any optional services, payment handling and applicable cancellation or refund terms;
- manuscript collection, access, retention and deletion practices, reflected accurately in privacy information;
- copyright, licences, author consent, profile visibility, corrections and withdrawal terms;
- a working intake and publication workflow with meaningful behavior, data and security checks.

Future contributed work requires owner-supplied manuscripts and approved terms. Professional preparation of a future accepted manuscript does not permit editing any existing owner-supplied PDF. Backend changes and their deployment are separate from the current content launch. Update [`PRODUCT.md`](../PRODUCT.md), this document and affected policies with the implementation; follow the proportional checks in [`AGENTS.md`](../AGENTS.md).
