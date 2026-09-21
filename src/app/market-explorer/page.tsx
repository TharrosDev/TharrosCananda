import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Market Explorer",
  description: "Sample scenarios showing how Tharros connects Canadian trade signals, provinces, routes to market and official sources.",
  alternates: { canonical: "/market-explorer" },
};

export default async function MarketExplorerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { sample } = await searchParams;
  return (
    <>
      <PageHero
        title="See how a Canadian market question is assembled."
        description="Two sample scenarios show how trade signals, geographic concentration, routes to market and official resources fit into one inspectable view, with every source and limitation visible."
        aside={<div className="hero-aside"><strong>Sample scenarios, synthetic values</strong><p>Nothing here is a live Canadian statistic. Real products are researched on request.</p></div>}
      />
      <div className="page-shell explorer-page"><MarketExplorer initialSample={typeof sample === "string" ? sample : undefined} /></div>
      <section className="section explorer-next">
        <div><h2>Need evidence for a real product?</h2><p>A human-verified scan can test the classification, source current data and add the market context a metric cannot supply.</p></div>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
