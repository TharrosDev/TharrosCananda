import type { Metadata } from "next";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { publicSources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Sources & Methodology",
  description: "How Tharros Canada selects, dates, attributes and interprets public sources.",
  alternates: { canonical: "/methodology" },
};

const evidenceClasses = [
  ["Trade and statistical data", "Official statistical tables, classifications, customs and trade datasets."],
  ["Procurement and public spending", "Tender notices, awards, contract history, programme and budget documentation."],
  ["Company evidence", "Public filings, websites, product documentation, announcements and disclosed business activity."],
  ["Policy and programme records", "Government, EU and institutional strategies, programmes, consultations and implementation documents."],
  ["Research and ecosystem evidence", "Public funding, research programmes, institutional records and related source material."],
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
        title="Sources and methodology."
        description="Sources are recorded with their period, retrieval date, interpretation and limitations."
      />
      <section className="section methodology-grid">
        <div className="methodology-main">
          <article id="source-selection">
            <h2>Source selection</h2>
            <p>Primary and official sources are preferred. Secondary research may add context when its quality, recency and relevance are clear.</p>
          </article>
          <article id="human-research">
            <h2>Human verification</h2>
            <p>Sources are checked across classifications and records. Observations are kept separate from inference.</p>
          </article>
          <article id="freshness">
            <h2>Freshness and versioning</h2>
            <p>“Latest” means the most recent period available from the publisher. Relevant lags, revisions and classification changes are noted.</p>
          </article>
          <article id="live-data">
            <h2>Live data interfaces</h2>
            <p>The Market Data tool requests current Statistics Canada series. If the source is unavailable, the tool reports the error.</p>
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
          <p>Listed sources do not imply endorsement or partnership.</p>
        </aside>
      </section>
      <section className="section evidence-classes">
        <div><h2>Source categories.</h2><p>The source mix varies by question.</p></div>
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
