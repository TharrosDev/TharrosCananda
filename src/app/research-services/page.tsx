import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ServiceList } from "@/components/service-list";
import { pricingTerms, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Commissioned Research",
  description: "Commissioned Canada–Europe research: market scans, buyer and distributor intelligence, competitor intelligence and custom research, with indicative prices.",
  alternates: { canonical: "/research-services" },
};

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        title="Commissioned research, scoped to the decision."
        description="Three standard products for market work in Canada, and custom research for any other Canada–Europe question. Everything is agreed in writing; a call is optional."
        index={services.map((service) => ({ label: service.name, href: `#${service.slug}`, note: service.priceLabel }))}
      />
      <section className="section services-page">
        <p className="pricing-note">{pricingTerms}</p>
        <ServiceList />
      </section>
      <section className="closing-cta">
        <h2>Not sure which fits? Describe the question.</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
