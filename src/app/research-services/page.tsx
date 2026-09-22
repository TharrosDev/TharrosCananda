import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ServiceList } from "@/components/service-list";
import { pricingTerms, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Commissioned Research",
  description: "Commissioned Canada–Europe research: market scans, buyer intelligence, competitor and ecosystem research, white-label support and custom research.",
  alternates: { canonical: "/research-services" },
};

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        title="Research built around the decision."
        description="Productized intelligence for common market questions, plus custom and white-label research across the Canada–Europe relationship. Everything is scoped in writing; a call is optional."
        index={services.map((service) => ({ label: service.name, href: `#${service.slug}` }))}
      />
      <section className="section section--compact services-page">
        <div className="service-context">
          <p className="pricing-note">{pricingTerms}</p>
          <nav className="context-links" aria-label="Commissioning information">
            <Link href="/how-it-works">How commissions work <ArrowIcon /></Link>
            <Link href="/methodology">Sources & methodology <ArrowIcon /></Link>
          </nav>
        </div>
        <ServiceList />
      </section>
      <section className="closing-cta">
        <h2>Not sure which format fits? Describe the question.</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
