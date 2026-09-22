# Research Archive Implementation Plan (PR 2 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/research` into a search tool with these parts:
- full-text search, including inside the PDFs, with typo tolerance and highlighted snippets;
- faceted chips with counts;
- shareable URL state;
- rich result cards;
- an area overview strip.

**Architecture:**
- The page stays static. A client component reads its state from `useSearchParams` inside Suspense, the same pattern `/request-research` uses.
- The documents, including each report's extracted text from `src/data/report-text.json`, are passed as props. The component builds a `minisearch` index in memory.
- Pure logic lives in `src/lib/archive.ts`, so it can be unit-tested without a DOM: URL parse and serialize, filtering, facet counts, snippets and reading time.

**Tech Stack:** Next.js 16, React 19, `minisearch` 7.x, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-22-research-monitor-ux-design.md` §2 (+ §5 PR 2)

## Global Constraints

- Theme, tokens and typefaces stay unchanged. Legibility minimums: labels ≥ 11.5px, body ≥ 19px (cards' summaries ≥ 17px).
- No invented research. The featured/latest slot renders only for non-specimen publications. With only the specimen, show the honest "first publications are in preparation" note.
- The only new dependency is `minisearch`.
- URL keys: `q`, `area`, `type`, `year`, `sort`. Use `router.replace(url, { scroll: false })` so typing doesn't add history entries.
- Motion: 150–250 ms transitions, disabled under `prefers-reduced-motion`.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **A garbage or unknown URL param** (`?area=nope&year=abc&sort=x`) falls back to defaults and never crashes. Test: Task 1 (unit).
2. **A query matching only PDF body text** (e.g. "Vestibulum") still returns the report, with a snippet showing the match. Test: Task 1 (unit) + Task 3 (e2e).
3. **Punctuation or regex characters in the query** (`c++ (tariff)`) never throw, and snippets escape HTML. Test: Task 1 (unit).
4. **No JavaScript.** The archive list is still server-rendered with links, via the Suspense fallback rendering the default state. Test: Task 3 (e2e, `javaScriptEnabled: false`).
5. **Back button after filter changes** returns to the previous page, not through every keystroke. Test: Task 3 (e2e: type a query, go back, expect the previous URL).

---

### Task 1: Archive logic (`src/lib/archive.ts`)

**Files:** Create `src/lib/archive.ts`, `tests/archive.test.ts`. Install `minisearch`.

**Produces:**
- `type ArchiveDoc = { slug; reference; title; summary; tags: string[]; type; area; year: string; publishedAt; text: string; pages: number | null; cover: string | null; file: string | null; bytes: number | null; specimen: boolean; authors: string[] }`
- `type ArchiveState = { q: string; area: string; type: string; year: string; sort: "newest" | "relevance" }`
- `parseArchiveState(params: URLSearchParams, allowed: { areas: string[]; types: string[]; years: string[] }): ArchiveState`: unknown values fall back to `"all"` / `"newest"`.
- `serializeArchiveState(state): string`: omits defaults; returns `""` or `"?q=…"`.
- `createArchiveIndex(docs): MiniSearch<ArchiveDoc>`: fields title (boost 3), tags (boost 2), summary (boost 1.5), text; `fuzzy: 0.2`, `prefix: true`, `combineWith: "AND"`.
- `runArchiveQuery(docs, index, state): { results: (ArchiveDoc & { snippet: string | null; terms: string[] })[]; facets: { area: Record<string, number>; type: Record<string, number>; year: Record<string, number> } }`. Each facet count applies every *other* active filter plus the query.
- `snippet(text, terms, radius = 80): string | null`: the first window containing a term, ellipsised, as plain text.
- `readingMinutes(text): number` = `Math.max(1, Math.round(words / 230))`.
- `buildArchiveDocs(publications, assets, texts): ArchiveDoc[]`: server-side assembler.

- [ ] Step 1: Write `tests/archive.test.ts`:
  - `parseArchiveState` falls back on garbage.
  - A serialize/parse round trip preserves state.
  - A query "vestibulum" matches the specimen via `text` only, and the snippet contains "Vestibulum".
  - A typo "lorme" matches (fuzzy).
  - `c++ (tariff)` returns without throwing.
  - With area=trade the area facet still counts other areas.
  - `readingMinutes` returns ≥ 1.
  - Newest sort is ordered by `publishedAt` descending; relevance sort is used only when `q` is set.
- [ ] Step 2: Run `npx vitest run tests/archive.test.ts` and expect FAIL (module missing).
- [ ] Step 3: `npm i minisearch --save-exact`, then implement `src/lib/archive.ts`.
- [ ] Step 4: Run and expect PASS. Then run the full `npx vitest run`.
- [ ] Step 5: Commit: `feat(research): archive search, facets and URL state logic`.

### Task 2: Archive UI

**Files:**
- Rewrite `src/components/research-archive.tsx`.
- Modify `src/app/research/page.tsx`.
- Append the archive CSS rules to `src/app/globals.css`, replacing the `.archive-controls`/`.archive-list` rules.

**Consumes:** everything from Task 1; `reportAsset`, `reportText`; `CiteButton`.

UI contract, which the e2e tests depend on:
- A search input labelled "Search the archive" (`type="search"`).
- Chip groups: `role="group"` with `aria-label` "Research area", "Format" and "Year". Each chip is a `button` with `aria-pressed` and the text `Name (count)`. A chip with count 0 and not pressed is `disabled`.
- A sort control: `select` labelled "Sort", shown only when `q` is set (otherwise the order is newest).
- A result count in an `aria-live="polite"` element: "N publications".
- Each result is an `article` with:
  - a cover image (`alt=""`, `loading="lazy"`, 120px wide);
  - a meta line: reference · type · month year · pages · reading time;
  - the title link;
  - the snippet (with `<mark>`) or the summary;
  - tags;
  - actions: Cite (`CiteButton` with `reference` + stable URL), "PDF" link (`download`), and "Copy link".
- An area strip above the controls: 4 buttons with the area name, scope and count. Clicking one toggles the area filter.
- No results: "No publications match." plus "Clear all filters". When `q` is set, add "Did you mean …?" suggestions from `index.autoSuggest(q)` (max 3, excluding the query itself).
- Specimen-only notice: when every doc is `specimen`, show "The first Tharros publications are in preparation. The example below shows how each report is published." above the list.

- [ ] Step 1: Rewrite the page.
  - `src/app/research/page.tsx` builds `docs = buildArchiveDocs(allPublications, …)` (all publications, the specimen included).
  - It renders `<Suspense fallback={<ResearchArchive docs={docs} … state={defaults} />}><ResearchArchiveWithUrl docs={docs} … /></Suspense>`.
  - Keep the hero and the closing CTA. Replace the dark `archive-principle` band copy with "Search the full text of every report, or filter by area, format and year."
- [ ] Step 2: Implement the component.
  - `ResearchArchiveWithUrl` reads `useSearchParams` → `parseArchiveState`.
  - It updates with `router.replace(pathname + serializeArchiveState(next), { scroll: false })`.
  - The query input keeps local state and syncs to the URL after 250 ms (debounce with `setTimeout` in an effect).
- [ ] Step 3: CSS.
  - Chips: 44px min height, 1px rule border, `aria-pressed=true` → ink background. Disabled chips at 45% opacity.
  - Cards: a grid of `120px 1fr` (stacked under 640px); cover with the sheet shadow; `mark { background: rgba(158,58,53,.14); color: inherit; }`.
  - Area strip: a 4-column grid (2 columns ≤ 1024px, 1 column ≤ 640px), with `aria-pressed` styling.
- [ ] Step 4: Run `npx tsc --noEmit && npx eslint . --max-warnings=0 && npx vitest run`.
- [ ] Step 5: Commit: `feat(research): searchable archive with facets, rich cards and area strip`.

### Task 3: Archive e2e + baselines + PR

**Files:** create `e2e/archive.spec.ts`.

- [ ] Step 1: Write the tests (desktop + mobile).
  - Typing "vestibulum" shows 1 result with a `mark` containing "Vestibulum", and the URL contains `q=vestibulum`.
  - Clicking the "Trade & Economic Integration" chip sets `area=`; clicking again clears it.
  - `/research?area=nope&year=abc` renders 1 publication.
  - A typo query "lorme" still finds the report.
  - "zzzz" shows "No publications match." and "Clear all filters" restores the list.
  - Back button: go to `/`, then `/research`, type a query, `page.goBack()` → the URL is `/`.
  - `javaScriptEnabled: false`: the list shows the report link.
  - The Cite button inside the result copies text containing "TC-EX-000".
  - Axe on `/research` with a query applied: no serious or critical violations.
- [ ] Step 2: Run `npm run build && npx playwright test e2e/archive.spec.ts e2e/site.spec.ts` and expect PASS.
- [ ] Step 3: Commit, push the branch `feat/research-archive`, dispatch "Update visual baselines", review the `research-*` baselines, open the PR, wait for green CI, merge.
