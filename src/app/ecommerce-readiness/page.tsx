import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ReadinessChecker } from "@/components/readiness-checker";

export const metadata: Metadata = {
  title: "Canada E-Commerce Readiness",
  description: "Identify categories of Canadian e-commerce, customs, tax and fulfilment questions to investigate.",
  alternates: { canonical: "/ecommerce-readiness" },
};

export default function EcommerceReadinessPage() {
  return (
    <>
      <PageHero title="Map the questions behind a Canadian sales route." description="Choose a product context and initial channel. This preview identifies categories to investigate—it does not make legal, tax, customs or regulatory determinations." />
      <section className="section"><ReadinessChecker /></section>
      <section className="section official-guidance"><div><h2>Use qualified sources for the answer.</h2><p>Requirements vary by product, province, fulfilment model and importer arrangement. Confirm classifications and obligations with official resources and qualified professionals.</p></div><div><a href="https://www.cbsa-asfc.gc.ca/prog/manif/portal-portail/menu-eng.html" target="_blank" rel="noreferrer">CARM Client Portal <ArrowIcon /></a><a href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses.html" target="_blank" rel="noreferrer">GST/HST for businesses <ArrowIcon /></a><a href="https://www.cbsa-asfc.gc.ca/trade-commerce/tariff-tarif/menu-eng.html" target="_blank" rel="noreferrer">Canadian customs tariff <ArrowIcon /></a></div></section>
      <section className="closing-cta"><div><h2>Need the route tested against your product?</h2><p>Request a scoped market scan with the commercial and official-source questions made explicit.</p></div><Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link></section>
    </>
  );
}
