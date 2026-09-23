import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const clientQuestions = [
  {
    title: "Assess a market",
    copy: "Review market structure, trade, geography and routes to market.",
    href: "/research-services#market-scan",
  },
  {
    title: "Find buyers or partners",
    copy: "Identify relevant buyers, importers, distributors and partners.",
    href: "/research-services#buyer-distributor",
  },
  {
    title: "Understand competitors",
    copy: "Compare offers, positioning, geography and channels.",
    href: "/research-services#competitor-intelligence",
  },
  {
    title: "Research a specific question",
    copy: "Scope a question across trade, defence, industry, energy or technology.",
    href: "/research-services#commissioned-research",
  },
] as const;

const folioSources = [
  "Official data",
  "Procurement",
  "Company records",
  "Policy documents",
] as const;

export default function HomePage() {
  const featuredResearch = publications.filter((publication) => publication.featured).slice(0, 3);
  const researchToShow = featuredResearch.length ? featuredResearch : publications.slice(0, 3);
  const homeServices = services.filter((service) => service.homeFeatured);

  return (
    <>
      <section className="home-intro">
        <div className="home-intro-grid">
          <div className="home-intro-copy">
            <h1>Independent Canada–Europe research.</h1>
            <p className="home-intro-deck">
              Market assessments, buyer and competitor research, and commissioned studies on trade,
              defence, energy, industry and technology between Canada and Europe.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/request-research">
                Commission research <ArrowIcon />
              </Link>
              <Link className="text-link" href="/research">
                View research <ArrowIcon />
              </Link>
            </div>
          </div>
          <div
            className="evidence-folio"
            role="group"
            aria-label="A specimen of the Tharros evidence review process"
          >
            <div className="folio-head">
              <span>Evidence folio</span>
              <span>Working specimen · not a finding</span>
            </div>
            <div className="folio-stage">
              <article className="folio-sheet">
                <div className="folio-reference">
                  <span>TC / REVIEW NOTE</span>
                  <span>Source-led analysis</span>
                </div>
                <h2>Evidence before conclusion.</h2>
                <p>
                  A research question is tested against attributed records before it becomes a
                  written finding.
                </p>
                <div className="folio-extract" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <footer>
                  <span>Scope</span>
                  <strong>Canada–Europe</strong>
                  <span>Status</span>
                  <strong>Under review</strong>
                </footer>
              </article>
              <aside className="folio-margin" aria-label="Review checks">
                <span>01</span>
                <p>Source named</p>
                <span>02</span>
                <p>Date checked</p>
                <span>03</span>
                <p>Limits recorded</p>
              </aside>
            </div>
            <div className="folio-register">
              {folioSources.map((source) => (
                <span key={source}>{source}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="home-intro-foot">
          <p>Canada ↔ Europe</p>
          <Link href="#start">
            Explore research areas <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </section>

      <section className="section home-decisions" id="start">
        <div className="home-section-lead">
          <h2>Start with a question.</h2>
          <p>Research is scoped around the information you need.</p>
        </div>
        <ol className="decision-panels">
          {clientQuestions.map((item, index) => (
            <li key={item.title}>
              <Link href={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section home-services">
        <div className="home-section-lead">
          <h2>Commissioned research.</h2>
          <p>Choose a defined service or request a custom scope.</p>
          <Link className="text-link" href="/research-services">
            Services and pricing <ArrowIcon />
          </Link>
        </div>
        <ul className="service-catalogue" aria-label="Research services">
          {homeServices.map((service, index) => (
            <li key={service.slug}>
              <Link href={`/research-services#${service.slug}`}>
                <span>
                  {String(index + 1).padStart(2, "0")}
                  {service.flagship ? " · Flagship" : ""}
                </span>
                <h3>{service.name}</h3>
                <p>{service.question}</p>
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="expertise-spread">
        <div className="expertise-spread-inner">
          <div className="expertise-statement">
            <p>Research areas</p>
            <h2>Four connected fields.</h2>
            <p>Work may span more than one area.</p>
          </div>
          <div className="expertise-ledger">
            {researchAreas.map((area, index) => (
              <div key={area.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{area.name}</h3>
                <p>{area.scope}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="research-threshold">
        <div>
          <p>Live Monitor</p>
          <h2>Follow the relationship as it moves.</h2>
        </div>
        <div>
          <p>
            Track recent reporting across trade, defence, energy, industry and strategic technology,
            discovered through Currents and linked back to original publishers.
          </p>
          <div className="threshold-links">
            <Link className="text-link" href="/live-monitor">
              Open Live Monitor <ArrowIcon />
            </Link>
            <Link className="text-link" href="/methodology">
              Methodology <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="research-threshold">
        <div>
          <p>Public research</p>
          <h2>{researchToShow.length ? "Selected releases." : "First publications in preparation."}</h2>
        </div>
        <div>
          {researchToShow.length ? (
            researchToShow.map((publication) => (
              <Link key={publication.slug} href={`/research/${publication.slug}`}>
                <strong>{publication.title}</strong>
                <span>
                  {publication.type} ·{" "}
                  {new Date(publication.publishedAt).toLocaleDateString("en-CA", {
                    year: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </span>
              </Link>
            ))
          ) : (
            <p>Publications will appear here as they are released.</p>
          )}
          <div className="threshold-links">
            {!researchToShow.length && (
              <Link className="text-link" href="/research/example-report">
                See how a report is published <ArrowIcon />
              </Link>
            )}
            <Link className="text-link" href="/research">
              Research archive <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-finale">
        <h2>Have a research question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
