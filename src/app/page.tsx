import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { AtlanticMap } from "@/components/atlantic-map";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
import { researchAreas } from "@/lib/research-areas";
import { commissionPrivacy, services } from "@/lib/services";
import { formatLongDate, formatMonthYear, pageMetadata } from "@/lib/site";
import "./home.css";

const homeTitle = "Tharros Canada | Independent research across Canada and Europe";
export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      "Independent research institute working across Canada and Europe: published research on trade, defence, energy, industry and technology, and assessments of the public data behind it. Research can also be commissioned.",
    path: "/",
  }),
  title: { absolute: homeTitle },
};

// Non-breaking hyphens keep year ranges like 2017-2024 on one line.
const keepRanges = (title: string) => title.replace(/(\d)-(\d)/g, "$1‑$2");

export default function HomePage() {
  // Newest first; a `featured` report leads regardless of date.
  const researchToShow = [...publications]
    .sort(
      (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) || b.publishedAt.localeCompare(a.publishedAt),
    )
    .slice(0, 3);
  const [lead, ...earlier] = researchToShow;
  const leadAsset = lead && reportAsset(lead.slug);
  // The summary's first sentence as a teaser; the full summary is on the report page.
  const leadTeaser = lead?.summary.split(/(?<=[.?!])\s+(?=[A-Z])/)[0].replace(/[.?!]$/, "");
  const perArea = (slug: string) => publications.filter((p) => p.area === slug).length;

  return (
    <>
      <section className="home-front" aria-labelledby="home-title">
        <div className="home-front-grid">
          <div className="home-front-copy">
            <h1 id="home-title">Independent research across Canada and Europe.</h1>
            <p className="home-front-deck">
              Published research on trade, defence, energy, industry and technology, and notes on
              whether the public data behind it holds up. Questions can also be commissioned.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/research">
                Read the research <ArrowIcon />
              </Link>
              <Link className="text-link" href="/research-services">
                Commission research <ArrowIcon />
              </Link>
            </div>
          </div>

          <section className="home-release" aria-labelledby="release-heading">
            <div className="home-release-bar">
              <h2 id="release-heading">{lead ? "Latest release" : "Public research."}</h2>
              {lead && (
                <span>
                  {lead.reference} · {lead.type}
                </span>
              )}
            </div>
            {lead ? (
              <article className="home-release-sheet">
                {leadAsset && (
                  <ViewTransition name={`cover-${lead.slug}`} share="cover">
                    <Link
                      href={`/research/${lead.slug}`}
                      className="home-release-cover"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={leadAsset.cover}
                        alt=""
                        width={816}
                        height={1056}
                        sizes="(max-width: 700px) 40vw, 220px"
                        priority
                      />
                    </Link>
                  </ViewTransition>
                )}
                <div className="home-release-body">
                  <h3>
                    <Link href={`/research/${lead.slug}`}>{keepRanges(lead.title)}</Link>
                  </h3>
                  <p className="home-release-summary">
                    {leadTeaser}… <Link href={`/research/${lead.slug}`}>Read more</Link>
                  </p>
                </div>
                <dl className="home-release-ledger">
                  <div>
                    <dt>Published</dt>
                    <dd>
                      <time dateTime={lead.publishedAt}>{formatLongDate(lead.publishedAt)}</time>
                    </dd>
                  </div>
                </dl>
                <div className="home-release-actions">
                  <Link className="button-secondary" href={`/research/${lead.slug}`}>
                    Read the report <ArrowIcon />
                  </Link>
                  {leadAsset && (
                    <a className="text-link" href={leadAsset.file} download>
                      Download PDF · {Math.round(leadAsset.bytes / 1024)} KB
                    </a>
                  )}
                </div>
              </article>
            ) : (
              <div className="home-release-empty">
                <p>
                  The first publications are in preparation. Each will carry named authorship,
                  methodology, sources and limitations.
                </p>
                <Link className="text-link" href="/research/example-report">
                  See how a report is published <ArrowIcon />
                </Link>
              </div>
            )}
            {earlier.length > 0 && (
              <ol className="home-release-earlier" aria-label="Earlier releases">
                {earlier.map((publication) => (
                  <li key={publication.slug}>
                    <Link href={`/research/${publication.slug}`}>
                      <span>{publication.reference}</span>
                      <strong>{keepRanges(publication.title)}</strong>
                      <span>
                        {publication.type} · {formatMonthYear(publication.publishedAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </section>

      <section className="home-field" id="areas" aria-labelledby="areas-heading">
        <div className="home-field-grid">
          <div className="home-field-map">
            <h2 id="areas-heading">Five connected fields.</h2>
            <p>Work may span more than one area.</p>
            <AtlanticMap />
          </div>
          <ul className="home-field-areas">
            {researchAreas.map((area) => {
              const count = perArea(area.slug);
              return (
                <li key={area.slug}>
                  <h3>
                    {count > 0 ? (
                      <Link href={`/research?area=${area.slug}`}>{area.name}</Link>
                    ) : (
                      area.name
                    )}
                  </h3>
                  <p>{area.scope}</p>
                  {count > 0 && (
                    <span className="home-field-count">
                      {count} {count === 1 ? "publication" : "publications"}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section
        className="section home-commission"
        id="commission"
        aria-labelledby="commission-heading"
      >
        <div className="home-commission-head">
          <h2 id="commission-heading">Commissioned research.</h2>
          <p>
            Set a question and Tharros answers it with the same sources and method. Every commission
            is scoped and priced in writing before work begins.
          </p>
          <p>{commissionPrivacy}</p>
          <Link className="text-link" href="/research-services">
            Commission research <ArrowIcon />
          </Link>
        </div>
        <ul className="home-commission-list" aria-label="What can be commissioned">
          {services.map((service) => (
            <li key={service.slug}>
              <Link href={`/research-services#${service.slug}`}>
                <h3>{service.name}</h3>
                <p>{service.question}</p>
                <ArrowIcon />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
