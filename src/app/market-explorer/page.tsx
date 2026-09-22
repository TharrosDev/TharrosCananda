import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowIcon } from "@/components/icons";
import { MarketInstrument, MarketInstrumentSkeleton } from "@/components/market-instrument";
import "./market-data.css";
import { parseMarketSelection } from "@/lib/statcan";

export const metadata: Metadata = {
  title: "Canada–CETA Market Data",
  description: "Monthly Statistics Canada customs-basis merchandise trade under CETA by commodity group, with publisher flags, table notes and full provenance.",
  alternates: { canonical: "/market-explorer" },
};

export default async function MarketExplorerPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const selection = parseMarketSelection(await searchParams);

  return (
    <>
      <header className="market-hero">
        <div><p>Official market data</p><h1>Canada–CETA merchandise trade.</h1></div>
        <div>
          <p>Monthly imports and exports between Canada and the European Union by commodity group, read directly from Statistics Canada.</p>
          <div className="market-hero-status"><span>Table 12-10-0174-01</span><span>Customs basis · CAD · not seasonally adjusted</span><span>Updated when Statistics Canada releases</span></div>
        </div>
      </header>
      <section className="market-use-guide" aria-label="How to use this market data tool">
        <div><span>01</span><strong>Choose a direction</strong><p>Canadian imports from, or exports to, the CETA group.</p></div>
        <div><span>02</span><strong>Compare groups</strong><p>Rank commodity groups by value and change, then chart one.</p></div>
        <div><span>03</span><strong>Check the record</strong><p>Flags, table notes and provenance sit with the figures.</p></div>
      </section>
      <div className="page-shell explorer-page">
        <Suspense fallback={<MarketInstrumentSkeleton />}>
          <MarketInstrument selection={selection} />
        </Suspense>
      </div>
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
