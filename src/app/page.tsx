import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { TradeSignalPreview } from "@/components/trade-signal-preview";
import { publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

const clientQuestions = [
  {
    title: "Enter or assess a market",
    copy: "Understand market structure, trade signals, geography, routes to market and the questions that still require verification.",
    href: "/research-services#market-scan",
  },
  {
    title: "Find buyers or partners",
    copy: "Build a sourced view of organizations that may buy, import, distribute, integrate or otherwise matter to a commercial route.",
    href: "/research-services#buyer-distributor",
  },
  {
    title: "Understand competitors",
    copy: "Map comparable offers, positioning, geography, channels and public evidence in the relevant Canadian or European market.",
    href: "/research-services#competitor-intelligence",
  },
  {
    title: "Answer a cross-Atlantic question",
    copy: "Commission focused research when the issue crosses trade, defence, industry, energy, technology or multiple markets.",
    href: "/research-services#commissioned-research",
  },
] as const;

const customerScope = [
  ["European companies", "Assess Canada, identify buyers or distributors, understand competition or validate a route to market."],
  ["Canadian businesses", "Understand European markets, programmes, competitors, partners or sector developments."],
  ["Advisers & professional firms", "Add external research capacity for a client engagement, including white-label work."],
  ["Organizations & investors", "Commission a focused brief, data note, sector map or strategic research question."],
] as const;

export default function HomePage() {
  const featuredResearch = publications.filter((publication) => publication.featured).slice(0, 3);
  const researchToShow = featuredResearch.length ? featuredResearch : publications.slice(0, 3);
  const homeServices = services.filter((service) => service.homeFeatured);

  return (
    <>
      <PageHero
        variant="home"
        title="Commercial research and intelligence connecting Canada and Europe."
        description="Tharros Canada researches commercial, economic, industrial, technological and strategic developments across the Canada–Europe relationship, turning public evidence into focused decision-useful work."
        index={clientQuestions.map((item) => ({ label: item.title, href: item.href }))}
        indexLabel="Questions Tharros is built to answer"
      >
        <div className="hero-actions">
          <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
          <Link className="text-link" href="/research-services">See services <ArrowIcon /></Link>
        </div>
      </PageHero>

      <section className="section decision-section">
        <div className="section-intro">
          <h2>Start with the decision.</h2>
          <p>Services are organized around the question being answered, not a generic consulting package.</p>
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

      <section className="section section--compact client-scope">
        <div className="section-intro">
          <h2>Built for cross-Atlantic work.</h2>
          <p>Tharros can work on either side of the relationship and can sit behind another firm's engagement where appropriate.</p>
        </div>
        <div className="client-scope-grid">
          {customerScope.map(([name, need]) => <div key={name}><strong>{name}</strong><p>{need}</p></div>)}
        </div>
      </section>

      <section className="section section--compact expertise-home">
        <div className="section-intro">
          <h2>Canada–Europe expertise.</h2>
          <p>Four research pillars organize the evidence. Commercial questions can sit across more than one.</p>
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
            <h2>Inspect the source before the story.</h2>
            <p>The public data interface is a narrow proof of the research infrastructure behind Tharros. It reads official Statistics Canada CETA merchandise-trade series and fails visibly rather than substituting synthetic values.</p>
          </div>
          <TradeSignalPreview />
        </div>
      </section>

      <section className="section services-home">
        <div className="section-intro">
          <h2>Commissioned research.</h2>
          <p>Four common starting points are shown here. Partner, ecosystem and white-label research are available for broader engagements.</p>
          <Link className="text-link" href="/research-services">All services and pricing <ArrowIcon /></Link>
        </div>
        <ul className="product-list" aria-label="Research services">
          {homeServices.map((service) => (
            <li key={service.slug} className={service.flagship ? "is-flagship" : undefined}>
              <Link href={`/research-services#${service.slug}`}>
                {service.flagship && <small>Flagship</small>}
                <strong>{service.name}</strong>
                <span>{service.question}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section section--compact archive-home">
        <div>
          <h2>{researchToShow.length ? "Selected research." : "Research archive."}</h2>
          {researchToShow.length ? (
            <p>Recent verified work from the Tharros Canada research archive.</p>
          ) : (
            <p>Publications will appear here as independent Tharros research is released.</p>
          )}
        </div>
        <div className={researchToShow.length ? "home-research-list" : undefined}>
          {researchToShow.length ? researchToShow.map((publication) => (
            <Link key={publication.slug} href={`/research/${publication.slug}`}>
              <strong>{publication.title}</strong>
              <span>{publication.type} · {new Date(publication.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", timeZone: "UTC" })}</span>
            </Link>
          )) : (
            <>
              <Link className="text-link" href="/research">Open research archive <ArrowIcon /></Link>
              <Link className="text-link" href="/methodology">Sources & methodology <ArrowIcon /></Link>
            </>
          )}
        </div>
      </section>

      <section className="closing-cta">
        <h2>Have a Canada–Europe question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
