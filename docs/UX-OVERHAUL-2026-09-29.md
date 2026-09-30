# The Open Issue UX revision — 2026-09-29

## Approved direction

The owner first selected Open Questions, candidate 7, seed `f037cd34`. A second working chooser, key `e5ea266c`, produced the later direct approval of **The open issue**, seed `df0d4fa0`. The owner explicitly asked to keep image places empty so they can supply imagery later. The second approval governs the current implementation.

The current system uses a white page, dark ink, selective ultramarine, neutral grey grouping, restrained pale blue evidence states, and small orange identity details. Space Grotesk supplies display type; Schibsted Grotesk supplies prose and controls. DESIGN and the schemaVersion 2 sidecar describe the implemented tokens and patterns. The direction, quality, and surface contracts retain the choice history without treating the first composition as current.

## Current composition and tasks

- **Home:** a full-width statement leads into an unboxed asymmetric publication/project spread. The report record includes its real cover, full registry summary, reading action, and PDF metadata. Earlier publications remain quieter linked records. A native open-question index follows, then one full-width method invitation.
- **About:** compact purpose, a factual ledger beside a publication-title index, subject disclosures, an independence/principles chapter, and operational editorial-contact rows.
- **Methodology:** a white workshop gives the real TC-2026-001 evidence instrument full width and keeps “Traced to” feedback visible. A continuous five-rule reading path leads into a source register enhanced by text search and region selection. Native region links and all ten publishers remain available without JavaScript.
- **Archive:** the established tool layout remains, with a compact ink heading, framed white search, neutral facets, open results, and a ruled optional preview. Search, URL state, density, sort, suggestions, Cite, PDF, Copy link, details, and the no-JavaScript list remain functional requirements.
- **Report:** compact title/record framing and direct reading/evidence destinations surround the unchanged owner's PDF. Existing contents, page navigation, zoom/fit, search/matches, fullscreen fallback, download, and citation controls remain.
- **Policy pages:** white title and horizontal facts, static horizontal chapter links, and title/body reference rows.
- **Footer and navigation:** a white typographic signature with compact navigation/contact columns; desktop navigation uses underline feedback and mobile navigation retains its full-height described destinations.

## Owner-supplied imagery

`src/data/editorial-images.ts` contains exactly two entries: `home: null` and `about: null`. Home has one 16:9 editorial frame and About one 3:2 frame. An empty entry renders a neutral frame without an image or caption; the empty frame is hidden from assistive technology. Methodology has no editorial image slot.

The owner will supply imagery later. A configured record supports source, alt text, intrinsic dimensions, and optional credit; credit produces a caption only when an image record supplies it. No generated or stock imagery, placeholder image text, icon, caption, or upload prompt populates either empty frame. Real supplied publication covers remain separate report artifacts.

## Truth and interaction

The revision uses existing publication facts, source records, and owner PDF artifacts. It does not change report indexing choices or restore retired intake and live feeds. PRODUCT and REPORT_REQUIREMENTS continue to govern those boundaries.

Native disclosures and links provide useful reading paths before hydration. Search and filtering progressively enhance complete source and archive records. Focus, explicit trace feedback, current-section cues, contact copy recovery, and responsive controls support the working tasks. Reduced motion removes smooth scrolling and view transitions and suppresses animated trace drawing without hiding content.

## Validation status

The following evidence applies to the integrated second revision:

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
