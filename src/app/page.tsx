import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { MarketExplorer } from "@/components/market-explorer";
import { SectionHeading } from "@/components/section-heading";
import { ServiceList } from "@/components/service-list";
import { SourceRail } from "@/components/source-rail";
import { pricingTerms } from "@/lib/services";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Canadian market research for European companies</p>
          <h1>Understand the Canadian market before you enter it.</h1>
          <p className="hero-description">
            For European SMEs evaluating Canada: human-verified research into demand, market structure, buyers and distributors, competitors and routes to market, before you commit money or people.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link>
            <Link className="text-link" href="/market-explorer">See a sample analysis <ArrowIcon /></Link>
          </div>
          <p className="hero-boundary">Commercial intelligence only; not legal, tax, customs or compliance advice.</p>
          <div className="hero-pillars" aria-label="What Tharros Canada combines">
            <div><span>Trade data</span><p>Official public sources</p></div>
            <div><span>Market intelligence</span><p>Decision-oriented context</p></div>
            <div><span>Commercial research</span><p>Human verification</p></div>
          </div>
        </div>
        <div className="hero-explorer"><MarketExplorer variant="hero" /></div>
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
          <div><span>Signal</span><h3>Is there measurable activity?</h3><p>Trade direction, HS classification, country share and geographic concentration.</p></div>
          <div><span>Structure</span><h3>How does the market work?</h3><p>Channels, buyers, importers, competitors, associations and commercial norms.</p></div>
          <div><span>Decision</span><h3>What deserves the next euro?</h3><p>A bounded research question, source trail and clear account of what remains uncertain.</p></div>
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

      <section className="section ecommerce-band">
        <div>
          <h2>Selling into Canada without a Canadian company?</h2>
          <p>Compare cross-border e-commerce, marketplace, wholesale, retail and distributor routes—and see which questions need qualified advice.</p>
        </div>
        <ul>
          {["GST/HST", "Importer arrangements", "CARM", "HS classification", "CETA", "Product requirements"].map((item) => <li key={item}><CheckIcon />{item}</li>)}
        </ul>
        <Link href="/ecommerce-readiness">Review cross-border route questions <ArrowIcon /></Link>
      </section>

      <section className="closing-cta">
        <div><h2>A clearer Canadian market question starts here.</h2><p>Share the product, objective and decision. Tharros replies in writing with a proposed scope, price and timeline. Nothing starts until you approve it.</p></div>
        <Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link>
      </section>
    </>
  );
}
