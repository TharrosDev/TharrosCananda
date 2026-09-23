import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { requestResearchHref } from "@/lib/research-request";
import { services } from "@/lib/services";
import "./services.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom and partner research, market assessments and buyer and partner research across Canada and Europe. Scoped and priced per case.",
  alternates: { canonical: "/research-services" },
};

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        variant="document"
        title="Research, scoped to your question."
        description="Every engagement is scoped and priced per case, in writing, before work begins."
      />
      <section className="section services-index" aria-label="Services">
        <ol>
          {services.map((service) => (
            <li
              key={service.slug}
              id={service.slug}
              className={service.flagship ? "is-flagship" : undefined}
            >
              <h2>{service.name}</h2>
              <p>{service.question}</p>
              <Link
                className={service.flagship ? "button-primary" : "text-link"}
                href={requestResearchHref({ service: service.slug })}
              >
                Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
              </Link>
            </li>
          ))}
        </ol>
        <nav className="services-more" aria-label="Commissioning information">
          <Link href="/how-it-works">
            How commissions work <ArrowIcon />
          </Link>
          <Link href="/methodology">
            Sources & methodology <ArrowIcon />
          </Link>
        </nav>
      </section>
      <section className="closing-cta">
        <h2>Not sure which fits?</h2>
        <p>Describe the decision. Tharros will suggest the smallest useful scope.</p>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
