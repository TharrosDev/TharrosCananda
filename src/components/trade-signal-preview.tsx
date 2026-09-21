"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowIcon } from "@/components/icons";
import type { TradeExplorerResponse } from "@/types/official-data";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function periodLabel(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-CA", { year: "numeric", month: "short", timeZone: "UTC" });
}

export function TradeSignalPreview() {
  const [data, setData] = useState<TradeExplorerResponse | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/market-data/trade?flow=imports", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("unavailable");
        setData((await response.json()) as TradeExplorerResponse);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });
    return () => controller.abort();
  }, []);

  const latest = data?.points.at(-1);

  return (
    <div className="trade-preview">
      <div className="trade-preview-heading">
        <span>Official data</span>
        <strong>Statistics Canada · CETA merchandise trade</strong>
      </div>
      {latest && data ? (
        <div className="trade-preview-value">
          <strong>{money.format(latest.valueCad)}</strong>
          <span>{data.query.flow} · {periodLabel(latest.period)}</span>
          <small>{data.query.commodity.label}</small>
        </div>
      ) : (
        <div className="trade-preview-value">
          <strong>{failed ? "Source unavailable" : "Loading official series…"}</strong>
          <span>{failed ? "No substitute values are shown." : "Direct from Statistics Canada WDS."}</span>
        </div>
      )}
      <Link href="/market-explorer">Open Canada–CETA market data <ArrowIcon /></Link>
    </div>
  );
}
