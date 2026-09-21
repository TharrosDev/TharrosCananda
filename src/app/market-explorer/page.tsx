import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { PageHero } from "@/components/page-hero";

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
        variant="task"
        title="Market Explorer."
        description="Explore sample market evidence, provincial concentration, routes and provenance. Demonstration values are synthetic."
      />
      <div className="page-shell explorer-page"><MarketExplorer key={typeof sample === "string" ? sample : "default"} initialSample={typeof sample === "string" ? sample : undefined} /></div>
      <section className="closing-cta">
        <h2>Need this for a real product?</h2>
        <Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link>
      </section>
    </>
  );
}
