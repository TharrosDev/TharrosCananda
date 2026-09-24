import type { Metadata } from "next";
import { jsonLd, pageMetadata, siteUrl } from "@/lib/site";
import Link from "next/link";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { ArrowIcon } from "@/components/icons";
import { requestResearchHref } from "@/lib/research-request";
import { SampleDocument } from "@/components/sample-document";
import { commissionPrivacy, commissionSteps, services } from "@/lib/services";
import "./services.css";

export const metadata: Metadata = pageMetadata({
  title: "Research Services",
  description:
    "Commission independent research from Tharros Canada on a question you set, answered with the same sources and method as its published work. See a sample layout for each service. Commissioned work stays private unless the client asks to publish it.",
  path: "/research-services",
});

export default function ResearchServicesPage() {
  return (
    <>
      <AnalyticsBeacon event="research_service_viewed" />
      <header className="services-opening">
        <div className="services-opening-copy">
          <h1>Research services.</h1>
          <p>
            Tharros publishes its own research first. Commissions fund that work: you set the
            question, and it is answered with the same sources and method.
          </p>
        </div>
        <section className="commission-privacy" aria-labelledby="privacy-title">
          <h2 id="privacy-title">Private by default.</h2>
          <p>{commissionPrivacy}</p>
          <p>The public archive holds Tharros&rsquo;s own research only.</p>
        </section>
      </header>

      <section className="services-shelf" aria-labelledby="options-title">
        <div className="services-shelf-head ruled ruled-strong">
          <h2 id="options-title">What can be commissioned.</h2>
          <p>Open any cover to see the shape of what you would receive.</p>
        </div>
        <ol className="services-index">
          {services.map((service, index) => {
            const isFlagship = index === 0;
            return (
              <li
                key={service.slug}
                id={service.slug}
                className={isFlagship ? "service is-flagship" : "service"}
              >
                <div className="service-specimen">
                  <SampleDocument service={service.slug} name={service.name} />
                </div>
                <div className="service-body">
                  <h3>{service.name}</h3>
                  <p className="service-question">{service.question}</p>
                  <div className="service-receive">
                    <h4>You receive</h4>
                    <ul className="service-deliverables">
                      {service.deliverables.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <Link
                      className={isFlagship ? "button-primary" : "text-link"}
                      href={requestResearchHref({ service: service.slug })}
                    >
                      Request<span className="sr-only"> {service.name}</span> <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="process-strip" aria-labelledby="process-title">
        <h2 id="process-title">How a commission runs.</h2>
        <ol>
          {commissionSteps.map(([title, copy], index) => (
            <li key={title} className="ruled">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <div className="process-foot">
          <p className="process-terms">
            No account or call required. Nothing is purchased until you approve a written scope.
          </p>
          <nav className="services-more" aria-label="Commissioning information">
            <Link href="/how-it-works">
              How commissions work <ArrowIcon />
            </Link>
            <Link href="/methodology">
              Sources & methodology <ArrowIcon />
            </Link>
          </nav>
        </div>
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
