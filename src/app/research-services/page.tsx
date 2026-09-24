import type { Metadata } from "next";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/site";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { requestResearchHref } from "@/lib/research-request";
import { SampleDocument } from "@/components/sample-document";
import { commissionPrivacy, commissionSteps, services } from "@/lib/services";
import "./services.css";

export const metadata: Metadata = pageMetadata({
  title: "Commission Research",
  description:
    "Commission independent research from Tharros Canada on a question you set, answered with the same sources and method as its published work. Commissioned work stays private unless the client asks to publish it.",
  path: "/research-services",
});

export default function CommissionResearchPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <PageHero
        variant="document"
        title="Commission research."
        description="Tharros publishes its own research first. Commissions fund that work: you set the question, and it is answered with the same sources and method."
      />
      <section className="section commission-privacy" aria-labelledby="privacy-title">
        <h2 id="privacy-title">Private by default.</h2>
        <div>
          <p>{commissionPrivacy}</p>
          <p>The public archive holds Tharros&rsquo;s own research only.</p>
        </div>
      </section>
      <section className="section services-index" aria-labelledby="options-title">
        <h2 id="options-title">What can be commissioned.</h2>
        <ol>
          {services.map((service) => (
            <li key={service.slug} id={service.slug}>
              <h3>{service.name}</h3>
              <p>{service.question}</p>
              <Link className="text-link" href={requestResearchHref({ service: service.slug })}>
                Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
              </Link>
              <details className="service-output">
                <summary>What you receive</summary>
                <ul>
                  {service.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <SampleDocument service={service.slug} name={service.name} />
              </details>
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
      <section className="section process-strip" aria-labelledby="process-title">
        <h2 id="process-title">How a commission runs</h2>
        <ol>
          {commissionSteps.map(([title, copy], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="closing-cta">
        <h2>Have a question?</h2>
        <p>Describe the decision it supports. Tharros will reply with a written scope.</p>
        <Link className="button-primary" href="/request-research">
          Start a request <ArrowIcon />
        </Link>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Research that can be commissioned from Tharros Canada",
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Service",
                "@id": `${siteUrl}/research-services#${service.slug}`,
                name: service.name,
                description: service.question,
                serviceType: "Commissioned research",
                areaServed: ["Canada", "European Union"],
                provider: { "@id": `${siteUrl}/#organization` },
              },
            })),
          }),
        }}
      />
    </>
  );
}
