"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { DemoStamp } from "@/components/demo-stamp";
import { ProvinceBars } from "@/components/province-bars";
import { TrendChart } from "@/components/trend-chart";
import { demoProvider } from "@/data/demo-markets";
import { track } from "@/lib/analytics";
import { collectLimitations, formatDelta, formatSourceDate, trendDelta } from "@/lib/format";
import { requestResearchHref } from "@/lib/research-request";
import type { MarketResult } from "@/types/market";

// ponytail: the provider is chosen here; a live adapter implementing MarketDataProvider replaces this import.
const provider = demoProvider;
const samples = provider.listSamples();

type ExplorerProps = {
  variant?: "hero" | "full";
  /** Sample slug from the URL (?sample=), so a shared link opens the same entry. */
  initialSample?: string;
};

export function MarketExplorer({ variant = "full", initialSample }: ExplorerProps) {
  const [result, setResult] = useState<MarketResult>(samples.find((sample) => sample.slug === initialSample) ?? samples[0]);
  const [query, setQuery] = useState("");
  const [unmatched, setUnmatched] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const full = variant === "full";
  const isSample = result.status === "demo";

  function selectSample(sample: MarketResult) {
    setResult(sample);
    setUnmatched(null);
    if (full) window.history.replaceState(null, "", `?sample=${sample.slug}`);
    track("market_explorer_completed", { result: sample.slug });
  }

  async function checkProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      setMessage("Enter a product description or HS code.");
      return;
    }
    setMessage("");
    track("market_explorer_started", { query_type: /^\d/.test(trimmed) ? "hs_code" : "product" });
    const outcome = await provider.search(trimmed);
    if (outcome.kind === "found") selectSample(outcome.result);
    else if (outcome.kind === "not-found") setUnmatched(outcome.query);
    else setMessage(outcome.message);
  }

  const sampleRequestHref = requestResearchHref({
    service: "market-scan",
    product: result.query,
    hs: result.hsCode,
    context: `Seen in the Market Explorer sample: ${result.query}.`,
  });

  return (
    <section className={`explorer explorer-${variant}`} aria-labelledby={`explorer-title-${variant}`}>
      <div className="explorer-topline">
        <div>
          <h2 id={`explorer-title-${variant}`}>Tharros Market Explorer</h2>
          <p>Sample scenarios showing how Canadian market evidence is assembled.</p>
        </div>
        <DemoStamp compact={!full} />
      </div>

      <div className="sample-picker" role="group" aria-labelledby={`sample-label-${variant}`}>
        <span id={`sample-label-${variant}`} className="sr-only">Sample scenarios (public preview)</span>
        <div>
          {samples.map((sample) => (
            <button
              key={sample.slug}
              type="button"
              aria-pressed={sample.slug === result.slug}
              onClick={() => selectSample(sample)}
            >
              {sample.query}
              <small>HS {sample.hsCode}</small>
            </button>
          ))}
        </div>
      </div>

      <div className="explorer-result">
        <div className="result-meta">
          <div className="entry-heading">
            <span>HS heading</span>
            <strong>{result.hsCode}</strong>
          </div>
          <div className="entry-description">
            <span>Sample product</span>
            <strong>{result.query}</strong>
            {full && <small>{result.hsDescription}</small>}
          </div>
          <div>
            <span>Data status</span>
            <strong>{isSample ? "Synthetic sample" : "Official source"}</strong>
          </div>
        </div>

        <div className="result-primary">
          <div className="trend-panel">
            <div className="result-heading">
              <div>
                <h3>Illustrative five‑year signal</h3>
                <p>{result.trend.unit}</p>
              </div>
              <span className="trend-change">{formatDelta(trendDelta(result), "index pts")}</span>
            </div>
            <TrendChart data={result.trend.points} compact={!full} />
          </div>
          <div className="province-panel">
            <div className="result-heading">
              <div>
                <h3>Leading provinces</h3>
                <p>{result.provinces.unit}</p>
              </div>
            </div>
            <ProvinceBars data={result.provinces.shares} compact={!full} />
          </div>
        </div>

        {full && (
          <>
            <div className="result-interpretation">
              <p>{result.interpretation}</p>
            </div>
            <div className="result-secondary">
              <div>
                <h3>Routes a real study would examine</h3>
                <div className="route-list">
                  {result.routes.items.map((route) => (
                    <article key={route.name}>
                      <strong>{route.name}</strong>
                      <p>{route.question}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <h3>Relevant official resources</h3>
                <div className="resource-list">
                  {result.resources.items.map((resource) => (
                    <a key={resource.label} href={resource.url} target="_blank" rel="noreferrer">
                      <span>{resource.label}<span className="sr-only"> (opens in a new tab)</span></span>
                      <small>{resource.publisher}</small>
                      <ArrowIcon />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <Provenance result={result} />

            <div className="explorer-ask">
              <form onSubmit={checkProduct} noValidate>
                <label htmlFor="explorer-product">Have a different product?</label>
                <p id="explorer-product-hint">
                  This public preview contains {samples.length} sample scenarios only. Enter your product and we’ll show a matching
                  sample, or carry it into a research request.
                </p>
                <div>
                  <input
                    id="explorer-product"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="e.g. Solar mounting systems or 7616.99"
                    maxLength={200}
                    aria-invalid={Boolean(message)}
                    aria-describedby={message ? "explorer-product-hint explorer-product-error" : "explorer-product-hint"}
                  />
                  <button type="submit">Check samples</button>
                </div>
                {message && <p className="field-message is-error" id="explorer-product-error">{message}</p>}
              </form>
              <div aria-live="polite">
                {unmatched && (
                  <div className="explorer-unmatched">
                    <p><strong>“{unmatched}” isn’t one of the sample scenarios.</strong></p>
                    <p>A Canada Market Scan can research it using official sources and manual verification.</p>
                    <Link
                      className="button-primary"
                      href={requestResearchHref({
                        service: "market-scan",
                        product: unmatched,
                        context: "Entered in the Market Explorer; not covered by the public samples.",
                      })}
                    >
                      Use this product in a research request <ArrowIcon />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="source-strip">
          <div>
            <span>Source status</span>
            <strong>{isSample ? "Synthetic sample values" : result.sources.map((source) => source.publisher).join(", ")}</strong>
          </div>
          <p>{result.sources[0]?.notes}</p>
          {full ? (
            <Link href={sampleRequestHref}>Research a real product like this</Link>
          ) : (
            <Link href="/market-explorer">See sources and limitations</Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Provenance({ result }: { result: MarketResult }) {
  const limitations = collectLimitations(result);
  return (
    <section className="provenance" aria-labelledby="provenance-title">
      <h3 id="provenance-title">Sources, provenance and limitations</h3>
      <div className="provenance-grid">
        <div>
          {result.sources.map((source) => (
            <dl key={source.id} className="provenance-record">
              <div><dt>Status</dt><dd>{result.status === "demo" ? "Sample (synthetic values)" : "Live official data"}</dd></div>
              <div><dt>Publisher</dt><dd>{source.publisher}</dd></div>
              <div><dt>Dataset</dt><dd>{source.url.startsWith("/") ? <Link href={source.url}>{source.dataset}</Link> : <a href={source.url} target="_blank" rel="noreferrer">{source.dataset}<span className="sr-only"> (opens in a new tab)</span></a>}</dd></div>
              <div><dt>Period</dt><dd>{source.period}</dd></div>
              <div><dt>Last updated</dt><dd>{formatSourceDate(source.lastUpdated, result.status)}</dd></div>
              <div><dt>Retrieved</dt><dd>{formatSourceDate(source.retrievedAt, result.status)}</dd></div>
              <div><dt>Licence</dt><dd>{source.licence}</dd></div>
              <div><dt>HS {result.hsCode}</dt><dd>{result.hsDescription}</dd></div>
            </dl>
          ))}
        </div>
        <div>
          <h4>Material limitations</h4>
          <ul>{limitations.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
