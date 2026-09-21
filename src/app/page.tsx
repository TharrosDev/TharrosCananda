import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { TradeSignalPreview } from "@/components/trade-signal-preview";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

const clientQuestions = [
  {
    title: "Enter a market",
    copy: "Understand market structure, trade signals, geography, routes to market and the questions that still require verification.",
    href: "/research-services#market-scan",
  },
  {
    title: "Find buyers or partners",
    copy: "Build a sourced view of organizations that may buy, import, distribute or otherwise matter to a commercial route.",
    href: "/research-services#buyer-distributor",
  },
  {
    title: "Understand competitors",
    copy: "Map comparable offers, positioning, geography, channels and public evidence without presenting estimates as fact.",
    href: "/research-services#competitor-intelligence",
  },
  {
    title: "Track a sector or policy shift",
    copy: "Commission a focused answer when the commercial question crosses trade, defence, industry, energy or technology.",
    href: "/research-services#commissioned-research",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <PageHero
        variant="home"
        title="Commercial research and intelligence connecting Canada and Europe."
        description="Tharros Canada turns public data, procurement records, company evidence and policy material into focused research for organizations making decisions across the relationship."
        index={clientQuestions.map((item) => ({ label: item.title, href: item.href }))}
        indexLabel="What clients ask us to answer"
      >
        <div className="hero-actions">
          <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
          <Link className="text-link" href="/research-services">See services <ArrowIcon /></Link>
        </div>
      </PageHero>

      <section className="section decision-section">
        <div className="section-intro">
          <h2>Start with the decision.</h2>
          <p>Services are organized around the question being answered, not around a generic consulting package.</p>
        </div>
        <ol className="decision-list">
          {clientQuestions.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3><Link href={item.href}>{item.title}</Link></h3><p>{item.copy}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section expertise-home">
        <div className="section-intro">
          <h2>Canada–Europe expertise.</h2>
          <p>Four research areas organize the evidence. Commercial questions can sit across more than one.</p>
          <Link className="text-link" href="/research-areas">Explore expertise <ArrowIcon /></Link>
        </div>
        <div className="expertise-register">
          {researchAreas.map((area, index) => (
            <Link key={area.slug} href={`/research-areas#${area.slug}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{area.name}</strong>
              <small>{area.scope}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="band data-proof">
        <div className="band-inner data-proof-inner">
          <div>
            <h2>Use the source before the story.</h2>
            <p>The public data interface now reads official Statistics Canada CETA merchandise-trade series. If the source is unavailable, the interface says so instead of substituting synthetic values.</p>
          </div>
          <TradeSignalPreview />
        </div>
      </section>

      <section className="section services-home">
        <div className="section-intro">
          <h2>Commissioned research.</h2>
          <p>Three standardized starting points plus custom research. Indicative pricing stays visible in the service detail rather than defining the proposition.</p>
          <Link className="text-link" href="/research-services">Services and indicative prices <ArrowIcon /></Link>
        </div>
        <ul className="product-list" aria-label="Research services">
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/research-services#${service.slug}`}>
                <strong>{service.name}</strong>
                <span>{service.question}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section archive-home">
        <div>
          <h2>Research archive.</h2>
          <p>The archive is ready for real papers, briefs and data notes as they are published. It remains deliberately empty until that work exists.</p>
        </div>
        <div>
          <Link className="text-link" href="/research">Open research archive <ArrowIcon /></Link>
          <Link className="text-link" href="/methodology">Sources & methodology <ArrowIcon /></Link>
        </div>
      </section>

      <section className="closing-cta">
        <h2>Have a Canada–Europe question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
