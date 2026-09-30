---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
mode: "persuade"
related_targets: ["src/app/home.css","src/app/research/page.tsx","src/app/research/[slug]/page.tsx","src/app/research-areas/page.tsx","src/app/about/page.tsx","src/app/methodology/page.tsx","src/app/privacy/page.tsx","src/app/accessibility/page.tsx","src/app/copyright/page.tsx","src/app/not-found.tsx"]
---

## Scope

Whole public site. Home introduces Tharros Canada and real work; Research, the supplied PDF reader, Methodology, Research areas, About and reference pages support discovery, reading, verification and editorial contact. Preserve supplied PDFs, publication facts, indexing choices and every Research tool.

## Choice history

The owner first chose Open Questions, candidate 7, seed `f037cd34`, then The open issue, chooser `e5ea266c`, seed `df0d4fa0`. Subsequent direct instructions simplified those surfaces, replaced blue emphasis with neutral black and sparse burgundy and chose a Canada–Europe connecting-line animation. The latest homepage request asks for a far bolder layout and animation, followed by an explicit request for something different from the map. The owner approved the typographic masthead and requested the final period be removed; the earlier choices are historical context.

## Direction contract

THESIS: Give independent student research a recognisable, contemporary presence through the Tharros Canada name, real reports and visible sources. Keep Home compact after the opening and let dedicated pages carry the deeper explanations.

OWN-WORLD: White ground, neutral ink and black surfaces, sparse burgundy `#782c3d`, deep hover `#55202c`, muted red `#9e354c`, pale selected states `#f6edf0` and neutral grey grouping. `--blue` is a compatibility alias for ink. Space Grotesk identifies Tharros and titles; Schibsted Grotesk handles prose, metadata and controls. Open reading structures, precise rules and square controls.

STORY: Recognise Tharros and its Canada–Europe interests; read the latest report; glance at three draft upcoming topics; choose Methodology or Research areas; inspect published evidence; learn the purpose and get in touch.

FIRST VIEWPORT: An oversized two-line Tharros Canada wordmark spans the shared shell without a final period, with Tharros aligned left, Canada aligned right and a large burgundy slash drawn from the existing wordmark. The 248px desktop cap is an intentional homepage display exception; local clamps keep the full identity visible on phones. A full-width black band holds the concise introduction and direct Research and About actions. The band stacks at 760px and below; its actions stack at 480px and below. Opposing masked text reveals last 900ms with a 120ms Canada delay; the slash unfolds over 1100ms after 180ms. The CSS-only sequence completes at 1280ms, runs once and is assigned only when motion is permitted. The default and reduced-motion states show the complete composition, with static introduction and controls. There is no map in the hero.

FORM: A compact latest report cover, title, type, date and Read/PDF actions sit beside three numbered draft upcoming topics. Only the first shows In progress, and a visible note makes the topics provisional. Two compact CTA boxes lead to Methodology and Research areas. About contains About, Mission, Why and Contact; Methodology contains the real evidence trace and five rules; Research areas holds the five native subject disclosures and actual publication availability. The removed homepage essays, About ledger and reference chapters, and Methodology publisher directory/taxonomy do not return. Research instruments, PDF controls, policy reference rows and mobile navigation retain their working structure.

IMAGE POLICY: Real supplied report covers remain visible. Optional `home: null` and `about: null` image records remain in their existing configuration, but Home and About do not render empty frames. No placeholder, stock or generated imagery is inserted. Any future owner imagery needs truthful alt text, dimensions and credit.

COPY: Public destinations say Research. Use direct phrases such as Check out our research and Look at the research. Avoid decorative Record/Archive headers and referring to Tharros as the project. Topical uses of record in source metadata or procurement explanations are allowed.

FINISH: Follow AGENTS.md's proportional-check policy. Small copy, layout and CSS fixes use source/diff review and relevant targeted lint; the owner reviews appearance and supplies tweaks or bug reports. Do not add tests, take automated screenshots, run whole suites or build by default for these fixes. Significant behavior changes warrant targeted functional checks; full browser runs require an explicit request or a significant functional reason. Record only the checks actually run. Earlier screenshots, counts and finish verdicts describe their historical revision. DESIGN and the sidecar describe final source.
