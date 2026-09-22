# Live Monitor Implementation Plan (PR 3 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/live-monitor` a scanning tool, adding:
- Editorial and Compact views;
- freshness and "new since your last visit";
- multi-topic and source filters with highlighting and URL state;
- a context panel (topic volume by day, top sources, classification note);
- per-story actions (copy link, cite, commission).

**Architecture:**
- The data contract is unchanged: Currents, 20 articles, 7 days, fail-closed.
- Pure logic goes in `src/lib/monitor-view.ts`, unit-tested: state parse/serialize, filtering, day grouping, "new since", volume, top sources and highlight segments.
- `live-monitor-feed.tsx` is split into the feed shell plus `monitor-story.tsx` (one story in either view) and `monitor-context.tsx` (the panel).
- The page stays `force-dynamic` (hardening-pass ruling), so `useSearchParams` needs no Suspense.
- Every time rendered on the server is absolute (`formatDateTime`). "N min ago" is computed only after mount, so hydration always matches.

**Tech Stack:** Next.js 16, React 19, Vitest, Playwright (Currents mocked by `e2e/mock-sources.mjs`).

**Spec:** `docs/superpowers/specs/2026-09-22-research-monitor-ux-design.md` §3 (+ §5 PR 3)

## Global Constraints

- The theme, the dark hero and the existing monitor typography stay as they are. Legibility minimums apply (≥ 11.5px labels, ≥ 17px dispatch body).
- No new dependencies. Charts are inline SVG, each with an accessible data table (`<table class="sr-only">`).
- URL keys: `q`, `topics` (comma list), `sources` (comma list), `window` (`24h|72h|7d`), `view` (`editorial|compact`). Use `router.replace(…, { scroll: false })`.
- `localStorage` keys: `tharros.monitor.view` and `tharros.monitor.lastVisit`. Wrap every access in try/catch, because private mode can throw.
- The caveat is shown verbatim: "Up to 20 stories per refresh; counts are indicative, not market statistics."
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **`localStorage` throws** (private mode or blocked). The monitor renders and the view toggle still works for the session. Test: Task 1 (unit: storage helpers swallow errors).
2. **First visit** (no `lastVisit`) shows no "New" tags, rather than marking everything new. Test: Task 1 (unit).
3. **URL lists topics or sources that don't exist** (`?topics=nope,trade-economy&sources=evil.com`). Unknown values are dropped. Test: Task 1 (unit).
4. **Error snapshot** (Currents down). The fail-closed panel, Retry and attribution still render, and the context panel is hidden. Test: Task 3 (e2e with the mock returning 503; see mock notes).
5. **Search term with regex characters** (`(nato`). Highlighting never throws and never injects HTML. Test: Task 1 (unit: `highlightSegments`).

---

### Task 1: Monitor view logic (`src/lib/monitor-view.ts`)

**Files:** Create `src/lib/monitor-view.ts`, `tests/monitor-view.test.ts`.

**Produces:**
- `type MonitorViewState = { q: string; topics: MonitorTopicId[]; sources: string[]; window: MonitorWindowId; view: "editorial" | "compact" }`
- `parseMonitorState(params: URLSearchParams, knownSources: string[]): MonitorViewState`, and `serializeMonitorState(state): string`, which omits defaults.
- `filterArticles(articles, state, referenceTime): MonitorArticle[]`:
  - window cutoff against `referenceTime`;
  - topics OR-matched (none selected = all);
  - sources OR-matched;
  - `q` case-insensitive across title, description and domain.
- `groupByDay(articles, timeZone = "America/Toronto", referenceTime): { key: string; label: string; items: MonitorArticle[] }[]`. The label is "Today", "Yesterday" or `formatMonthYear`-style "Sep 20", all computed in the time zone, with days sorted newest first.
- `newSince(articles, lastVisit: number | null): Set<string>`: article ids with `publishedAt > lastVisit`; an empty set when `lastVisit` is null.
- `topicVolume(articles, referenceTime, days = 7): Record<MonitorTopicId, number[]>`: counts per day, oldest to newest.
- `topSources(articles, n = 5): { domain: string; count: number }[]`
- `highlightSegments(text, q): { text: string; match: boolean }[]`: splits on the case-insensitive literal `q` (regex characters escaped).
- `readStorage(key): string | null` and `writeStorage(key, value): void`, both try/catch-wrapped.

- [ ] Step 1: Write `tests/monitor-view.test.ts` covering each export, including all five Review Focus cases. Fixtures: 5 articles over 3 days with topics and domains mixed; `referenceTime = Date.parse("2026-09-22T18:00:00Z")`.
- [ ] Step 2: Run `npx vitest run tests/monitor-view.test.ts` and expect FAIL.
- [ ] Step 3: Implement.
- [ ] Step 4: Expect PASS, then run the full suite.
- [ ] Step 5: Commit: `feat(live-monitor): view state, grouping, volume and highlight logic`.

### Task 2: News citations

**Files:** Modify `src/lib/citation.ts` and `tests/citation.test.ts`.

**Produces:** `CitationInput` gains `kind?: "report" | "news"` and `publisher?: string`. For `kind: "news"`, the publisher is the news outlet, not Tharros:
- APA: `Publisher. (2026, September 22). Title. URL`
- MLA: `"Title." Publisher, 22 Sept. 2026, URL.`
- Chicago: `Publisher. "Title." September 22, 2026. URL.`
- Harvard: `Publisher (2026) Title. Available at: URL (Accessed: …).`

- [ ] Steps: write the failing tests for all 4 styles, run them (FAIL), implement, run them (PASS), then commit `feat(citation): news article citations`.

### Task 3: Monitor UI

**Files:**
- Rewrite `src/components/live-monitor-feed.tsx`.
- Create `src/components/monitor-story.tsx` and `src/components/monitor-context.tsx`.
- Modify `src/app/live-monitor/live-monitor.css`, `e2e/mock-sources.mjs` (a 503 mode) and `e2e/site.spec.ts`/`e2e/visual.spec.ts` where their selectors change.
- Create `e2e/monitor.spec.ts`.

UI contract, which the e2e tests depend on:
- A view toggle: `role="group"` labelled "View", with buttons "Editorial" and "Compact" (`aria-pressed`).
- Topic chips: a `role="group"` labelled "Research areas". Buttons are multi-select with `aria-pressed`, text `ShortLabel N`, and an "All" button that clears the selection.
- A source filter: `<details>` with the summary "Sources (N)" containing checkboxes labelled with the domain and its count.
- Freshness: the text "Checked <abs time> ET" server-side; after mount, "Checked N min ago" plus a `title` holding the absolute time. When new stories exist: "N new since your last visit".
- Compact view: an `<ol>` per day, preceded by an `h3` day label. Each row is an `article` with time, topic dots (`aria-label` = topic names), the headline link, the domain, and a "New" tag when applicable.
- Search matches in headlines and descriptions are wrapped in `<mark>`.
- Story actions menu: `<details>` with the summary "Actions for: <title>" (visually "•••" plus sr-only text), containing:
  - "Copy link";
  - "Cite this article", which opens a `CitationPanel` with `kind: "news"`;
  - "Commission research on this", linking to `requestResearchHref({ context: "Following up: <title> (<url>)" })`.
- Context panel: `aside` labelled "Coverage context", holding:
  - per-topic 7-day bars (SVG, `aria-hidden`), plus a `table.sr-only` of the counts;
  - the top 5 sources;
  - a "How stories are classified" paragraph linking to /methodology;
  - the caveat, verbatim.
  - It is hidden in the error state.
- `e2e/mock-sources.mjs`: when the request carries the header `x-mock-fail: 1`, respond 503. Server-to-server requests can't carry browser headers, so for the error-state e2e start a second mock mode instead: `MOCK_MODE=fail` env on a separate port in a dedicated Playwright project. Simpler ruling allowed: cover the error state with a unit-level render check of `errorCopy` plus the existing smoke test, and record the ruling.

- [ ] Step 1: Write `e2e/monitor.spec.ts`:
  - The compact toggle shows day headings and persists across a reload (localStorage).
  - The URL `?view=compact&topics=defence-security` opens filtered to compact.
  - Multi-select Trade + Defence shows their union.
  - Selecting a source narrows the results.
  - The search term is highlighted with `mark`.
  - "Commission research on this" navigates to `/request-research?context=…` and the form's context field (step 3) contains the title.
  - Cite this article copies text containing the domain name and the headline.
  - Axe on both views: no serious or critical violations.
- [ ] Step 2: Run `npm run build && npx playwright test e2e/monitor.spec.ts` and expect FAIL.
- [ ] Step 3: Implement the components and CSS, keeping the existing editorial look (lead dispatch plus grid) as the Editorial view.
- [ ] Step 4: Run `npx tsc --noEmit && npx eslint . --max-warnings=0 && npx vitest run && npx playwright test e2e/monitor.spec.ts e2e/site.spec.ts` and expect PASS.
- [ ] Step 5: Commit `feat(live-monitor): compact view, multi-filters, context panel and story actions`. Push `feat/live-monitor-tools`, dispatch baselines, review them, open the PR, wait for CI, merge.
