import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Tharros Canada scopes, sources, verifies and delivers commercial research.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  ["Frame the decision", "You describe the offer, market objective and the decision the work needs to support."],
  ["Confirm the scope", "Tharros replies in writing with the planned deliverable, sources, exclusions, price and timing."],
  ["Research and verify", "Public data is collected with provenance; company and competitor findings are checked manually."],
  ["Deliver the evidence", "You receive a concise output with linked sources, observations, limitations and practical next questions."],
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <PageHero title="A predictable research process, without a mandatory sales call." description="The purpose of the workflow is to reduce uncertainty before you buy and preserve traceability after the work is delivered." />
      <section className="section process-page">
        <ol className="process-list">{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{copy}</p></div></li>)}</ol>
        <aside className="process-standard"><h2>What a good brief includes</h2><ul>{["The product in plain language", "Country of origin and current markets", "The Canadian decision under consideration", "Known HS code, if any", "Timing or geographic constraints", "What is already known"].map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul></aside>
      </section>
      <section className="section boundary-grid">
        <div><h2>Tharros provides</h2><ul>{["Commercial research", "Market intelligence", "Public-source analysis", "Buyer and competitor research", "Data aggregation and signposting"].map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h2>Tharros does not provide</h2><ul>{["Legal or tax advice", "Customs brokerage", "Financial or immigration advice", "Formal compliance determinations", "Guaranteed commercial outcomes"].map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="closing-cta"><div><h2>Start with the decision you need to make.</h2><p>A complete brief is useful, but not required.</p></div><Link className="button-primary" href="/request-research">Request research <ArrowIcon /></Link></section>
    </>
  );
}
