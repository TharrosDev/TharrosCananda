"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Publication } from "@/data/publications";
import type { ResearchArea } from "@/lib/research-areas";

export function ResearchArchive({
  publications,
  areas,
  publicationTypes,
}: {
  publications: Publication[];
  areas: readonly ResearchArea[];
  publicationTypes: readonly { name: string; description: string }[];
}) {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [type, setType] = useState("all");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return publications.filter((publication) => {
      const matchesQuery =
        !needle ||
        [publication.title, publication.summary, ...(publication.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesQuery && (area === "all" || publication.area === area) && (type === "all" || publication.type === type);
    });
  }, [area, publications, query, type]);

  if (!publications.length) {
    return (
      <div className="archive-empty">
        <div>
          <h2>First publications in preparation</h2>
          <p>The archive structure is ready for the first completed Tharros Canada research. Each release will carry its authorship, date, methodology, sources, limitations and suggested citation.</p>
        </div>
        <details className="archive-placeholder">
          <summary>Publication formats</summary>
          <div>
            {publicationTypes.map((item) => <p key={item.name}><strong>{item.name}</strong> — {item.description}</p>)}
          </div>
        </details>
      </div>
    );
  }

  return (
    <>
      <form className="archive-controls" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Search archive</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Title, subject or keyword" />
        </label>
        <label>
          <span>Expertise</span>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="all">All areas</option>
            {areas.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span>Publication type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All formats</option>
            {publicationTypes.map((item) => <option key={item.name}>{item.name}</option>)}
          </select>
        </label>
      </form>
      <ol className="archive-list">
        {results.map((item) => (
          <li key={item.slug}>
            <div className="archive-meta">
              <span>{item.type}</span>
              <time dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
              </time>
            </div>
            <h2><Link href={`/research/${item.slug}`}>{item.title}</Link></h2>
            <p>{item.summary}</p>
            <div className="archive-tags">{(item.tags ?? []).map((tag) => <span key={tag}>{tag}</span>)}</div>
          </li>
        ))}
        {!results.length && <li className="archive-no-results">No publications match these filters.</li>}
      </ol>
    </>
  );
}
