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
    onChange?.(defaultArchiveState);
    // The button that was used disappears with the filters; keep keyboard focus on the page's tool.
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
    <div className={preview ? "archive-tool has-preview" : "archive-tool"}>
      <form
        className="archive-searchbar"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="archive-search">
          <span>Search the archive</span>
          <input
            ref={searchRef}
            type="search"
            value={draft}
            maxLength={120}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Title, subject, reference or any word in a report"
          />
          <kbd className="archive-search-key" aria-hidden="true">
            /
          </kbd>
        </label>
      </form>

      <div className="archive-controls">
        {/* Always open on wide screens (CSS); a disclosure on narrow ones, so results come first. */}
        <details className="archive-filters">
          <summary>
            Filters
            {activeFilters > 0 && <em> · {activeFilters} active</em>}
          </summary>
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

      <div className="archive-results">
        <div className="archive-result-count">
          <span aria-live="polite">
            {results.length} {results.length === 1 ? "publication" : "publications"}
          </span>
          <span className="archive-result-tools">
            {state.q.trim() && (
              <label>
                <span>Sort</span>
                <select
                  value={state.sort}
                  onChange={(event) => set({ sort: event.target.value as ArchiveState["sort"] })}
                >
                  <option value="relevance">Most relevant</option>
                  <option value="newest">Newest first</option>
                </select>
              </label>
            )}
            <span className="archive-density" role="group" aria-label="List density">
              <button type="button" aria-pressed={!compact} onClick={() => setDensity(false)}>
                Expanded
              </button>
              <button type="button" aria-pressed={compact} onClick={() => setDensity(true)}>
                Compact
              </button>
            </span>
            <button
              type="button"
              className="archive-preview-toggle"
              aria-pressed={preview}
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
            <button type="button" className="button-secondary" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {preview && selected && (
        <aside className="archive-record-pane" aria-label="Selected publication">
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
          {doc.tags.length > 0 && (
            <div className="archive-tags">
              {doc.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}
          <div className="archive-card-actions">
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
            <summary>Record</summary>
            <ArchiveRecord doc={doc} areaName={areaName} counts={counts} inline />
          </details>
        </div>
      </article>
    </li>
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
