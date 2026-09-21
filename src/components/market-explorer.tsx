"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import { DemoStamp } from "@/components/demo-stamp";
import { ProvinceBars } from "@/components/province-bars";
import { TrendChart } from "@/components/trend-chart";
import { demoMarkets, findDemoMarket } from "@/data/demo-markets";
import { track } from "@/lib/analytics";
import type { DemoMarketResult } from "@/types/market";

type ExplorerProps = {
  variant?: "hero" | "full";
};

export function MarketExplorer({ variant = "full" }: ExplorerProps) {
  const [query, setQuery] = useState("Industrial LED lighting");
  const [country, setCountry] = useState("Germany");
  const [result, setResult] = useState<DemoMarketResult>(demoMarkets[0]);
  const [status, setStatus] = useState<"idle" | "loading" | "empty">("idle");
  const [message, setMessage] = useState("");

  const title = useMemo(() => `${result.query} · ${result.hsCode}`, [result]);

  function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      setMessage("Enter a product description or HS code.");
      return;
    }

    setMessage("");
    setStatus("loading");
    track("market_explorer_started", { query_type: /^\d/.test(query.trim()) ? "hs_code" : "product" });

    window.setTimeout(() => {
      const match = findDemoMarket(query);
      if (!match) {
        setStatus("empty");
        return;
      }
      setResult({ ...match, country });
      setStatus("idle");
      track("market_explorer_completed", { result: match.slug });
    }, 420);
  }

  function selectExample(market: DemoMarketResult) {
    setQuery(market.query);
    setCountry(market.country);
    setResult(market);
    setStatus("idle");
    setMessage("");
  }

  return (
    <section className={`explorer explorer-${variant}`} aria-labelledby={`explorer-title-${variant}`}>
      <div className="explorer-topline">
        <div>
          <h2 id={`explorer-title-${variant}`}>Tharros Market Explorer</h2>
          <p>Test the shape of a Canadian market question.</p>
        </div>
        <DemoStamp compact={variant === "hero"} />
      </div>

      <form className="explorer-search" onSubmit={runSearch} noValidate>
        <div className="explorer-query">
          <SearchIcon />
          <label htmlFor={`market-query-${variant}`}>Product description or HS code</label>
          <input
            id={`market-query-${variant}`}
            name="query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Industrial LED lighting or 9405.11"
            aria-describedby={message ? `query-message-${variant}` : undefined}
          />
        </div>
        {variant === "full" && (
          <div className="explorer-country">
            <label htmlFor={`country-${variant}`}>Exporter country</label>
            <select id={`country-${variant}`} value={country} onChange={(event) => setCountry(event.target.value)}>
              <option>Germany</option>
              <option>France</option>
              <option>Italy</option>
              <option>Poland</option>
              <option>Netherlands</option>
              <option>Estonia</option>
              <option>Latvia</option>
              <option>Lithuania</option>
              <option>Other European country</option>
            </select>
          </div>
        )}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Checking preview…" : "Explore market"}
          <ArrowIcon />
        </button>
      </form>
      {message && <p className="field-message is-error" id={`query-message-${variant}`}>{message}</p>}

      {status === "empty" ? (
        <div className="explorer-empty" role="status">
          <p className="empty-title">This preview does not have a matching demo.</p>
          <p>
            The V1 Explorer contains two transparent examples rather than pretending to cover every product.
            Try one of these:
          </p>
          <div className="example-actions">
            {demoMarkets.map((market) => (
              <button key={market.slug} type="button" onClick={() => selectExample(market)}>
                {market.query} · {market.hsCode}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={status === "loading" ? "explorer-result is-loading" : "explorer-result"} aria-busy={status === "loading"}>
          <div className="result-meta">
            <div>
              <span>Product</span>
              <strong>{result.query}</strong>
            </div>
            <div>
              <span>HS reference</span>
              <strong>{result.hsCode}</strong>
            </div>
            <div>
              <span>Country lens</span>
              <strong>{country}</strong>
            </div>
          </div>

          <div className="result-primary">
            <div className="trend-panel">
              <div className="result-heading">
                <div>
                  <h3>{variant === "hero" ? "Illustrative five-year signal" : title}</h3>
                  <p>{result.unit}</p>
                </div>
                <span className="trend-change">+{result.trend.at(-1)!.value - result.trend[0].value} index pts</span>
              </div>
              <TrendChart data={result.trend} compact={variant === "hero"} />
            </div>
            <div className="province-panel">
              <div className="result-heading">
                <div>
                  <h3>Leading provinces</h3>
                  <p>Illustrative share of value</p>
                </div>
              </div>
              <ProvinceBars data={result.provinces} compact={variant === "hero"} />
            </div>
          </div>

          {variant === "full" && (
            <>
              <div className="result-interpretation">
                <p>{result.interpretation}</p>
              </div>
              <div className="result-secondary">
                <div>
                  <h3>Potential commercial routes</h3>
                  <div className="route-list">
                    {result.routes.map((route) => (
                      <article key={route.name}>
                        <div><strong>{route.name}</strong><span>{route.fit}</span></div>
                        <p>{route.rationale}</p>
                      </article>
                    ))}
                  </div>
                </div>
                <div>
                  <h3>Relevant official resources</h3>
                  <div className="resource-list">
                    {result.resources.map((resource) => (
                      <a key={resource.label} href={resource.url} target="_blank" rel="noreferrer">
                        <span>{resource.label}</span><small>{resource.publisher}</small><ArrowIcon />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="source-strip">
            <div>
              <span>Source status</span>
              <strong>{result.source.dataset}</strong>
            </div>
            <p>{result.source.notes}</p>
            <a href={result.source.url}>Read the methodology</a>
          </div>
        </div>
      )}
    </section>
  );
}
