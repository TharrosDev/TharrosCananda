import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CitationPanel } from "@/components/citation-panel";
import { ArrowIcon } from "@/components/icons";
import { ReportActions } from "@/components/report/report-actions";
import { ReportViewer } from "@/components/report/report-viewer";
import { allPublications, publicationBySlug } from "@/data/publications";
import type { CitationInput } from "@/lib/citation";
import { researchAreas } from "@/lib/research-areas";
import { reportContents, reportLimitations, reportSources } from "@/lib/report-sections";
import { reportAsset } from "@/lib/reports";
import { researchLicence } from "@/lib/licence";
import { isCountedSlug, publicationCounts } from "@/lib/metrics";
import { ReadTracker } from "@/components/read-tracker";
import { formatLongDate, jsonLd, pageMetadata, siteUrl } from "@/lib/site";

export const generateStaticParams = () => allPublications.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = publicationBySlug((await params).slug);
  if (!p) return {};
  const asset = reportAsset(p.slug);
  // The OG image comes from ./opengraph-image.tsx (the file convention wins over metadata images).
  const page = pageMetadata({
    title: p.title,
    description: p.summary,
    path: `/research/${p.slug}`,
    type: "article",
  });
  const base: Metadata = {
    ...page,
    openGraph: { ...page.openGraph, publishedTime: p.publishedAt, authors: p.authors },
  };
  if (!p.indexable) return { ...base, robots: { index: false, follow: false } };
  // Highwire Press tags: what Google Scholar reads to index a report and its PDF.
  return {
    ...base,
    other: {
      citation_title: p.title,
      citation_author: p.authors,
      citation_publication_date: p.publishedAt.replaceAll("-", "/"),
      citation_publisher: "Tharros Canada",
      citation_technical_report_number: p.reference,
      citation_technical_report_institution: "Tharros Canada",
      citation_language: "en",
      ...(asset ? { citation_pdf_url: `${siteUrl}${asset.file}` } : {}),
    },
  };
}

export default async function ReportPage({ params }: Props) {
  const p = publicationBySlug((await params).slug);
  if (!p) notFound();
  const asset = reportAsset(p.slug);
  const counted = isCountedSlug(p.slug);
  // Real reports always show their counts, zeros included; hidden only when the database is unreachable.
  const allCounts = counted ? await publicationCounts() : null;
  const readership = allCounts ? (allCounts[p.slug] ?? { reads: 0, citations: 0 }) : null;
  const area = researchAreas.find((a) => a.slug === p.area);
  const stableUrl = `${siteUrl}/research/id/${p.reference}`;
  const citation: CitationInput = {
    title: p.title,
    authors: p.authors,
    publishedAt: p.publishedAt,
    url: stableUrl,
    reference: p.reference,
  };
  const sources = reportSources(p);
  const limitations = reportLimitations(p);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: p.title,
    headline: p.title,
    reportNumber: p.reference,
    abstract: p.summary,
    datePublished: p.publishedAt,
    inLanguage: "en-CA",
    author: p.authors.map((name) => ({
      "@type": name === "Tharros Canada" ? "Organization" : "Person",
      name,
    })),
    publisher: { "@id": `${siteUrl}/#organization` },
    about: area?.name,
    url: `${siteUrl}/research/${p.slug}`,
    license: researchLicence.url,
    ...(asset
      ? {
          encoding: {
            "@type": "MediaObject",
            contentUrl: `${siteUrl}${asset.file}`,
            encodingFormat: "application/pdf",
          },
        }
      : {}),
    citation: p.sources.flatMap((s) => (s.url ? [s.url] : [])),
  };

  return (
    <>
      {p.specimen && (
        <div className="report-notice" role="note">
          <div>
            <strong>Example layout</strong>
            <p>
              This shows how a Tharros research report is published. Every word is lorem ipsum
              placeholder text, and the figure contains no data. It is not a publication and is kept
              out of search engines.
            </p>
          </div>
          <Link className="text-link" href="/research">
            Back to the research archive <ArrowIcon />
          </Link>
        </div>
      )}
      <header className="report-header">
        <div className="report-header-main">
          <p className="report-header-kicker">
            {p.type} ·{" "}
            {area ? <Link href={`/research?area=${area.slug}`}>{area.name}</Link> : p.area}
          </p>
          <h1>{p.title}</h1>
          {p.subtitle && <p className="report-header-subtitle">{p.subtitle}</p>}
          <p className="report-header-abstract">{p.summary}</p>
        </div>
        <div className="report-header-side">
          <dl className="report-header-meta">
            <div>
              <dt>Reference</dt>
              <dd>{p.reference}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>
                <time dateTime={p.publishedAt}>{formatLongDate(p.publishedAt)}</time>
              </dd>
            </div>
            <div>
              <dt>{p.authors.length === 1 ? "Author" : "Authors"}</dt>
              <dd>{p.authors.join(", ")}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>
                {p.origin === "independent" ? "Independent research" : "Commissioned research"}
              </dd>
            </div>
            {asset && (
              <div>
                <dt>Length</dt>
                <dd>{asset.pages} pages</dd>
              </div>
            )}
            {readership && (
              <>
                <div>
                  <dt>Views</dt>
                  <dd>{readership.reads.toLocaleString("en-CA")}</dd>
                </div>
                <div>
                  <dt>Times cited</dt>
                  <dd>{readership.citations.toLocaleString("en-CA")}</dd>
                </div>
              </>
            )}
          </dl>
          {asset && (
            <ReportActions file={asset.file} bytes={asset.bytes} url={stableUrl} title={p.title} />
          )}
        </div>
      </header>
      {asset ? (
        <ReportViewer
          file={asset.file}
          pages={asset.pages}
          title={p.title}
          contents={reportContents(p, asset.outline)}
          pageWidth={asset.width}
          pageHeight={asset.height}
        />
      ) : (
        <p className="report-pending">The PDF for this report is being prepared.</p>
      )}
      <section className="report-appendix" aria-labelledby="report-appendix-label">
        <h2 className="report-appendix-label" id="report-appendix-label">
          Sources and citation
        </h2>
        <div className="report-appendix-body">
          {sources.length > 0 && (
            <div className="report-appendix-block" id="sources">
              <h2>Sources</h2>
              <ol className="report-appendix-sources">
                {sources.map((s, i) => (
                  <li key={i}>
                    {s.publisher}.{" "}
                    {s.url ? (
                      <a href={s.url} rel="noreferrer">
                        {s.title}
                      </a>
                    ) : (
                      <em>{s.title}</em>
                    )}
                    .{s.period && ` ${s.period}.`}
                    {s.retrievedAt && ` Retrieved ${s.retrievedAt}.`}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {limitations.length > 0 && (
            <div className="report-appendix-block" id="limitations">
              <h2>Limitations</h2>
              <ul>
                {limitations.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="report-appendix-block" id="cite">
            <h2>Cite this report</h2>
            <CitationPanel input={citation} slug={counted ? p.slug : undefined} />
            <p className="report-appendix-stable">
              Stable link: <a href={stableUrl}>{stableUrl.replace(/^https?:\/\//, "")}</a>
            </p>
          </div>
          <div className="report-appendix-block report-appendix-more">
            <h2>Continue</h2>
            <ul>
              {area && (
                <li>
                  <Link href={`/research?area=${area.slug}`}>
                    More in {area.name} <ArrowIcon />
                  </Link>
                </li>
              )}
              <li>
                <Link href="/methodology">
                  How Tharros selects and checks sources <ArrowIcon />
                </Link>
              </li>
              <li>
                <Link href="/research">
                  Research archive <ArrowIcon />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
      {counted && <ReadTracker slug={p.slug} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
    </>
  );
}
