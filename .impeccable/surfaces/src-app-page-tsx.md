---
version: 2
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/app/research/page.tsx","src/app/research/[slug]/page.tsx","src/app/research-services/page.tsx","src/app/request-research/page.tsx","src/app/about/page.tsx","src/app/methodology/page.tsx","src/app/how-it-works/page.tsx","src/app/privacy/page.tsx","src/app/accessibility/page.tsx","src/app/copyright/page.tsx","src/app/not-found.tsx"]
---

## Scope

This covers the whole public site:
- **Persuade** on Home and Research Services.
- **Inform** on Research, report pages, Methodology, About and the documents.
- **Operate** inside Request Research.

**Audience:** businesses and organizations with Canada–Europe questions, and partner firms that need research capacity.

**Primary action:** read the research, then commission a scoped answer.

**Proof:**
- real published research;
- public sources a reader can inspect;
- explicit limitations;
- three clearly defined services.

**Constraints:**
- no invented evidence, people, clients or prices;
- no implied institutional affiliation. Publishers are named for attribution only;
- WCAG 2.2 AA;
- the ivory, graphite, red and steel system;
- the business is pre-incorporation, so organization details stay empty until verified.

## Direction contract

Current as of 2026-09-24. It merges the original ledger direction with the "Evidence Instruments" (2026-09-23) and "Front page / Reading room" (2026-09-24) directions, which the owner chose through structured questions.

THESIS: Prove, don't describe. Tharros is an independent research institute whose interface is an evidence ledger. The proof comes first: the latest real release on Home, and a reading room whose search reaches inside the PDFs and lands on the page it matched. Each supporting page runs one instrument that shows the method working on real records.

OWN-WORLD: The tokens are unchanged.
- Ivory-light sheets, with a soft page shadow, sit under dark running-head bars.
- Steel carries every trace, connector, count, page number and match highlight.
- Red is for actions only, and green is the received state.
- Square geometry, one rule per boundary, no cards.
- The 12-column construction grid shows only behind the Home front page.

STORY:
1. Home: read the latest release, see the five fields on the Atlantic plate, then commission a question.
2. Research: search or filter in the rail, scan the results, and inspect the record without leaving the page.
3. Open the report at the exact page.
4. Methodology proves the method on TC-2026-001.
5. About shows what exists, what the institute is and what it refuses.
6. Services shows the deliverable before the ask.
7. Request writes the brief as the visitor types.

FIRST VIEWPORT:
- Home: the H1 and actions (cols 1–6) beside the latest-release sheet (cols 7–12).
- Research: the slim banner and method line, then the rail, results and record pane from 1180px.
- Methodology: the H1 and deck (cols 1–4) beside the provenance trace, with one phrase traced by default.
- About: a statement H1, then the deck beside the Ottawa–Brussels route drawn as the masthead rule.
- Services: the H1 with the "Private by default." notice, then the specimen shelf led by the flagship cover.
- Request: a compact dark task hero with the three-step sequence, then the form beside the live brief.
- Documents: the H1 and deck beside the document's record, then a contents rail beside one sheet of numbered clauses.

FORM:
- Navigation: Research · Methodology · About, with Commission as the one filled action.
- Three services: Custom & Partner Research (flagship), Market Assessment and Buyer & Partner Research. No published prices.
- The five research areas are archive taxonomy and a homepage ledger, never routes.
- Signature interactions:
  - the report cover morphing into its first page (React ViewTransition, shared name `cover-<slug>`);
  - `#page=N&search=word` deep links;
  - the trace leaders (WAAPI);
  - the sample cover opening into the reader (View Transitions);
  - the brief filling live and taking a green "Received" stamp.
- Motion: section rules draw in on a `view()` timeline, and the rails fill on named view timelines. Nothing is hidden by scroll-linked motion.
- Every archive tool is preserved: search, facets, URL state, density, sort, suggestions, Cite, PDF, Copy link and the no-JS list.

FINISH:
- Unreviewed or undocumented work is unfinished.
- A build ends with lint, typecheck, unit tests and e2e passing, and with visual baselines refreshed on CI and reviewed.
- `DESIGN.md` is updated to the shipped state, and new labels are flagged for owner approval in the PR.
- The finish check is done inline, not by a multi-agent review.
