# Report requirements

This guide is for adding a research report the owner supplies as a PDF. It covers what every site tool needs from that report, where to find each value in the PDF, and the checks that block a merge when something is missing. House-typeset reports (typed `body` blocks, printed by the site) follow `README.md` "Publishing a report" and pass the same record checks.

## Rule #1: never edit the document

**No AI edits the supplied PDF.** Don't modify it, re-export it, re-save it, optimise it, add bookmarks or change its metadata. The file in `public/research/<reference>.pdf` must be byte-for-byte what the owner sent.

- Anything the site needs that isn't in the PDF goes into the **record** (`src/data/publications.ts`), never into the file.
- `npm run report:pdf` only reads a supplied PDF. It records a hash of the file, and `tests/report-pdf.test.ts` fails if the file changes afterwards.
- If the PDF can't meet a requirement below, stop and ask the owner for a new export. Don't fix it yourself.

## What the PDF must have

| Requirement | Why | Checked by |
|---|---|---|
| A real text layer (exported from Word, not scanned) | Archive search, find-in-report and reading time read the extracted text | `report:pdf` refuses the file |
| The title appears in the text | Ties the file to its record | `report:pdf` and `tests/report-pdf.test.ts` |
| Letter or A4 pages | The viewer sizes its pages from page 1 | Viewer reads `width`/`height` from the manifest |
| Bookmarks (recommended) | Build the Contents panel and the section jumps | Optional. Without bookmarks the Contents panel is hidden |

The owner can get bookmarks in Word through *File → Save as → PDF → Options → Create bookmarks using: Headings*.

## Field map: record ← PDF

Take each value **verbatim** from the PDF. Sections are often named differently, so match on meaning rather than on the exact heading.

| Record field | Used by | Where to find it in the PDF |
|---|---|---|
| `title`, `subtitle` | Page header, citations, OG image, JSON-LD, search | Cover or first heading. Copy exactly, since the title must match the text |
| `authors` | Citations, JSON-LD, Scholar tags | Byline, cover, "Prepared by", "About the author" |
| `publishedAt` (`YYYY-MM-DD`) | Citations, sitemap, archive year facet | Date on the cover, colophon or footer |
| `summary` | Page lede, meta description, OG image, llms.txt, search | Executive summary, Summary, Abstract, Overview, Key findings, Introduction. Use its opening paragraph or two |
| `limitations` | Limitations panel | Limitations, Caveats, Constraints, Scope and limitations, "What this report does not cover" |
| `sources` (each with `url` and `retrievedAt`) | Sources panel, JSON-LD `citation` | Sources, References, Bibliography, Works cited, Endnotes, footnotes, source lines under charts and tables |
| `tags` | Search, PDF keywords | Keywords line, otherwise the main subjects |
| `area` | Archive facet, OG image, "More in" link | One of the `researchAreas` slugs (`src/lib/research-areas.ts`). Judge from the content |
| `type` | Archive facet, page header | One of `publicationTypes`. Judge from length and form |
| `reference` | Stable URL `/research/id/<reference>` | Assigned by the site: `TC-<YEAR>-<NNN>`, next free number |
| `slug` | URL | Assigned by the site: short, lowercase and hyphenated, based on the title |
| `origin` | Page header | `independent` unless the owner says it was commissioned and cleared for publication |

Information that is only in a figure, table or image (for example, a source line printed inside a chart) is read visually and transcribed **into the record**. The PDF stays as it is.

## When a value isn't in the PDF

1. Search the whole document first: headings under other names, footnotes, chart captions, the back page.
2. If it truly isn't there, draft it as record metadata. `area`, `type` and `tags` are usually drafted.
3. List every drafted value in the PR body under **"Drafted metadata – needs approval"**, one line per field. The owner approves or corrects them before merge.
4. For a source that has no URL, find the publisher's canonical page and record the date you retrieved it. List it as drafted.

Never invent findings, data, sources or authors (see `AGENTS.md` Content truth).

## Intake steps

1. Save the owner's file unchanged as `public/research/<reference>.pdf`.
2. Add a record to `publications` in `src/data/publications.ts` with `supplied: true`, `body: []` and the fields above. Set `indexable: true` only for verified, published work.
3. Run `npm run report:pdf -- <slug>`. It reads the PDF and writes the cover JPEG, extracted text, bookmarks, page size and file hash to `src/data/report-*.json`. It needs no build or server for supplied reports.
4. Run `npm run lint && npm run typecheck && npm test`, then check `/research/<slug>` in `npm run dev`: viewer, Contents, Limitations, Sources, Cite and archive search.
5. Open a PR with the drafted-metadata list. Merge once `verify` and `browser` are green and the owner has approved the drafted values.

## Hard checks (CI)

These run for every report, including the specimen `TC-EX-000`.

- `tests/publications.test.ts`:
  - The reference matches `TC-<YEAR>-<NNN>`.
  - The ISO date is valid.
  - `area` and `type` are known values.
  - The title, authors, summary and tags are filled in.
  - There is at least one record-level source, and every source has a URL and an ISO `retrievedAt`.
  - A supplied report has an empty `body`.
- `tests/report-pdf.test.ts`:
  - The PDF and cover exist and the byte count matches.
  - The text layer matches the page count and contains the title.
  - The bookmarks are valid.
  - For supplied PDFs, the file hash is unchanged since intake (Rule #1).
  - For house reports, the PDF is not stale.
