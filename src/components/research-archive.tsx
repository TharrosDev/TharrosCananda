"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Fragment,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  ViewTransition,
} from "react";
import { CiteButton } from "@/components/cite-button";
import { ArrowIcon } from "@/components/icons";
import {
  type ArchiveDoc,
  type ArchiveState,
  createArchiveIndex,
  type ArchiveResult,
  defaultArchiveState,
  pageHits,
  parseArchiveState,
  readingMinutes,
  runArchiveQuery,
  serializeArchiveState,
  termPattern,
} from "@/lib/archive";
import { copyText } from "@/lib/clipboard";
import { formatCounts, NO_COUNTS, sendMetric } from "@/lib/metrics-client";
import { formatLongDate, formatMonthYear, siteUrl } from "@/lib/site";
import { readStorage, writeStorage } from "@/lib/storage";

// Compact rows hide the summary, tags and actions; the record pane (Preview) sits beside the list on
// wide screens. Compact on and Preview off are the defaults; the other choice is a per-browser
// preference. Kept in memory too, so the toggles still work when storage is blocked; the server render
// always uses the defaults.
const COMPACT_KEY = "tharros.archive.compact";
const PREVIEW_KEY = "tharros.archive.preview";
let compactChoice: boolean | null = null;
let previewChoice: boolean | null = null;
const viewListeners = new Set<() => void>();
const subscribeView = (listener: () => void) => {
  viewListeners.add(listener);
  return () => viewListeners.delete(listener);
};
const readCompact = () => compactChoice ?? readStorage(COMPACT_KEY) !== "0";
const readPreview = () => previewChoice ?? readStorage(PREVIEW_KEY) === "1";
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
function setDensity(compact: boolean) {
  compactChoice = compact;
  writeStorage(COMPACT_KEY, compact ? "1" : "0");
  viewListeners.forEach((listener) => listener());
}
function setPreview(show: boolean) {
  previewChoice = show;
  writeStorage(PREVIEW_KEY, show ? "1" : "0");
  viewListeners.forEach((listener) => listener());
}

type Counts = { reads: number; citations: number };

type Area = { slug: string; name: string; scope: string };
type Props = {
  docs: ArchiveDoc[];
  areas: readonly Area[];
  types: readonly { name: string }[];
  /** Reads and citations by slug; null when unavailable, and then nothing is shown. */
  counts?: Record<string, Counts> | null;
};

/** Reads and writes the archive state in the URL (?q=&area=&type=&year=&sort=) so every view can be shared. */
export function ResearchArchiveWithUrl(props: Props) {
  const params = useSearchParams();
  const pathname = usePathname();
  const allowed = useMemo(
    () => ({
      areas: props.areas.map((a) => a.slug),
      types: props.types.map((t) => t.name),
      years: [...new Set(props.docs.map((d) => d.year))],
    }),
    [props.areas, props.types, props.docs],
  );
  const state = parseArchiveState(new URLSearchParams(params.toString()), allowed);
  // Shallow URL update (Next's documented pattern for client-only state): no server round-trip per
  // keystroke, and replace, not push, so filtering never floods history. useSearchParams follows it.
  const onChange = (next: ArchiveState) =>
    window.history.replaceState(null, "", `${pathname}${serializeArchiveState(next)}`);
  return <ResearchArchive {...props} state={state} onChange={onChange} />;
}

export function ResearchArchive({
  docs,
  areas,
  types,
  counts,
  state = defaultArchiveState,
  onChange,
}: Props & { state?: ArchiveState; onChange?: (next: ArchiveState) => void }) {
  const index = useMemo(() => createArchiveIndex(docs), [docs]);
  const { results, facets } = useMemo(
    () => runArchiveQuery(docs, index, state),
    [docs, index, state],
  );
  const set = (patch: Partial<ArchiveState>) => onChange?.({ ...state, ...patch });

  const compact = useSyncExternalStore(subscribeView, readCompact, () => true);
  const preview = useSyncExternalStore(subscribeView, readPreview, () => false);
  // Keep the fallback message as ordinary server-rendered HTML until the tool hydrates.
  // This also works when a browser blocks scripts without changing its noscript parsing mode.
  const interactive = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const toolRef = useRef<HTMLDivElement>(null);
  const previewToggleRef = useRef<HTMLButtonElement>(null);
  const hasResults = results.length > 0;

  // Sticky panels must fit below the header, including after a filter, record or font changes.
  // Taller records stay in normal flow so every source and limitation can be reached without an inner scroll.
  useEffect(() => {
    const panels = toolRef.current?.querySelectorAll<HTMLElement>(
      ".archive-controls, .archive-record-pane",
    );
    if (!panels) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const headerHeight = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
        );
        for (const panel of panels)
          panel.toggleAttribute(
            "data-sticky-fit",
            panel.getBoundingClientRect().height <= window.innerHeight - headerHeight - 48,
          );
      });
    };
    const observer = new ResizeObserver(measure);
    panels.forEach((panel) => observer.observe(panel));
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [preview, hasResults]);

  // The field is local so typing stays instant; the URL follows after a short pause. The field only
  // resyncs from the URL when the change came from elsewhere (back/forward, a chip, a suggestion),
  // never from the echo of its own write, so spaces and in-flight keystrokes survive.
  const [draft, setDraft] = useState(state.q);
  const [sent, setSent] = useState<string | null>(null);
  const [syncedQuery, setSyncedQuery] = useState(state.q);
  if (syncedQuery !== state.q) {
    setSyncedQuery(state.q);
    if (state.q !== sent) setDraft(state.q);
  }
  useEffect(() => {
    const next = draft.trim();
    if (next === state.q.trim()) return;
    const timer = setTimeout(() => {
      setSent(next);
      onChange?.({
        ...state,
        q: next,
        sort: !next ? "newest" : state.q.trim() ? state.sort : "relevance",
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, state, onChange]);
  const clearAll = () => {
    setDraft("");
    setSent("");
    onChange?.(defaultArchiveState);
    // The button that was used disappears with the filters; keep keyboard focus on the page's tool.
    searchRef.current?.focus();
  };
  const applySearch = () => {
    const q = draft.trim();
    setSent(q);
    set({ q, sort: !q ? "newest" : state.q.trim() ? state.sort : "relevance" });
  };
  const clearSearch = () => {
    setDraft("");
    setSent("");
    set({ q: "", sort: "newest" });
    searchRef.current?.focus();
  };
  const clearFacets = () => {
    set({ area: "all", type: "all", year: "all" });
    searchRef.current?.focus();
  };

  const years = Object.keys(facets.year).sort().reverse();
  const activeFilters = [state.area, state.type, state.year].filter((v) => v !== "all").length;
  const filtered = state.q.trim() !== "" || activeFilters > 0;
  const suggestions =
    !results.length && state.q.trim()
      ? index
          .autoSuggest(state.q, { fuzzy: 0.3 })
          .map((s) => s.suggestion)
          .filter((s) => s !== state.q.toLowerCase())
          .slice(0, 3)
      : [];

  // The record pane follows the result the visitor last clicked or focused; the first result otherwise.
  const [picked, setPicked] = useState<string | null>(null);
  const selected = results.find((doc) => doc.slug === picked) ?? results[0];
  const areaName = (slug: string) => areas.find((a) => a.slug === slug)?.name;
  const countsFor = (doc: ArchiveDoc) =>
    doc.counted && counts ? formatCounts(counts[doc.slug] ?? NO_COUNTS) : null;
  const filterTokens = [
    ...(state.area !== "all"
      ? [{ key: "area" as const, name: "area", label: areaName(state.area) }]
      : []),
    ...(state.type !== "all" ? [{ key: "type" as const, name: "format", label: state.type }] : []),
    ...(state.year !== "all" ? [{ key: "year" as const, name: "year", label: state.year }] : []),
  ];
  const updating = draft.trim() !== state.q.trim();
  const archiveUrl = `${siteUrl}/research${serializeArchiveState(state)}`;
  const [archiveCopy, setArchiveCopy] = useState<{ url: string; success: boolean } | null>(null);
  const currentCopy = archiveCopy?.url === archiveUrl ? archiveCopy : null;
  const copyArchive = async () => {
    const success = await copyText(archiveUrl);
    setArchiveCopy({ url: archiveUrl, success });
  };

  // "/" jumps to the search field from anywhere on the page, unless the visitor is already typing.
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Up and down step between result titles (which also moves the record); Enter opens one.
  const onListKey = (event: KeyboardEvent<HTMLOListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const titles = [
      ...event.currentTarget.querySelectorAll<HTMLAnchorElement>(".archive-card h2 a"),
    ];
    const at = titles.indexOf(event.target as HTMLAnchorElement);
    const next = at === -1 ? null : titles[at + (event.key === "ArrowDown" ? 1 : -1)];
    if (!next) return;
    event.preventDefault();
    next.focus();
  };

  return (
    <div className={preview ? "archive-tool has-preview" : "archive-tool"} ref={toolRef}>
      <form
        className="archive-searchbar"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          applySearch();
        }}
      >
        <div className="archive-search">
          <label htmlFor="archive-query">Search research</label>
          <div className="archive-search-field">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path d="m15.5 15.5 5 5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
            <input
              id="archive-query"
              ref={searchRef}
              type="search"
              value={draft}
              maxLength={120}
              aria-describedby="archive-search-help"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Find a subject, reference or word in a report"
            />
            {draft ? (
              <button
                type="button"
                className="archive-search-clear"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                <CloseIcon />
              </button>
            ) : (
              <kbd className="archive-search-key" aria-hidden="true">
                /
              </kbd>
            )}
            <button className="archive-search-submit" type="submit">
              Search <ArrowIcon />
            </button>
          </div>
          <p id="archive-search-help" className="archive-search-help">
            Search reaches inside every report. Results update as you type.
          </p>
          <p className="archive-no-script" hidden={interactive}>
            Search and filters need JavaScript. All publications are listed below.
          </p>
        </div>
      </form>

      <div className="archive-controls">
        {/* Always open on wide screens (CSS); a disclosure on narrow ones, so results come first. */}
        <details className="archive-filters">
          <summary>
            Filters
            {activeFilters > 0 && <em> · {activeFilters} active</em>}
          </summary>
          <p className="archive-filter-help">
            Narrow by subject, format or year. Counts reflect your current search.
          </p>
          <span className="archive-group-label" aria-hidden="true">
            Research area
          </span>
          <div className="archive-areas" role="group" aria-label="Research area">
            {areas.map((area) => {
              const pressed = state.area === area.slug;
              const count = facets.area[area.slug] ?? 0;
              return (
                <button
                  key={area.slug}
                  type="button"
                  aria-pressed={pressed}
                  disabled={!pressed && count === 0}
                  aria-describedby={`area-scope-${area.slug}`}
                  onClick={() => set({ area: pressed ? "all" : area.slug })}
                >
                  <span className="archive-area-name">
                    {area.name}{" "}
                    <em>
                      {count}
                      <span className="sr-only">
                        {" "}
                        {count === 1 ? "publication" : "publications"}
                      </span>
                    </em>
                  </span>
                  <span className="archive-area-scope" id={`area-scope-${area.slug}`}>
                    {area.scope}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="archive-facets">
            <span className="archive-group-label" aria-hidden="true">
              Format
            </span>
            <div className="archive-chips" role="group" aria-label="Format">
              {types.map((type) => {
                const pressed = state.type === type.name;
                const count = facets.type[type.name] ?? 0;
                return (
                  <button
                    key={type.name}
                    type="button"
                    aria-pressed={pressed}
                    disabled={!pressed && count === 0}
                    onClick={() => set({ type: pressed ? "all" : type.name })}
                  >
                    {type.name} ({count})
                  </button>
                );
              })}
            </div>
            <span className="archive-group-label" aria-hidden="true">
              Year
            </span>
            <div className="archive-chips" role="group" aria-label="Year">
              {years.map((year) => {
                const pressed = state.year === year;
                return (
                  <button
                    key={year}
                    type="button"
                    aria-pressed={pressed}
                    disabled={!pressed && facets.year[year] === 0}
                    onClick={() => set({ year: pressed ? "all" : year })}
                  >
                    {year} ({facets.year[year]})
                  </button>
                );
              })}
            </div>
          </div>
        </details>
      </div>

      <div className="archive-results" aria-busy={updating}>
        <div className="archive-result-count">
          <span aria-live="polite">
            <span>
              {results.length} {results.length === 1 ? "publication" : "publications"}
            </span>
            <span className="sr-only">
              {state.q.trim() ? ` matching ${state.q.trim()}` : " in Research"}
              {activeFilters ? ` with ${activeFilters} active filters` : ""}
            </span>
          </span>
          <span className="archive-result-tools">
            <label>
              <span>Sort</span>
              <select
                value={state.q.trim() ? state.sort : "newest"}
                onChange={(event) => set({ sort: event.target.value as ArchiveState["sort"] })}
              >
                <option value="newest">Newest first</option>
                <option value="relevance" disabled={!state.q.trim()}>
                  Most relevant
                </option>
              </select>
            </label>
            <span className="archive-density" role="group" aria-label="List density">
              <button type="button" aria-pressed={!compact} onClick={() => setDensity(false)}>
                Expanded
              </button>
              <button type="button" aria-pressed={compact} onClick={() => setDensity(true)}>
                Compact
              </button>
            </span>
            <button
              ref={previewToggleRef}
              type="button"
              className="archive-preview-toggle"
              aria-pressed={preview}
              title="Show sources, contents and limitations beside the selected publication"
              onClick={() => setPreview(!preview)}
            >
              Preview
            </button>
            {filtered && (
              <button type="button" className="archive-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
          </span>
        </div>

        <div className="archive-results-context">
          <p>
            {updating
              ? "Updating results…"
              : state.q.trim()
                ? `Results for “${state.q.trim()}”`
                : "Browse the published work."}
          </p>
          <button type="button" className="archive-copy-view" onClick={copyArchive}>
            {currentCopy?.success ? "Research link copied" : "Copy research link"}
          </button>
          <span className="sr-only" role="status">
            {currentCopy?.success
              ? "Research link copied"
              : currentCopy
                ? "Copy failed. The research link is shown to copy by hand."
                : ""}
          </span>
          {currentCopy && !currentCopy.success && (
            <input
              className="archive-link-field"
              readOnly
              value={archiveUrl}
              aria-label="Research link"
              onFocus={(event) => event.currentTarget.select()}
            />
          )}
        </div>

        {filtered && (
          <div className="archive-active-filters" role="group" aria-label="Active filters">
            {state.q.trim() && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label={`Remove search: ${state.q.trim()}`}
              >
                <span>Search: {state.q.trim()}</span>
                <CloseIcon />
              </button>
            )}
            {filterTokens.map((filter) => (
              <button
                key={filter.key}
                type="button"
                aria-label={`Remove ${filter.name} filter: ${filter.label}`}
                onClick={() => {
                  set({ [filter.key]: "all" });
                  searchRef.current?.focus();
                }}
              >
                <span>{filter.label}</span>
                <CloseIcon />
              </button>
            ))}
          </div>
        )}

        {results.length ? (
          <ol
            className={compact ? "archive-list is-compact" : "archive-list"}
            onKeyDown={onListKey}
          >
            {results.map((doc) => (
              <ArchiveCard
                key={doc.slug}
                counts={countsFor(doc)}
                doc={doc}
                areaName={areaName(doc.area)}
                selected={doc.slug === selected?.slug}
                onSelect={() => setPicked(doc.slug)}
              />
            ))}
          </ol>
        ) : (
          <div className="archive-no-results">
            <h2>No publications match.</h2>
            <p>
              {state.q.trim()
                ? "Try fewer words, a broader subject or a report reference."
                : "Try removing a filter to see more research."}
              {activeFilters > 0 && " Your selected filters may also be limiting the results."}
            </p>
            {suggestions.length > 0 && (
              <p>
                Did you mean{" "}
                {suggestions.map((s, i) => (
                  <Fragment key={s}>
                    {i > 0 && ", "}
                    <button
                      type="button"
                      className="archive-suggestion"
                      onClick={() => {
                        set({ q: s, sort: "relevance" });
                        searchRef.current?.focus();
                      }}
                    >
                      {s}
                    </button>
                  </Fragment>
                ))}
                ?
              </p>
            )}
            <div className="archive-empty-actions">
              {activeFilters > 0 && state.q.trim() && (
                <button type="button" className="button-secondary" onClick={clearFacets}>
                  Keep search, remove filters
                </button>
              )}
              <button type="button" className="button-primary" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {preview && selected && (
        <aside className="archive-record-pane" aria-label="Selected publication">
          <div className="archive-record-heading">
            <span>Publication preview</span>
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => {
                setPreview(false);
                previewToggleRef.current?.focus();
              }}
            >
              <CloseIcon />
            </button>
          </div>
          <p className="archive-preview-help">
            Select a result to inspect its sources and contents.
          </p>
          <ArchiveRecord
            doc={selected}
            areaName={areaName(selected.area)}
            counts={countsFor(selected)}
            showAbstract={compact || Boolean(selected.snippet)}
          />
        </aside>
      )}
    </div>
  );
}

function ArchiveCard({
  doc,
  areaName,
  counts,
  selected,
  onSelect,
}: {
  doc: ArchiveResult;
  areaName?: string;
  counts?: string | null;
  selected: boolean;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const stableUrl = `${siteUrl}/research/id/${doc.reference}`;
  const firstMatch = doc.snippet ? pageHits(doc, doc.terms, 1, 75)[0] : null;
  async function copy() {
    setCopied((await copyText(stableUrl)) ? "done" : "failed");
  }
  return (
    <li>
      <article
        className="archive-card"
        data-selected={selected || undefined}
        onClick={onSelect}
        onFocus={onSelect}
      >
        {doc.cover ? (
          // Shares its name with the report's first page, so opening the report morphs the cover into it.
          <ViewTransition name={`cover-${doc.slug}`} share="cover">
            <Link
              href={`/research/${doc.slug}`}
              className="archive-cover"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Image src={doc.cover} alt="" width={120} height={155} />
            </Link>
          </ViewTransition>
        ) : (
          <span className="archive-cover" aria-hidden="true" />
        )}
        <div className="archive-card-body">
          <p className="archive-card-meta">
            <span>{doc.reference}</span>
            <span>{doc.type}</span>
            {areaName && <span>{areaName}</span>}
            <time dateTime={doc.publishedAt}>{formatMonthYear(doc.publishedAt)}</time>
            {doc.pages && <span>{doc.pages} pages</span>}
            {doc.text && <span>{readingMinutes(doc.text)} min read</span>}
            {counts && <span>{counts}</span>}
          </p>
          <h2>
            <Link href={`/research/${doc.slug}`}>{doc.title}</Link>
          </h2>
          <p className="archive-summary">
            {doc.snippet ? <Highlighted text={doc.snippet} terms={doc.terms} /> : doc.summary}
          </p>
          {doc.snippet && (
            <div className="archive-search-match">
              <p>
                <Highlighted text={firstMatch?.snippet ?? doc.snippet} terms={doc.terms} />
              </p>
              {firstMatch && (
                <Link
                  href={`/research/${doc.slug}#page=${firstMatch.page}&search=${encodeURIComponent(firstMatch.term)}`}
                >
                  Open match · p. {firstMatch.page}
                  <ArrowIcon />
                </Link>
              )}
            </div>
          )}
          {doc.tags.length > 0 && (
            <div className="archive-tags">
              {doc.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <div className="archive-card-actions">
            <Link className="archive-read-action" href={`/research/${doc.slug}`}>
              Read report <ArrowIcon />
            </Link>
            <CiteButton
              input={{
                title: doc.title,
                authors: doc.authors,
                publishedAt: doc.publishedAt,
                url: stableUrl,
                reference: doc.reference,
              }}
              slug={doc.counted ? doc.slug : undefined}
            />
            {doc.file && (
              <a
                href={doc.file}
                download
                onClick={doc.counted ? () => sendMetric(doc.slug, "read") : undefined}
              >
                PDF{doc.bytes ? ` · ${Math.round(doc.bytes / 1024)} KB` : ""}
              </a>
            )}
            <button type="button" onClick={copy}>
              {copied === "done" ? "Link copied" : "Copy link"}
            </button>
            {copied === "failed" && (
              <input
                className="archive-link-field"
                readOnly
                value={stableUrl}
                aria-label="Report link"
                onFocus={(e) => e.currentTarget.select()}
              />
            )}
            <span className="sr-only" role="status">
              {copied === "done"
                ? "Link copied"
                : copied === "failed"
                  ? "Copy failed; the link is shown to copy by hand"
                  : ""}
            </span>
          </div>
          {/* Where there is no room for the record pane, the record opens under its entry. */}
          <details className="archive-record-inline">
            <summary>Details</summary>
            <ArchiveRecord doc={doc} areaName={areaName} counts={counts} inline />
          </details>
        </div>
      </article>
    </li>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="m5 5 10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** A publication's record: its ledger, where the search matched inside the PDF (or its contents), sources and limitations. */
function ArchiveRecord({
  doc,
  areaName,
  counts,
  inline = false,
  showAbstract = false,
}: {
  doc: ArchiveResult;
  areaName?: string;
  counts?: string | null;
  inline?: boolean;
  /** The abstract, when the entry beside the record is not already showing it (compact rows, or a search snippet). */
  showAbstract?: boolean;
}) {
  const href = `/research/${doc.slug}`;
  const hits = pageHits(doc, doc.terms, 4, 60);
  return (
    <div className="archive-record">
      {!inline && (
        <>
          <h2 className="archive-record-title">
            <Link href={href}>{doc.title}</Link>
          </h2>
          <div className="archive-record-actions">
            <Link className="button-primary" href={href}>
              Read the report
            </Link>
            {doc.file && (
              <a
                className="text-link"
                href={doc.file}
                download
                onClick={doc.counted ? () => sendMetric(doc.slug, "read") : undefined}
              >
                PDF{doc.bytes ? ` · ${Math.round(doc.bytes / 1024)} KB` : ""}
              </a>
            )}
          </div>
        </>
      )}
      <dl className="archive-record-ledger">
        <div>
          <dt>Reference</dt>
          <dd>{doc.reference}</dd>
        </div>
        <div>
          <dt>Published</dt>
          <dd>
            <time dateTime={doc.publishedAt}>{formatLongDate(doc.publishedAt)}</time>
          </dd>
        </div>
        <div>
          <dt>{doc.authors.length === 1 ? "Author" : "Authors"}</dt>
          <dd>{doc.authors.join(", ")}</dd>
        </div>
        {areaName && (
          <div>
            <dt>Area</dt>
            <dd>{areaName}</dd>
          </div>
        )}
        {counts && (
          <div>
            <dt>Readership</dt>
            <dd>{counts}</dd>
          </div>
        )}
      </dl>
      {showAbstract && <p className="archive-record-abstract">{doc.summary}</p>}
      {hits.length > 0 ? (
        <section className="archive-record-block">
          <h3>Matches in this report</h3>
          <ol className="archive-record-pages">
            {hits.map((hit) => (
              <li key={hit.page}>
                <a href={`${href}#page=${hit.page}&search=${encodeURIComponent(hit.term)}`}>
                  <span>p. {hit.page}</span>
                  <span>
                    <Highlighted text={hit.snippet} terms={doc.terms} />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        doc.contents.length > 0 && (
          <section className="archive-record-block">
            <h3>In this report</h3>
            <ol className="archive-record-pages">
              {doc.contents.map((entry) => (
                <li key={`${entry.page}-${entry.top}-${entry.title}`}>
                  <a href={`${href}#page=${entry.page}`}>
                    <span>p. {entry.page}</span>
                    <span>{entry.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>
        )
      )}
      {doc.sources.length > 0 && (
        <section className="archive-record-block">
          <h3>Sources</h3>
          <ul className="archive-record-sources">
            {doc.sources.map((source, i) => (
              <li key={i}>
                <strong>{source.publisher}</strong>{" "}
                {source.url ? (
                  <a href={source.url} rel="noreferrer">
                    {source.title}
                  </a>
                ) : (
                  <em>{source.title}</em>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {doc.limitations.length > 0 && (
        <section className="archive-record-block">
          <h3>Limitations</h3>
          <ul className="archive-record-limits">
            {doc.limitations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Wraps matched terms in <mark>; the text stays plain React text, so nothing is injected as HTML. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const pattern = termPattern(terms, "gi");
  if (!pattern) return <>{text}</>;
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}
