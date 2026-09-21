import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { SectionHeading } from "@/components/section-heading";
import { ServiceList } from "@/components/service-list";
import { SourceRail } from "@/components/source-rail";
import { pricingTerms, services } from "@/lib/services";

const [marketScan, buyerIntel, competitorIntel] = services;

// The five questions a European company has to answer before entering Canada, and which offer addresses each.
const questions = [
  { name: "Demand", question: "Is there measurable Canadian activity for this product?", service: marketScan },
  { name: "Market structure", question: "How is the market organized across segments, provinces and channels?", service: marketScan },
  { name: "Buyers & distributors", question: "Which Canadian organizations could buy, import or distribute it?", service: buyerIntel },
  { name: "Competitors", question: "Who already sells a comparable offer, and how is it positioned?", service: competitorIntel },
  { name: "Routes to market", question: "Which route is realistic: distributor, direct B2B, wholesale or online?", service: marketScan },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <h1>Understand the Canadian market before you enter it.</h1>
          <p className="hero-description">
            Canadian market research for European companies evaluating Canada. Human-verified findings on demand, market
            structure, buyers and distributors, competitors and routes to market, before you commit money or people.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link>
            <Link className="text-link" href="/market-explorer">See a sample analysis <ArrowIcon /></Link>
          </div>
          <p className="hero-boundary">Commercial intelligence only; not legal, tax, customs or compliance advice.</p>
        </div>
        <div className="hero-explorer"><MarketExplorer variant="hero" /></div>
      </section>

      <section className="band band-dark question-index" aria-labelledby="question-index-title">
        <div className="band-inner">
          <div className="band-heading">
            <h2 id="question-index-title">Five questions to answer before entering Canada.</h2>
            <p>Each is researched from official public sources and verified by hand. The column on the right shows which offer addresses it.</p>
          </div>
          <ol className="index-list">
            {questions.map((item, index) => (
              <li key={item.name}>
                <span className="index-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="index-body">
                  <h3>{item.name}</h3>
                  <p>{item.question}</p>
                </div>
                <Link className="index-service" href={`/research-services#${item.service.slug}`}>
                  {item.service.name} <ArrowIcon />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SourceRail />

      <section className="section section-problem">
        <SectionHeading title="A market question is rarely answered by one number." align="split">
          <p>
            Import values can show movement. They cannot tell you, on their own, whether your product fits the channel,
            which organizations matter, or where the commercial friction sits.
          </p>
        </SectionHeading>
        <div className="evidence-sequence">
          <div><h3>Signal: is there measurable activity?</h3><p>Trade direction, HS classification, country share and geographic concentration.</p></div>
          <div><h3>Structure: how does the market work?</h3><p>Channels, buyers, importers, competitors, associations and commercial norms.</p></div>
          <div><h3>Decision: what deserves the next euro?</h3><p>A bounded research question, source trail and clear account of what remains uncertain.</p></div>
        </div>
      </section>

      <section className="section section-services">
        <SectionHeading title="Research that starts where public data stops." align="split">
          <div><p>Three scoped research products, each with a defined question, concrete outputs and an indicative price.</p><p className="section-note">{pricingTerms}</p></div>
        </SectionHeading>
        <ServiceList compact />
      </section>

      <section className="section decision-path">
        <div className="decision-copy">
          <h2>Explore first. Ask for judgment when it matters.</h2>
          <p>
            You can review how Tharros works without a sales conversation. Look at a sample analysis, inspect the source model,
            then request research when the next decision needs verified Canadian context.
          </p>
          <Link className="button-secondary" href="/how-it-works">See how research works <ArrowIcon /></Link>
        </div>
        <ol className="decision-steps">
          <li><span>1</span><div><strong>Frame the question</strong><p>Product, HS code if known, and the commercial objective in Canada.</p></div></li>
          <li><span>2</span><div><strong>Inspect public signals</strong><p>Understand the source, period, method and limitation.</p></div></li>
          <li><span>3</span><div><strong>Choose the next evidence</strong><p>Market, buyer or competitor research—not a mandatory call.</p></div></li>
        </ol>
      </section>

      <section className="band ecommerce-band">
        <div className="band-inner">
          <div>
            <h2>Selling into Canada without a Canadian company?</h2>
            <p>Compare cross-border e-commerce, marketplace, wholesale and distributor routes, and see which questions need qualified advice.</p>
          </div>
          <ul>
            {["GST/HST", "Importer arrangements", "CARM", "HS classification", "CETA", "Product requirements"].map((item) => <li key={item}><CheckIcon />{item}</li>)}
          </ul>
          <Link href="/ecommerce-readiness">Review cross-border route questions <ArrowIcon /></Link>
        </div>
      </section>

      <section className="closing-cta">
        <div><h2>A clearer Canadian market question starts here.</h2><p>Share the product, objective and decision. Tharros replies in writing with a proposed scope, price and timeline. Nothing starts until you approve it.</p></div>
        <Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link>
      </section>
    </>
  );
}
