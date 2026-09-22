import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { ReportActions } from "@/components/report/report-actions";
import { ReportViewer } from "@/components/report/report-viewer";
import { allPublications, publicationBySlug } from "@/data/publications";
import type { CitationInput } from "@/lib/citation";
import { researchAreas } from "@/lib/research-areas";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, jsonLd, siteUrl } from "@/lib/site";

export const generateStaticParams = () => allPublications.map((p) => ({ slug: p.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = publicationBySlug((await params).slug);
  if (!p) return {};
  const asset = reportAsset(p.slug);
  // The OG image comes from ./opengraph-image.tsx (the file convention wins over metadata images).
  const base: Metadata = {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/research/${p.slug}` },
    openGraph: { type: "article", title: p.title, description: p.summary, publishedTime: p.publishedAt, authors: p.authors },
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
  const area = researchAreas.find((a) => a.slug === p.area);
  const stableUrl = `${siteUrl}/research/id/${p.reference}`;
  const citation: CitationInput = { title: p.title, authors: p.authors, publishedAt: p.publishedAt, url: stableUrl, reference: p.reference };
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: p.title,
    headline: p.title,
    reportNumber: p.reference,
    abstract: p.summary,
    datePublished: p.publishedAt,
    inLanguage: "en-CA",
    author: p.authors.map((name) => ({ "@type": name === "Tharros Canada" ? "Organization" : "Person", name })),
    publisher: { "@type": "Organization", name: "Tharros Canada", url: siteUrl },
    about: area?.name,
    url: `${siteUrl}/research/${p.slug}`,
    ...(asset ? { encoding: { "@type": "MediaObject", contentUrl: `${siteUrl}${asset.file}`, encodingFormat: "application/pdf" } } : {}),
    citation: p.sources.flatMap((s) => (s.url ? [s.url] : [])),
  };

  return (
    <>
      {p.specimen && (
        <div className="report-notice" role="note">
          <div>
            <strong>Example layout</strong>
            <p>
              This shows how a Tharros research report is published. Every word is lorem ipsum placeholder text, and the figure
              contains no data. It is not a publication and is kept out of search engines.
            </p>
          </div>
          <Link className="text-link" href="/research">
            Back to the research archive <ArrowIcon />
          </Link>
        </div>
      )}
      <header className="report-header">
        <p className="report-header-kicker">
          {p.type} · {area?.name ?? p.area}
        </p>
        <h1>{p.title}</h1>
        {p.subtitle && <p className="report-header-subtitle">{p.subtitle}</p>}
        <dl className="report-header-meta">
          <div><dt>Reference</dt><dd>{p.reference}</dd></div>
          <div><dt>Published</dt><dd><time dateTime={p.publishedAt}>{formatLongDate(p.publishedAt)}</time></dd></div>
          <div><dt>Authors</dt><dd>{p.authors.join(", ")}</dd></div>
          {asset && <div><dt>Length</dt><dd>{asset.pages} pages</dd></div>}
        </dl>
        <p className="report-header-abstract">{p.summary}</p>
        {asset && <ReportActions file={asset.file} bytes={asset.bytes} citation={citation} url={stableUrl} title={p.title} />}
      </header>
      {asset ? (
        <ReportViewer file={asset.file} pages={asset.pages} title={p.title} />
      ) : (
        <p className="report-pending">The PDF for this report is being prepared.</p>
      )}
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    </>
  );
}
