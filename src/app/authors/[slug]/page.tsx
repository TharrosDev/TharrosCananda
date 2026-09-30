import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { authorBySlug, authors, publicationsForAuthor } from "@/data/authors";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, pageMetadata } from "@/lib/site";
import "./author-profile.css";

export const generateStaticParams = () => authors.map((author) => ({ slug: author.slug }));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = authorBySlug((await params).slug);
  if (!author) return {};
  return {
    ...pageMetadata({
      title: author.name,
      description: `Publications by ${author.name}, with original PDFs, sources and recommended citations.`,
      path: `/authors/${author.slug}`,
    }),
    ...(!author.indexable ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function AuthorPage({ params }: Props) {
  const author = authorBySlug((await params).slug);
  if (!author) notFound();
  const works = publicationsForAuthor(author.slug);
  const hasDetails = Boolean(
    author.institution || author.program || author.linkedin || author.orcid,
  );

  return (
    <div className="author-profile">
      <header className={`author-profile-header${hasDetails ? " has-details" : ""}`}>
        <nav className="author-profile-breadcrumb" aria-label="Breadcrumb">
          <Link href="/research">Publications</Link>
          <ArrowIcon />
          <span aria-current="page">{author.name}</span>
        </nav>
        <div className="author-profile-introduction">
          <h1>{author.name}</h1>
          {author.bio ? (
            <p>{author.bio}</p>
          ) : (
            <p>
              Read the publications below, inspect their sources and download the original PDFs.
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
      <section className="author-profile-publications" aria-labelledby="author-publications-title">
        <h2 id="author-publications-title">Publications</h2>
        {works.length ? (
          <div className="author-profile-work-list">
            {works.map((publication) => {
              const asset = reportAsset(publication.slug);
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
