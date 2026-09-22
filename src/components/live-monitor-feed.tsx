"use client";

import { useMemo, useState } from "react";
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

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Toronto",
});

function displayDate(value: string) {
  return dateFormatter.format(new Date(value));
}

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
  if (code === "invalid-request") return "Currents rejected the monitor search request. The integration needs attention before live coverage can resume.";
  if (code === "invalid-response") return "Currents returned an unexpected response shape. No unverified fallback content is being substituted.";
  return "Currents did not return usable coverage. No substitute headlines or synthetic stories are shown.";
}

export function LiveMonitorFeed({ data }: { data: LiveMonitorSnapshot }) {
  const router = useRouter();
  const [topic, setTopic] = useState<MonitorTopicId | "all">("all");
  const [windowId, setWindowId] = useState<MonitorWindowId>("7d");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(18);

  const window = monitorWindows.find((item) => item.id === windowId) ?? monitorWindows[2];
  const parsedReferenceTime = Date.parse(data.retrievedAt);
  const referenceTime = Number.isFinite(parsedReferenceTime) ? parsedReferenceTime : Number.NEGATIVE_INFINITY;
  const cutoff = referenceTime - window.hours * 60 * 60 * 1000;

  const inWindow = useMemo(
    () => data.articles.filter((article) => {
      const published = Date.parse(article.publishedAt);
      return Number.isFinite(published) && published >= cutoff && published <= referenceTime;
    }),
    [cutoff, data.articles, referenceTime],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
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
  }, [inWindow, query, topic]);

  function resetLimit() {
    setLimit(18);
  }

  if (data.kind === "error" && !data.articles.length) {
    return (
      <section className="monitor-error" aria-labelledby="monitor-error-title">
        <p className="monitor-kicker">Live coverage</p>
        <h2 id="monitor-error-title">Live coverage is temporarily unavailable.</h2>
        <p>{errorCopy(data.errorCode)}</p>
        <div className="monitor-error-actions">
          <button className="button-secondary" type="button" onClick={() => router.refresh()}>Retry live coverage</button>
          <a className="text-link" href="https://currentsapi.services/" target="_blank" rel="noreferrer">
            About Currents <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="monitor-workspace" aria-label="Canada Europe live news monitor">
      <div className="monitor-status-line">
        <span>
          <i aria-hidden="true" />
          Powered by <a className="monitor-provider-link" href="https://currentsapi.services/" target="_blank" rel="noreferrer">Currents News API<span className="sr-only"> (opens in a new tab)</span></a>
        </span>
        <span data-volatile>Retrieved {displayDate(data.retrievedAt)} ET</span>
      </div>

      <form className="archive-controls monitor-controls" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Search coverage</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetLimit();
            }}
            placeholder="Company, country, sector or term"
          />
        </label>
        <label>
          <span>Research area</span>
          <select
            aria-label="Research area"
            value={topic}
            onChange={(event) => {
              setTopic(event.target.value as MonitorTopicId | "all");
              resetLimit();
            }}
          >
            <option value="all">All areas</option>
            {monitorTopics.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label>
          <span>Time period</span>
          <select
            aria-label="Time period"
            value={windowId}
            onChange={(event) => {
              setWindowId(event.target.value as MonitorWindowId);
              resetLimit();
            }}
          >
            {monitorWindows.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </form>

      <div className="archive-result-count" aria-live="polite">
        <span>{visible.length} {visible.length === 1 ? "development" : "developments"}</span>
        <span>{topic === "all" ? "All research areas" : topicLabel(topic)} · {window.label}</span>
      </div>

      <ol className="archive-list monitor-article-list">
        {visible.slice(0, limit).map((article) => (
          <li key={article.id}>
            <div className="archive-meta">
              <span>{article.topics.length ? article.topics.map(topicLabel).join(" · ") : "Canada–Europe"}</span>
              <time dateTime={article.publishedAt}>Published {displayDate(article.publishedAt)} ET</time>
            </div>
            <h2><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h2>
            {article.description && <p className="monitor-description">{article.description}</p>}
            <div className="monitor-source-meta">
              <strong>{article.domain}</strong>
              {article.language !== "Not supplied" && <span>{languageLabel(article.language)}</span>}
            </div>
            <a className="text-link monitor-open-link" href={article.url} target="_blank" rel="noreferrer">
              Open original <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        {!visible.length && (
          <li className="archive-no-results">
            No developments match these filters. Change the research area, time period or search term.
          </li>
        )}
      </ol>

      {visible.length > limit && (
        <div className="monitor-more">
          <button className="button-secondary" type="button" onClick={() => setLimit((current) => current + 18)}>Load more coverage</button>
        </div>
      )}
    </section>
  );
}
