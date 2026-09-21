import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { publicationTypes } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";

const commissionExamples = [
  "Canadian market opportunities for European companies",
  "European opportunities for Canadian companies",
  "Defence-industrial integration",
  "CETA, trade and market access",
  "Critical minerals and energy",
  "Supply chains and industrial policy",
  "AI, cyber and digital policy",
  "Aerospace and strategic industries",
];

export default function HomePage() {
  return (
    <>
      <PageHero
        title="Commercial research and intelligence connecting Canada and Europe."
        description="Tharros Canada researches the commercial, economic, industrial, technological and strategic developments that link the two, and takes commissions from organizations working across that relationship."
        index={researchAreas.map((area) => ({ label: area.name, href: `/research-areas#${area.slug}`, note: area.scope }))}
        indexLabel="Research areas"
      >
        <div className="hero-actions">
          <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
          <Link className="text-link" href="/research-areas">Research areas <ArrowIcon /></Link>
        </div>
      </PageHero>

      <section className="section commission">
        <div className="commission-intro">
          <h2>Commission focused research.</h2>
          <p>Bring almost any commercially relevant Canada–Europe question. Scope, price and timeline are agreed in writing before work starts.</p>
          <Link className="text-link" href="/research-services">Services and indicative prices <ArrowIcon /></Link>
        </div>
        <ul className="topic-list" aria-label="Examples of commissioned subjects">
          {commissionExamples.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <ul className="product-list" aria-label="Standard research products">
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/research-services#${service.slug}`}>
                <strong>{service.name}</strong>
                <span>{service.priceLabel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section own-research">
        <div>
          <h2>Independent research by Tharros Canada.</h2>
          <p>Alongside commissioned work, Tharros publishes its own research across the four areas. The first publications are in preparation.</p>
          <Link className="text-link" href="/research">About our research <ArrowIcon /></Link>
        </div>
        <ul className="type-list">
          {publicationTypes.map((type) => <li key={type.name}>{type.name}</li>)}
        </ul>
      </section>

      <section className="closing-cta">
        <h2>Have a Canada–Europe question?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
