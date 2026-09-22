import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { TradeSignalPreview } from "@/components/trade-signal-preview";
import { publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

const clientQuestions = [
  { title: "Enter or assess a market", copy: "Understand market structure, trade signals, geography, routes to market and the questions that still require verification.", href: "/research-services#market-scan" },
  { title: "Find buyers or partners", copy: "Build a sourced view of organizations that may buy, import, distribute, integrate or otherwise matter to a commercial route.", href: "/research-services#buyer-distributor" },
  { title: "Understand competitors", copy: "Map comparable offers, positioning, geography, channels and public evidence in the relevant Canadian or European market.", href: "/research-services#competitor-intelligence" },
  { title: "Answer a cross-Atlantic question", copy: "Commission focused research when the issue crosses trade, defence, industry, energy, technology or multiple markets.", href: "/research-services#commissioned-research" },
] as const;

const evidenceSources = ["Official data", "Procurement", "Company records", "Policy documents"] as const;

export default function HomePage() {
  const featuredResearch = publications.filter((publication) => publication.featured).slice(0, 3);
  const researchToShow = featuredResearch.length ? featuredResearch : publications.slice(0, 3);
  const homeServices = services.filter((service) => service.homeFeatured);

  return (
    <>
      <section className="home-intro">
        <div className="home-intro-grid">
          <div className="home-intro-copy">
            <p className="hero-context">Independent Canada–Europe intelligence</p>
            <h1>Evidence for the decisions between markets.</h1>
            <p className="home-intro-deck">Tharros Canada turns fragmented public evidence across Canada and Europe into focused commercial research—built around the decision you need to make.</p>
            <div className="hero-actions">
              <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
              <Link className="text-link" href="/research-services">Explore the work <ArrowIcon /></Link>
            </div>
          </div>
          <div className="evidence-atlas" aria-label="Tharros research process: Canada and Europe connected through sourced evidence">
            <div className="atlas-head"><span>Evidence route</span><span>CA ↔ EU</span></div>
            <svg className="atlas-field" viewBox="0 0 720 430" role="img" aria-labelledby="atlas-title atlas-description">
              <title id="atlas-title">Canada to Europe evidence route</title>
              <desc id="atlas-description">A diagram connecting Canadian and European source records through verification and analysis.</desc>
              <path className="atlas-contour" d="M45 91c45-37 89-48 143-42 30 4 53 18 80 18 26 0 49-15 75-12 22 3 35 21 57 24" />
              <path className="atlas-contour atlas-contour-east" d="M475 116c35-13 55-44 96-47 50-3 71 34 105 55" />
              <path className="atlas-route" pathLength="1" d="M128 221C249 129 386 125 580 205" />
              <circle className="atlas-node atlas-node-origin" cx="128" cy="221" r="7" />
              <circle className="atlas-node" cx="352" cy="155" r="5" />
              <circle className="atlas-node atlas-node-destination" cx="580" cy="205" r="7" />
              <line className="atlas-rule" x1="128" y1="221" x2="128" y2="331" />
              <line className="atlas-rule" x1="580" y1="205" x2="580" y2="331" />
              <text className="atlas-label" x="72" y="360">CANADA</text>
              <text className="atlas-label" x="521" y="360">EUROPE</text>
              <text className="atlas-coordinate" x="72" y="386">45.4215° N</text>
              <text className="atlas-coordinate" x="521" y="386">50.8503° N</text>
            </svg>
            <div className="atlas-register">
              {evidenceSources.map((source, index) => <span key={source}><b>{String(index + 1).padStart(2, "0")}</b>{source}</span>)}
            </div>
          </div>
        </div>
        <div className="home-intro-foot"><p>Commercial research · Market intelligence · Decision support</p><Link href="#start">Start with your decision <span aria-hidden="true">↓</span></Link></div>
      </section>

      <section className="section home-decisions" id="start">
        <div className="home-section-lead"><h2>The question comes first.</h2><p>No generic consultancy package. The scope begins with the decision, then follows the evidence far enough to make that decision clearer.</p></div>
        <ol className="decision-panels">
          {clientQuestions.map((item, index) => (
            <li key={item.title}><Link href={item.href}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.copy}</p><ArrowIcon /></Link></li>
          ))}
        </ol>
      </section>

      <section className="expertise-spread">
        <div className="expertise-spread-inner">
          <div className="expertise-statement"><p>Canada–Europe focus</p><h2>One relationship.<br />Four connected fields.</h2><p>Tharros follows the commercial questions that move between trade, security, industrial capacity and strategic technology. The boundaries stay porous because the real decisions do too.</p></div>
          <div className="expertise-ledger">
            {researchAreas.map((area, index) => <div key={area.slug}><span>{String(index + 1).padStart(2, "0")}</span><h3>{area.name}</h3><p>{area.scope}</p></div>)}
          </div>
        </div>
      </section>

      <section className="data-stage">
        <div className="data-stage-intro"><p>Live proof, not decoration</p><h2>Inspect the source before the story.</h2><p>The public data interface reads official Statistics Canada CETA merchandise-trade series. If the source fails, the interface fails visibly—no synthetic replacement, no invented certainty.</p><Link className="text-link" href="/market-explorer">Explore official market data <ArrowIcon /></Link></div>
        <div className="data-stage-preview"><TradeSignalPreview /></div>
      </section>

      <section className="section home-services">
        <div className="home-section-lead"><h2>Research shaped to the decision.</h2><p>Defined starting points make scope tangible. Coverage expands with the assignment; source discipline does not change.</p><Link className="text-link" href="/research-services">Services and pricing <ArrowIcon /></Link></div>
        <ul className="service-catalogue" aria-label="Research services">
          {homeServices.map((service, index) => <li key={service.slug}><Link href={`/research-services#${service.slug}`}><span>{String(index + 1).padStart(2, "0")}{service.flagship ? " · Flagship" : ""}</span><h3>{service.name}</h3><p>{service.question}</p><ArrowIcon /></Link></li>)}
        </ul>
      </section>

      <section className="research-threshold">
        <div><p>Public research</p><h2>{researchToShow.length ? "Selected releases." : "The archive opens with the work."}</h2></div>
        <div>
          {researchToShow.length ? researchToShow.map((publication) => <Link key={publication.slug} href={`/research/${publication.slug}`}><strong>{publication.title}</strong><span>{publication.type} · {new Date(publication.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", timeZone: "UTC" })}</span></Link>) : <p>No placeholder reports. Publications appear only when the underlying research exists, with authorship, date, methodology, sources, limitations and a stable URL.</p>}
          <div className="threshold-links"><Link className="text-link" href="/research">Enter the research archive <ArrowIcon /></Link><Link className="text-link" href="/methodology">Read the methodology <ArrowIcon /></Link></div>
        </div>
      </section>

      <section className="home-finale"><p>What do you need to know?</p><h2>Bring the question.<br />We’ll scope the evidence.</h2><Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link></section>
    </>
  );
}
