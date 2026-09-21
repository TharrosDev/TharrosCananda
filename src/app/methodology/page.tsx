import type { Metadata } from "next";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { publicSources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Sources & Methodology",
  description: "How Tharros Canada attributes, dates, interprets and limits public-source market intelligence.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  return (
    <>
      <PageHero title="The source is part of the answer." description="Tharros records where information came from, when it was current, how it was interpreted and what it cannot establish." />
      <section className="section methodology-grid">
        <div className="methodology-main">
          <article><h2>Public data</h2><p>Official datasets may provide trade values, product classifications, importer names, geographic patterns or business-register information. Each usable data block should carry publisher, dataset, URL, period, update date, retrieval date, licence and limitations.</p></article>
          <article><h2>Human research</h2><p>Manual work adds classification checks, company relevance, channel context and source corroboration. It does not convert public indicators into certainty; observations and inferences are labelled as such.</p></article>
          <article><h2>Freshness</h2><p>“Latest” means the most recent period available from the stated publisher—not today. Publication lag, revisions and changes in classification are recorded when they affect interpretation.</p></article>
          <article id="demonstration-data"><h2>Demonstration data</h2><p>The public Market Explorer uses synthetic values in sample scenarios to demonstrate the output structure. Those values are labelled and must not be used as Canadian market statistics. The interface reads from a data-provider boundary, so official-source data can replace the samples without redesigning it.</p></article>
          <article><h2>Limitations</h2><p>HS categories may be broader than a product. Import values do not measure addressable demand. Importer records may include customs brokers or non-resident importers. Company websites can be incomplete or stale. Every output should state the limits that matter to the decision.</p></article>
        </div>
        <aside className="source-register"><h2>Initial source register</h2>{publicSources.map((source) => <a key={source.publisher} href={source.url} target="_blank" rel="noreferrer"><strong>{source.publisher}</strong><span>{source.purpose}</span><small>Open official source <ArrowIcon /><span className="sr-only"> (opens in a new tab)</span></small></a>)}<p>References identify public publishers. They do not imply endorsement, partnership or validation of Tharros Canada.</p></aside>
      </section>
      <section className="section provenance-model"><h2>Minimum provenance record</h2><dl><div><dt>Publisher</dt><dd>Who released it</dd></div><div><dt>Dataset</dt><dd>Exact product or table</dd></div><div><dt>Period</dt><dd>What time it describes</dd></div><div><dt>Retrieved</dt><dd>When it was accessed</dd></div><div><dt>Licence</dt><dd>Terms for reuse</dd></div><div><dt>Notes</dt><dd>Material limitations</dd></div></dl></section>
    </>
  );
}
