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
  if (normalised === "english") return "EN";
  if (normalised === "french") return "FR";
  if (normalised === "german") return "DE";
  if (normalised === "italian") return "IT";
  if (normalised === "spanish") return "ES";
  return value.length <= 4 ? value.toUpperCase() : value;
}

export function LiveMonitorFeed({ data }: { data: LiveMonitorSnapshot }) {
  const router = useRouter();
  const [topic, setTopic] = useState<MonitorTopicId | "all">("all");
  const [windowId, setWindowId] = useState<MonitorWindowId>("7d");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(18);

  const window = monitorWindows.find((item) => item.id === windowId) ?? monitorWindows[2];
  const referenceTime = Date.parse(data.retrievedAt);
  const cutoff = referenceTime - window.hours * 60 * 60 * 1000;

  const inWindow = useMemo(
    () => data.articles.filter((article) => Date.parse(article.seenAt) >= cutoff),
    [cutoff, data.articles],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return inWindow.filter((article) => {
      const topicMatch = topic === "all" || article.topics.includes(topic);
      const searchMatch =
        !needle ||
        [article.title, article.domain, article.sourceCountry, article.language]
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
        <h2 id="monitor-error-title">The GDELT feed is not responding.</h2>
        <p>The Live Monitor page is available, but the upstream discovery service did not return usable coverage. No substitute headlines or synthetic stories are shown.</p>
        <div className="monitor-error-actions">
          <button className="button-secondary" type="button" onClick={() => router.refresh()}>Retry live coverage</button>
          <a className="text-link" href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">
            About GDELT <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="monitor-workspace" aria-label="Canada Europe live news monitor">
      <div className="monitor-status-line">
        <span><i aria-hidden="true" />GDELT discovery · 7-day rolling source window</span>
        <span data-volatile>Retrieved {displayDate(data.retrievedAt)} ET</span>
      </div>

      {data.kind === "partial" && (
        <p className="monitor-notice" role="status">
          {data.broadFallback
            ? "Topic-specific GDELT feeds were unavailable, so a broader Canada–Europe discovery feed is shown. Research-area tags are inferred from headlines when possible."
            : "Some research-area feeds could not be refreshed. Available coverage is shown."}
        </p>
      )}

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
              <time dateTime={article.seenAt}>Indexed {displayDate(article.seenAt)} ET</time>
            </div>
            <h2><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h2>
            <div className="monitor-source-meta">
              <strong>{article.domain}</strong>
              <span>{article.sourceCountry}</span>
              <span>{languageLabel(article.language)}</span>
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
