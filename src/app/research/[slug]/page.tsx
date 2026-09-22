import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { CitationSidebar } from "@/components/citation-sidebar";
import { PageHero } from "@/components/page-hero";
import { publicationBySlug, publications } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca";

export function generateStaticParams() {
  return publications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = publicationBySlug(slug);
  if (!publication) return {};
  return {
    title: publication.title,
    description: publication.summary,
    alternates: { canonical: `/research/${publication.slug}` },
    openGraph: {
      type: "article",
      title: publication.title,
      description: publication.summary,
      publishedTime: publication.publishedAt,
      authors: publication.authors,
    },
  };
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = publicationBySlug(slug);
  if (!publication) notFound();

  const area = researchAreas.find((item) => item.slug === publication.area);
  const originLabel = publication.origin === "independent" ? "Independent research by Tharros Canada" : "Client-commissioned research";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: publication.title,
    description: publication.summary,
    datePublished: publication.publishedAt,
    author: publication.authors.map((name) => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: "Tharros Canada", url: "https://tharros.ca" },
    articleSection: area?.name ?? publication.area,
    citation: publication.sources.map((source) => source.url),
  };

  return (
    <>
      <PageHero variant="document" title={publication.title} description={publication.summary} />
      <div className="section research-article-layout">
      <article className="research-article">
        <header className="research-article-meta">
          <dl>
            <div><dt>Format</dt><dd>{publication.type}</dd></div>
            <div><dt>Origin</dt><dd>{originLabel}</dd></div>
            <div><dt>Expertise</dt><dd>{area?.name ?? publication.area}</dd></div>
            <div><dt>Published</dt><dd><time dateTime={publication.publishedAt}>{new Date(publication.publishedAt).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time></dd></div>
            <div><dt>Authors</dt><dd>{publication.authors.join(", ")}</dd></div>
          </dl>
          {publication.pdfUrl && <a className="text-link" href={publication.pdfUrl}>Download report <ArrowIcon /></a>}
        </header>

        <section>
          <h2>Executive summary</h2>
          <p className="research-lede">{publication.executiveSummary}</p>
        </section>

        <section>
          <h2>Key findings</h2>
          <ol className="research-findings">{publication.keyFindings.map((finding) => <li key={finding}>{finding}</li>)}</ol>
        </section>

        {(publication.sections ?? []).map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}

        <section><h2>Methodology</h2><p>{publication.methodology}</p></section>
        <section><h2>Limitations</h2><ul className="research-limitations">{publication.limitations.map((item) => <li key={item}>{item}</li>)}</ul></section>

        <section>
          <h2>Sources</h2>
          <ol className="research-sources">
            {publication.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.publisher}: {source.title}</a>
                {(source.period || source.retrievedAt) && <small>{[source.period, source.retrievedAt && `Retrieved ${source.retrievedAt}`].filter(Boolean).join(" · ")}</small>}
              </li>
            ))}
          </ol>
        </section>

        <section className="research-citation">
          <h2>Suggested citation</h2>
          <p>{publication.suggestedCitation}</p>
        </section>

        <footer className="research-article-footer">
          <Link href="/research">Back to research archive</Link>
          <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
        </footer>
      </article>
      <CitationSidebar
        input={{
          title: publication.title,
          authors: publication.authors,
          publishedAt: publication.publishedAt,
          url: `${siteUrl}/research/${publication.slug}`,
        }}
      />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </>
  );
}
