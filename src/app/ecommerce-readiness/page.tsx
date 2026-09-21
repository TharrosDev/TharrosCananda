import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ReadinessChecker } from "@/components/readiness-checker";

export const metadata: Metadata = {
  title: "Cross-Border Route Questions",
  description: "Identify categories of Canadian e-commerce, customs, tax and fulfilment questions to investigate.",
  alternates: { canonical: "/ecommerce-readiness" },
};

export default function EcommerceReadinessPage() {
  return (
    <>
      <PageHero title="Map the questions behind a Canadian sales route." description="Choose an initial sales channel to see the categories of questions European sellers may need to investigate. It does not make legal, tax, customs or regulatory determinations." />
      <section className="section"><ReadinessChecker /></section>
      <section className="section official-guidance"><div><h2>Use qualified sources for the answer.</h2><p>Requirements vary by product, province, fulfilment model and importer arrangement. Confirm classifications and obligations with official resources and qualified professionals.</p></div><div><a href="https://www.cbsa-asfc.gc.ca/prog/manif/portal-portail/menu-eng.html" target="_blank" rel="noreferrer">CARM Client Portal<span className="sr-only"> (opens in a new tab)</span> <ArrowIcon /></a><a href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html" target="_blank" rel="noreferrer">GST/HST for businesses<span className="sr-only"> (opens in a new tab)</span> <ArrowIcon /></a><a href="https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html" target="_blank" rel="noreferrer">Canadian customs tariff<span className="sr-only"> (opens in a new tab)</span> <ArrowIcon /></a></div></section>
      <section className="closing-cta"><h2>Need the route tested against your product?</h2><Link className="button-primary" href="/request-research?service=market-scan">Request a market scan <ArrowIcon /></Link></section>
    </>
  );
}
