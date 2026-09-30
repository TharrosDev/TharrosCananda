import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { authors, publicationsForAuthor } from "@/data/authors";
import { pageMetadata } from "@/lib/site";
import "./authors.css";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Authors",
    description:
      "Explore author profiles on Tharros Canada, with authored work, original publications and citation tools in one shareable place.",
    path: "/authors",
  }),
  robots: { index: false, follow: false },
};

export default function AuthorsPage() {
  return (
    <div className="authors-page">
      <header className="authors-header">
        <h1>Authors.</h1>
        <div className="authors-introduction">
          <p>
            A profile brings authored work together in one place. Explore publications, follow their
            sources and find citations, with a shareable link for résumés, applications and
            professional portfolios.
          </p>
          <Link href="/research" className="authors-database-link">
            Explore the research database <ArrowIcon />
          </Link>
        </div>
      </header>
      <section aria-label="Author directory">
        {authors.length ? (
          <ul className="authors-list">
            {authors.map((author) => {
              const works = publicationsForAuthor(author.slug);
              const types = [...new Set(works.map((work) => work.type))];
              return (
                <li key={author.slug} className="authors-entry">
                  <div className="authors-entry-introduction">
                    <h2>
                      <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                    </h2>
                    {author.bio && <p>{author.bio}</p>}
                    {(author.institution || author.program) && (
                      <p>{[author.institution, author.program].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <div className="authors-entry-work">
                    <p>
                      {works.length} {works.length === 1 ? "authored work" : "authored works"}
                    </p>
                    {types.length > 0 && <p className="authors-entry-types">{types.join(" · ")}</p>}
                    <Link href={`/authors/${author.slug}`}>
                      View profile and work <ArrowIcon />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="authors-empty">Author profiles will appear here as work is published.</p>
        )}
      </section>
    </div>
  );
}
