import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { PageHero } from "@/components/page-hero";
import { demoMarkets } from "@/data/demo-markets";

export const metadata: Metadata = {
  title: "Data: Market Explorer",
  description: "A sample of how Tharros presents trade data: trend, provincial concentration, routes to market and sources, using clearly labelled synthetic values.",
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
        title="How Tharros presents data."
        description="Two sample scenarios show a trade signal, its provincial concentration, possible routes to market and every source and limitation. The values are synthetic."
        index={[
          ...demoMarkets.map((market) => ({ label: market.query, href: `?sample=${market.slug}`, note: `Sample · HS ${market.hsCode}` })),
          { label: "Sources and limitations", href: "#provenance-title" },
        ]}
      />
      <div className="page-shell explorer-page"><MarketExplorer key={typeof sample === "string" ? sample : "default"} initialSample={typeof sample === "string" ? sample : undefined} /></div>
      <section className="closing-cta">
        <h2>Need this for a real product?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
