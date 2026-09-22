import Link from "next/link";
import { connection } from "next/server";
import { ArrowIcon } from "@/components/icons";
import { monthLabel } from "@/components/market-instrument";
import { getCetaTrade } from "@/lib/statcan-data";
import { yearAgoChange } from "@/lib/trade-analysis";

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", notation: "compact", maximumFractionDigits: 1 });

/** Streams in after the homepage renders; if Statistics Canada fails, it says so and shows no number. */
export async function TradeSignalPreview() {
  await connection();
  const trade = await getCetaTrade("imports", null);
  const latest = trade.kind === "ok" ? trade.data.points.at(-1) : undefined;
  const change = trade.kind === "ok" ? yearAgoChange(trade.data.points) : null;
  return (
    <div className="trade-preview">
      <div className="trade-preview-heading"><span>Official data</span><strong>Statistics Canada · CETA merchandise trade</strong></div>
      {latest && trade.kind === "ok" ? (
        <div className="trade-preview-value">
          <strong>{money.format(latest.valueCad)}</strong>
          <span>{trade.data.query.flow} · {monthLabel(latest.period)}</span>
          <small>{trade.data.query.commodity.label}{change !== null ? ` · ${change >= 0 ? "+" : "−"}${Math.abs(change).toFixed(1)}% on the same month a year earlier` : ""}</small>
        </div>
      ) : (
        <div className="trade-preview-value"><strong>Source unavailable</strong><span>Statistics Canada did not respond. Open the market data page to retry.</span></div>
      )}
      <Link href="/market-explorer">Open Canada–CETA market data <ArrowIcon /></Link>
    </div>
  );
}

export function TradeSignalPreviewSkeleton() {
  return (
    <div className="trade-preview" data-loading aria-busy="true">
      <div className="trade-preview-heading"><span>Official data</span><strong>Statistics Canada · CETA merchandise trade</strong></div>
      <div className="trade-preview-value"><strong className="trade-preview-pending" aria-hidden="true">&nbsp;</strong><span>Loading the latest release…</span></div>
      <Link href="/market-explorer">Open Canada–CETA market data <ArrowIcon /></Link>
    </div>
  );
}
