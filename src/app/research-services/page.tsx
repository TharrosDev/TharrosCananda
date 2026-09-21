import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ServiceList } from "@/components/service-list";

export const metadata: Metadata = {
  title: "Research Services",
  description: "Human-verified Canadian market, buyer, distributor and competitor research for European businesses.",
  alternates: { canonical: "/research-services" },
};

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        title="Research scoped around the decision—not a generic report."
        description="When public data is not enough, Tharros adds manual verification, commercial context and a source trail you can inspect."
        aside={<div className="hero-aside"><span>Engagement model</span><strong>Asynchronous by default</strong><p>Written scope, price and timeline before work begins. A call is optional.</p></div>}
      />
      <section className="section services-page">
        <div className="pricing-note">
          <strong>Early validation pricing</strong>
          <p>The ranges below help make purchasing predictable. Final pricing depends on scope, geography, sector complexity and the level of verification required.</p>
        </div>
        <ServiceList />
      </section>
      <section className="section deliverable-band">
        <div><h2>Every research output should answer four things.</h2><p>What we found, where it came from, what it could mean, and what remains uncertain.</p></div>
        <ol><li><span>Evidence</span>Linked public sources</li><li><span>Interpretation</span>Commercial meaning</li><li><span>Limits</span>Unknowns and caveats</li><li><span>Next step</span>Decision-oriented action</li></ol>
      </section>
      <section className="closing-cta">
        <div><h2>Not sure which research product fits?</h2><p>Describe the decision you need to make. “Not sure yet” is a valid selection.</p></div>
        <Link className="button-primary" href="/request-research">Describe your question <ArrowIcon /></Link>
      </section>
    </>
  );
}
