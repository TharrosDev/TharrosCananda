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
          <h2>Research archive</h2>
          <p>
            No Tharros Canada papers or reports have been published yet. The archive is already structured so verified work can
            be added without changing the information architecture.
          </p>
        </div>
        <details className="archive-placeholder">
          <summary>How this archive will work</summary>
          <div>
            <p>
              As research is released, this page will index it by research area, publication type and date, with search across
              titles, summaries and tags.
            </p>
            <p>
              Each publication entry is designed to carry named authorship where applicable, publication date, executive
              summary, methodology, sources, limitations and a stable URL. Reports will appear here only when the underlying
              work actually exists.
            </p>
            <p>
              Planned formats include {publicationTypes.map((item) => item.name).join(", ")}. More research is on the way.
            </p>
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
            <h2><Link href={item.url}>{item.title}</Link></h2>
            <p>{item.summary}</p>
            <div className="archive-tags">{(item.tags ?? []).map((tag) => <span key={tag}>{tag}</span>)}</div>
          </li>
        ))}
        {!results.length && <li className="archive-no-results">No publications match these filters.</li>}
      </ol>
    </>
  );
}
