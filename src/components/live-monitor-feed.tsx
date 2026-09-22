"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import {
  monitorTopics,
  monitorWindows,
  topicLabel,
  type LiveMonitorSnapshot,
  type MonitorTopicId,
  type MonitorWindowId,
} from "@/lib/live-monitor";
import { formatDateTime } from "@/lib/site";

const displayDate = (value: string) => formatDateTime(value, "America/Toronto");

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
  if (code === "not-configured")
    return "The Currents API key has not been configured on this deployment.";
  if (code === "unauthorized") return "Currents rejected the configured API key.";
  if (code === "quota")
    return "The Currents request quota has been reached for the current billing period.";
  if (code === "invalid-request")
    return "Currents rejected the monitor search request. The integration needs attention before live coverage can resume.";
  if (code === "invalid-response")
    return "Currents returned an unexpected response shape. No unverified fallback content is being substituted.";
  return "Currents did not return usable coverage. No substitute headlines or synthetic stories are shown.";
}

export function LiveMonitorFeed({ data }: { data: LiveMonitorSnapshot }) {
  const router = useRouter();
  const [topic, setTopic] = useState<MonitorTopicId | "all">("all");
  const [windowId, setWindowId] = useState<MonitorWindowId>("7d");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [limit, setLimit] = useState(11);

  const activeWindow = monitorWindows.find((item) => item.id === windowId) ?? monitorWindows[2];
  const parsedReferenceTime = Date.parse(data.retrievedAt);
  const referenceTime = Number.isFinite(parsedReferenceTime)
    ? parsedReferenceTime
    : Number.NEGATIVE_INFINITY;
  const cutoff = referenceTime - activeWindow.hours * 60 * 60 * 1000;

  const inWindow = useMemo(
    () =>
      data.articles.filter((article) => {
        const published = Date.parse(article.publishedAt);
        return Number.isFinite(published) && published >= cutoff && published <= referenceTime;
      }),
    [cutoff, data.articles, referenceTime],
  );

  const visible = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return inWindow.filter((article) => {
      const topicMatch = topic === "all" || article.topics.includes(topic);
      const searchMatch =
        !needle ||
        [article.title, article.description, article.domain, article.language]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return topicMatch && searchMatch;
    });
  }, [deferredQuery, inWindow, topic]);

  const topicCounts = useMemo(
    () =>
      Object.fromEntries(
        monitorTopics.map((item) => [
          item.id,
          inWindow.filter((article) => article.topics.includes(item.id)).length,
        ]),
      ) as Record<MonitorTopicId, number>,
    [inWindow],
  );

  const sourceCount = useMemo(
    () => new Set(inWindow.map((article) => article.domain)).size,
    [inWindow],
  );
  const lead = visible[0];
  const dispatches = visible.slice(1, limit);
  const filtersActive = topic !== "all" || windowId !== "7d" || Boolean(query.trim());

  function resetLimit() {
    setLimit(11);
  }

  function clearFilters() {
    setTopic("all");
    setWindowId("7d");
    setQuery("");
    resetLimit();
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
          <a
            className="text-link"
            href="https://currentsapi.services/"
            target="_blank"
            rel="noreferrer"
          >
            About Currents <ArrowIcon />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="monitor-workspace" aria-label="Canada Europe live news monitor">
      <div className="monitor-desk-head">
        <div
          className={data.articles.length ? "monitor-status-line" : "monitor-status-line is-empty"}
        >
          <span>
            <i aria-hidden="true" />
            Signal desk online
          </span>
          <span data-volatile>Checked {displayDate(data.retrievedAt)} ET</span>
        </div>
        <dl className="monitor-telemetry">
          <div>
            <dt>Provider</dt>
            <dd>
              <a
                className="monitor-provider-link"
                href="https://currentsapi.services/"
                target="_blank"
                rel="noreferrer"
              >
                Currents<span className="sr-only"> News API (opens in a new tab)</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>Window</dt>
            <dd>{activeWindow.label}</dd>
          </div>
          <div>
            <dt>Sources</dt>
            <dd>{sourceCount}</dd>
          </div>
          <div>
            <dt>Dispatches</dt>
            <dd>{inWindow.length}</dd>
          </div>
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
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetLimit();
            }}
            placeholder="Search company, country, sector or term"
          />
        </label>
        <fieldset className="monitor-window-picker">
          <legend className="sr-only">Time period</legend>
          {monitorWindows.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={windowId === item.id}
              onClick={() => {
                setWindowId(item.id);
                resetLimit();
              }}
            >
              {item.id === "72h" ? "3D" : item.id.toUpperCase()}
            </button>
          ))}
        </fieldset>
      </form>

      <div className="monitor-topic-rail" role="group" aria-label="Filter by research area">
        <button
          type="button"
          aria-pressed={topic === "all"}
          onClick={() => {
            setTopic("all");
            resetLimit();
          }}
        >
          <span>All signals</span>
          <strong>{inWindow.length}</strong>
        </button>
        {monitorTopics.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={topic === item.id}
            onClick={() => {
              setTopic(item.id);
              resetLimit();
            }}
          >
            <span>{item.shortLabel}</span>
            <strong>{topicCounts[item.id]}</strong>
          </button>
        ))}
      </div>

      <div className="monitor-result-line" aria-live="polite" aria-atomic="true">
        <span>
          {visible.length} {visible.length === 1 ? "relevant dispatch" : "relevant dispatches"}
        </span>
        <span>
          {topic === "all" ? "All research areas" : topicLabel(topic)} · {activeWindow.label}
        </span>
        {filtersActive && (
          <button type="button" onClick={clearFilters}>
            Reset view
          </button>
        )}
      </div>

      {visible.length ? (
        <div className="monitor-feed" key={`${topic}-${windowId}`}>
          <article className="monitor-lead">
            <div className="monitor-lead-index">
              <span>Lead dispatch</span>
              <strong>01</strong>
            </div>
            <div className="monitor-lead-story">
              <div className="monitor-story-meta">
                <span>
                  {lead.topics.length ? lead.topics.map(topicLabel).join(" · ") : "Canada–Europe"}
                </span>
                <time dateTime={lead.publishedAt}>
                  Published {displayDate(lead.publishedAt)} ET
                </time>
              </div>
              <h2>
                <a href={lead.url} target="_blank" rel="noreferrer">
                  {lead.title}
                </a>
              </h2>
              {lead.description && <p>{lead.description}</p>}
              <div className="monitor-story-foot">
                <span>
                  <strong>{lead.domain}</strong>
                  {lead.language !== "Not supplied" && ` · ${languageLabel(lead.language)}`}
                </span>
                <a href={lead.url} target="_blank" rel="noreferrer">
                  Read at source <ArrowIcon />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
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
                      <time dateTime={article.publishedAt}>
                        {displayDate(article.publishedAt)} ET
                      </time>
                    </div>
                    <p className="monitor-dispatch-topic">
                      {article.topics.length
                        ? article.topics.map(topicLabel).join(" · ")
                        : "Canada–Europe"}
                    </p>
                    <h3>
                      <a href={article.url} target="_blank" rel="noreferrer">
                        {article.title}
                      </a>
                    </h3>
                    {article.description && (
                      <p className="monitor-description">{article.description}</p>
                    )}
                    <div className="monitor-dispatch-foot">
                      <span>
                        {article.domain}
                        {article.language !== "Not supplied" &&
                          ` · ${languageLabel(article.language)}`}
                      </span>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open original article: ${article.title}`}
                      >
                        <ArrowIcon />
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : (
        <div className="monitor-empty" role="status">
          <h2>
            {data.articles.length
              ? "No developments match these filters."
              : "No current coverage was returned."}
          </h2>
          <p>
            {data.articles.length
              ? "Change the research area, time period or search term to widen the view."
              : "Currents completed the search, but did not return usable Canada–Europe coverage for this seven-day window. Nothing has been substituted."}
          </p>
          {data.articles.length > 0 && (
            <button className="button-secondary" type="button" onClick={clearFilters}>
              Clear all filters
            </button>
          )}
        </div>
      )}

      {visible.length > limit && (
        <div className="monitor-more">
          <button
            className="button-secondary"
            type="button"
            onClick={() => setLimit((current) => current + 12)}
          >
            Load more coverage
          </button>
        </div>
      )}
    </section>
  );
}
