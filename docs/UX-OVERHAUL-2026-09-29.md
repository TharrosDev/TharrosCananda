# Tharros Canada UX revisions — 2026-09-29

## Current simplification and burgundy revision

The latest owner instructions replace the earlier statement-led homepage with a large Tharros Canada identity beside a black Canada–Europe diagram. Three fine connection lines draw once over 4.2 seconds, staggered by .2 and .4 seconds, only when motion is permitted. Reduced motion shows the complete static diagram. Its pale line/node shades are local on-dark details; the wider site uses white ground, neutral ink and sparse burgundy actions.

Home now pairs a compact latest real cover/report with three draft upcoming topics, with the first marked In progress. The ideas live in a separate registry and a visible note says titles and scope may change. Two small CTA boxes replace the long field and methodology essays, linking to Methodology and the new `/research-areas` route.

About now contains short About, Mission, Why and Contact sections, with one editorial invitation and the existing email/copy recovery. The publication ledger, subject guide, source and independence chapters, separate inquiry categories and empty imagery frame have been removed. Research areas owns the five native subject disclosures and actual publication availability.

Methodology retains the real TC-2026-001 evidence trace and five research rules. The public source directory and source-category section are removed. The trace heading says Supporting evidence. Public collection wording throughout the site is Research; topical uses of record remain where needed, while decorative Record/Archive labels and the project wording are removed.

The palette is neutral ink `#151515`, burgundy `#782c3d`, deep hover `#55202c`, muted red `#9e354c` and pale state `#f6edf0`. The legacy `--blue` token resolves to ink. Real report covers remain visible; Home and About do not render null optional imagery frames. Owner PDFs, publication facts, indexing choices, Research instruments and reader controls remain authoritative.

DESIGN, PRODUCT, the schemaVersion 2 sidecar, direction, quality bar and surface briefs describe this revision. Their criteria do not themselves establish QA. The current check scope is recorded below. The later historical table is evidence for the **superseded earlier Open Issue composition only**, not for this simplification. Its historical captures, test totals and finish verdict are retained for traceability and must not be cited as current validation.

### Current validation scope

| Check | Confirmed result and scope |
| --- | --- |
| Lint and TypeScript | Final full lint and typecheck completed with exit 0. |
| Unit tests | 89 tests passed across 22 files. |
| Fresh production build | The separate final production build completed with exit 0. |
| Functional browser tests | A fresh run against an independently managed production server on port 3101 completed with exit 0: 178 passed, 46 intentional platform skips, 0 unexpected failures and 0 flaky tests; 81.4 seconds. |
| Responsive captures | Root inspected 12 captures across six routes at 1440px desktop and 390px mobile; those captures showed no horizontal page overflow or page errors. |
| Hero motion | Root observed the 4.2-second draw with .2/.4-second staggering and one iteration. This timing check is separate from reduced-motion static screenshots. |
| Protected research artifacts | Git diff was empty for supplied PDFs, the publication registry, generated report assets and organization data. |
| Independent finish review | Disposition: **ship**. The reviewer inspected all 12 current captures and found no material fixes. |

The earlier auto-server browser run completed its test cases but stalled during server shutdown and was interrupted. The separately managed production-server rerun above resolved the runner uncertainty and exited successfully. The independent finish review above applies to these current captures. Linux visual baselines were unavailable locally because WSL had no installed distribution and remain pending the CI baseline workflow. Remote CI, deployment, physical-device testing and broader browser coverage were not established by these checks.

## Historical: earlier Open Issue revision

### Approved direction

The owner first selected Open Questions, candidate 7, seed `f037cd34`. A second working chooser, key `e5ea266c`, produced the later direct approval of **The open issue**, seed `df0d4fa0`. The owner explicitly asked to keep image places empty so they can supply imagery later. The second approval governs the current implementation.

The current system uses a white page, dark ink, selective ultramarine, neutral grey grouping, restrained pale blue evidence states, and small orange identity details. Space Grotesk supplies display type; Schibsted Grotesk supplies prose and controls. DESIGN and the schemaVersion 2 sidecar describe the implemented tokens and patterns. The direction, quality, and surface contracts retain the choice history without treating the first composition as current.

### Current composition and tasks

- **Home:** a full-width statement leads into an unboxed asymmetric publication/project spread. The report record includes its real cover, full registry summary, reading action, and PDF metadata. Earlier publications remain quieter linked records. A native open-question index follows, then one full-width method invitation.
- **About:** compact purpose, a factual ledger beside a publication-title index, subject disclosures, an independence/principles chapter, and operational editorial-contact rows.
- **Methodology:** a white workshop gives the real TC-2026-001 evidence instrument full width and keeps “Traced to” feedback visible. A continuous five-rule reading path leads into a source register enhanced by text search and region selection. Native region links and all ten publishers remain available without JavaScript.
- **Archive:** the established tool layout remains, with a compact ink heading, framed white search, neutral facets, open results, and a ruled optional preview. Search, URL state, density, sort, suggestions, Cite, PDF, Copy link, details, and the no-JavaScript list remain functional requirements.
- **Report:** compact title/record framing and direct reading/evidence destinations surround the unchanged owner's PDF. Existing contents, page navigation, zoom/fit, search/matches, fullscreen fallback, download, and citation controls remain.
- **Policy pages:** white title and horizontal facts, static horizontal chapter links, and title/body reference rows.
- **Footer and navigation:** a white typographic signature with compact navigation/contact columns; desktop navigation uses underline feedback and mobile navigation retains its full-height described destinations.

### Owner-supplied imagery

`src/data/editorial-images.ts` contains exactly two entries: `home: null` and `about: null`. Home has one 16:9 editorial frame and About one 3:2 frame. An empty entry renders a neutral frame without an image or caption; the empty frame is hidden from assistive technology. Methodology has no editorial image slot.

The owner will supply imagery later. A configured record supports source, alt text, intrinsic dimensions, and optional credit; credit produces a caption only when an image record supplies it. No generated or stock imagery, placeholder image text, icon, caption, or upload prompt populates either empty frame. Real supplied publication covers remain separate report artifacts.

### Truth and interaction

The revision uses existing publication facts, source records, and owner PDF artifacts. It does not change report indexing choices or restore retired intake and live feeds. PRODUCT and REPORT_REQUIREMENTS continue to govern those boundaries.

Native disclosures and links provide useful reading paths before hydration. Search and filtering progressively enhance complete source and archive records. Focus, explicit trace feedback, current-section cues, contact copy recovery, and responsive controls support the working tasks. Reduced motion removes smooth scrolling and view transitions and suppresses animated trace drawing without hiding content.

### Validation status

The following historical evidence applies only to the earlier integrated Open Issue revision:

| Check | Result and scope |
| --- | --- |
| Lint and TypeScript | Final full lint and typecheck passed. |
| Unit tests | 90 unit tests passed. The final CSS-guard run passed all four tests. |
| Production builds | Both integrated production builds passed. |
| Initial full nonvisual browser run | Of 238 tests, 192 passed, 45 intentional platform checks were skipped, and one failed because two mobile evidence links were only 21px tall. The links were corrected to 44px targets. This was not an all-green full-suite run. |
| Fresh confirmation | The site and methodology suites plus 18 capture tests completed: 78 passed, 24 expected platform checks were skipped, and none failed, across 102 tests. This scoped rerun confirmed the mobile-link correction and final focus and image-component cleanup. |
| Captures | 36 images cover nine routes at two device sizes, with full-page and viewport captures. All 36 were inspected. |
| Independent finish review | Disposition: **ship**. All five review-contract sections were complete, with no material fixes. Review covered the supplied screenshots and sampled code, including distinct page structures, typography, white ground, the evidence workshop, research/reader adaptation, mobile reflow, and owner-controlled empty frames. |

The earlier Open Questions counts apply to a superseded first composition and are not used as evidence for this revision. The finish review does not recertify the historical detector; no detector rerun is claimed. Reduced-motion captures show preserved content, not live timing. Linux visual baselines, remote CI, deployment, physical devices, and broader browser coverage remain outside this evidence.
