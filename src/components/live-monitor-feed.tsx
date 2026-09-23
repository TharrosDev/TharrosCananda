"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { MonitorContext } from "@/components/monitor-context";
import { Highlight, StoryActions } from "@/components/monitor-story";
import { type LiveMonitorSnapshot, type MonitorArticle, monitorTopics, monitorWindows, topicLabel } from "@/lib/live-monitor";
import {
  filterArticles,
  groupByDay,
  type MonitorViewState,
  newSince,
  parseMonitorState,
  readStorage,
  serializeMonitorState,
  writeStorage,
} from "@/lib/monitor-view";
import { formatDateTime } from "@/lib/site";

const displayDate = (value: string) => formatDateTime(value, "America/Toronto");
const VIEW_KEY = "tharros.monitor.view";
const VISIT_KEY = "tharros.monitor.lastVisit";

function languageLabel(value: string) {
  const normalised = value.toLowerCase();
  if (normalised === "en" || normalised === "english") return "EN";
  if (normalised === "fr" || normalised === "french") return "FR";
  if (normalised === "de" || normalised === "german") return "DE";
  if (normalised === "it" || normalised === "italian") return "IT";
  if (normalised === "es" || normalised === "spanish") return "ES";
  return value.length <= 4 ? value.toUpperCase() : value;
}

function errorCopy(code: LiveMonitorSnapshot["errorCode"]) {
  if (code === "not-configured") return "The Currents API key has not been configured on this deployment.";
  if (code === "unauthorized") return "Currents rejected the configured API key.";
  if (code === "quota") return "The Currents request quota has been reached for the current billing period.";
  if (code === "invalid-request")
    return "Currents rejected the monitor search request. The integration needs attention before live coverage can resume.";
  if (code === "invalid-response")
    return "Currents returned an unexpected response shape. No unverified fallback content is being substituted.";
  return "Currents did not return usable coverage. No substitute headlines or synthetic stories are shown.";
}

const topicLine = (article: MonitorArticle) => (article.topics.length ? article.topics.map(topicLabel).join(" · ") : "Canada–Europe");

function minutesAgo(iso: string, now: number) {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
}

export function LiveMonitorFeed({ data }: { data: LiveMonitorSnapshot }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const knownSources = useMemo(() => [...new Set(data.articles.map((a) => a.domain))].sort(), [data.articles]);
  const state = parseMonitorState(new URLSearchParams(params.toString()), knownSources);
  // Shallow URL updates: shareable views without a server round-trip or history entries.
  const update = (patch: Partial<MonitorViewState>) =>
    window.history.replaceState(null, "", `${pathname}${serializeMonitorState({ ...state, ...patch })}`);

  const parsedReferenceTime = Date.parse(data.retrievedAt);
  const referenceTime = Number.isFinite(parsedReferenceTime) ? parsedReferenceTime : Number.NEGATIVE_INFINITY;
  const activeWindow = monitorWindows.find((item) => item.id === state.window) ?? monitorWindows[2];
  const [limit, setLimit] = useState(11);
  // The field keeps its own text (including trailing spaces the URL trims) and only resyncs on external changes.
  const [draft, setDraft] = useState(state.q);
  const [syncedQuery, setSyncedQuery] = useState(state.q);
  if (syncedQuery !== state.q) {
    setSyncedQuery(state.q);
    if (state.q !== draft.trim()) setDraft(state.q);
  }

  // Browser-only details are read after mount so the server HTML and first client render match.
  const [lastVisit, setLastVisit] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);
  // Runs once: re-running on URL changes would overwrite lastVisit and erase the "New" tags.
  useEffect(() => {
    const stored = Number(readStorage(VISIT_KEY));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage after hydration
    setLastVisit(Number.isFinite(stored) && stored > 0 ? stored : null);
    writeStorage(VISIT_KEY, String(Date.now()));
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    const current = new URLSearchParams(window.location.search);
    if (!current.has("view") && readStorage(VIEW_KEY) === "compact") {
      current.set("view", "compact");
      window.history.replaceState(null, "", `${window.location.pathname}?${current}`);
    }
    return () => clearInterval(timer);
  }, []);

  // ponytail: plain recomputation per render; at most 20 stories per snapshot, so memoisation buys nothing.
  const inWindow = filterArticles(data.articles, { ...state, q: "", topics: [], sources: [] }, referenceTime);
  const visible = filterArticles(data.articles, state, referenceTime);
  const fresh = newSince(data.articles, lastVisit);
  const topicCounts = Object.fromEntries(monitorTopics.map((t) => [t.id, inWindow.filter((a) => a.topics.includes(t.id)).length]));
  const sourceCounts = Object.fromEntries(knownSources.map((s) => [s, inWindow.filter((a) => a.domain === s).length]));
  const filtersActive = state.topics.length > 0 || state.sources.length > 0 || state.window !== "7d" || Boolean(state.q.trim());

  function setView(view: MonitorViewState["view"]) {
    writeStorage(VIEW_KEY, view);
    update({ view });
  }
  function toggleTopic(id: (typeof monitorTopics)[number]["id"]) {
    setLimit(11);
    update({ topics: state.topics.includes(id) ? state.topics.filter((t) => t !== id) : [...state.topics, id] });
  }
  function toggleSource(domain: string) {
    update({ sources: state.sources.includes(domain) ? state.sources.filter((s) => s !== domain) : [...state.sources, domain] });
  }
  function clearFilters() {
    setLimit(11);
    update({ q: "", topics: [], sources: [], window: "7d" });
  }

  if (data.kind === "error" && !data.articles.length) {
    return (
      <section className="monitor-error" aria-labelledby="monitor-error-title">
        <p className="monitor-kicker">Live coverage</p>
        <h2 id="monitor-error-title">Live coverage is temporarily unavailable.</h2>
        <p>{errorCopy(data.errorCode)}</p>
        <div className="monitor-error-actions">
          <button className="button-secondary" type="button" onClick={() => router.refresh()}>
            Retry live coverage
          </button>
          <a className="text-link" href="https://currentsapi.services/" target="_blank" rel="noreferrer">
            About Currents <ArrowIcon />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    );
  }

  const newCount = visible.filter((a) => fresh.has(a.id)).length;
  const lead = visible[0];
  const dispatches = visible.slice(1, limit);
  const newTag = (id: string) => (fresh.has(id) ? <span className="monitor-new">New</span> : null);

  return (
    <section className="monitor-workspace" aria-label="Canada Europe live news monitor">
      <div className="monitor-desk-head">
        <div className={data.articles.length ? "monitor-status-line" : "monitor-status-line is-empty"}>
          <span>
            <i aria-hidden="true" />
            Signal desk online
          </span>
          <span data-volatile title={`${displayDate(data.retrievedAt)} ET`}>
            Checked {now === null ? `${displayDate(data.retrievedAt)} ET` : minutesAgo(data.retrievedAt, now)}
          </span>
          {newCount > 0 && <span className="monitor-new-count">{newCount} new since your last visit</span>}
        </div>
        <dl className="monitor-telemetry">
          <div>
            <dt>Provider</dt>
            <dd>
              <a className="monitor-provider-link" href="https://currentsapi.services/" target="_blank" rel="noreferrer">
                Currents<span className="sr-only"> News API (opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div><dt>Window</dt><dd>{activeWindow.label}</dd></div>
          <div><dt>Sources</dt><dd>{new Set(inWindow.map((a) => a.domain)).size}</dd></div>
          <div><dt>Dispatches</dt><dd>{inWindow.length}</dd></div>
        </dl>
      </div>

      <form className="monitor-command-bar" onSubmit={(event) => event.preventDefault()}>
        <label className="monitor-search">
          <span className="sr-only">Search coverage</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.7" cy="10.7" r="6.7" />
            <path d="m16 16 5 5" />
          </svg>
          <input
            type="search"
            maxLength={120}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setLimit(11);
              update({ q: event.target.value });
            }}
            placeholder="Search company, country, sector or term"
          />
        </label>
        <fieldset className="monitor-window-picker">
          <legend className="sr-only">Time period</legend>
          {monitorWindows.map((item) => (
            <button key={item.id} type="button" aria-pressed={state.window === item.id} onClick={() => update({ window: item.id })}>
              {item.id === "72h" ? "3D" : item.id.toUpperCase()}
            </button>
          ))}
        </fieldset>
        <div className="monitor-view-toggle" role="group" aria-label="View">
          <button type="button" aria-pressed={state.view === "editorial"} onClick={() => setView("editorial")}>Editorial</button>
          <button type="button" aria-pressed={state.view === "compact"} onClick={() => setView("compact")}>Compact</button>
        </div>
      </form>

      <div className="monitor-topic-rail" role="group" aria-label="Research areas">
        <button type="button" aria-pressed={state.topics.length === 0} onClick={() => update({ topics: [] })}>
          <span>All signals</span>
          <strong>{inWindow.length}</strong>
        </button>
        {monitorTopics.map((item) => (
          <button key={item.id} type="button" aria-pressed={state.topics.includes(item.id)} onClick={() => toggleTopic(item.id)}>
            <span>{item.shortLabel}</span>
            <strong>{topicCounts[item.id]}</strong>
          </button>
        ))}
      </div>

      {knownSources.length > 1 && (
        <details className="monitor-sources">
          <summary>Sources ({knownSources.length}){state.sources.length > 0 && ` · ${state.sources.length} selected`}</summary>
          <fieldset>
            <legend className="sr-only">Filter by source</legend>
            {knownSources.map((domain) => (
              <label key={domain}>
                <input type="checkbox" checked={state.sources.includes(domain)} onChange={() => toggleSource(domain)} />
                <span>{domain}</span>
                <strong>{sourceCounts[domain]}</strong>
              </label>
            ))}
          </fieldset>
        </details>
      )}

      <div className="monitor-result-line" aria-live="polite" aria-atomic="true">
        <span>
          {visible.length} {visible.length === 1 ? "relevant dispatch" : "relevant dispatches"}
        </span>
        <span>
          {state.topics.length ? state.topics.map(topicLabel).join(" + ") : "All research areas"} · {activeWindow.label}
        </span>
        {filtersActive && (
          <button type="button" onClick={clearFilters}>
            Reset view
          </button>
        )}
      </div>

      <div className="monitor-body">
        <div className="monitor-body-main">
          {!visible.length ? (
            <div className="monitor-empty" role="status">
              <h2>{data.articles.length ? "No developments match these filters." : "No current coverage was returned."}</h2>
              <p>
                {data.articles.length
                  ? "Change the research area, source, time period or search term to widen the view."
                  : "Currents completed the search, but did not return usable Canada–Europe coverage for this seven-day window. Nothing has been substituted."}
              </p>
              {data.articles.length > 0 && (
                <button className="button-secondary" type="button" onClick={clearFilters}>
                  Clear all filters
                </button>
              )}
            </div>
          ) : state.view === "compact" ? (
            <div className="monitor-compact">
              {groupByDay(visible, "America/Toronto", referenceTime).map((group) => (
                <section key={group.key} className="monitor-day" aria-labelledby={`day-${group.key}`}>
                  <h3 id={`day-${group.key}`}>{group.label}</h3>
                  <ol>
                    {group.items.map((article) => (
                      <li key={article.id}>
                        <article className="monitor-row">
                          <time dateTime={article.publishedAt}>{displayDate(article.publishedAt).split(", ")[1] ?? "—"}</time>
                          <span className="monitor-row-topics">
                            {article.topics.map((t) => <i key={t} className={`topic-dot topic-dot--${t}`} aria-hidden="true" />)}
                            <span className="sr-only">{topicLine(article)}</span>
                          </span>
                          <h4>
                            <a href={article.url} target="_blank" rel="noreferrer">
                              <Highlight text={article.title} query={state.q} />
                              <span className="sr-only"> (opens in a new tab)</span>
                            </a>
                          </h4>
                          <span className="monitor-row-source">{article.domain}</span>
                          {newTag(article.id)}
                          <StoryActions article={article} />
                        </article>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          ) : (
            <div className="monitor-feed" key={`${state.topics.join()}-${state.window}`}>
              <article className="monitor-lead">
                <div className="monitor-lead-index">
                  <span>Lead dispatch</span>
                  <strong>01</strong>
                </div>
                <div className="monitor-lead-story">
                  <div className="monitor-story-meta">
                    <span>{topicLine(lead)}</span>
                    <time dateTime={lead.publishedAt}>Published {displayDate(lead.publishedAt)} ET</time>
                  </div>
                  <h2>
                    <a href={lead.url} target="_blank" rel="noreferrer">
                      <Highlight text={lead.title} query={state.q} />
                    </a>
                  </h2>
                  {lead.description && <p><Highlight text={lead.description} query={state.q} /></p>}
                  <div className="monitor-story-foot">
                    <span>
                      <strong>{lead.domain}</strong>
                      {lead.language !== "Not supplied" && ` · ${languageLabel(lead.language)}`}
                      {newTag(lead.id)}
                    </span>
                    <span className="monitor-story-tools">
                      <StoryActions article={lead} />
                      <a href={lead.url} target="_blank" rel="noreferrer">
                        Read at source <ArrowIcon />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </span>
                  </div>
                </div>
              </article>
              {dispatches.length > 0 && (
                <ol className="monitor-dispatch-grid">
                  {dispatches.map((article, index) => (
                    <li key={article.id}>
                      <article>
                        <div className="monitor-dispatch-index">
                          <span>{String(index + 2).padStart(2, "0")}</span>
                          <time dateTime={article.publishedAt}>{displayDate(article.publishedAt)} ET</time>
                        </div>
                        <p className="monitor-dispatch-topic">{topicLine(article)}</p>
                        <h3>
                          <a href={article.url} target="_blank" rel="noreferrer">
                            <Highlight text={article.title} query={state.q} />
                          </a>
                        </h3>
                        {article.description && (
                          <p className="monitor-description"><Highlight text={article.description} query={state.q} /></p>
                        )}
                        <div className="monitor-dispatch-foot">
                          <span>
                            {article.domain}
                            {article.language !== "Not supplied" && ` · ${languageLabel(article.language)}`}
                            {newTag(article.id)}
                          </span>
                          <span className="monitor-story-tools">
                            <StoryActions article={article} />
                            <a href={article.url} target="_blank" rel="noreferrer" aria-label={`Open original article: ${article.title}`}>
                              <ArrowIcon />
                            </a>
                          </span>
                        </div>
                      </article>
                    </li>
                  ))}
                </ol>
              )}
              {visible.length > limit && (
                <div className="monitor-more">
                  <button className="button-secondary" type="button" onClick={() => setLimit((current) => current + 12)}>
                    Load more coverage
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <MonitorContext articles={filterArticles(data.articles, { ...state, q: "", topics: [], sources: [], window: "7d" }, referenceTime)} referenceTime={referenceTime} />
      </div>
    </section>
  );
}
