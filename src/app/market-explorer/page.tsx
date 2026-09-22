import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { LiveMarketExplorer } from "@/components/live-market-explorer";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        variant="task"
        title="Canada–CETA market data."
        description="A narrow demonstration of Tharros research infrastructure using current Statistics Canada merchandise-trade series. The tool exposes source context and limits; commissioned research provides the interpretation."
      />
      <div className="page-shell explorer-page"><LiveMarketExplorer initialData={initialData} /></div>
      <section className="closing-cta">
        <h2>Need the evidence interpreted for a commercial decision?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
