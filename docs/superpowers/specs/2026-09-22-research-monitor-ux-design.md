# Research, Live Monitor and site-wide UX upgrade — design

Date: 2026-09-22 · Status: approved in conversation, pending written-spec review

## Intent

**Stated by the owner**
- Deep UX polish of the whole site. Theme, tokens and overall styling stay the same.
- Research archive and Live Monitor get the deepest upgrade: intuitive, professional, high-quality tools.
- The example report keeps its current look but becomes functionally real: an embedded PDF that the citation tool can cite and that search engines can index.
- Audience: prospective clients, researchers and interested public. Everything is open to everyone, with no login and no separate "analyst mode".
- Motion: quiet and precise.
- Known pain points: mobile, home page flow, services and commissioning. Everything else is audited against DESIGN.md.

**Constraints**
- No invented research, clients or data (PRODUCT.md). The example report stays lorem ipsum, clearly labelled.
- Indexing: the full pipeline is built and tested but switched off for the example via `indexable: false`. A real publication turns it on by setting the flag.
- Legibility minimums from the April 2026 pass must hold (11.5px labels, 19–20px body). When in doubt, err larger.
- Lessons from the 2026-09-22 PDF attempt that was reverted (c12e368 → 7a446a9): it lost the page design, the PDF looked wrong, and the native viewer looked bad. Each is addressed below.

**Success**
- The report page looks like today's paper sheets. The sheets are the real PDF. The PDF looks identical to the web design.
- The report can be cited, downloaded and found by on-site full-text search. It is ready for Scholar the moment it is set indexable.
- Research and Live Monitor feel like tools: fast filtering, shareable URLs, clear states, useful actions.
- CI stays green: unit, e2e, axe, visual.

## 1. Report publication pipeline

**Single source.**
- `src/data/publications.ts` holds the full report record. It extends `Publication` with:
  - `reference` (e.g. `TC-EX-000`), `indexable: boolean`, `pdf: { path, pages, bytes, sha }`.
  - Typed body blocks: `heading`, `paragraph`, `findings`, `callout`, `figure`, `list`, `sources`.
- The lorem example moves here: `slug: "example-report"`, `specimen: true`, `indexable: false`. The hand-built `/research/example-report/page.tsx` is removed and the example uses the shared report route.

**Print surface.**
- The route `/research/[slug]/print` renders the record with the existing `report.css`, moved to `src/components/report/`.
- Print rules: `@page { size: Letter; margin: 0 }` (US Letter, the Canadian standard; each sheet keeps today's inner padding), running head and foot, page numbers, and `break-inside: avoid` for findings, figures and sources.
- It is excluded from robots (`noindex`) and from the sitemap.

**Generation.** `scripts/report-pdf.mjs`, run as `npm run report:pdf [slug]`:
1. Builds and starts the app, then prints `/research/<slug>/print` with Playwright Chromium (`page.pdf({ outline: true, tagged: true, printBackground: true, preferCSSPageSize: true })`).
2. Post-processes with `pdf-lib` (devDependency): title, author, subject (abstract), keywords (tags), creator "Tharros Canada", and a fixed creation date taken from `publishedAt`, so repeated runs stay stable.
3. Writes `public/research/<reference>.pdf`.
4. Renders page 1 to `public/research/<reference>-cover.webp` (used for the archive thumbnail and `og:image`).
5. Extracts the text per page with `pdfjs-dist` into `src/data/report-text/<slug>.json`.
6. Stores `pages`, `bytes` and a `sha` of the source record in the record's generated `pdf` metadata file (`src/data/report-pdf.json`).

The artifacts are committed, because Vercel builds cannot run Chromium.

**Stale guard (unit test).**
- The test hashes each record's source content and compares it with `report-pdf.json`.
- A mismatch fails CI with the message "run npm run report:pdf <slug>".
- The test also checks that the PDF file exists, that its page count matches, and that the extracted text contains the title and reference.

**Report page `/research/[slug]`.**
- **Header (HTML):**
  - Kicker (type · area), title and subtitle.
  - A meta row: reference, published date, authors, origin, pages.
  - The abstract.
  - An action bar: Cite (existing `CitationPanel` in a popover), Download PDF (with size), Copy link, and Share (`navigator.share`, falling back to copy).
- **Specimen notice:**
  - The existing "Example layout" note stays, above the header, when `specimen: true`.
- **Viewer:**
  - `ReportViewer` is a client component. It loads `pdfjs-dist` through a dynamic import and its worker from `public/` (self-hosted, CSP `'self'`).
  - Each page is drawn to a canvas inside a `.report-page` frame, so the look is the current shadow, ivory and spacing.
  - A pdf.js text layer keeps the text selectable and findable.
  - Pages render lazily with IntersectionObserver.
  - The sticky toolbar holds: page `n / N` (typing a page number jumps there), zoom − / + / fit width, download and Cite.
  - Keyboard: PageUp and PageDown move by page; `+` and `−` zoom.
  - Loading state: sized placeholder sheets, so the layout doesn't jump. On error: "The PDF could not be displayed" with a download link. Without JavaScript: the download link.
- **Indexing (only when `indexable`):**
  - Highwire meta tags: `citation_title`, `citation_author`, `citation_publication_date`, `citation_pdf_url`, `citation_technical_report_number`, `citation_publisher`.
  - JSON-LD `Report`, using the existing `jsonLd` helper.
  - The sitemap includes the page and the PDF.
- **When not indexable:**
  - `robots: noindex`, no Highwire tags, and no sitemap entry.
  - The PDF is served with `X-Robots-Tag: noindex` through a `headers()` rule for non-indexable references.
- **Stable IDs:**
  - `/research/id/[reference]` returns a 308 redirect to `/research/[slug]`.
  - The citation text uses the stable URL.
- **Citation:**
  - `buildCitation` takes the `reference` and the stable URL.
  - The MLA/Chicago name-inversion bug (flagged in the hardening audit) is fixed now, because citing becomes a real feature.

## 2. Research archive `/research`

- **Search:**
  - A `minisearch` index is built at build time in a server module. It covers title, summary, tags and the PDF full text from `report-text/*.json`, is serialised, and passed to the client.
  - Typo tolerance (`fuzzy: 0.2`) and prefix matching; results ranked by relevance when a query is present.
  - Snippets: each hit shows about 160 characters around the best match from the full text, with the matches in `<mark>`.
- **Filters:**
  - Area, format and year are chip groups showing live counts. Chips with no results are shown but disabled.
  - A "Clear all" control.
  - Sort: newest or relevance. Relevance applies only when there is a query.
- **URL state:** `?q=&area=&type=&year=&sort=`. Changing filters updates the URL with `router.replace` (no history spam); the back button still works for navigation.
- **Result cards:**
  - Cover thumbnail, reference ID, type, date, pages, and reading time (words ÷ 230).
  - Title, summary or snippet, and tags.
  - Actions: Cite (popover), PDF, Copy link.
- **Area strip:**
  - The 4 research areas from `research-areas.ts`, each with its one-line scope and count; clicking one sets the area filter.
  - Featured/latest slot: renders only when there are non-specimen publications (nothing is invented).
- **States:**
  - No results: suggestions from the nearest fuzzy terms, plus Clear filters.
  - Archive with only the specimen: an honest note that the first publications are in preparation.

## 3. Live Monitor `/live-monitor`

The data contract is unchanged: Currents, 20 articles, a 7-day window, and the fail-closed rules. Everything below is client-side on the existing snapshot.

- **Views:**
  - "Editorial" is today's lead story plus cards.
  - "Compact" is a dense list grouped by day (Today, Yesterday, then dated headings), one line per story: time, topic dots, headline and source.
  - The chosen view is kept in the URL (`view=`) and in `localStorage` as the default.
- **Freshness:**
  - A "Checked N min ago" label with an absolute time in its tooltip, updated every minute on the client. The server-rendered text is the absolute time, so hydration matches.
  - "New since your last visit": the `localStorage` timestamp from the previous visit marks newer stories with a small "New" tag and shows a count in the toolbar.
- **Filters:**
  - Topics become multi-select chips with counts; none selected means all.
  - A source filter (a domain list with counts, collapsible).
  - The time window stays as it is.
  - Search terms are highlighted in headlines and descriptions.
  - URL state: `?q=&topics=&sources=&window=&view=`.
- **Context panel:**
  - A 7-day bar row per topic (story counts by day, drawn as inline SVG with accessible table data).
  - The top 5 sources.
  - "How stories are classified": whole-word keyword matching plus Currents categories (links to /methodology).
  - The caveat "Up to 20 stories per refresh; counts are indicative, not market statistics."
- **Per-story actions:**
  - Open original (the existing link).
  - Copy link.
  - Cite: an APA-style news citation of publisher, headline, date and URL, via `buildCitation` extended with a `news` input kind.
  - "Commission research on this": links to `/request-research?context=<headline + url>`, reusing `requestResearchHref`.

## 4. Site-wide polish

This pass keeps the palette, typefaces and grid. It refines within them.

- **Audit first:**
  - Every route is checked against DESIGN.md and the legibility minimums.
  - Any text below the minimums is raised.
  - Focus rings, hover and pressed states, rules and spacing rhythm are made consistent.
- **Motion:**
  - One tokenised set: `--ease: cubic-bezier(.2,.7,.2,1)`, `--dur-1: 150ms`, `--dur-2: 250ms`.
  - Section reveals are CSS-only (`animation-timeline: view()` where supported, and no reveal where it isn't), so there is no JavaScript scroll listener.
  - Everything is disabled under `prefers-reduced-motion`.
- **Mobile:**
  - The navigation sheet fills the screen with a larger type scale and closes on navigation (already done).
  - Tap targets are at least 44px.
  - Tables and chip rows scroll horizontally, with an edge fade.
  - A sticky filter bar on Research and Monitor.
- **Home:**
  - The order becomes: what Tharros does → who it's for → proof (method, areas, Live Monitor excerpt) → how to commission.
  - Duplicated copy is cut, so the offer is clear within the first two screens.
- **Services and commissioning:**
  - The services comparison becomes clearer (what you get, format, typical scope).
  - The request form gets a labelled 3-step indicator, validation on blur instead of only on "Continue", a review step with clearer edit affordances, and a save-draft to `sessionStorage` so a refresh doesn't lose answers.
- **States:**
  - A designed not-found page.
  - The error boundary from the hardening pass.
  - Loading skeletons that match the final layout sizes.

## 5. Delivery and verification

Four PRs, merged in order, with CI green on each:

1. **Report pipeline:** record, print route, generation script, viewer, report page, indexing gate, stable IDs, citation fixes.
2. **Research archive:** search index, filters, URL state, cards, area strip, states.
3. **Live Monitor:** views, freshness, filters, context panel, actions.
4. **Site-wide polish:** audit fixes, motion, mobile, home, services and form.

**Tests**
- **Unit:**
  - The record schema.
  - The stale-PDF guard.
  - Citation formats, including news and inverted names.
  - Search ranking and snippets.
  - URL-state parse and serialise for both tools.
  - Day grouping and "new since" logic.
- **E2E:**
  - The viewer renders N pages and the page input jumps.
  - Download returns `application/pdf`.
  - The cite popover copies text.
  - The id redirect returns 308.
  - The example is noindex, has no `citation_*` tags, and is absent from the sitemap.
  - Archive filters round-trip through the URL.
  - Monitor multi-topic filtering, compact view and the commission prefill.
- **Axe** runs on `/research`, `/research/example-report` and `/live-monitor` in both views.
- **Visual baselines** are refreshed per PR; the new baselines are reviewed before merge.

**New dependencies**
- `pdfjs-dist`: runtime, loaded only by the viewer. The worker is self-hosted.
- `minisearch`: runtime, about 7 KB gzipped.
- `pdf-lib`: dev-only, used for PDF metadata.

**Out of scope**
- A CMS or authoring UI.
- DOI registration.
- Accounts.
- Server-side Monitor history beyond the current snapshot.
- Real research content.
