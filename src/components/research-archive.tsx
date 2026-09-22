"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { CiteButton } from "@/components/cite-button";
import {
  type ArchiveDoc,
  type ArchiveState,
  createArchiveIndex,
  defaultArchiveState,
  parseArchiveState,
  readingMinutes,
  runArchiveQuery,
  serializeArchiveState,
} from "@/lib/archive";
import { formatMonthYear, siteUrl } from "@/lib/site";

type Area = { slug: string; name: string; scope: string };
type Props = { docs: ArchiveDoc[]; areas: readonly Area[]; types: readonly { name: string }[] };

/** Reads and writes the archive state in the URL (?q=&area=&type=&year=&sort=) so every view can be shared. */
export function ResearchArchiveWithUrl(props: Props) {
  const params = useSearchParams();
  const router = useRouter();
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
  // replace, not push: filtering and typing must not add history entries.
  const onChange = (next: ArchiveState) => router.replace(`${pathname}${serializeArchiveState(next)}`, { scroll: false });
  return <ResearchArchive {...props} state={state} onChange={onChange} />;
}

export function ResearchArchive({ docs, areas, types, state = defaultArchiveState, onChange }: Props & { state?: ArchiveState; onChange?: (next: ArchiveState) => void }) {
  const index = useMemo(() => createArchiveIndex(docs), [docs]);
  const { results, facets } = useMemo(() => runArchiveQuery(docs, index, state), [docs, index, state]);
  const set = (patch: Partial<ArchiveState>) => onChange?.({ ...state, ...patch });

  // The field is local so typing stays instant; the URL follows after a short pause.
  const [draft, setDraft] = useState(state.q);
  const [syncedQuery, setSyncedQuery] = useState(state.q);
  if (syncedQuery !== state.q) {
    setSyncedQuery(state.q);
    setDraft(state.q);
  }
  useEffect(() => {
    if (draft === state.q) return;
    const timer = setTimeout(() => onChange?.({ ...state, q: draft, sort: !draft.trim() ? "newest" : state.q.trim() ? state.sort : "relevance" }), 250);
    return () => clearTimeout(timer);
  }, [draft, state, onChange]);

  const years = Object.keys(facets.year).sort().reverse();
  const onlySpecimens = docs.length > 0 && docs.every((d) => d.specimen);
  const filtered = state.q.trim() !== "" || state.area !== "all" || state.type !== "all" || state.year !== "all";
  const suggestions = !results.length && state.q.trim()
    ? index.autoSuggest(state.q, { fuzzy: 0.3 }).map((s) => s.suggestion).filter((s) => s !== state.q.toLowerCase()).slice(0, 3)
    : [];

  return (
    <div className="archive-tool">
      <form className="archive-controls" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="archive-search">
          <span>Search the archive</span>
          <input type="search" value={draft} maxLength={120} onChange={(event) => setDraft(event.target.value)}
            placeholder="Title, subject, reference or any word in a report" />
        </label>
        <div className="archive-areas" role="group" aria-label="Research area">
          {areas.map((area) => {
            const pressed = state.area === area.slug;
            const count = facets.area[area.slug] ?? 0;
            return (
              <button key={area.slug} type="button" aria-pressed={pressed} disabled={!pressed && count === 0}
                onClick={() => set({ area: pressed ? "all" : area.slug })}>
                <span className="archive-area-name">{area.name} <em>({count})</em></span>
                <span className="archive-area-scope">{area.scope}</span>
              </button>
            );
          })}
        </div>

        <div className="archive-facets">
          <div className="archive-chips" role="group" aria-label="Format">
            {types.map((type) => {
              const pressed = state.type === type.name;
              const count = facets.type[type.name] ?? 0;
              return (
                <button key={type.name} type="button" aria-pressed={pressed} disabled={!pressed && count === 0}
                  onClick={() => set({ type: pressed ? "all" : type.name })}>
                  {type.name} ({count})
                </button>
              );
            })}
          </div>
          <div className="archive-chips" role="group" aria-label="Year">
            {years.map((year) => {
              const pressed = state.year === year;
              return (
                <button key={year} type="button" aria-pressed={pressed} disabled={!pressed && facets.year[year] === 0}
                  onClick={() => set({ year: pressed ? "all" : year })}>
                  {year} ({facets.year[year]})
                </button>
              );
            })}
          </div>
        </div>
      </form>

      <div className="archive-result-count">
        <span aria-live="polite">{results.length} {results.length === 1 ? "publication" : "publications"}</span>
        <span className="archive-result-tools">
          {state.q.trim() && (
            <label>
              <span>Sort</span>
              <select value={state.sort} onChange={(event) => set({ sort: event.target.value as ArchiveState["sort"] })}>
                <option value="relevance">Most relevant</option>
                <option value="newest">Newest first</option>
              </select>
            </label>
          )}
          {!state.q.trim() && <span>Newest first</span>}
          {filtered && <button type="button" className="archive-clear" onClick={() => onChange?.(defaultArchiveState)}>Clear all</button>}
        </span>
      </div>

      {onlySpecimens && (
        <p className="archive-specimen-note">
          The first Tharros publications are in preparation. The example below shows how each report is published.
        </p>
      )}

      {results.length ? (
        <ol className="archive-list">
          {results.map((doc) => <ArchiveCard key={doc.slug} doc={doc} />)}
        </ol>
      ) : (
        <div className="archive-no-results" role="status">
          <h2>No publications match.</h2>
          {suggestions.length > 0 && (
            <p>
              Did you mean{" "}
              {suggestions.map((s, i) => (
                <Fragment key={s}>
                  {i > 0 && ", "}
                  <button type="button" className="archive-suggestion" onClick={() => set({ q: s })}>{s}</button>
                </Fragment>
              ))}
              ?
            </p>
          )}
          <button type="button" className="button-secondary" onClick={() => onChange?.(defaultArchiveState)}>Clear all filters</button>
        </div>
      )}
    </div>
  );
}

function ArchiveCard({ doc }: { doc: ArchiveDoc & { snippet: string | null; terms: string[] } }) {
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const stableUrl = `${siteUrl}/research/id/${doc.reference}`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(stableUrl);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
  }
  return (
    <li>
      <article className="archive-card">
        {doc.cover ? (
          <Link href={`/research/${doc.slug}`} className="archive-cover" tabIndex={-1} aria-hidden="true">
            <Image src={doc.cover} alt="" width={120} height={155} />
          </Link>
        ) : <span className="archive-cover" aria-hidden="true" />}
        <div className="archive-card-body">
          <p className="archive-card-meta">
            <span>{doc.reference}</span>
            <span>{doc.specimen ? `Example · ${doc.type}` : doc.type}</span>
            <time dateTime={doc.publishedAt}>{formatMonthYear(doc.publishedAt)}</time>
            {doc.pages && <span>{doc.pages} pages</span>}
            {doc.text && <span>{readingMinutes(doc.text)} min read</span>}
          </p>
          <h2><Link href={`/research/${doc.slug}`}>{doc.title}</Link></h2>
          <p className="archive-summary">{doc.snippet ? <Highlighted text={doc.snippet} terms={doc.terms} /> : doc.summary}</p>
          {doc.tags.length > 0 && <div className="archive-tags">{doc.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}
          <div className="archive-card-actions">
            <CiteButton input={{ title: doc.title, authors: doc.authors, publishedAt: doc.publishedAt, url: stableUrl, reference: doc.reference }} />
            {doc.file && <a href={doc.file} download>PDF{doc.bytes ? ` · ${Math.round(doc.bytes / 1024)} KB` : ""}</a>}
            <button type="button" onClick={copy}>{copied === "done" ? "Link copied" : "Copy link"}</button>
            {copied === "failed" && <input className="archive-link-field" readOnly value={stableUrl} aria-label="Report link" onFocus={(e) => e.currentTarget.select()} />}
          </div>
        </div>
      </article>
    </li>
  );
}

/** Wraps matched terms in <mark>; the text stays plain React text, so nothing is injected as HTML. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const escaped = terms.filter(Boolean).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return <>{parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>))}</>;
}
