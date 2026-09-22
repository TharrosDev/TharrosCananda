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
        <div><p>Official market data</p><h1>Canada–CETA merchandise trade.</h1></div>
        <div><p>Explore monthly imports and exports by commodity group from Statistics Canada.</p><div className="market-hero-status"><span className={initialData ? "is-live" : "is-offline"}>{initialData ? "Official source connected" : "Official source unavailable"}</span><span>Table 12-10-0174-01</span><span>Customs basis · CAD</span></div></div>
      </header>
      <section className="market-use-guide" aria-label="How to use this market data tool"><div><span>01</span><strong>Choose a direction</strong><p>Switch between Canadian imports and exports.</p></div><div><span>02</span><strong>Select the market signal</strong><p>Use publisher-defined commodity groups.</p></div><div><span>03</span><strong>Inspect context</strong><p>Read the series, provenance and limitations together.</p></div></section>
      <div className="page-shell explorer-page"><LiveMarketExplorer initialData={initialData} /></div>
      <section className="market-interpretation">
        <div><p>Interpretation</p><h2>What the data shows.</h2></div>
        <div><p>The series shows recorded trade values. It does not establish market size, buyer intent, pricing, competitive position or cause.</p><Link className="text-link" href="/methodology">Sources and methodology <ArrowIcon /></Link></div>
      </section>
      <section className="closing-cta">
        <h2>Need research beyond the trade series?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
