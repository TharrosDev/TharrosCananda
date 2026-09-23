import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ServiceComparison, ServiceList } from "@/components/service-list";
import { pricingTerms } from "@/lib/services";
import "./services.css";

export const metadata: Metadata = {
  title: "Commissioned Research",
  description:
    "Commissioned Canada–Europe research: market scans, buyer intelligence, competitor and ecosystem research, white-label support and custom research.",
  alternates: { canonical: "/research-services" },
};

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        title="Commissioned Canada–Europe research."
        description="Six services for market, buyer, competitor and partner questions between Canada and Europe."
        indexLabel="Every commission"
        index={[
          { label: "Scope, price and timing in writing" },
          { label: "No account or call required" },
          { label: "Work starts after your approval" },
        ]}
      >
        <div className="hero-actions">
          <Link className="button-primary" href="/request-research">
            Commission research <ArrowIcon />
          </Link>
          <a className="text-link" href="#compare">
            Compare services <span aria-hidden="true">↓</span>
          </a>
        </div>
      </PageHero>
      <section className="section services-compare" id="compare" aria-labelledby="compare-heading">
        <header className="services-compare-head">
          <h2 id="compare-heading">Compare services.</h2>
          <p>{pricingTerms}</p>
        </header>
        <ServiceComparison />
        <nav className="context-links" aria-label="Commissioning information">
          <Link href="/how-it-works">
            How commissions work <ArrowIcon />
          </Link>
          <Link href="/methodology">
            Sources & methodology <ArrowIcon />
          </Link>
        </nav>
      </section>
      <section className="section services-detail" aria-label="Service details">
        <ServiceList />
      </section>
      <section className="closing-cta">
        <h2>Not sure which service fits?</h2>
        <p>Describe the decision. Tharros will suggest the smallest useful starting point.</p>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
