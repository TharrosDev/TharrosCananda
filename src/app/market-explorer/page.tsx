import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { LiveMarketExplorer } from "@/components/live-market-explorer";
import { getCetaTradeSeries } from "@/lib/statcan";

export const metadata: Metadata = {
  title: "Canada–CETA Market Data",
  description: "Explore current Statistics Canada customs-basis merchandise trade under CETA, with source provenance and federal dataset discovery.",
  alternates: { canonical: "/market-explorer" },
};

export default async function MarketExplorerPage() {
  const initialData = await getCetaTradeSeries({ flow: "imports" }).catch(() => null);

  return (
    <>
      <header className="market-hero">
        <div><p>Official market data</p><h1>Read the movement.<br />Check the source.</h1></div>
        <div><p>Explore monthly Canada–CETA merchandise trade by flow and commodity group, directly from Statistics Canada. Every view keeps its period, basis, retrieval context and limits attached.</p><div className="market-hero-status"><span className={initialData ? "is-live" : "is-offline"}>{initialData ? "Official source connected" : "Official source unavailable"}</span><span>Table 12-10-0174-01</span><span>Customs basis · CAD</span></div></div>
      </header>
      <section className="market-use-guide" aria-label="How to use this market data tool"><div><span>01</span><strong>Choose a direction</strong><p>Switch between Canadian imports and exports.</p></div><div><span>02</span><strong>Select the market signal</strong><p>Use publisher-defined commodity groups.</p></div><div><span>03</span><strong>Inspect context</strong><p>Read the series, provenance and limitations together.</p></div></section>
      <div className="page-shell explorer-page"><LiveMarketExplorer initialData={initialData} /></div>
      <section className="market-interpretation">
        <div><p>Useful without pretending to be analysis</p><h2>A signal is a starting point.</h2></div>
        <div><p>This tool answers a narrow question: what does the official trade series show? It does not establish addressable market size, buyer intent, pricing, competitive position or cause.</p><p>Commissioned work can connect the series to company, procurement, policy and sector evidence for a specific commercial decision.</p><Link className="text-link" href="/methodology">How Tharros handles sources <ArrowIcon /></Link></div>
      </section>
      <section className="closing-cta">
        <h2>Need the signal turned into a commercial answer?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
