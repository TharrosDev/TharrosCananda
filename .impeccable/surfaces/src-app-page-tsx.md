---
version: 2
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/research/page.tsx","src/app/research-services/page.tsx","src/app/request-research/page.tsx","src/app/about/page.tsx","src/app/how-it-works/page.tsx","src/app/methodology/page.tsx","src/app/privacy/page.tsx","src/app/accessibility/page.tsx"]
---

## Scope

Whole public site. Persuade on home/services, inform on document/research pages, and operate inside research intake.

Audience: businesses and organizations with Canada–Europe commercial questions. Primary action: commission scoped research. Proof: official data, transparent methods, clearly defined services, and verified research as it is published.

Constraints: no invented evidence or implied institutional affiliation; WCAG 2.2 AA target; ivory/graphite/red system; official publisher names are attribution, never endorsements.

## Direction contract

THESIS: Tharros is an evidence-led commercial research house. The interface uses a strict ledger grammar—rules, registers, publication metadata and source annotations—without pretending the business is larger or more established than verified evidence supports.

OWN-WORLD: Warm ivory, graphite ink, dark chapter bands, muted action red, steel quantitative series, Source Serif 4 and Schibsted Grotesk. The visual material comes from data/research artifacts, not stock photos or generic dashboard cards.

STORY: Read the Canada–Europe Atlantic route → start from a decision/service → inspect the four research areas → review method/research archive → commission a scoped answer.

FIRST VIEWPORT: Home opens with a dark, full-bleed evidence atlas beside the statement-scale proposition and commission action. Compact dark heroes introduce task pages; archive, methodology, process and policy routes use light editorial document headers. About and Commission Research use dedicated statement and scope-desk compositions.

FORM: Primary navigation is Services · Research · Methodology · About. The four research areas remain a homepage summary and archive taxonomy rather than a standalone route. Three services: Custom & Partner Research (flagship), Market Assessment, Buyer & Partner Research; no published prices. The archive stays empty until genuine publications exist and is prepared for area/type/date filtering plus title/summary/tag search across Intelligence Briefs, Research Reports, Market Notes, Data Notes and Sector Analyses.

FINISH: unreviewed or undocumented work is unfinished. A production pass ends with lint, typecheck, tests and build passing and agent-facing documentation aligned to the shipped architecture.

## Direction contract: Evidence Instruments (Methodology, About, Research Services, Request Research; 2026-09-23)

THESIS: Prove, don't describe. Each of the four pages runs one instrument that shows the method working on real records, refusing the category default of heading, prose and a ruled list.

OWN-WORLD: Unchanged tokens. Steel carries every trace, connector, count and data mark; red is actions only; green is the received state. Documents and instruments sit on ivory-light paper sheets with a soft page shadow; square geometry; one rule per boundary; no cards.

STORY: Methodology proves the method on TC-2026-001; About shows what exists, what the institute is and what it refuses; Services shows the deliverable before the ask; Request writes the brief as the visitor types.

FIRST VIEWPORT: Methodology: H1 and deck (cols 1–4) beside the provenance trace panel (cols 5–12), a phrase traced by default. About: statement-scale H1, then the deck beside the Ottawa–Brussels route drawn as the masthead rule. Services: H1 with the "Private by default." notice, then the specimen shelf with the flagship cover. Request: compact dark task hero with the three-step sequence, then the form beside the live brief sheet.

FORM: overdrive direction "Evidence Instruments", chosen by the owner through a structured question (no concept-seed roll). Signature interactions: the trace's steel leaders drawn from a phrase's line to its record fields (WAAPI); the sample cover morphing into the reader (View Transitions); the brief filling live and taking a green "Received" stamp. Motion grammar: section rules draw in on a view() timeline (transform only), the method rail fills on a named view timeline; nothing is hidden by scroll-linked motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance


## Direction contract: Front page and Reading room (Home, Research, documents; 2026-09-24)

THESIS: The proof comes first, and the research tool does not regress. Home leads with the latest real release as a document. The archive becomes a reading room where a search reaches inside the PDFs and lands on the page it matched.

OWN-WORLD: Tokens are unchanged, and the Evidence Instruments grammar is extended:
- ivory-light sheets under dark running-head bars (the Methodology trace bar);
- steel for counts, page numbers and match highlights;
- red for actions only;
- square geometry and one rule per boundary.
The 12-column construction grid is exposed only behind the home front page.

STORY:
1. Home: read the latest release, then the five fields on the Atlantic plate, then commission a question.
2. Research: search or filter in the rail, scan the results, and inspect the record (matches by page, contents, sources, limitations) without leaving the page.
3. Open the report at the exact page.

FIRST VIEWPORT:
- Home: the H1 and actions (cols 1–6) beside the latest-release sheet (cols 7–12).
- Research: the slim banner with the method line, then the rail, results and record pane side by side from 1180px.
- Documents: the H1 and deck beside the document's record (updated, contact, standard or licence), then the contents rail beside one sheet of numbered clauses.

FORM: The overdrive directions "Front page" (Home) and "Reading room" (Research) were chosen by the owner through a structured question, alongside tame document upgrades for Privacy, Accessibility, Copyright, How it works, the 404 and the report page.
- Signature interaction: a report cover on Home or in the archive morphs into the report's first page (React ViewTransition, shared name `cover-<slug>`).
- Match deep links: `#page=N&search=word` opens the viewer at the page, with its find already running.
- Every archive feature is preserved: search, facets, URL state, density, sort, suggestions, Cite, PDF, Copy link and the no-JS list.

FINISH: The build ends with lint, typecheck, unit tests and the e2e suites passing. Visual baselines are refreshed on CI and reviewed, DESIGN.md is rewritten to the shipped state, and the new labels are flagged for owner approval in the PR. The owner asked for no multi-agent review, so the finish check was done inline.
