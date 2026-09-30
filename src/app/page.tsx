import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { EditorialImageSlot } from "@/components/editorial-image-slot";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
import { researchAreas } from "@/lib/research-areas";
import { formatLongDate, formatMonthYear, pageMetadata } from "@/lib/site";
import "./home.css";

const homeTitle = "Tharros Canada | Independent research across Canada and Europe";
export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      "Independent research across Canada and Europe. Read sourced reports on policy, trade, defence, industry and the public data behind them.",
    path: "/",
  }),
  title: { absolute: homeTitle },
};

// Non-breaking hyphens keep year ranges together in publication titles.
const keepRanges = (title: string) => title.replace(/(\d)-(\d)/g, "$1‑$2");

export default function HomePage() {
  const researchToShow = [...publications]
    .sort(
      (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) || b.publishedAt.localeCompare(a.publishedAt),
    )
    .slice(0, 3);
  const [lead, ...earlier] = researchToShow;
  const leadAsset = lead && reportAsset(lead.slug);
  const perArea = (slug: string) => publications.filter((publication) => publication.area === slug);

  return (
    <>
      <section className="home-masthead" aria-labelledby="home-title">
        <h1 id="home-title">
          Research,
          <span>across borders.</span>
        </h1>
        <div className="home-masthead-bottom">
          <p>
            An independent student research project exploring the policies, industries and public
            evidence connecting <strong>Canada and Europe.</strong>
          </p>
          <div className="home-masthead-actions">
            <Link className="button-primary" href="/research">
              Read the research <ArrowIcon />
            </Link>
            <Link className="text-link" href="/about">
              Meet the project <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="home-issue" aria-labelledby="release-heading">
        <div className="home-release">
          <div className="home-issue-heading">
            <h2 id="release-heading">{lead ? "Latest release" : "Public research."}</h2>
            <Link href="/research">
              The archive <ArrowIcon />
            </Link>
          </div>
          {lead ? (
            <article className="home-lead-publication">
              <div className="home-publication-record">
                <span>{lead.reference}</span>
                <span>{lead.type}</span>
                <time dateTime={lead.publishedAt}>{formatLongDate(lead.publishedAt)}</time>
              </div>
              <div className="home-publication-opening">
                <h3>
                  <Link href={"/research/" + lead.slug}>{keepRanges(lead.title)}</Link>
                </h3>
                {leadAsset && (
                  <ViewTransition name={"cover-" + lead.slug} share="cover">
                    <Link
                      href={"/research/" + lead.slug}
                      className="home-publication-cover"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={leadAsset.cover}
                        alt=""
                        width={816}
                        height={1056}
                        sizes="(max-width: 640px) 64px, 100px"
                        preload
                      />
                    </Link>
                  </ViewTransition>
                )}
              </div>
              <p className="home-publication-summary">{lead.summary}</p>
              <div className="home-publication-actions">
                <Link className="home-read-link" href={"/research/" + lead.slug}>
                  Read the report <ArrowIcon />
                </Link>
                {leadAsset && (
                  <a className="home-pdf-link" href={leadAsset.file} download>
                    Download PDF · {leadAsset.pages} pages · {Math.round(leadAsset.bytes / 1024)} KB
                  </a>
                )}
              </div>
            </article>
          ) : (
            <p className="home-publication-summary">
              The first publications are in preparation. Each will carry named authorship,
              methodology, sources and limitations.
            </p>
          )}

          <EditorialImageSlot slot="home" className="home-issue-image" />

          {earlier.length > 0 && (
            <ol className="home-release-earlier" aria-label="Earlier releases">
              {earlier.map((publication) => {
                const asset = reportAsset(publication.slug);
                return (
                  <li key={publication.slug}>
                    <div className="home-earlier-record">
                      <span>{publication.reference}</span>
                      <span>{publication.type}</span>
                      <time dateTime={publication.publishedAt}>
                        {formatMonthYear(publication.publishedAt)}
                      </time>
                    </div>
                    <h3>
                      <Link href={"/research/" + publication.slug}>
                        {keepRanges(publication.title)} <ArrowIcon />
                      </Link>
                    </h3>
                    {asset && (
                      <a className="home-pdf-link" href={asset.file} download>
                        Download PDF · {asset.pages} pages · {Math.round(asset.bytes / 1024)} KB
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        <aside className="home-project-column" aria-label="The project and its evidence">
          <div className="home-project-intro">
            <h2>
              Open questions.
              <br />
              Inspectable research.
            </h2>
            <p>
              Tharros starts with a question and follows the public evidence. Each report makes its
              sources and its limits available to the reader.
            </p>
            <Link className="home-column-link" href="/about">
              Get to know the project <ArrowIcon />
            </Link>
          </div>
          <div className="home-project-route">
            <h3>Behind a claim.</h3>
            <p>Follow a real passage into the source record that supports it.</p>
            <Link className="home-column-link" href="/methodology#worked-example">
              Inspect the evidence <ArrowIcon />
            </Link>
          </div>
          <div className="home-project-route">
            <h3>An open line.</h3>
            <p>Ask about a report, flag a correction or discuss a contribution.</p>
            <Link className="home-column-link" href="/about#contact">
              Contact the project <ArrowIcon />
            </Link>
          </div>
          <a className="home-index-jump" href="#areas">
            Find a question below <ArrowIcon />
          </a>
        </aside>
      </section>

      <section className="home-question-index" id="areas" aria-labelledby="areas-heading">
        <div className="home-index-heading">
          <h2 id="areas-heading">Five connected fields.</h2>
          <p>Open a question. See the scope and the research published so far.</p>
        </div>
        <div className="home-question-register">
          {researchAreas.map((area) => {
            const work = perArea(area.slug);
            return (
              <details className="home-question-field" key={area.slug}>
                <summary>
                  <div className="home-question-meta">
                    <h3>{area.name}</h3>
                    <span>
                      {work.length > 0
                        ? work.length + (work.length === 1 ? " publication" : " publications")
                        : "Open questions · no publications yet"}
                    </span>
                  </div>
                  <p>{area.questions[0]}</p>
                  <svg className="home-question-toggle" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M3 10h14" />
                    <path className="home-question-toggle-vertical" d="M10 3v14" />
                  </svg>
                </summary>
                <div className="home-question-body">
                  <p>{area.scope}</p>
                  <ul>
                    {area.questions.slice(1).map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                  <div className="home-question-destination">
                    {work.length > 0 ? (
                      <Link className="home-column-link" href={"/research?area=" + area.slug}>
                        Read {area.name} research <ArrowIcon />
                      </Link>
                    ) : (
                      <>
                        <span>No published research in this field yet.</span>
                        <Link className="home-column-link" href={"/about#field-" + area.slug}>
                          Explore the field <ArrowIcon />
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <section className="home-method-close" aria-labelledby="home-method-heading">
        <h2 id="home-method-heading">The method stays visible.</h2>
        <p>
          <strong>Source the facts. Separate interpretation. State the limits.</strong> Read the
          evidence alongside each conclusion, and see what it can support.
        </p>
        <div className="home-method-actions">
          <Link className="home-read-link" href="/methodology">
            Explore the methodology <ArrowIcon />
          </Link>
          <Link className="text-link" href="/research">
            Choose a report <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
