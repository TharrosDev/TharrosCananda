import type { Metadata } from "next";
import Link from "next/link";
import { formatLongDate, pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { MethodRail } from "@/components/method-rail";
import { PageContents } from "@/components/page-contents";
import { ProvenanceTrace, type TraceRecordRow } from "@/components/provenance-trace";
import { publicationByReference, type Publication } from "@/data/publications";
import { tracePassages, tracePhrases, traceReference } from "@/data/trace-example";
import "./methodology.css";

export const metadata: Metadata = pageMetadata({
  title: "Sources & Methodology",
  description:
    "How Tharros checks sources, separates findings from interpretation and states limitations. Follow the evidence behind an existing publication.",
  path: "/methodology",
});

// The worked example is real published work: TC-2026-001, the Ottawa traffic-collisions Data Note.
const example = publicationByReference(traceReference);

/** Builds the record beside the quoted passages from the report's own record; null if it lacks what the trace shows. */
function traceOf(publication: Publication | undefined) {
  if (!publication) return null;
  const { sources, limitations = [] } = publication;
  const dataset = sources.find((source) => !/about|metadata|licence/i.test(source.title));
  const about = sources.find((source) => /: about$/i.test(source.title));
  const meta = sources.find((source) => /metadata/i.test(source.title));
  const licence = sources.find((source) => /licence/i.test(source.title));
  if (!dataset || !licence) return null;
  const record: TraceRecordRow[] = [
    {
      field: "publisher",
      label: "Publisher",
      definition: "Who released it",
      value: dataset.publisher,
    },
    {
      field: "dataset",
      label: "Dataset",
      definition: "The exact source product",
      value: dataset.title,
      url: dataset.url,
      more: [
        ...(about?.url ? [{ label: "About page", url: about.url }] : []),
        ...(meta?.url ? [{ label: "ISO-19139 metadata", url: meta.url }] : []),
      ],
    },
    // Drafted from the dataset's own title and the report's wording ("between 2017-2024 (excluding 2023)").
    {
      field: "period",
      label: "Period",
      definition: "What time it describes",
      value: "2017–2024, excluding 2023",
    },
    {
      field: "licence",
      label: "Licence",
      definition: "The conditions for use",
      value: licence.title,
      url: licence.url,
    },
    {
      field: "notes",
      label: "Notes",
      definition: "Material limitations",
      value: "",
      items: limitations,
    },
  ];
  return { publication, record };
}

const trace = traceOf(example);

const clauses = [
  {
    id: "source-selection",
    label: "Source selection",
    rule: "Primary and official sources come first.",
    detail: "Secondary research may add context when its quality, recency and relevance are clear.",
    note: "The City of Ottawa's own dataset, read with its ISO-19139 metadata record.",
  },
  {
    id: "human-research",
    label: "Human verification",
    rule: "Sources are checked by hand, across classifications and records.",
    detail: "Observations are kept separate from inference.",
    note: "The dataset was read alongside its About page, its ISO-19139 metadata and its licence.",
  },
  {
    id: "freshness",
    label: "Freshness and versioning",
    rule: "“Latest” means the most recent period the publisher has released.",
    detail: "Relevant lags, revisions and classification changes are noted.",
    note: "The publisher’s release leaves out 2023.",
  },
  {
    id: "fitness",
    label: "Fitness for use",
    rule: "A dataset is judged against the use in question.",
    detail:
      "Each assessment checks coverage and gaps, how the data was collected, its definitions and documentation, how often it is updated and what its licence allows, then states what it can and cannot support.",
    note: "Suited to where and how collisions happen and to broad trends; weak for a continuous 2017 to 2024 comparison.",
  },
  {
    id: "limitations",
    label: "Limitations",
    rule: "Every output states the limits that matter to the decision.",
    detail:
      "Trade values do not measure addressable demand. Classifications can be broader than a product. Procurement records do not prove future opportunity. Company websites and public filings can be incomplete or stale.",
    note: "No separate data dictionary or methodological guide was found for the dataset.",
  },
] as const;
const railItems = clauses.map(({ id, label }) => ({ id, label }));

const pageSections = [
  ...(trace ? [{ id: "worked-example", label: "Worked example" }] : []),
  { id: "method-title", label: "Research method" },
] as const;

export default function MethodologyPage() {
  return (
    <>
      <header className="method-opening">
        <h1>Sources and methodology.</h1>
        <p>
          Follow a finding from a published report to its sources, then see how the evidence is
          checked. For the planned undergraduate submission process, see{" "}
          <Link href="/how-it-works">how publishing works</Link>.
        </p>
      </header>

      {trace && (
        <figure className="trace-figure" id="worked-example" aria-labelledby="trace-title">
          <div className="trace-heading">
            <h2 id="trace-title">Follow the evidence.</h2>
            <Link href={`/research/${trace.publication.slug}`}>
              {trace.publication.reference} <span>{trace.publication.type}</span> <ArrowIcon />
            </Link>
          </div>
          <ProvenanceTrace passages={tracePassages} phrases={tracePhrases} record={trace.record} />
          <figcaption id="trace-caption">
            <p>
              Quoted from{" "}
              <Link href={`/research/${trace.publication.slug}`}>{trace.publication.title}</Link>,
              published {formatLongDate(trace.publication.publishedAt)}. Footnote numbers are left
              out.
            </p>
            <a href="#method-title">
              How this is checked <ArrowIcon />
            </a>
          </figcaption>
        </figure>
      )}

      <PageContents label="Methodology sections" items={pageSections} className="method-contents" />

      <section className="method" aria-labelledby="method-title">
        <div className="method-head">
          <h2 id="method-title">How the research is checked.</h2>
          <p>
            Each report names its sources, explains its method and states the limits that affect its
            findings. Interpretation stays separate from fact.
          </p>
        </div>
        <div className="method-body">
          <MethodRail items={railItems} label="The five research rules" />
          <ol className="method-clauses">
            {clauses.map((clause) => (
              <li key={clause.id} id={clause.id}>
                <div className="clause-text">
                  <h3>{clause.label}</h3>
                  <p className="clause-rule">{clause.rule}</p>
                  <p className="clause-detail">{clause.detail}</p>
                </div>
                {trace && (
                  <p className="clause-note">
                    <strong>Applied in {trace.publication.reference}</strong> {clause.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="method-close" aria-labelledby="method-close-title">
        <div>
          <h2 id="method-close-title">Read the research.</h2>
          <p>Read a report with its sources and limitations alongside it.</p>
        </div>
        <div className="method-close-actions">
          <Link className="method-link" href="/research">
            Check out our research <ArrowIcon />
          </Link>
          <Link className="method-link" href="/about#contact">
            Question a finding or flag a correction <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
