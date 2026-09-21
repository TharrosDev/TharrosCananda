import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "How It Works",
  description: "How Tharros Canada scopes, sources, verifies and delivers commissioned research.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  ["Describe the question", "The subject, what you need to know and the decision it supports."],
  ["Agree the scope", "A written reply with deliverable, sources, exclusions, price and timing."],
  ["Research and verify", "Public sources are collected with provenance; findings are checked by hand."],
  ["Receive the findings", "A concise output with linked sources, stated limitations and open questions."],
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <PageHero title="A predictable process, in writing." description="No mandatory call. Nothing starts until you approve the scope." />
      <section className="section process-page">
        <ol className="process-list">{steps.map(([title, copy], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{title}</h2><p>{copy}</p></div></li>)}</ol>
      </section>
      <section className="section boundary-grid">
        <div><h2>Tharros provides</h2><ul>{["Commercial research and intelligence", "Market, buyer and competitor research", "Sector, policy and industry analysis", "Public-source data with provenance"].map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h2>Tharros does not provide</h2><ul>{["Legal, tax or regulatory advice", "Lobbying or advocacy", "Investment advice", "Customs brokerage or compliance determinations"].map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="closing-cta">
        <h2>Start with the question.</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
