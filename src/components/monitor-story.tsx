"use client";

import Link from "next/link";
import { useState } from "react";
import { CitationPanel } from "@/components/citation-panel";
import type { MonitorArticle } from "@/lib/live-monitor";
import { highlightSegments } from "@/lib/monitor-view";
import { requestResearchHref } from "@/lib/research-request";

/** Search matches wrapped in <mark>; plain React text, so provider content can never inject HTML. */
export function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightSegments(text, query).map((segment, i) => (segment.match ? <mark key={i}>{segment.text}</mark> : <span key={i}>{segment.text}</span>))}
    </>
  );
}

/** Per-story actions: copy the source link, cite the source article, or commission research on it. */
export function StoryActions({ article }: { article: MonitorArticle }) {
  const [state, setState] = useState<"idle" | "copied" | "manual">("idle");
  const [citing, setCiting] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(article.url);
      setState("copied");
    } catch {
      setState("manual");
    }
  }

  return (
    <details className="monitor-actions">
      <summary>
        <span aria-hidden="true">•••</span>
        <span className="sr-only">Actions for: {article.title}</span>
      </summary>
      <div className="monitor-actions-menu">
        <button type="button" onClick={copy}>{state === "copied" ? "Link copied" : "Copy link"}</button>
        {state === "manual" && <input readOnly value={article.url} aria-label="Article link" onFocus={(e) => e.currentTarget.select()} />}
        <button type="button" aria-expanded={citing} onClick={() => setCiting((value) => !value)}>Cite this article</button>
        {citing && (
          <CitationPanel
            input={{ kind: "news", publisher: article.domain, title: article.title, authors: [], publishedAt: article.publishedAt, url: article.url }}
          />
        )}
        <Link href={requestResearchHref({ context: `Following up: ${article.title} (${article.url})` })}>Commission research on this</Link>
        <span className="sr-only" role="status">{state === "copied" ? "Link copied" : ""}</span>
      </div>
    </details>
  );
}
