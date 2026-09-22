import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

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

const evidenceSources = [
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
            className="evidence-atlas"
            aria-label="How Tharros research works: sources from both sides are checked before they reach a finding"
          >
            <div className="atlas-head">
              <span>Research process</span>
              <span>CA ↔ EU</span>
            </div>
            <svg
              className="atlas-field"
              viewBox="0 0 720 430"
              role="img"
              aria-labelledby="atlas-title atlas-description"
            >
              <title id="atlas-title">From source records to a finding</title>
              <desc id="atlas-description">
                Canadian and European source records are each checked, dated and attributed, then
                combined into a written finding.
              </desc>
              <path className="atlas-route" pathLength="1" d="M128 221C249 129 386 125 580 205" />
              <circle className="atlas-node atlas-node-origin" cx="128" cy="221" r="7" />
              <circle className="atlas-node" cx="352" cy="155" r="5" />
              <circle className="atlas-node atlas-node-destination" cx="580" cy="205" r="7" />
              <line className="atlas-rule" x1="128" y1="221" x2="128" y2="331" />
              <line className="atlas-rule" x1="352" y1="155" x2="352" y2="100" />
              <line className="atlas-rule" x1="580" y1="205" x2="580" y2="331" />
              <text className="atlas-step" x="352" y="84" textAnchor="middle">
                CHECKED · DATED · ATTRIBUTED
              </text>
              <text className="atlas-label" x="72" y="360">
                CANADA
              </text>
              <text className="atlas-label" x="521" y="360">
                EUROPE
              </text>
              <text className="atlas-coordinate" x="72" y="386">
                Canadian source records
              </text>
              <text className="atlas-coordinate" x="521" y="386">
                European source records
              </text>
            </svg>
            <div className="atlas-register">
              {evidenceSources.map((source, index) => (
                <span key={source}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  {source}
                </span>
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

      <section className="research-threshold">
        <div>
          <p>Public research</p>
          <h2>{researchToShow.length ? "Selected releases." : "No publications yet."}</h2>
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
            <Link className="text-link" href="/research">
              Research archive <ArrowIcon />
            </Link>
            <Link className="text-link" href="/methodology">
              Methodology <ArrowIcon />
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
