# Undergraduate research showcase launch

Tharros Canada is an undergraduate research showcase and searchable public database with author profiles that display authored works. It gives strong academic work a professional home beyond the classroom, so students can share, cite and reference it in résumés, applications, LinkedIn profiles and professional portfolios. The initial audience is Canadian university undergraduates across disciplines. [`PRODUCT.md`](../PRODUCT.md) contains the exact owner-supplied definition.

## Current state

- Submissions are closed: `publishing.submissionsOpen` is `false` in `src/data/publishing.ts`.
- Pricing is undecided: `publishing.fee` is `null`. No fee has been supplied or approved, and the site makes no claim of free publication.
- `/submit` provides eligibility and preparation guidance. It has no upload form, account requirement, payment control or manuscript submission endpoint.
- `/research` is the current searchable research database, retaining its citation, PDF and sharing tools.
- `/authors` lists real author records and links to authored work. The directory is `noindex` and absent from the sitemap and llms.txt until the owner approves indexing.
- `/how-it-works` explains Prepare → Review → Publish → Showcase. The contribution and review descriptions are launch preparation, not evidence of an operating intake service.
- `/about#contact` provides the existing editorial contact for questions and corrections. It is not a manuscript intake channel.
- `/authors/magnus-abdelnour` groups existing reports under their supplied Magnus Abdelnour byline. No university affiliation, biography or external profile links have been supplied or added. The author record is `indexable: false`; profile indexing is approved separately from publication indexing.
- The retired research-request API remains closed with HTTP 410. Legacy request retention and separate backend retirement remain governed by [`OPERATIONS.md`](OPERATIONS.md).
- There are no self-serve accounts, profile editing, messaging or social-network features. Profiles display verified authored work and optional approved details.
- No opening date, review turnaround, acceptance rate, publication package or institutional partnership has been approved.

The homepage retains its existing Tharros Canada hero exactly, including the masthead, slash, animation and opening introduction/action band. The research showcase, database and profile introduction begins below it. Primary navigation is Research database · Authors · How it works · About · Showcase your work; `/research` remains the database URL and `/submit` remains forthcoming-contribution guidance.

## Planned contribution and showcase process

The platform connects original undergraduate work with a searchable publication record and an optional author profile. Work may include papers, research projects, policy briefs, data work and other academic work. Its repository, portfolio and LinkedIn-style referencing elements make authored work easy to find, share and include in professional materials.

The public journey is **Prepare → Review → Publish → Showcase**:

1. **Prepare:** gather complete original academic work, citations, permissions and basic author information for a future approved intake process.
2. **Review:** assess academic quality, citations and sourcing, originality, writing quality, suitability and formatting. Decisions are accepted, accepted with revisions or rejected; required revisions must be addressed before publication.
3. **Publish:** give accepted work a stable publication page and URL, accurate authorship, a publication date, its supplied document and a recommended citation in the research database.
4. **Showcase:** share the publication link, reference its citation, and connect authored works through an optional profile for résumés, applications, LinkedIn and professional portfolios.

Plagiarism, fabricated research, unsupported claims and incomplete work do not meet the stated standard. No submission is guaranteed publication. The platform can provide a useful reference and portfolio piece; no job, admission, scholarship or prestige outcome is promised. Pricing and payment terms require separate owner approval before intake opens and never replace an editorial decision.

## Existing research remains intact

The product update does not reinterpret an existing report as a new student submission or paid publication. Preserve:

- original PDFs, including their bytes, metadata and bookmarks;
- references, slugs, dates, publication facts, bylines and evidence;
- existing recommended citations and publisher attribution;
- licence records and any restrictions attached to supplied material;
- `/research/<slug>` and `/research/id/<reference>` links;
- archive search, facets, URL state, density, sort, suggestions, Cite, PDF, Copy link and the no-JavaScript list;
- `indexable: false` until the owner explicitly approves public indexing.

External search-engine indexing stays disabled, with reports excluded from the sitemap, llms.txt and readership totals. Reports remain listed and searchable in the onsite `/research` database, with its existing tools available. No placeholders or invented authors are added to make the platform appear populated. Source retrieval and access dates remain absent. See [`REPORT_REQUIREMENTS.md`](REPORT_REQUIREMENTS.md) and [`DATA_SOURCES.md`](DATA_SOURCES.md).

## Author information

Keep existing publication bylines as supplied. New author names, university or program details, biographies and external links need owner-supplied, verified and approved records. A student's university identifies their own supplied affiliation; it does not imply a partnership or endorsement of Tharros.

Author profiles are optional and require explicit publication consent. The directory and profile pages use real records; their indexing gates remain separate from report indexing. The new positioning does not authorize publishing a founder profile or personal details. `organization.lead` remains `null`; other organization fields remain empty until verified values are supplied and approved.

## Before opening submissions

The owner must approve the contribution workflow and its terms before submissions open. Required decisions and implementation include:

- eligible authors and work, file requirements, contributor permissions and originality rules;
- screening responsibility, revision handling, decision communication and the limits of editorial review;
- a pricing decision, any payment handling, and applicable cancellation or refund terms;
- manuscript collection, access, retention and deletion practices, reflected accurately in privacy information;
- copyright, licences, author consent, profile visibility and editing permissions, corrections and withdrawal terms;
- a working intake and publication workflow with meaningful behavior, data and security checks.

Future contributed work requires owner-supplied manuscripts and approved terms. Professional preparation of a future accepted manuscript does not permit editing any existing owner-supplied PDF. Backend changes and their deployment are separate from the current content launch. Update [`PRODUCT.md`](../PRODUCT.md), this document and affected policies with the implementation; follow the proportional checks in [`AGENTS.md`](../AGENTS.md).
