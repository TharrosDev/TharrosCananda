import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Market Explorer",
  description: "Preview how Tharros connects Canadian trade signals, provinces, routes and official sources.",
  alternates: { canonical: "/market-explorer" },
};

export default function MarketExplorerPage() {
  return (
    <>
      <PageHero
        title="Start with a product. Leave with a better market question."
        description="The V1 Market Explorer demonstrates how trade signals, geographic concentration, commercial routes and official resources can be assembled into one inspectable view."
        aside={<div className="hero-aside"><span>Preview status</span><strong>Two transparent demo datasets</strong><p>No values are presented as live Canadian statistics.</p></div>}
      />
      <div className="page-shell explorer-page"><MarketExplorer /></div>
      <section className="section explorer-next">
        <div><h2>Need evidence for a real product?</h2><p>A human-verified scan can test the classification, source current data and add the market context a metric cannot supply.</p></div>
        <Link className="button-primary" href="/request-research">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
