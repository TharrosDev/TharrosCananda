import type { Metadata } from "next";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { publicSources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Sources & Methodology",
  description: "How Tharros Canada selects, dates, attributes, interprets and limits public-source commercial intelligence.",
  alternates: { canonical: "/methodology" },
};

const evidenceClasses = [
  ["Trade and statistical data", "Official statistical tables, classifications, customs and trade datasets."],
  ["Procurement and public spending", "Tender notices, awards, contract history, programme and budget documentation."],
  ["Company evidence", "Public filings, websites, product documentation, announcements and disclosed commercial activity."],
  ["Policy and programme records", "Government, EU and institutional strategies, programmes, consultations and implementation documents."],
  ["Research and ecosystem evidence", "Public funding, research programmes, institutional records and other source material relevant to a commercial question."],
] as const;

export default function MethodologyPage() {
  return (
    <>
      <PageHero
        variant="document"
        index={[
          { label: "Source selection", href: "#source-selection" },
          { label: "Human verification", href: "#human-research" },
          { label: "Freshness", href: "#freshness" },
          { label: "Live data", href: "#live-data" },
          { label: "Limitations", href: "#limitations" },
        ]}
        title="The source is part of the answer."
        description="Tharros records where information came from, what period it describes, when it was retrieved, how it was interpreted and what it cannot establish."
      />
      <section className="section methodology-grid">
        <div className="methodology-main">
          <article id="source-selection">
            <h2>Source selection</h2>
            <p>Primary and official sources are preferred when they can directly support a fact. Secondary research may add context, but source quality, recency and relevance to the actual question are considered before a claim is used.</p>
          </article>
          <article id="human-research">
            <h2>Human verification</h2>
            <p>Research work adds classification checks, company relevance, cross-source corroboration and context. Observations are kept separate from inference; public indicators are not converted into certainty simply because they are quantitative.</p>
          </article>
          <article id="freshness">
            <h2>Freshness and versioning</h2>
            <p>“Latest” means the most recent period available from the stated publisher. Publication lag, revisions, changed classifications and retrieval dates are recorded when they affect interpretation.</p>
          </article>
          <article id="live-data">
            <h2>Live data interfaces</h2>
            <p>The public Market Data tool requests Statistics Canada table metadata and current series through the Web Data Service. If the official source cannot be reached or no series is returned, the interface shows an unavailable state rather than substituting demonstration values.</p>
          </article>
          <article id="limitations">
            <h2>Limitations</h2>
            <p>Trade values do not measure addressable demand. Classifications can be broader than a product. Procurement records do not prove future opportunity. Company websites and public filings can be incomplete or stale. Each output should state the limits that matter to the decision.</p>
          </article>
        </div>
        <aside className="source-register">
          <h2>Core public sources</h2>
          {["Canada", "Europe"].map((region) => (
            <div className="source-region" key={region}>
              <h3>{region}</h3>
              {publicSources.filter((source) => source.region === region).map((source) => (
                <a key={source.publisher} href={source.url} target="_blank" rel="noreferrer">
                  <strong>{source.publisher}</strong>
                  <span>{source.purpose}</span>
                  <small>{source.access} <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></small>
                </a>
              ))}
            </div>
          ))}
          <p>References identify public publishers and access routes. They do not imply endorsement, partnership or validation of Tharros Canada.</p>
        </aside>
      </section>
      <section className="section evidence-classes">
        <div><h2>Evidence is broader than trade data.</h2><p>The source mix changes with the question. These are the main classes the research system is designed to accommodate.</p></div>
        <dl>{evidenceClasses.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
      </section>
      <section className="section provenance-model">
        <h2>Minimum provenance record</h2>
        <dl>
          <div><dt>Publisher</dt><dd>Who released it</dd></div>
          <div><dt>Dataset / record</dt><dd>Exact source product</dd></div>
          <div><dt>Period</dt><dd>What time it describes</dd></div>
          <div><dt>Retrieved</dt><dd>When it was accessed</dd></div>
          <div><dt>Licence / terms</dt><dd>Conditions for use</dd></div>
          <div><dt>Notes</dt><dd>Material limitations</dd></div>
        </dl>
      </section>
    </>
  );
}
