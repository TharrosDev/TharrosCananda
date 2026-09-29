# Responsive spacing and UX audit — September 29, 2026

Scope: the shared header/footer, Home, Research, one permanent report (TC-2026-001), Methodology, About, Privacy, Accessibility, Copyright and the 404. Preserve the evidence-led identity, factual content, report indexing decisions and owner's PDF files.

## Findings and changes

| Priority | Finding and reader impact | Implemented correction |
| --- | --- | --- |
| P2 | Shared page spacing started at 64px, section spacing at 52px, and footer spacing at 72px. Small screens accumulated large intervals between related reading tasks. | Define separate fluid page (48–96px), section (40–72px), block (24–48px) and row (16–28px) roles. Footer uses the same rhythm. |
| P2 | `100vw` shell calculations did not account for scrollbar width or safe areas. | Calculate the bounded 1440px shell from the containing block and safe-area-aware gutters; enable viewport-fit cover without limiting zoom. |
| P2 | Tablet layouts fell from split composition to long single-column registers. | Use two columns for homepage fields/method notes and Methodology publisher registers at 641–980px. Keep About principles two-up to 640px. |
| P2 | Methodology and policy contents links disappeared at 980px. Readers lost direct access to later clauses. | Keep a compact, labelled index above the text on narrow screens, with working plain anchors and the existing current-section indicator. |
| P2 | Report metadata and three actions competed inside a narrow sidebar around 981–1180px; copied labels and fallback inputs had little room. | Stack the report header at 1180px; arrange record/actions side by side on tablets. Protect metadata wrapping and input widths. |
| P2 | Expanded phone archive entries confined summaries, actions and records to the column beside a cover. Citation popovers could exceed their action column. | Preserve the cover/title grouping while moving supporting content across the full entry. Phone citations expand in flow; wide popovers are bounded by their parent. |
| P2 | Archive panels became sticky based only on viewport class, even when the selected record exceeded the available height. | Measure both panels with ResizeObserver. Only fitting panels stick; long records scroll naturally with the page, without nested scrolling. |
| P2 | PDF controls were 40px on touch tablets, and phone visual order differed from keyboard order. Small phones could produce an accidental fourth toolbar row. | Use 44px controls everywhere, 16px search text, matching DOM/visual order and explicit phone rows. Very narrow phones get separate page/zoom rows. |
| P2 | Sticky toolbars/rails consumed a large share of short landscape viewports. | Release PDF toolbars, Methodology contents and atlas maps into normal flow at 600px height and below. |
| P3 | A tracked wordmark, labelled Menu button and fixed 32px gap left little tolerance on narrow phones. Large display titles reached 104px. | Fluid header gap, smaller narrow-phone wordmark and 96px cap for Home/About display titles. |

## Evidence and regression coverage

The incumbent was built and captured before editing at 320, 390, 768, 1024, 1180, 1440 and 2560 CSS px on six representative routes. Default-state document overflow checks passed, so most changes address dense composition, navigation continuity and opened interaction states rather than a claim that every existing page overflowed. The layout detector returned no mechanical findings; source and rendered assessment exposed the issues above.

`e2e/responsive.spec.ts` adds a fixed nine-route matrix at 320, 390, 560, 640, 768, 980, 981, 1020, 1024, 1180, 1181, 1440, 1920, 2560, 3440 and 3840 CSS px. It checks document width and horizontal control containment, including both sides of major layout seams. Dedicated cases cover open phone citations, denied clipboard fallback, long versus fitting sticky records, mobile contents anchors, PDF focus order, landscape toolbar behavior and tablet touch target heights. Existing site/archive/report tests remain the contracts for functional behavior, reduced motion, accessibility, full screen and PDF jumps. Linux screenshot baselines are regenerated and reviewed before merge.

Local validation passed lint, TypeScript, all 90 unit tests, the production build and 146 browser tests (44 intentionally skipped by device/project applicability). The final 3840px extension and Linux screenshot baselines are covered in CI; those results are recorded in the pull request. Local captures span seven widths across six representative surfaces, and the before/after review confirmed phone, tablet and ultrawide composition. This is Chromium emulation and automated axe evidence; physical iPhone/Android testing, Safari/Firefox coverage, screen-reader testing and hardware performance remain separate checks. The 320 CSS px matrix provides narrow reflow coverage without claiming a manual browser-zoom or physical-device audit.
