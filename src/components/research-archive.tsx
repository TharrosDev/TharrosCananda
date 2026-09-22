"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CiteButton } from "@/components/cite-button";
import type { Publication } from "@/data/publications";
import type { ResearchArea } from "@/lib/research-areas";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";

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
  const [year, setYear] = useState("all");

  const years = useMemo(
    () =>
      [...new Set(publications.map((publication) => publication.publishedAt.slice(0, 4)))]
        .sort()
        .reverse(),
    [publications],
  );

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return publications
      .filter((publication) => {
        const matchesQuery =
          !needle ||
          [publication.title, publication.summary, ...(publication.tags ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(needle);
        return (
          matchesQuery &&
          (area === "all" || publication.area === area) &&
          (type === "all" || publication.type === type) &&
          (year === "all" || publication.publishedAt.startsWith(year))
        );
      })
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [area, publications, query, type, year]);

  if (!publications.length) {
    return (
      <div className="archive-empty">
        <div className="archive-empty-status">
          <span>Archive status</span>
          <strong>0</strong>
          <p>Published records</p>
        </div>
        <div className="archive-empty-copy">
          <h2>No publications yet.</h2>
          <p>
            New work will be indexed by area, format and date. Each entry will include authorship, a
            summary, methodology, sources, limitations and a stable URL.
          </p>
        </div>
        <div className="archive-format-grid">
          {publicationTypes.map((item, index) => (
            <div key={item.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <form className="archive-controls" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Search archive</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Title, subject or keyword"
          />
        </label>
        <label>
          <span>Research area</span>
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="all">All areas</option>
            {areas.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Publication type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            <option value="all">All formats</option>
            {publicationTypes.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Publication year</span>
          <select value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="all">All dates</option>
            {years.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </form>
      <div className="archive-result-count" aria-live="polite">
        <span>
          {results.length} {results.length === 1 ? "publication" : "publications"}
        </span>
        <span>Newest first</span>
      </div>
      <ol className="archive-list">
        {results.map((item) => (
          <li key={item.slug}>
            <div className="archive-meta">
              <div className="archive-meta-fields">
                <span>{item.type}</span>
                <time dateTime={item.publishedAt}>
                  {new Date(item.publishedAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
              <CiteButton
                input={{
                  title: item.title,
                  authors: item.authors,
                  publishedAt: item.publishedAt,
                  url: `${siteUrl}/research/${item.slug}`,
                }}
              />
            </div>
            <h2>
              <Link href={`/research/${item.slug}`}>{item.title}</Link>
            </h2>
            <p className="archive-summary">{item.summary}</p>
            {item.tags && item.tags.length > 0 && (
              <div className="archive-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </li>
        ))}
        {!results.length && (
          <li className="archive-no-results">No publications match these filters.</li>
        )}
      </ol>
    </>
  );
}
