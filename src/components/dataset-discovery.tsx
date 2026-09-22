"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import type { OfficialDatasetSearchResponse } from "@/types/official-data";

/**
 * Secondary source discovery: a keyword search of the federal Open Government catalogue, loaded only when
 * opened. Results are catalogue records to explore, not figures, and never compete with the series above.
 */
export function DatasetDiscovery({ query }: { query: string }) {
  const [state, setState] = useState<{ query: string; status: "loading" | "ready" | "error"; results: OfficialDatasetSearchResponse["results"] } | null>(null);

  function load(open: boolean) {
    if (!open || state?.query === query) return;
    setState({ query, status: "loading", results: [] });
    fetch(`/api/open-data/search?q=${encodeURIComponent(query)}`)
      .then(async (response) => {
        const payload = (await response.json()) as OfficialDatasetSearchResponse;
        if (!response.ok) throw new Error(payload.error);
        setState({ query, status: "ready", results: payload.results });
      })
      .catch(() => setState({ query, status: "error", results: [] }));
  }

  return (
    <details className="dataset-discovery" onToggle={(event) => load(event.currentTarget.open)}>
      <summary>Find related federal datasets</summary>
      <div aria-live="polite">
        <p className="dataset-discovery-note">A keyword search of the Government of Canada open data catalogue for &ldquo;{query}&rdquo;. These are catalogue records to explore, not verified figures.</p>
        {state?.status === "loading" && <p>Searching the Open Government catalogue…</p>}
        {state?.status === "error" && <p>The Open Government catalogue is not responding. Try again later.</p>}
        {state?.status === "ready" && !state.results.length && <p>No catalogue records matched this search.</p>}
        {state?.status === "ready" && state.results.length > 0 && (
          <div className="official-dataset-register-list">
            {state.results.map((dataset) => (
              <a key={dataset.id} href={dataset.url} target="_blank" rel="noreferrer">
                <strong>{dataset.title}<span className="sr-only"> (opens in a new tab)</span></strong>
                <span>{dataset.publisher}</span>
                <small>{dataset.formats.length ? dataset.formats.join(" · ") : "Catalogue record"}</small>
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </details>
  );
}
