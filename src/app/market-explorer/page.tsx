import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { LiveMarketExplorer } from "@/components/live-market-explorer";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Canada–CETA Market Data",
  description: "Explore live Statistics Canada customs-basis merchandise trade under CETA, with source provenance and related Government of Canada datasets.",
  alternates: { canonical: "/market-explorer" },
};

export default function MarketExplorerPage() {
  return (
    <>
      <PageHero
        variant="task"
        title="Canada–CETA market data."
        description="A narrow, source-first explorer using current Statistics Canada merchandise-trade data. It shows official series and their limits; it does not manufacture market estimates."
      />
      <div className="page-shell explorer-page"><LiveMarketExplorer /></div>
      <section className="closing-cta">
        <h2>Need the data interpreted for a commercial decision?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
