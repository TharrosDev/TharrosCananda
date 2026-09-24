import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { commissionPrivacy, commissionSteps as steps } from "@/lib/services";

export const metadata: Metadata = pageMetadata({
  title: "How Commissioned Research Works",
  description:
    "How Tharros Canada scopes, prices, sources, verifies and delivers commissioned research: written scope first, work only after approval, and private to the client unless they choose to publish.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        variant="document"
        title="How commissioned research works."
        description={`Scope, price and timing are agreed in writing before work begins. ${commissionPrivacy}`}
        index={steps.map(([title], position) => ({ label: title, href: `#step-${position + 1}` }))}
      />
      <section className="section process-page">
        <ol className="process-list">
          {steps.map(([title, copy], index) => (
            <li key={title} id={`step-${index + 1}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{title}</h2>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="section boundary-grid" id="boundaries">
        <div>
          <h2>Tharros provides</h2>
          <ul>
            {[
              "Market, buyer and competitor research",
              "Sector, policy and industry analysis",
              "Public-source data with provenance",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Tharros does not provide</h2>
          <ul>
            {[
              "Legal, tax or regulatory advice",
              "Lobbying or advocacy",
              "Investment advice",
              "Customs brokerage or compliance determinations",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="closing-cta">
        <h2>Start with the question.</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
