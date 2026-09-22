"use client";

import { useMemo, useState } from "react";
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
  const [topic, setTopic] = useState<MonitorTopicId | "all">("all");
  const [windowId, setWindowId] = useState<MonitorWindowId>("72h");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(18);

  const window = monitorWindows.find((item) => item.id === windowId) ?? monitorWindows[1];
  const referenceTime = Date.parse(data.retrievedAt);
  const cutoff = referenceTime - window.hours * 60 * 60 * 1000;

  const inWindow = useMemo(
    () => data.articles.filter((article) => Date.parse(article.seenAt) >= cutoff),
    [cutoff, data.articles],
  );

  const counts = useMemo(
    () => Object.fromEntries(monitorTopics.map((item) => [item.id, inWindow.filter((article) => article.topics.includes(item.id)).length])),
    [inWindow],
  ) as Record<MonitorTopicId, number>;

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

  function chooseTopic(value: MonitorTopicId | "all") {
    setTopic(value);
    setLimit(18);
  }

  function chooseWindow(value: MonitorWindowId) {
    setWindowId(value);
    setLimit(18);
  }

  if (data.kind === "error" && !data.articles.length) {
    return (
      <section className="monitor-unavailable" aria-labelledby="monitor-unavailable-title">
        <p>Live Monitor</p>
        <h2 id="monitor-unavailable-title">Current coverage is temporarily unavailable.</h2>
        <p>GDELT did not return a usable feed. No substitute headlines or synthetic stories are shown.</p>
        <a href="https://www.gdeltproject.org/" target="_blank" rel="noreferrer">
          About the GDELT Project <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>
    );
  }

  const lead = visible[0];
  const remainder = visible.slice(1, limit);

  return (
    <section className="monitor-workspace" aria-label="Canada Europe live news monitor">
      {data.kind === "partial" && (
        <p className="monitor-partial" role="status">
          Some topic feeds could not be refreshed. Available GDELT coverage is still shown.
        </p>
      )}

      <div className="monitor-topic-register" aria-label="Coverage by research area">
        {monitorTopics.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={topic === item.id ? "is-active" : ""}
            aria-pressed={topic === item.id}
            onClick={() => chooseTopic(item.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.label}</strong>
            <small>{counts[item.id]} signals</small>
          </button>
        ))}
      </div>

      <div className="monitor-controls">
        <div className="monitor-filter-group" aria-label="Topic filter">
          <span>View</span>
          <button type="button" className={topic === "all" ? "is-active" : ""} aria-pressed={topic === "all"} onClick={() => chooseTopic("all")}>All coverage</button>
          {monitorTopics.map((item) => (
            <button key={item.id} type="button" className={topic === item.id ? "is-active" : ""} aria-pressed={topic === item.id} onClick={() => chooseTopic(item.id)}>
              {item.shortLabel}
            </button>
          ))}
        </div>
        <div className="monitor-filter-group monitor-window" aria-label="Time window">
          <span>Period</span>
          {monitorWindows.map((item) => (
            <button key={item.id} type="button" className={windowId === item.id ? "is-active" : ""} aria-pressed={windowId === item.id} onClick={() => chooseWindow(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <label className="monitor-search">
          <span>Search current coverage</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(18);
            }}
            placeholder="Company, country, sector or term"
          />
        </label>
      </div>

      <div className="monitor-result-line" aria-live="polite">
        <span>{visible.length} {visible.length === 1 ? "development" : "developments"}</span>
        <span>{topic === "all" ? "All research areas" : topicLabel(topic)} · {window.label}</span>
      </div>

      {lead ? (
        <>
          <article className="monitor-lead-story">
            <div className="monitor-story-index">01</div>
            <div>
              <div className="monitor-story-meta">
                <span>{lead.topics.map(topicLabel).join(" · ")}</span>
                <time dateTime={lead.seenAt}>{displayDate(lead.seenAt)}</time>
              </div>
              <h2><a href={lead.url} target="_blank" rel="noreferrer">{lead.title}</a></h2>
              <div className="monitor-source-line">
                <strong>{lead.domain}</strong>
                <span>{lead.sourceCountry}</span>
                <span>{languageLabel(lead.language)}</span>
                <a href={lead.url} target="_blank" rel="noreferrer">Open original <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </div>
          </article>

          <ol className="monitor-story-list" start={2}>
            {remainder.map((article, index) => (
              <li key={article.id}>
                <span className="monitor-story-number">{String(index + 2).padStart(2, "0")}</span>
                <article>
                  <div className="monitor-story-meta">
                    <span>{article.topics.map(topicLabel).join(" · ")}</span>
                    <time dateTime={article.seenAt}>{displayDate(article.seenAt)}</time>
                  </div>
                  <h3><a href={article.url} target="_blank" rel="noreferrer">{article.title}</a></h3>
                  <div className="monitor-source-line">
                    <strong>{article.domain}</strong>
                    <span>{article.sourceCountry}</span>
                    <span>{languageLabel(article.language)}</span>
                    <a href={article.url} target="_blank" rel="noreferrer" aria-label={"Open original article from " + article.domain}>Open <ArrowIcon /></a>
                  </div>
                </article>
              </li>
            ))}
          </ol>

          {visible.length > limit && (
            <div className="monitor-more">
              <button className="button-secondary" type="button" onClick={() => setLimit((current) => current + 18)}>Load more coverage</button>
            </div>
          )}
        </>
      ) : (
        <div className="monitor-empty">
          <h2>No matching developments in this view.</h2>
          <p>Change the research area, time period or search term. The monitor never inserts placeholder stories.</p>
        </div>
      )}
    </section>
  );
}
