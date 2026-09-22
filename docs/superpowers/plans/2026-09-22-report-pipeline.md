# Report Publication Pipeline Implementation Plan (PR 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the lorem-ipsum example report into a real, generated PDF. The PDF is drawn on its page as today's paper sheets, can be cited and downloaded, has a stable ID, and is fully wired for indexing. Indexing stays switched off for the example.

**Architecture:**
- One structured record in `src/data/publications.ts` feeds a print-only route. That route renders it with the existing report CSS and CSS `@page` rules.
- A local script prints the route to PDF with Playwright Chromium, stamps metadata with `pdf-lib`, extracts the text with `pdfjs-dist`, and commits the artifacts.
- A unit test fails CI when the record or CSS changes without the PDF being regenerated.
- The public page wraps a `pdfjs-dist` canvas viewer in a web-page header, action bar and citation tools.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Vitest 5, Playwright 1.63, `pdfjs-dist` 6.x, `pdf-lib`.

**Spec:** `docs/superpowers/specs/2026-09-22-research-monitor-ux-design.md` (section 1, plus the parts of section 5 that concern PR 1)

**Deliberate deviations from the spec:**
- The cover is JPEG (Playwright screenshots can't be WebP).
- Pages render eagerly (reports are 2 pages; a `ponytail:` note marks where lazy rendering goes).
- Cite lives in the header action bar, not in the viewer toolbar.

## Global Constraints

- Theme, tokens and typefaces stay unchanged. Reuse the `report.css` rules as they are; don't restyle them.
- Legibility minimums: labels ≥ 11.5px, body ≥ 16px inside report sheets (sheet typography is kept from today), site body 19–20px.
- No invented research. The example stays lorem ipsum, keeps the visible "Example layout" notice, and has `specimen: true` and `indexable: false`.
- When `indexable` is `false`: `robots` noindex, no `citation_*` meta, no sitemap entry, and the PDF is served with `X-Robots-Tag: noindex`.
- Page size is `Letter`: 8.5 × 11 in, which is 816 × 1056 CSS px.
- CSP stays as it is (`script-src 'self' 'unsafe-inline'`, `worker-src 'self' blob:`). The pdf.js worker is self-hosted under `/public`, and `isEvalSupported: false`.
- Dependencies: `pdfjs-dist` (runtime, dynamically imported only by the viewer and the script) and `pdf-lib` (dev). Nothing else.
- The PDF artifacts are committed. CI never runs the generator.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Before writing pdf.js calls, read `node_modules/pdfjs-dist/types/src/display/api.d.ts` and `.../text_layer.d.ts`. The signatures in this plan target 6.x; if the installed types differ, follow the types.
- Before writing Next APIs, read the relevant guide in `node_modules/next/dist/docs/` (AGENTS.md rule).

## Review Focus

1. **The PDF fails to load (404, network error, corrupt file).** The viewer shows "The PDF could not be displayed." with a working Download link, never a blank area. Test: Task 5, e2e with `page.route` aborting the PDF.
2. **Narrow phones (320–390px).** Sheets scale to fit the width with no horizontal page scroll, and the toolbar wraps. Test: Task 6, the existing overflow e2e loop gains `/research/example-report`.
3. **JavaScript disabled.** The header, abstract and a Download PDF link are still visible. Test: Task 6, e2e with `javaScriptEnabled: false`.
4. **Unknown or lower-case stable ID (`/research/id/tc-ex-000`, `/research/id/NOPE`).** A case-insensitive match returns a 308; an unknown ID returns a 404 and never a 500. Test: Task 7, e2e.
5. **`navigator.share` or clipboard unavailable or denied.** Share falls back to Copy link; if copying fails, the URL is shown in a selectable field and nothing throws. Test: Task 6, e2e deleting `navigator.share` and stubbing `clipboard.writeText` to reject.

---

## File map

| Path | Responsibility |
|---|---|
| `src/lib/fonts.ts` (create) | The `next/font` instances, shared by the layout and the print route |
| `src/lib/citation.ts` (modify) | Locale-free dates, full-name inversion for MLA/Chicago, report number |
| `src/data/publications.ts` (modify) | `Publication` + `ReportBlock` types, the specimen record with lorem body, `allPublications`, lookup helpers |
| `src/lib/report-source.ts` (create) | `reportSourceHash(publication)`: a hash of record content plus report CSS |
| `src/data/report-pdf.json` (generated) | Per slug: file, cover, pages, bytes, sha, outline |
| `src/data/report-text/<slug>.json` (generated) | Per-page extracted PDF text |
| `src/lib/reports.ts` (create) | Typed access to the generated artifacts: `reportAsset(slug)`, `reportText(slug)` |
| `src/components/report/report.css` (move from `src/app/research/example-report/report.css`) | Sheet typography (unchanged rules) plus viewer and print additions |
| `src/components/report/report-document.tsx` (create) | Renders `ReportBlock[]` as the flowing print document |
| `src/app/research/[slug]/print/page.tsx` (create) | Print surface: `@page` rules, `report-*` meta for the script, noindex |
| `scripts/report-pdf.mjs` (create) | Build → start → print → stamp → cover → extract → write artifacts |
| `src/components/report/report-viewer.tsx` (create) | Client pdf.js viewer: sheets, toolbar, keyboard, error state |
| `src/components/report/report-actions.tsx` (create) | Client action bar: Cite popover, Download, Copy link, Share |
| `src/app/research/[slug]/page.tsx` (rewrite) | Report page: notice, header, actions, viewer, meta and JSON-LD gating |
| `src/app/research/example-report/` (delete) | Replaced by the shared route (same URL) |
| `src/app/research/id/[reference]/route.ts` (create) | 308 from the stable ID to the slug |
| `src/app/sitemap.ts`, `next.config.ts` (modify) | Indexable reports + PDFs; `X-Robots-Tag` for non-indexable PDFs |
| `tests/citation.test.ts`, `tests/publications.test.ts`, `tests/report-pdf.test.ts`, `tests/sitemap.test.ts` | Unit tests |
| `e2e/report.spec.ts` (create) | Viewer, actions, indexing gate, stable ID, no-JS, errors |

---

### Task 1: Citation correctness

**Files:**
- Modify: `src/lib/citation.ts`
- Test: `tests/citation.test.ts`

**Interfaces:**
- Produces: `CitationInput` gains `reference?: string`. The `buildCitation(style, input)` signature is unchanged. Dates are rendered through `formatLongDate` and `formatMonthYear` from `src/lib/site.ts`, so server and client agree.
- Consumes: `formatMonthYear(iso)` (exists in `src/lib/site.ts`). This task adds `formatLongDate(iso)` there.

- [ ] **Step 1: Write the failing tests** (append to `tests/citation.test.ts`, inside the `describe`):

```ts
  it("keeps full first names for MLA and Chicago, initials only for APA", () => {
    expect(buildCitation("mla", namedReport)).toBe(
      'Smith, Jane, and Alex Chen. "Defence procurement pathways." Tharros Canada, June 1, 2026, https://tharros.ca/research/defence-procurement.',
    );
    expect(buildCitation("chicago", namedReport)).toBe(
      'Smith, Jane, and Alex Chen. 2026. "Defence procurement pathways." Tharros Canada. https://tharros.ca/research/defence-procurement.',
    );
    expect(buildCitation("apa", namedReport)).toContain("Smith, J. & Chen, A.");
  });

  it("adds the report number when a reference is given", () => {
    const withRef = { ...namedReport, reference: "TC-2026-001" };
    expect(buildCitation("apa", withRef)).toBe(
      "Smith, J. & Chen, A. (June 2026). Defence procurement pathways (Report No. TC-2026-001). Tharros Canada. https://tharros.ca/research/defence-procurement",
    );
    expect(buildCitation("mla", withRef)).toContain('"Defence procurement pathways." Tharros Canada Report TC-2026-001, Tharros Canada,');
    expect(buildCitation("chicago", withRef)).toContain('"Defence procurement pathways." Report TC-2026-001. Tharros Canada.');
    expect(buildCitation("harvard", withRef)).toContain("Defence procurement pathways. Report TC-2026-001. Tharros Canada.");
  });
```

Also update the existing MLA expectation in `"inverts personal author names and joins multiple authors"`: `'Smith, J., and Alex Chen.` becomes `'Smith, Jane, and Alex Chen.`.

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npx vitest run tests/citation.test.ts`
Expected: 2 new tests FAIL, and the updated MLA expectation FAILS.

- [ ] **Step 3: Implement.** In `src/lib/site.ts`, add below `formatMonthYear`:

```ts
/** "June 1, 2026" (UTC) */
export function formatLongDate(value: string) {
  const p = dateParts(value, "UTC");
  return p ? `${fullMonths[months.indexOf(p.month)]} ${p.day}, ${p.year}` : "Date unavailable";
}
```

with, directly under the existing `months` array:

```ts
const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
```

Also add, next to it:

```ts
/** "June 2026" (UTC) */
export function formatFullMonthYear(value: string) {
  const p = dateParts(value, "UTC");
  return p ? `${fullMonths[months.indexOf(p.month)]} ${p.year}` : "Date unavailable";
}
```

Declare `fullMonths` directly under `months` so both functions can use it.

In `src/lib/citation.ts`:
- Import `formatFullMonthYear` and `formatLongDate` from `@/lib/site`.
- Replace `longDate`, `yearMonth` and `year` with:

```ts
const longDate = formatLongDate;
const yearMonth = formatFullMonthYear;
const year = (iso: string) => iso.slice(0, 4);
```

Then make `invert` take a mode, and use `"full"` in `joinNatural`:

```ts
/** APA: "Jane Smith" -> "Smith, J."; MLA/Chicago/Harvard: "Smith, Jane". Organizations pass through. */
function invert(name: string, mode: "initials" | "full" = "initials") {
  if (isOrgAuthor(name)) return name;
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  const last = parts.pop() as string;
  const given = mode === "full" ? parts.join(" ") : parts.map((part) => `${part[0]}.`).join(" ");
  return `${last}, ${given}`;
}
```

In `joinNatural`, call `invert(authors[0], "full")` and `invert(name, "full")`. `joinApa` keeps `invert(name)`.

Report number, inside `buildCitation` after the destructuring:

```ts
  const ref = input.reference;
```

- APA title part: `${title}${ref ? ` (Report No. ${ref})` : ""}.`
- MLA: `"${title}." ${ref ? `Tharros Canada Report ${ref}, ` : ""}${PUBLISHER}, …`
- Chicago: `"${title}." ${ref ? `Report ${ref}. ` : ""}${PUBLISHER}. …`
- Harvard: `${title}. ${ref ? `Report ${ref}. ` : ""}${PUBLISHER}. Available at: …`
- The Harvard `accessed` date uses `formatLongDate(accessedAt.toISOString())`.

- [ ] **Step 4: Run the tests and confirm they pass**

Run: `npx vitest run tests/citation.test.ts tests/site.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/citation.ts src/lib/site.ts tests/citation.test.ts
git commit -m "fix(citation): full given names for MLA/Chicago, report numbers, locale-free dates"
```

---

### Task 2: Publication record and source hash

**Files:**
- Modify: `src/data/publications.ts`
- Create: `src/lib/report-source.ts`, `tests/publications.test.ts`
- Modify callers: `src/app/research/page.tsx` (it uses `researchSpecimenPublication`, which remains exported)

**Interfaces:**
- Produces:
  - `type ReportBlock`, `type Publication` (fields below).
  - `publications: Publication[]` (real work only; still `[]`).
  - `researchSpecimenPublication: Publication`.
  - `allPublications: Publication[]`.
  - `publicationBySlug(slug): Publication | undefined` (searches `allPublications`).
  - `publicationByReference(ref): Publication | undefined` (case-insensitive).
  - `reportSourceHash(p: Publication, css: string): string` (16 hex chars).
  - `REPORT_CSS_PATH = "src/components/report/report.css"`.
- Consumes: nothing new.

- [ ] **Step 1: Write the failing test** `tests/publications.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { allPublications, publicationByReference, publicationBySlug, researchSpecimenPublication } from "../src/data/publications";
import { reportSourceHash } from "../src/lib/report-source";

describe("publication records", () => {
  it("have unique slugs and well-formed unique references", () => {
    const slugs = allPublications.map((p) => p.slug);
    const refs = allPublications.map((p) => p.reference);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(refs).size).toBe(refs.length);
    for (const ref of refs) expect(ref).toMatch(/^TC-[A-Z0-9]+-\d{3}$/);
  });

  it("never lets a specimen be indexable", () => {
    for (const p of allPublications) if (p.specimen) expect(p.indexable).toBe(false);
  });

  it("finds the specimen by slug and by reference, case-insensitively", () => {
    expect(publicationBySlug("example-report")).toBe(researchSpecimenPublication);
    expect(publicationByReference("tc-ex-000")).toBe(researchSpecimenPublication);
    expect(publicationByReference("NOPE")).toBeUndefined();
  });

  it("hashes content and CSS so either change marks the PDF stale", () => {
    const a = reportSourceHash(researchSpecimenPublication, ".x{}");
    expect(a).toMatch(/^[0-9a-f]{16}$/);
    expect(reportSourceHash(researchSpecimenPublication, ".y{}")).not.toBe(a);
    expect(reportSourceHash({ ...researchSpecimenPublication, title: "Changed" }, ".x{}")).not.toBe(a);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run tests/publications.test.ts`
Expected: FAIL (`allPublications` / `publicationByReference` / `report-source` do not exist).

- [ ] **Step 3: Implement.** In `src/data/publications.ts`:
- Keep `publicationTypes`.
- Make `PublicationSource.url` optional.
- Replace `PublicationSection` and `Publication` with:

```ts
export type ReportBlock =
  | { kind: "heading"; text: string; number?: number }
  | { kind: "lede"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "findings"; items: { lead: string; text: string }[] }
  | { kind: "callout"; text: string }
  // ponytail: one placeholder figure style; add real chart kinds with the first data-bearing report.
  | { kind: "figure"; caption: string; source: string }
  | { kind: "list"; items: string[] }
  | { kind: "sources"; items: PublicationSource[] }
  | { kind: "columns"; left: ReportBlock[]; right: ReportBlock[] };

export type Publication = {
  slug: string;
  reference: string;
  title: string;
  subtitle?: string;
  type: (typeof publicationTypes)[number]["name"];
  area: ResearchArea["slug"];
  origin: "independent" | "commissioned";
  publishedAt: string;
  authors: string[];
  summary: string;
  tags?: string[];
  sources: PublicationSource[];
  body: ReportBlock[];
  /** Only true for verified, published work. Gates robots, citation_* meta, sitemap and the PDF's X-Robots-Tag. */
  indexable: boolean;
  featured?: boolean;
  specimen?: boolean;
};
```

Replace `researchSpecimenPublication` with the lorem record. The text is copied verbatim from the current `src/app/research/example-report/page.tsx`:

```ts
const lorem = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum, nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.",
  "Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum, sed posuere consectetur est at lobortis.",
  "Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
];
const placeholderSource = { publisher: "Publisher", title: "Dataset or document title", period: "Reference period", retrievedAt: "YYYY-MM-DD" };

export const researchSpecimenPublication: Publication = {
  slug: "example-report",
  reference: "TC-EX-000",
  title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  subtitle: "Sed posuere consectetur est at lobortis: vestibulum id ligula porta felis euismod semper.",
  type: "Research Report",
  area: "trade-economic-integration",
  origin: "independent",
  publishedAt: "2026-09-01",
  authors: ["Author Name"],
  summary: "A clearly labelled specimen showing how a published report appears and how its evidence, findings, methodology and sources are structured. Placeholder text only.",
  tags: ["Example layout", "Publication structure"],
  sources: [],
  indexable: false,
  specimen: true,
  body: [
    { kind: "heading", text: "Executive summary" },
    { kind: "lede", text: lorem[0] },
    { kind: "columns",
      left: [
        { kind: "heading", text: "Key findings" },
        { kind: "findings", items: [
          { lead: "Lorem ipsum dolor sit amet.", text: "Consectetur adipiscing elit, integer posuere erat a ante venenatis dapibus." },
          { lead: "Maecenas faucibus mollis interdum.", text: "Nulla vitae elit libero, a pharetra augue donec ullamcorper." },
          { lead: "Vestibulum id ligula porta.", text: "Felis euismod semper, cras mattis consectetur purus sit amet." },
        ] },
      ],
      right: [{ kind: "figure", caption: "Lorem ipsum dolor sit amet (illustrative placeholder, no data).", source: "Publisher, dataset, period." }],
    },
    { kind: "heading", number: 1, text: "Lorem ipsum dolor sit amet" },
    { kind: "paragraph", text: lorem[1] },
    { kind: "paragraph", text: lorem[2] },
    { kind: "callout", text: "Observation. Nullam quis risus eget urna mollis ornare vel eu leo, etiam porta sem malesuada magna." },
    { kind: "heading", number: 2, text: "Methodology" },
    { kind: "paragraph", text: lorem[2] },
    { kind: "columns",
      left: [
        { kind: "heading", number: 3, text: "Limitations" },
        { kind: "list", items: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Integer posuere erat a ante venenatis dapibus.", "Donec ullamcorper nulla non metus auctor fringilla."] },
      ],
      right: [
        { kind: "heading", number: 4, text: "Sources" },
        { kind: "sources", items: [placeholderSource, placeholderSource, placeholderSource] },
      ],
    },
  ],
};

export const allPublications: Publication[] = [...publications, researchSpecimenPublication];

export function publicationBySlug(slug: string) {
  return allPublications.find((publication) => publication.slug === slug);
}

export function publicationByReference(reference: string) {
  const wanted = reference.toUpperCase();
  return allPublications.find((publication) => publication.reference === wanted);
}
```

Create `src/lib/report-source.ts`:

```ts
import { createHash } from "node:crypto";
import type { Publication } from "@/data/publications";

export const REPORT_CSS_PATH = "src/components/report/report.css";

/** Fingerprint of everything that shapes the printed PDF: record content plus the report stylesheet. */
export function reportSourceHash(p: Publication, css: string) {
  const { slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body } = p;
  const content = JSON.stringify({ slug, reference, title, subtitle, type, area, origin, publishedAt, authors, summary, tags, sources, body });
  return createHash("sha256").update(content).update("\0").update(css).digest("hex").slice(0, 16);
}
```

- [ ] **Step 4: Run the tests.** `npx vitest run tests/publications.test.ts` should PASS. `npx tsc --noEmit` will show errors in `src/app/research/[slug]/page.tsx` for the removed fields. Replace that page's body temporarily with `notFound()`-safe minimal JSX:

```tsx
return <PageHero variant="document" title={publication.title} description={publication.summary} />;
```

Remove its unused imports. Task 6 rewrites the page; this keeps each commit compiling.

- [ ] **Step 5: Commit**

```bash
git add src/data/publications.ts src/lib/report-source.ts tests/publications.test.ts "src/app/research/[slug]/page.tsx"
git commit -m "feat(research): structured report record with stable reference and source hash"
```

---

### Task 3: Print surface

**Files:**
- Create: `src/lib/fonts.ts`, `src/components/report/report-document.tsx`, `src/app/research/[slug]/print/page.tsx`
- Move: `src/app/research/example-report/report.css` → `src/components/report/report.css` (use `mcp__filesystem__move_file`, per the user's CLAUDE.md)
- Modify: `src/app/layout.tsx` (import the fonts from `src/lib/fonts.ts`), `src/app/research/example-report/page.tsx` (update its CSS import path until Task 6 deletes it)
- Test: `e2e/report.spec.ts` (create)

**Interfaces:**
- Produces:
  - `ReportDocument({ publication, citation }: { publication: Publication; citation: string })`: flowing `<article class="report-document report-document--print">`.
  - `ReportBlocks({ blocks }: { blocks: ReportBlock[] })`.
  - Print route meta tags: `report-reference`, `report-title`, `report-authors` (JSON array), `report-abstract`, `report-keywords` (comma list), `report-published` (ISO), `report-sha`.
  - `sans` and `display` exported from `src/lib/fonts.ts`.
- Consumes: `publicationBySlug`, `allPublications`, `reportSourceHash`, `REPORT_CSS_PATH`, `buildCitation`, `formatMonthYear`, `siteUrl`.

- [ ] **Step 1: Write the failing e2e test** `e2e/report.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("print surface exposes report metadata and stays out of search", async ({ page }) => {
  await page.goto("/research/example-report/print");
  await expect(page.locator('meta[name="report-reference"]')).toHaveAttribute("content", "TC-EX-000");
  await expect(page.locator('meta[name="report-sha"]')).toHaveAttribute("content", /^[0-9a-f]{16}$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx playwright test e2e/report.spec.ts --project=desktop`
Expected: FAIL (404 on `/print`).

- [ ] **Step 3: Implement.**

`src/lib/fonts.ts`: move the two font constructors out of `layout.tsx` and export them.

```ts
import { Schibsted_Grotesk, Source_Serif_4 } from "next/font/google";

// Self-hosted at build time with preload and a metric-matched fallback (no layout shift on swap).
export const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
export const display = Source_Serif_4({ subsets: ["latin"], axes: ["opsz"], variable: "--font-display" });
```

`layout.tsx` then imports `{ sans, display }` from `@/lib/fonts` and drops its own constructors and the `next/font/google` import.

Move `report.css` with `mcp__filesystem__move_file`. At its top, replace the header comment with `/* Report sheets: shared by the print surface (PDF source) and the report page. */`. Keep every existing rule. Delete the `.report-notice*` rules from this file; Task 6 re-adds a notice style. Then append:

```css
/* Print surface: the flowing document Chromium paginates into the PDF. Screen view is only a preview. */
.report-document--print { width: 816px; padding: 0; gap: 0; }
.report-document--print .report-page-body { padding: 0; }
.report-document--print .report-meta, .report-document--print .report-columns, .report-document--print .report-figure,
.report-document--print .report-callout, .report-document--print .report-findings li, .report-document--print .report-sources li { break-inside: avoid; }
.report-document--print h2 { break-after: avoid; }

@media print {
  .skip-link, .site-header, .site-footer { display: none !important; }
  html, body { background: var(--ivory-light) !important; }
  .report-document--print { width: auto; }
}
```

`src/components/report/report-document.tsx`:

```tsx
import type { Publication, ReportBlock } from "@/data/publications";
import { formatMonthYear } from "@/lib/site";

export function ReportBlocks({ blocks }: { blocks: ReportBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.kind) {
      case "heading":
        return <h2 key={index}>{block.number !== undefined && <span>{block.number}</span>}{block.text}</h2>;
      case "lede":
        return <p key={index} className="report-lede">{block.text}</p>;
      case "paragraph":
        return <p key={index}>{block.text}</p>;
      case "callout":
        return <blockquote key={index} className="report-callout">{block.text}</blockquote>;
      case "findings":
        return <ol key={index} className="report-findings">{block.items.map((item) => <li key={item.lead}><strong>{item.lead}</strong> {item.text}</li>)}</ol>;
      case "list":
        return <ul key={index} className="report-list">{block.items.map((item) => <li key={item}>{item}</li>)}</ul>;
      case "sources":
        return <ol key={index} className="report-sources">{block.items.map((s, i) => <li key={i}>{s.publisher}. <em>{s.title}.</em>{s.period ? ` ${s.period}.` : ""}{s.retrievedAt ? ` Retrieved ${s.retrievedAt}.` : ""}</li>)}</ol>;
      case "figure":
        return (
          <figure key={index} className="report-figure">
            <svg viewBox="0 0 320 180" role="img" aria-label="Placeholder figure with no data">
              {[30, 70, 110, 150].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} className="report-figure-grid" />)}
              <path d="M0 140 C60 128 90 96 140 102 S230 58 320 44" className="report-figure-line" />
              <path d="M0 150 C70 146 120 132 170 128 S260 110 320 104" className="report-figure-line report-figure-line-muted" />
            </svg>
            <figcaption><strong>Figure 1.</strong> {block.caption} Source: {block.source}</figcaption>
          </figure>
        );
      case "columns":
        return <div key={index} className="report-columns"><div><ReportBlocks blocks={block.left} /></div><div><ReportBlocks blocks={block.right} /></div></div>;
    }
  });
}

export function ReportDocument({ publication, citation }: { publication: Publication; citation: string }) {
  const originLabel = publication.origin === "independent" ? "Independent research by Tharros Canada" : "Client-commissioned research";
  return (
    <article className="report-document report-document--print">
      <div className="report-page-body">
        <p className="report-kicker">{publication.type} · {publication.area.replaceAll("-", " ")}</p>
        <h1>{publication.title}</h1>
        {publication.subtitle && <p className="report-subtitle">{publication.subtitle}</p>}
        <dl className="report-meta">
          <div><dt>Reference</dt><dd>{publication.reference}</dd></div>
          <div><dt>Published</dt><dd>{formatMonthYear(publication.publishedAt)}</dd></div>
          <div><dt>Authors</dt><dd>{publication.authors.join(", ")}</dd></div>
          <div><dt>Origin</dt><dd>{originLabel}</dd></div>
        </dl>
        <ReportBlocks blocks={publication.body} />
        <div className="report-citation">
          <h2>Suggested citation</h2>
          <p>{citation}</p>
        </div>
      </div>
    </article>
  );
}
```

The kicker needs the area *name*. Import `researchAreas` from `@/lib/research-areas` and use `researchAreas.find((a) => a.slug === publication.area)?.name ?? publication.area` instead of the `replaceAll`.

`src/app/research/[slug]/print/page.tsx`:

```tsx
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReportDocument } from "@/components/report/report-document";
import { allPublications, publicationBySlug } from "@/data/publications";
import { buildCitation } from "@/lib/citation";
import { display, sans } from "@/lib/fonts";
import { REPORT_CSS_PATH, reportSourceHash } from "@/lib/report-source";
import { siteUrl } from "@/lib/site";
import "@/components/report/report.css";

export const dynamicParams = false;
export const generateStaticParams = () => allPublications.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = publicationBySlug((await params).slug);
  if (!p) return {};
  const css = readFileSync(join(process.cwd(), REPORT_CSS_PATH), "utf8");
  return {
    title: `${p.title} (print)`,
    robots: { index: false, follow: false },
    other: {
      "report-reference": p.reference,
      "report-title": p.title,
      "report-authors": JSON.stringify(p.authors),
      "report-abstract": p.summary,
      "report-keywords": (p.tags ?? []).join(", "),
      "report-published": p.publishedAt,
      "report-sha": reportSourceHash(p, css),
    },
  };
}

export default async function ReportPrintPage({ params }: Props) {
  const p = publicationBySlug((await params).slug);
  if (!p) notFound();
  const citation = buildCitation("apa", { title: p.title, authors: p.authors, publishedAt: p.publishedAt, url: `${siteUrl}/research/id/${p.reference}`, reference: p.reference });
  const head = `${p.type} · ${p.specimen ? "Example layout" : p.reference}`;
  const foot = p.specimen ? "Placeholder text. Not a Tharros Canada publication." : `${p.reference} · ${siteUrl.replace(/^https?:\/\//, "")}`;
  // @page margin boxes repeat the running head and foot on every PDF page (Chromium 131+).
  const pageCss = `
    @page { size: Letter; margin: 0.78in 0.75in 0.72in; background: #faf8f3;
      @top-left { content: "THARROS / CANADA"; font-family: ${display.style.fontFamily}; font-size: 9.5pt; letter-spacing: .16em; color: #161719; vertical-align: bottom; padding-bottom: 10pt; border-bottom: 0.75pt solid #161719; }
      @top-right { content: ${JSON.stringify(head.toUpperCase())}; font-family: ${sans.style.fontFamily}; font-size: 8pt; font-weight: 600; letter-spacing: .1em; color: #5b6168; vertical-align: bottom; padding-bottom: 10pt; border-bottom: 0.75pt solid #161719; }
      @bottom-left { content: ${JSON.stringify(foot.toUpperCase())}; font-family: ${sans.style.fontFamily}; font-size: 8pt; font-weight: 600; letter-spacing: .1em; color: #5b6168; vertical-align: top; padding-top: 10pt; border-top: 0.75pt solid #d9d4c8; }
      @bottom-right { content: counter(page) " / " counter(pages); font-family: ${sans.style.fontFamily}; font-size: 8pt; font-weight: 600; color: #5b6168; vertical-align: top; padding-top: 10pt; border-top: 0.75pt solid #d9d4c8; }
    }`;
  return (
    <>
      <style>{pageCss}</style>
      <ReportDocument publication={p} citation={citation} />
    </>
  );
}
```

Before running, replace the hex literals in `pageCss` with the actual values of `--ink`, `--slate`, `--rule` and `--ivory-light` from `src/app/globals.css :root`, since custom properties don't resolve inside `@page` margin boxes.

Update the import in `src/app/research/example-report/page.tsx` to `import "@/components/report/report.css";`, Move the `.report-notice` rules (and their lines inside the `@media (max-width: 760px)` block) out of `report.css` into `src/app/globals.css`, under a `/* ---------- Report notice ---------- */` heading. That keeps `report.css` limited to what shapes the PDF, and nothing changes visually before Task 6.

- [ ] **Step 4: Run it and confirm it passes**

Run: `npx playwright test e2e/report.spec.ts --project=desktop`
Expected: PASS.

Also run `npx tsc --noEmit && npx eslint . --max-warnings=0`.

- [ ] **Step 5: Commit**

```bash
git add -A src e2e/report.spec.ts
git commit -m "feat(research): print surface for reports with @page running heads and metadata"
```

---

### Task 4: PDF generator, artifacts and stale guard

**Files:**
- Create: `scripts/report-pdf.mjs`, `src/lib/reports.ts`, `tests/report-pdf.test.ts`
- Generated (committed): `public/research/TC-EX-000.pdf`, `public/research/TC-EX-000-cover.jpg`, `src/data/report-pdf.json`, `src/data/report-text/example-report.json`
- Modify: `package.json` (deps + scripts)

**Interfaces:**
- Produces:
  - `type ReportAsset = { file: string; cover: string; pages: number; bytes: number; sha: string; outline: boolean }`.
  - `reportAsset(slug): ReportAsset | undefined`.
  - `reportText(slug): string[]` (one string per page; `[]` if missing).
  - npm script `report:pdf`.
- Consumes: the print route meta (Task 3), `reportSourceHash`, `REPORT_CSS_PATH`.

- [ ] **Step 1: Install dependencies and add the scripts**

```bash
npm i pdfjs-dist@6 --save-exact
npm i -D pdf-lib --save-exact
```

In `package.json` `scripts`, add:

```json
"report:pdf": "node scripts/report-pdf.mjs",
"postinstall": "node -e \"require('node:fs').copyFileSync('node_modules/pdfjs-dist/build/pdf.worker.min.mjs','public/pdf.worker.min.mjs')\""
```

Add `public/pdf.worker.min.mjs` to `.gitignore`, then run `npm run postinstall` once and check the file exists.

- [ ] **Step 2: Write the failing stale-guard test** `tests/report-pdf.test.ts`:

```ts
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allPublications } from "../src/data/publications";
import { REPORT_CSS_PATH, reportSourceHash } from "../src/lib/report-source";
import { reportAsset, reportText } from "../src/lib/reports";

const css = readFileSync(join(process.cwd(), REPORT_CSS_PATH), "utf8");

describe.each(allPublications.map((p) => [p.slug, p] as const))("report %s", (slug, publication) => {
  const asset = reportAsset(slug);

  it("has a generated PDF", () => {
    expect(asset, `run: npm run build && npm run report:pdf -- ${slug}`).toBeDefined();
    const file = join(process.cwd(), "public", asset!.file);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBe(asset!.bytes);
    expect(existsSync(join(process.cwd(), "public", asset!.cover))).toBe(true);
  });

  it("is not stale", () => {
    expect(asset!.sha, `record or report.css changed; run: npm run build && npm run report:pdf -- ${slug}`).toBe(reportSourceHash(publication, css));
  });

  it("carries searchable text, an outline and its own identity", () => {
    const pages = reportText(slug);
    expect(pages).toHaveLength(asset!.pages);
    const all = pages.join(" ");
    expect(all).toContain(publication.reference);
    expect(all.replace(/\s+/g, " ")).toContain(publication.title);
    expect(asset!.outline).toBe(true);
  });
});
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npx vitest run tests/report-pdf.test.ts`
Expected: FAIL (`src/lib/reports` does not exist).

- [ ] **Step 4: Implement `src/lib/reports.ts`**

```ts
import assets from "@/data/report-pdf.json";

export type ReportAsset = { file: string; cover: string; pages: number; bytes: number; sha: string; outline: boolean };

export function reportAsset(slug: string): ReportAsset | undefined {
  return (assets as Record<string, ReportAsset>)[slug];
}

/** Extracted PDF text per page, for on-site search. Empty when the report has not been generated. */
export function reportText(slug: string): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require(`@/data/report-text/${slug}.json`) as { pages: string[] }).pages;
  } catch {
    return [];
  }
}
```

Create `src/data/report-pdf.json` containing `{}` so the import resolves before the first generation. If the bundler rejects the dynamic `require`, replace `reportText` with a static map: `import exampleReportText from "@/data/report-text/example-report.json"` and `const texts: Record<string, { pages: string[] }> = { "example-report": exampleReportText };`, then add each new report there. Prefer whichever builds; confirm with `npm run build`.

- [ ] **Step 5: Implement `scripts/report-pdf.mjs`**

```js
// Generates committed report PDFs from the print surface. Usage: npm run build && npm run report:pdf -- <slug> [...]
// Vercel builds cannot run Chromium, so artifacts are committed; tests/report-pdf.test.ts fails when they go stale.
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: npm run report:pdf -- <slug> [...slugs]");
  process.exit(1);
}

const port = 3300;
const base = `http://127.0.0.1:${port}`;
const server = spawn("npx", ["next", "start", "-p", String(port), "-H", "127.0.0.1"], { stdio: "inherit", shell: true });
const stop = () => server.kill();

async function waitForServer() {
  for (let i = 0; i < 60; i += 1) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("next start did not come up; did you run npm run build?");
}

async function extract(bytes) {
  const doc = await getDocument({ data: new Uint8Array(bytes), isEvalSupported: false, useSystemFonts: false }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n += 1) {
    const content = await (await doc.getPage(n)).getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : "")).join("").replace(/[ \t]+/g, " ").trim());
  }
  const outline = ((await doc.getOutline()) ?? []).length > 0;
  return { pages, outline };
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const manifestPath = join("src", "data", "report-pdf.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  await mkdir(join("public", "research"), { recursive: true });
  await mkdir(join("src", "data", "report-text"), { recursive: true });

  for (const slug of slugs) {
    const response = await page.goto(`${base}/research/${slug}/print`, { waitUntil: "networkidle" });
    if (!response?.ok()) throw new Error(`/research/${slug}/print returned ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const meta = await page.evaluate(() =>
      Object.fromEntries([...document.querySelectorAll('meta[name^="report-"]')].map((m) => [m.getAttribute("name").slice(7), m.getAttribute("content")])),
    );

    const printed = await page.pdf({ printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
    const pdf = await PDFDocument.load(printed, { updateMetadata: false });
    const stamp = new Date(`${meta.published}T00:00:00Z`);
    pdf.setTitle(meta.title, { showInWindowTitleBar: true });
    pdf.setAuthor(JSON.parse(meta.authors).join(", "));
    pdf.setSubject(meta.abstract);
    pdf.setKeywords([meta.reference, ...meta.keywords.split(",").map((k) => k.trim()).filter(Boolean)]);
    pdf.setCreator("Tharros Canada");
    pdf.setProducer("Tharros Canada report pipeline");
    pdf.setLanguage("en-CA");
    pdf.setCreationDate(stamp);
    pdf.setModificationDate(stamp);
    const bytes = await pdf.save();

    const file = `/research/${meta.reference}.pdf`;
    const cover = `/research/${meta.reference}-cover.jpg`;
    await writeFile(join("public", file), bytes);

    await page.emulateMedia({ media: "print" });
    await page.setViewportSize({ width: 816, height: 1056 });
    await page.screenshot({ path: join("public", cover), type: "jpeg", quality: 82, clip: { x: 0, y: 0, width: 816, height: 1056 } });
    await page.emulateMedia({ media: "screen" });

    const { pages, outline } = await extract(bytes);
    await writeFile(join("src", "data", "report-text", `${slug}.json`), JSON.stringify({ pages }, null, 2) + "\n");
    manifest[slug] = { file, cover, pages: pages.length, bytes: bytes.length, sha: meta.sha, outline };
    console.log(`${slug}: ${pages.length} pages, ${bytes.length} bytes, outline ${outline}`);
  }

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  await browser.close();
} finally {
  stop();
}
```

- [ ] **Step 6: Generate and inspect**

```bash
npm run build && npm run report:pdf -- example-report
```

Expected output: `example-report: 2 pages, … bytes, outline true`. Open `public/research/TC-EX-000.pdf` with the Read tool (PDF, pages "1-2") and `public/research/TC-EX-000-cover.jpg` with Read. Compare against `e2e/visual.spec.ts-snapshots/example-report-desktop-linux.png`:
- The running head reads THARROS / CANADA on the left and the type on the right, with a rule underneath.
- The title, meta row, findings, figure, callout and columns look like today's.
- The ivory page background is present, and the footer shows the page counter "1 / 2".

If a margin box renders in a fallback font, or the background is white in the margins, fix `pageCss` in Task 3 (`font-family` / `@page background`) and regenerate. Don't continue until it matches.

If `outline` is `false`, check the headings are real `<h1>`/`<h2>` elements. Chromium builds the outline from them with `tagged: true`.

- [ ] **Step 7: Run the stale guard**

Run: `npx vitest run`
Expected: all PASS, including the 3 `report example-report` tests.

Confirm the guard actually fires: change one character of the specimen `subtitle`, run `npx vitest run tests/report-pdf.test.ts` (expect FAIL "is not stale" with the regenerate hint), then revert.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .gitignore scripts/report-pdf.mjs src/lib/reports.ts src/data/report-pdf.json src/data/report-text public/research tests/report-pdf.test.ts
git commit -m "feat(research): generate committed report PDFs with metadata, cover and extracted text"
```

---

### Task 5: Report viewer

**Files:**
- Create: `src/components/report/report-viewer.tsx`
- Create: `src/components/report/report-viewer.css` (imported by the viewer). Keep it separate from `report.css`, which the PDF stale guard fingerprints.
- Test: `e2e/report.spec.ts`

**Interfaces:**
- Produces: `ReportViewer({ file, pages, title }: { file: string; pages: number; title: string })`, a client component.
  - DOM contract used by the tests:
    - `[data-report-viewer]`.
    - Each sheet is `.report-sheet[data-page="n"]` containing a `canvas` and a `.textLayer`.
    - A page input labelled "Page".
    - Buttons "Zoom in", "Zoom out", "Fit width", "Download PDF".
    - While any page is still rendering, the container carries `data-loading`.
  - Error state: text "The PDF could not be displayed." plus a Download link.
- Consumes: the `/pdf.worker.min.mjs` worker (Task 4) and the `ReportAsset` fields.

- [ ] **Step 1: Write the failing e2e tests** (append to `e2e/report.spec.ts`). Mount point: Task 6 renders the viewer on `/research/example-report`. Until then these fail, which is expected; Task 6 makes them pass. To test the viewer in isolation now, temporarily render it in the placeholder page from Task 2:

```tsx
<ReportViewer file="/research/TC-EX-000.pdf" pages={2} title={publication.title} />
```

```ts
test("viewer draws every PDF page as a sheet with selectable text", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await expect(viewer.locator(".report-sheet")).toHaveCount(2);
  await expect(viewer.locator('.report-sheet[data-page="1"] .textLayer')).toContainText("Lorem ipsum");
});

test("page input jumps and zoom changes sheet width", async ({ page }) => {
  await page.goto("/research/example-report");
  const viewer = page.locator("[data-report-viewer]");
  await expect(viewer).not.toHaveAttribute("data-loading", /.*/, { timeout: 15_000 });
  await page.getByLabel("Page").fill("2");
  await page.getByLabel("Page").press("Enter");
  await expect(viewer.locator('.report-sheet[data-page="2"]')).toBeInViewport();
  const before = (await viewer.locator(".report-sheet").first().boundingBox())!.width;
  await page.getByRole("button", { name: "Zoom out" }).click();
  await expect.poll(async () => (await viewer.locator(".report-sheet").first().boundingBox())!.width).toBeLessThan(before);
});

test("viewer fails closed with a download link when the PDF cannot load", async ({ page }) => {
  await page.route("**/research/TC-EX-000.pdf", (route) => route.abort());
  await page.goto("/research/example-report");
  await expect(page.getByText("The PDF could not be displayed.")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("[data-report-viewer]").getByRole("link", { name: /Download PDF/ })).toHaveAttribute("href", "/research/TC-EX-000.pdf");
});
```

- [ ] **Step 2: Run them and confirm they fail**

Run: `npx playwright test e2e/report.spec.ts --project=desktop`
Expected: the 3 new tests FAIL.

- [ ] **Step 3: Implement `src/components/report/report-viewer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import "./report-viewer.css";

type Props = { file: string; pages: number; title: string };
const SHEET_WIDTH = 816; // Letter at 96 dpi, the width the PDF was printed at.

export function ReportViewer({ file, pages, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [width, setWidth] = useState(0);
  const [rendering, setRendering] = useState(true);
  const [failed, setFailed] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  // Track available width so "fit" follows the layout (phones included).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scale = zoom === "fit" ? Math.min(width || SHEET_WIDTH, 900) / SHEET_WIDTH : zoom;

  useEffect(() => {
    if (!width) return;
    let cancelled = false;
    const tasks: { cancel: () => void }[] = [];
    setRendering(true);
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjs.getDocument({ url: file, isEvalSupported: false }).promise;
        // ponytail: renders every page up front; switch to IntersectionObserver-driven rendering past ~20 pages.
        for (let n = 1; n <= doc.numPages && !cancelled; n += 1) {
          const sheet = containerRef.current?.querySelector<HTMLElement>(`.report-sheet[data-page="${n}"]`);
          if (!sheet) continue;
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: scale * (96 / 72) });
          const ratio = window.devicePixelRatio || 1;
          const canvas = sheet.querySelector("canvas")!;
          canvas.width = Math.floor(viewport.width * ratio);
          canvas.height = Math.floor(viewport.height * ratio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          const task = page.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
          tasks.push(task);
          await task.promise;
          const layer = sheet.querySelector<HTMLDivElement>(".textLayer")!;
          layer.replaceChildren();
          layer.style.setProperty("--scale-factor", String(viewport.scale));
          await new pdfjs.TextLayer({ textContentSource: page.streamTextContent(), container: layer, viewport }).render();
        }
        if (!cancelled) setRendering(false);
      } catch (error) {
        if (!cancelled && (error as Error)?.name !== "RenderingCancelledException") setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      tasks.forEach((task) => task.cancel());
    };
  }, [file, scale, width]);

  // Current page follows scroll position.
  useEffect(() => {
    const sheets = containerRef.current?.querySelectorAll<HTMLElement>(".report-sheet");
    if (!sheets?.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(Number((e.target as HTMLElement).dataset.page))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sheets.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pages]);
  useEffect(() => setPageInput(String(current)), [current]);

  function goTo(n: number) {
    const target = Math.min(Math.max(1, n), pages);
    containerRef.current?.querySelector(`.report-sheet[data-page="${target}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const zoomBy = (delta: number) => setZoom((z) => Math.min(2, Math.max(0.5, Math.round(((z === "fit" ? scale : z) + delta) * 10) / 10)));

  function onKeyDown(event: React.KeyboardEvent) {
    if ((event.target as HTMLElement).tagName === "INPUT") return;
    if (event.key === "PageDown") { event.preventDefault(); goTo(current + 1); }
    if (event.key === "PageUp") { event.preventDefault(); goTo(current - 1); }
    if (event.key === "+" || event.key === "=") zoomBy(0.1);
    if (event.key === "-") zoomBy(-0.1);
  }

  const download = <a className="report-viewer-download" href={file} download>Download PDF</a>;

  return (
    <section className="report-viewer" aria-label={`${title}: PDF`} data-report-viewer data-loading={rendering && !failed ? "" : undefined} onKeyDown={onKeyDown}>
      <div className="report-viewer-toolbar" role="toolbar" aria-label="PDF controls">
        <form className="report-viewer-pages" onSubmit={(e) => { e.preventDefault(); goTo(Number(pageInput)); }}>
          <label htmlFor="report-page">Page</label>
          <input id="report-page" inputMode="numeric" value={pageInput} onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))} aria-describedby="report-page-total" />
          <span id="report-page-total">of {pages}</span>
        </form>
        <div className="report-viewer-zoom">
          <button type="button" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">−</button>
          <output aria-live="polite">{Math.round(scale * 100)}%</output>
          <button type="button" onClick={() => zoomBy(0.1)} aria-label="Zoom in">+</button>
          <button type="button" onClick={() => setZoom("fit")} aria-pressed={zoom === "fit"}>Fit width</button>
        </div>
        {download}
      </div>
      {failed ? (
        <div className="report-viewer-error" role="alert">
          <p>The PDF could not be displayed.</p>
          {download}
        </div>
      ) : (
        <div className="report-viewer-sheets" ref={containerRef} tabIndex={0} aria-label="Report pages">
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="report-sheet" data-page={i + 1} style={{ width: SHEET_WIDTH * scale, height: 1056 * scale }}>
              <canvas aria-hidden="true" />
              <div className="textLayer" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
```

Check `page.render`'s parameter names and `TextLayer` against `node_modules/pdfjs-dist/types` before running. In 6.x, `render` takes `{ canvas, viewport, transform? }` (with `canvasContext` optional); adjust if the types say otherwise.

`containerRef` is observed by ResizeObserver, but the sheets container only exists when `!failed`. Also observe the outer `section`: give the section its own ref, `rootRef`, and use `rootRef` in the ResizeObserver effect. `width` is the content width of `.report-viewer-sheets` (the section width minus its padding).

Create `src/components/report/report-viewer.css`:

```css
/* Report viewer: PDF pages drawn as the same shadowed ivory sheets. */
.report-viewer { width: min(900px, calc(100vw - 2 * var(--gutter))); margin: 0 auto; }
.report-viewer-toolbar { position: sticky; top: var(--header-height); z-index: 5; margin-bottom: 24px; padding: 10px 0; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 24px; border-bottom: 1px solid var(--rule-strong); background: var(--ivory); font-size: 14px; }
.report-viewer-pages, .report-viewer-zoom { display: flex; align-items: center; gap: 8px; }
.report-viewer-pages input { width: 3.2em; height: 36px; border: 1px solid var(--rule-strong); background: var(--ivory-light); text-align: center; font: inherit; font-variant-numeric: tabular-nums; }
.report-viewer-zoom button { min-width: 44px; height: 36px; padding: 0 10px; border: 1px solid var(--rule-strong); background: transparent; color: var(--ink); font: inherit; cursor: pointer; transition: background var(--dur-1, 150ms) ease; }
.report-viewer-zoom button:hover, .report-viewer-zoom button[aria-pressed="true"] { background: var(--ink); color: var(--ivory-light); }
.report-viewer-zoom output { min-width: 4ch; text-align: center; font-variant-numeric: tabular-nums; }
.report-viewer-download { font-weight: 600; text-decoration: underline; text-underline-offset: 4px; }
.report-viewer-sheets { display: grid; justify-items: center; gap: 32px; overflow-x: auto; padding-bottom: 8px; }
.report-viewer-sheets:focus-visible { outline: 2px solid var(--focus); outline-offset: 6px; }
.report-sheet { position: relative; background: var(--ivory-light); box-shadow: 0 1px 0 var(--rule-strong), 0 24px 60px -30px rgba(22, 23, 25, .35); scroll-margin-top: calc(var(--header-height) + 72px); }
.report-sheet canvas { display: block; }
.report-viewer[data-loading] .report-sheet { background: linear-gradient(var(--ivory-light), var(--ivory-light)) padding-box; }
.report-viewer-error { padding: 48px; border: 1px solid var(--rule-strong); background: var(--ivory-light); text-align: center; }
.report-viewer-error p { margin: 0 0 12px; font-size: 19px; }

/* pdf.js text layer: transparent, positioned text over the canvas so it can be selected and found. */
.textLayer { position: absolute; inset: 0; overflow: clip; opacity: 1; line-height: 1; text-size-adjust: none; forced-color-adjust: none; transform-origin: 0 0; z-index: 0; }
.textLayer :is(span, br) { position: absolute; color: transparent; white-space: pre; cursor: text; transform-origin: 0% 0%; }
.textLayer ::selection { background: rgba(47, 111, 174, .25); }
```

After installing, compare the `.textLayer` block with `node_modules/pdfjs-dist/web/pdf_viewer.css` `.textLayer` rules for the installed version. If that version relies on `--total-scale-factor`, `--min-font-size` or similar variables, copy its `.textLayer` rules verbatim instead of the three lines above, keeping only the `::selection` override.

- [ ] **Step 4: Run and confirm they pass**

Run: `npm run build && npx playwright test e2e/report.spec.ts --project=desktop --project=mobile`
Expected: PASS.

Then take a screenshot of `/research/example-report` (`npx playwright screenshot --full-page http://127.0.0.1:3100/research/example-report shot.png` against a running `next start`) and compare it with the old baseline. The sheets should look the same as before.

- [ ] **Step 5: Commit**

```bash
git add src/components/report e2e/report.spec.ts
git commit -m "feat(research): pdf.js viewer drawing report pages as paper sheets"
```

---

### Task 6: Report page

**Files:**
- Rewrite: `src/app/research/[slug]/page.tsx`
- Create: `src/components/report/report-actions.tsx`
- Delete: `src/app/research/example-report/page.tsx` (and its now-empty folder)
- Modify: `src/app/research/[slug]/opengraph-image.tsx` (`generateStaticParams` over `allPublications` instead of `publications`)
- Modify: `src/app/globals.css` (report header styles; the `.report-notice` rules added in Task 3 stay), `e2e/site.spec.ts` (overflow loop adds `/research/example-report`), `e2e/visual.spec.ts` (unchanged path, new baseline)
- Test: `e2e/report.spec.ts`

**Interfaces:**
- Produces: `ReportActions({ file, bytes, citation, url, title }: { file: string; bytes: number; citation: CitationInput; url: string; title: string })`.
- Consumes: `publicationBySlug`, `allPublications`, `reportAsset`, `ReportViewer`, `CitationPanel`, `jsonLd`, `siteUrl`, `formatLongDate`.

- [ ] **Step 1: Write the failing e2e tests** (append to `e2e/report.spec.ts`):

```ts
test("example report is labelled, noindex and has no Scholar tags", async ({ page }) => {
  await page.goto("/research/example-report");
  await expect(page.getByRole("note")).toContainText("Example layout");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[name^="citation_"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  await expect(page.getByText("TC-EX-000").first()).toBeVisible();
});

test("download serves a real PDF", async ({ request }) => {
  const response = await request.get("/research/TC-EX-000.pdf");
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("cite popover copies an APA citation with the stable reference URL", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/research/example-report");
  await page.getByRole("button", { name: "Cite" }).click();
  await page.getByRole("button", { name: "Copy citation" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("(Report No. TC-EX-000)");
  expect(copied).toContain("/research/id/TC-EX-000");
});

test("share falls back to copy, and to a visible URL when copying is denied", async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error simulate browsers without Web Share
    delete Navigator.prototype.share;
    navigator.clipboard.writeText = () => Promise.reject(new Error("denied"));
  });
  await page.goto("/research/example-report");
  await page.getByRole("button", { name: "Share" }).click();
  await expect(page.getByRole("textbox", { name: "Report link" })).toHaveValue(/\/research\/id\/TC-EX-000$/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("header, abstract and download remain", async ({ page }) => {
    await page.goto("/research/example-report");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: /Download PDF/ }).first()).toHaveAttribute("href", "/research/TC-EX-000.pdf");
  });
});
```

In `e2e/site.spec.ts`, change `const paths = ["/", "/research-services", "/request-research", "/live-monitor"];` (the overflow loop) to include `"/research/example-report"`.

- [ ] **Step 2: Run and confirm they fail**

Run: `npx playwright test e2e/report.spec.ts --project=desktop`
Expected: the new tests FAIL.

- [ ] **Step 3: Implement `src/components/report/report-actions.tsx`**

```tsx
"use client";

import { useState } from "react";
import { CitationPanel } from "@/components/citation-panel";
import type { CitationInput } from "@/lib/citation";

type Props = { file: string; bytes: number; citation: CitationInput; url: string; title: string };

export function ReportActions({ file, bytes, citation, url, title }: Props) {
  const [linkState, setLinkState] = useState<"idle" | "copied" | "manual">("idle");

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setLinkState("copied");
    } catch {
      setLinkState("manual");
    }
  }
  async function share() {
    if (typeof navigator.share === "function") {
      try { await navigator.share({ title, url }); return; } catch { /* dismissed: fall through to copy */ }
    }
    await copyLink();
  }

  return (
    <div className="report-actions">
      <details className="cite-popover report-cite">
        <summary role="button">Cite</summary>
        <div className="cite-popover-body"><CitationPanel input={citation} /></div>
      </details>
      <a className="button-primary" href={file} download>Download PDF <small>({Math.round(bytes / 1024)} KB)</small></a>
      <button type="button" className="report-action" onClick={copyLink}>{linkState === "copied" ? "Link copied" : "Copy link"}</button>
      <button type="button" className="report-action" onClick={share}>Share</button>
      {linkState === "manual" && (
        <label className="report-link-field">
          <span>Report link</span>
          <input readOnly value={url} aria-label="Report link" onFocus={(e) => e.currentTarget.select()} />
        </label>
      )}
      <span className="sr-only" role="status">{linkState === "copied" ? "Link copied" : ""}</span>
    </div>
  );
}
```

- [ ] **Step 4: Rewrite `src/app/research/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { ReportActions } from "@/components/report/report-actions";
import { ReportViewer } from "@/components/report/report-viewer";
import { allPublications, publicationBySlug } from "@/data/publications";
import type { CitationInput } from "@/lib/citation";
import { researchAreas } from "@/lib/research-areas";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, jsonLd, siteUrl } from "@/lib/site";
import "@/components/report/report.css";

export const generateStaticParams = () => allPublications.map((p) => ({ slug: p.slug }));
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = publicationBySlug((await params).slug);
  if (!p) return {};
  const asset = reportAsset(p.slug);
  // The OG image comes from ./opengraph-image.tsx (file convention wins over metadata images).
  const base: Metadata = {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/research/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.summary, publishedTime: p.publishedAt, authors: p.authors },
  };
  if (!p.indexable) return { ...base, robots: { index: false, follow: false } };
  return {
    ...base,
    other: {
      citation_title: p.title,
      citation_author: p.authors,
      citation_publication_date: p.publishedAt.replaceAll("-", "/"),
      citation_publisher: "Tharros Canada",
      citation_technical_report_number: p.reference,
      citation_technical_report_institution: "Tharros Canada",
      ...(asset ? { citation_pdf_url: `${siteUrl}${asset.file}` } : {}),
      citation_language: "en",
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const p = publicationBySlug((await params).slug);
  if (!p) notFound();
  const asset = reportAsset(p.slug);
  const area = researchAreas.find((a) => a.slug === p.area);
  const stableUrl = `${siteUrl}/research/id/${p.reference}`;
  const citation: CitationInput = { title: p.title, authors: p.authors, publishedAt: p.publishedAt, url: stableUrl, reference: p.reference };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: p.title,
    headline: p.title,
    reportNumber: p.reference,
    abstract: p.summary,
    datePublished: p.publishedAt,
    inLanguage: "en-CA",
    author: p.authors.map((name) => ({ "@type": name === "Tharros Canada" ? "Organization" : "Person", name })),
    publisher: { "@type": "Organization", name: "Tharros Canada", url: siteUrl },
    about: area?.name,
    url: `${siteUrl}/research/${p.slug}`,
    ...(asset ? { encoding: { "@type": "MediaObject", contentUrl: `${siteUrl}${asset.file}`, encodingFormat: "application/pdf" } } : {}),
    citation: p.sources.flatMap((s) => (s.url ? [s.url] : [])),
  };

  return (
    <>
      {p.specimen && (
        <div className="report-notice" role="note">
          <div>
            <strong>Example layout</strong>
            <p>This shows how a Tharros research report is published. Every word is lorem ipsum placeholder text, and the figure contains no data. It is not a publication and is kept out of search engines.</p>
          </div>
          <Link className="text-link" href="/research">Back to the research archive <ArrowIcon /></Link>
        </div>
      )}
      <header className="report-header">
        <p className="report-header-kicker">{p.type} · {area?.name ?? p.area}</p>
        <h1>{p.title}</h1>
        {p.subtitle && <p className="report-header-subtitle">{p.subtitle}</p>}
        <dl className="report-header-meta">
          <div><dt>Reference</dt><dd>{p.reference}</dd></div>
          <div><dt>Published</dt><dd><time dateTime={p.publishedAt}>{formatLongDate(p.publishedAt)}</time></dd></div>
          <div><dt>Authors</dt><dd>{p.authors.join(", ")}</dd></div>
          {asset && <div><dt>Length</dt><dd>{asset.pages} pages</dd></div>}
        </dl>
        <p className="report-header-abstract">{p.summary}</p>
        {asset && <ReportActions file={asset.file} bytes={asset.bytes} citation={citation} url={stableUrl} title={p.title} />}
      </header>
      {asset ? (
        <>
          <ReportViewer file={asset.file} pages={asset.pages} title={p.title} />
          <noscript><p className="report-noscript"><a href={asset.file}>Download PDF</a> to read this report.</p></noscript>
        </>
      ) : (
        <p className="report-noscript">The PDF for this report is being prepared.</p>
      )}
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </>
  );
}
```

The no-JS test expects a Download link without JavaScript. `ReportActions` is a client component, but its `<a download>` is server-rendered HTML, so it works without JS. Keep it as a plain `<a>`.

Delete `src/app/research/example-report/page.tsx`. Remove the `src/app/research/example-report` directory once it's empty.

Remove the now-unused `research-article*`, `citation-sidebar*` and `research-lede`/`research-findings`/`research-limitations`/`research-sources`/`research-citation` rules from `globals.css`. Before deleting each, `grep -rn "<class>" src` to confirm it has no other users. Delete `src/components/citation-sidebar.tsx` if nothing imports it.

Add to `globals.css`, under the Report notice heading:

```css
.report-header { width: min(900px, calc(100vw - 2 * var(--gutter))); margin: 0 auto; padding: clamp(40px, 5vw, 72px) 0 32px; }
.report-header-kicker { margin: 0; color: var(--red); font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
.report-header h1 { max-width: 22ch; margin: 16px 0 14px; font-size: clamp(36px, 4.6vw, 56px); line-height: 1.04; letter-spacing: -.02em; }
.report-header-subtitle { max-width: 56ch; margin: 0; font-family: var(--display); font-size: 21px; line-height: 1.4; }
.report-header-meta { margin: 28px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 2px solid var(--ink); border-bottom: 1px solid var(--rule); }
.report-header-meta > div { padding: 12px 12px 12px 0; }
.report-header-meta dt { color: var(--slate); font-size: 11.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.report-header-meta dd { margin: 4px 0 0; font-size: 16px; font-variant-numeric: tabular-nums; }
.report-header-abstract { max-width: 64ch; margin: 24px 0 0; color: var(--ink-soft); font-size: 19px; line-height: 1.55; }
.report-actions { margin-top: 28px; display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.report-actions small { font-weight: 400; opacity: .8; }
.report-action, .report-cite > summary { min-height: 44px; padding: 0 16px; display: inline-flex; align-items: center; border: 1px solid var(--ink); background: transparent; color: var(--ink); font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
.report-action:hover, .report-cite > summary:hover { background: var(--ink); color: var(--ivory-light); }
.report-link-field { flex-basis: 100%; display: grid; gap: 6px; font-size: 14px; }
.report-link-field input { height: 44px; padding: 0 12px; border: 1px solid var(--rule-strong); background: var(--ivory-light); font: inherit; }
.report-noscript { width: min(900px, calc(100vw - 2 * var(--gutter))); margin: 0 auto 48px; font-size: 19px; }
@media (max-width: 760px) { .report-header-meta { grid-template-columns: 1fr 1fr; } }
```

Check the existing `.cite-popover > summary` rules in `globals.css`: `.report-cite > summary` must win, so place the new rules after them.

- [ ] **Step 5: Run everything**

```bash
npx tsc --noEmit && npx eslint . --max-warnings=0 && npx vitest run
npm run build && npx playwright test e2e/report.spec.ts e2e/site.spec.ts
```

Expected: all PASS.

`report.css` must be unchanged since Task 4. If `npx vitest run` reports the PDF stale, something edited it: revert that edit, or regenerate with `npm run build && npm run report:pdf -- example-report` and re-inspect the PDF.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e public/research
git commit -m "feat(research): report page with header, actions and embedded PDF viewer"
```

---

### Task 7: Indexing plumbing and stable IDs

**Files:**
- Create: `src/app/research/id/[reference]/route.ts`, `tests/sitemap.test.ts`
- Modify: `src/app/sitemap.ts`, `next.config.ts`
- Test: `e2e/report.spec.ts`

**Interfaces:**
- Produces:
  - `GET /research/id/:reference` → 308 to `/research/:slug`, or 404.
  - Sitemap includes indexable reports and their PDFs.
  - `X-Robots-Tag: noindex` on the PDF and cover of each non-indexable report.
- Consumes: `publicationByReference`, `allPublications`, `reportAsset`.

- [ ] **Step 1: Write the failing tests**

`tests/sitemap.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

describe("sitemap", () => {
  it("lists indexable reports and their PDFs, never the specimen", async () => {
    vi.resetModules();
    vi.doMock("@/data/publications", async (orig) => {
      const mod = await orig<typeof import("@/data/publications")>();
      const real = { ...mod.researchSpecimenPublication, slug: "real-report", reference: "TC-2026-001", specimen: false, indexable: true };
      return { ...mod, allPublications: [real, mod.researchSpecimenPublication] };
    });
    vi.doMock("@/lib/reports", () => ({
      reportAsset: (slug: string) => (slug === "real-report" ? { file: "/research/TC-2026-001.pdf" } : { file: "/research/TC-EX-000.pdf" }),
    }));
    const { default: sitemap } = await import("../src/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://tharros.ca/research/real-report");
    expect(urls).toContain("https://tharros.ca/research/TC-2026-001.pdf");
    expect(urls.some((u) => u.includes("example-report") || u.includes("TC-EX-000"))).toBe(false);
  });
});
```

Append to `e2e/report.spec.ts`:

```ts
test("stable ID redirects permanently, case-insensitively; unknown IDs 404", async ({ request }) => {
  const ok = await request.get("/research/id/tc-ex-000", { maxRedirects: 0 });
  expect(ok.status()).toBe(308);
  expect(ok.headers()["location"]).toMatch(/\/research\/example-report$/);
  expect((await request.get("/research/id/NOPE", { maxRedirects: 0 })).status()).toBe(404);
});

test("non-indexable PDF carries X-Robots-Tag and is not in the sitemap", async ({ request }) => {
  expect((await request.get("/research/TC-EX-000.pdf")).headers()["x-robots-tag"]).toContain("noindex");
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("example-report");
});
```

- [ ] **Step 2: Run and confirm they fail**

Run: `npx vitest run tests/sitemap.test.ts` (FAIL). Run: `npm run build && npx playwright test e2e/report.spec.ts -g "stable ID|X-Robots" --project=desktop` (FAIL).

- [ ] **Step 3: Implement**

`src/app/research/id/[reference]/route.ts`:

```ts
import { publicationByReference } from "@/data/publications";

// Stable citation URL: the reference never changes even if a slug does.
export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const publication = publicationByReference((await params).reference);
  if (!publication) return new Response("Not found", { status: 404 });
  return new Response(null, { status: 308, headers: { Location: `/research/${publication.slug}` } });
}
```

In `src/app/sitemap.ts`, replace the `publications` import and the `research` mapping:

```ts
import { allPublications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
// …
  const research = allPublications
    .filter((p) => p.indexable)
    .flatMap((p) => {
      const asset = reportAsset(p.slug);
      const page = { url: `${base}/research/${p.slug}`, lastModified: new Date(p.publishedAt), changeFrequency: "monthly" as const, priority: 0.8 };
      return asset ? [page, { url: `${base}${asset.file}`, lastModified: new Date(p.publishedAt), changeFrequency: "yearly" as const, priority: 0.6 }] : [page];
    });
```

In `next.config.ts`, before `nextConfig`:

```ts
import { allPublications } from "./src/data/publications";
import reportAssets from "./src/data/report-pdf.json";

// Non-indexable reports (e.g. the lorem specimen) keep their files out of search engines too.
const noindexFiles = allPublications
  .filter((p) => !p.indexable)
  .flatMap((p) => {
    const asset = (reportAssets as Record<string, { file: string; cover: string }>)[p.slug];
    return asset ? [asset.file, asset.cover] : [];
  });
```

and add to the `headers()` array:

```ts
...noindexFiles.map((source) => ({ source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
```

`publications.ts` imports `type { ResearchArea }` from `@/lib/research-areas`. That import is erased, so `next.config.ts` loads it without alias resolution. If the config loader still complains about `@/`, change that one import to a relative `../lib/research-areas`.

- [ ] **Step 4: Run and confirm they pass**

Run: `npx vitest run && npm run build && npx playwright test e2e/report.spec.ts --project=desktop`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src next.config.ts tests/sitemap.test.ts e2e/report.spec.ts
git commit -m "feat(research): stable report IDs, sitemap and X-Robots-Tag gating by indexable"
```

---

### Task 8: Docs, baselines, PR

**Files:**
- Modify: `README.md` (a "Publishing a report" section), `AGENTS.md` (the `report:pdf` command), `docs/PRE_LAUNCH.md` (a note that the first real report must set `indexable: true`)

- [ ] **Step 1: Document.** Add to `README.md`:

```markdown
## Publishing a report

1. Add a record to `publications` in `src/data/publications.ts`: `reference` `TC-<YEAR>-<NNN>`, body blocks, `indexable: true` only for verified, published work.
2. `npm run build && npm run report:pdf -- <slug>`: prints `/research/<slug>/print` to `public/research/<reference>.pdf`, writes the cover, extracted text and `src/data/report-pdf.json`.
3. Read the PDF before committing. `npm test` fails if the record or `src/components/report/report.css` changes without regenerating.
4. Indexable reports get Scholar `citation_*` tags, `Report` JSON-LD, sitemap entries and the stable URL `/research/id/<reference>`.
```

Add `- npm run build && npm run report:pdf -- <slug>: regenerate a report PDF (commit the outputs).` to AGENTS.md "Project commands".

- [ ] **Step 2: Full local verification**

```bash
npx tsc --noEmit && npx eslint . --max-warnings=0 && npx vitest run && npm run build && npx playwright test e2e/site.spec.ts e2e/report.spec.ts
```

Expected: all PASS.

- [ ] **Step 3: Commit, push, baselines, PR**

```bash
git add README.md AGENTS.md docs/PRE_LAUNCH.md
git commit -m "docs: report publishing workflow [update-baselines]"
git push -u origin feat/report-pipeline
gh workflow run "Update visual baselines" -R TharrosDev/TharrosCananda --ref feat/report-pipeline
```

Wait for the run, `git pull --rebase`, and review the changed `example-report-*` baselines with Read. The sheets must look like the pre-change baseline. Then:

```bash
gh pr create -R TharrosDev/TharrosCananda --base main --head feat/report-pipeline --title "Report pipeline: real embedded PDF, citable, indexing-ready"
```

Merge after CI is green (branch protection requires `verify` + `browser`).
