"use client";

import { useState, useSyncExternalStore } from "react";
import { publicSources, seatPlaces, type Seat } from "@/data/sources";
import { ArrowIcon } from "@/components/icons";

const regions = ["Canada", "Provincial & municipal", "Europe"] as const;
const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const placeOf = (seat: Seat) =>
  seatPlaces.find((place) => (place.seats as readonly Seat[]).includes(seat));

/** The source registry is complete in server HTML; search progressively enhances the same list. */
export function SourceRegister() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All regions");
  const interactive = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const term = query.trim().toLocaleLowerCase("en-CA");
  const matches = publicSources.filter(
    (source) =>
      (region === "All regions" || source.region === region) &&
      `${source.publisher} ${source.purpose} ${source.access} ${source.seat}`
        .toLocaleLowerCase("en-CA")
        .includes(term),
  );
  const filtered = Boolean(term) || region !== "All regions";
  const clear = () => {
    setQuery("");
    setRegion("All regions");
  };

  return (
    <div className="atlas-register">
      <form
        className="source-search"
        role="search"
        aria-label="Public source register"
        data-interactive={interactive || undefined}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="source-search-field">
          <label htmlFor="source-search">Search the source register</label>
          <input
            id="source-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Publisher, subject or access type"
            aria-describedby="source-search-hint"
            disabled={!interactive}
          />
        </div>
        <div className="source-region-field">
          <label htmlFor="source-region">Region</label>
          <select
            id="source-region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            disabled={!interactive}
          >
            <option>All regions</option>
            {regions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <p id="source-search-hint">
          Search publisher names, source descriptions, cities and access types.
        </p>
      </form>
      <noscript>
        <p className="source-offline">
          Search needs JavaScript. All publishers are listed below; the region links work without
          it.
        </p>
      </noscript>
      <div className="source-results-meta">
        <p role="status" aria-live="polite" aria-atomic="true">
          {matches.length} of {publicSources.length} publishers
          {filtered ? " match your filters" : " listed"}
        </p>
        {filtered && <button onClick={clear}>Clear filters</button>}
        <span>Official source links open in a new tab</span>
      </div>
      {matches.length === 0 && (
        <div className="source-empty">
          <h3>No registered source matches your search.</h3>
          <p>Try a broader subject or choose all regions.</p>
          <button className="method-link" onClick={clear}>
            Show all publishers <ArrowIcon />
          </button>
        </div>
      )}
      {regions.map((item, index) => {
        const sources = matches.filter((source) => source.region === item);
        return (
          <section
            className="atlas-region"
            key={item}
            id={`source-region-${index}`}
            aria-labelledby={`source-region-title-${index}`}
          >
            <h3 id={`source-region-title-${index}`}>
              {item} <span>{sources.length}</span>
            </h3>
            {sources.length === 0 && matches.length > 0 && (
              <p className="source-region-empty">
                No publishers in this region match the current filters.
              </p>
            )}
            {sources.map((source) => (
              <a
                key={source.publisher}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                data-node={placeOf(source.seat)?.key}
              >
                <div className="source-record-main">
                  <strong>{source.publisher}</strong>
                  <span>{source.purpose}</span>
                </div>
                <div className="source-record-access">
                  <span>{source.access}</span>
                  <small>
                    {source.seat} <ArrowIcon />
                  </small>
                  <span className="sr-only"> (opens in a new tab)</span>
                </div>
              </a>
            ))}
          </section>
        );
      })}
    </div>
  );
}
