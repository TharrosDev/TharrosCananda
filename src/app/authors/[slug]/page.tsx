import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { CiteButton } from "@/components/cite-button";
import { authorBySlug, authors, publicationsForAuthor } from "@/data/authors";
import { buildCitation, type CitationInput } from "@/lib/citation";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, pageMetadata, siteUrl } from "@/lib/site";
import "./author-profile.css";

export const generateStaticParams = () => authors.map((author) => ({ slug: author.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = authorBySlug((await params).slug);
  if (!author) return {};
  return {
    ...pageMetadata({
      title: author.name,
      description: `The authored work of ${author.name} on Tharros Canada, with original publications, sources and recommended citations in one shareable profile.`,
      path: `/authors/${author.slug}`,
    }),
    ...(!author.indexable ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = authorBySlug((await params).slug);
  if (!author) notFound();
  const works = publicationsForAuthor(author.slug);
  const profileUrl = `${siteUrl}/authors/${author.slug}`;
  const hasDetails = Boolean(
    author.institution || author.program || author.linkedin || author.orcid,
  );

  return (
    <div className="author-profile">
      <header className={`author-profile-header${hasDetails ? " has-details" : ""}`}>
        <nav className="author-profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/authors">Authors</Link>
          <ArrowIcon />
          <span aria-current="page">{author.name}</span>
        </nav>
        <div className="author-profile-introduction">
          <h1>{author.name}</h1>
          {author.bio ? (
            <p>{author.bio}</p>
          ) : (
            <p>
              Authored work on Tharros Canada, collected in one place to read, reference and share.
            </p>
          )}
        </div>
        {hasDetails && (
          <dl className="author-profile-details">
            {author.institution && (
              <div>
                <dt>University</dt>
                <dd>{author.institution}</dd>
              </div>
            )}
            {author.program && (
              <div>
                <dt>Program</dt>
                <dd>{author.program}</dd>
              </div>
            )}
            {author.linkedin && (
              <div>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={author.linkedin} rel="noreferrer">
                    LinkedIn profile
                  </a>
                </dd>
              </div>
            )}
            {author.orcid && (
              <div>
                <dt>ORCID</dt>
                <dd>
                  <a href={author.orcid} rel="noreferrer">
                    ORCID profile
                  </a>
                </dd>
              </div>
            )}
          </dl>
        )}
      </header>
      <section className="author-profile-share" aria-labelledby="author-profile-share-title">
        <div>
          <h2 id="author-profile-share-title">One link to authored work</h2>
          <p>
            Include this profile in a résumé, application, LinkedIn profile or professional
            portfolio. Each work below has its own publication link and citation tools.
          </p>
        </div>
        <div className="author-profile-share-link">
          <span>Profile link</span>
          <a href={profileUrl}>{profileUrl}</a>
        </div>
      </section>
      <section className="author-profile-publications" aria-labelledby="author-publications-title">
        <div className="author-profile-section-heading">
          <h2 id="author-publications-title">Authored work</h2>
          <p>
            {works.length} {works.length === 1 ? "publication" : "publications"}
          </p>
        </div>
        {works.length ? (
          <div className="author-profile-work-list">
            {works.map((publication) => {
              const asset = reportAsset(publication.slug);
              const publicationUrl = `${siteUrl}/research/${publication.slug}`;
              const citation: CitationInput = {
                title: publication.title,
                authors: publication.authors,
                publisher: publication.publisher,
                publishedAt: publication.publishedAt,
                url: publicationUrl,
                reference: publication.reference,
              };
              return (
                <article className="author-profile-work" key={publication.slug}>
                  <div className="author-profile-work-meta">
                    <span>{publication.reference}</span>
                    <time dateTime={publication.publishedAt}>
                      {formatLongDate(publication.publishedAt)}
                    </time>
                    <span>{publication.type}</span>
                  </div>
                  <div className="author-profile-work-body">
                    <h3>
                      <Link href={`/research/${publication.slug}`}>{publication.title}</Link>
                    </h3>
                    <p>{publication.summary}</p>
                    <div className="author-profile-work-actions">
                      <Link href={`/research/${publication.slug}`}>
                        Read publication <ArrowIcon />
                      </Link>
                      <CiteButton
                        input={citation}
                        slug={publication.indexable ? publication.slug : undefined}
                      />
                      {asset && (
                        <a
                          href={asset.file}
                          download
                          aria-label={`Download PDF: ${publication.title}`}
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                    <details className="author-profile-recommended-citation">
                      <summary>Recommended citation (APA)</summary>
                      <p>{buildCitation("apa", citation)}</p>
                    </details>
                    <p className="author-profile-work-link">
                      <span>Publication link</span>
                      <a href={publicationUrl}>{publicationUrl}</a>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="author-profile-empty">No publications are listed for this author yet.</p>
        )}
      </section>
    </div>
  );
}
