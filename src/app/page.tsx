import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowIcon } from "@/components/icons";
import { authorByName } from "@/data/authors";
import { publications } from "@/data/publications";
import { eligibleWork, publishing } from "@/data/publishing";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, pageMetadata } from "@/lib/site";
import "./home.css";

const homeTitle = `${publishing.name} | Undergraduate research showcase & database`;
export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description: publishing.description,
    path: "/",
  }),
  title: { absolute: homeTitle },
};
const keepRanges = (title: string) => title.replace(/(\d)-(\d)/g, "$1‑$2");
const process = [
  { title: "Find", detail: "Search inside the work, or explore by subject and format." },
  { title: "Read", detail: "Open the paper, inspect its evidence and download the original PDF." },
  {
    title: "Reference",
    detail: "Use Cite for a ready-made citation and Copy link for a stable URL.",
  },
  {
    title: "Share",
    detail:
      "Link the work or its author profile in a résumé, application or professional portfolio.",
  },
];

export default function HomePage() {
  const lead = [...publications].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  const leadAsset = lead && reportAsset(lead.slug);
  return (
    <>
      <section className="home-masthead" aria-labelledby="home-title">
        <div className="home-hero-stage">
          <div className="home-hero-slash" aria-hidden="true">
            <span />
          </div>
          <h1 id="home-title">
            <span className="home-title-line">
              <span className="home-title-word">Tharros</span>
            </span>
            <span className="home-title-line home-title-line-canada">
              <span className="home-title-word">Canada</span>
            </span>
          </h1>
        </div>
        <div className="home-hero-band">
          <div className="home-hero-band-inner">
            <p>
              Independent research on the policies, industries and ideas connecting Canada and
              Europe.
            </p>
            <div className="home-masthead-actions">
              <Link className="button-primary" href="/research">
                Check out our research <ArrowIcon />
              </Link>
              <Link className="text-link" href="/about">
                About Tharros <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="home-publishing" aria-labelledby="publishing-heading">
        <h2 id="publishing-heading">{publishing.slogan}</h2>
        <div>
          <p className="home-publishing-deck">{publishing.supportingLine}</p>
          <p>
            Tharros Canada brings a research repository, professional portfolio and authored-work
            profiles together in a searchable database. Papers, research projects, policy briefs and
            data work can become something students share, reference and carry into their next
            opportunity.
          </p>
          <div className="home-showcase-actions">
            <Link className="button-primary" href="/research">
              Browse the database <ArrowIcon />
            </Link>
            <Link className="home-read-link" href="/authors">
              Explore author profiles <ArrowIcon />
            </Link>
          </div>
          <p className="home-launch-note">
            Existing work is available to explore. New student submissions are forthcoming.
          </p>
        </div>
      </section>
      <section className="home-issue" aria-label="Featured research and ways to use the database">
        <div className="home-release">
          <h2 id="release-heading">Inside the database</h2>
          {lead ? (
            <article className="home-lead-publication" aria-labelledby="latest-title">
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
                      sizes="(max-width: 640px) 84px, 150px"
                    />
                  </Link>
                </ViewTransition>
              )}
              <div className="home-publication-body">
                <div className="home-publication-meta">
                  <span>{lead.type}</span>
                  <time dateTime={lead.publishedAt}>{formatLongDate(lead.publishedAt)}</time>
                </div>
                <h3 id="latest-title">
                  <Link href={"/research/" + lead.slug}>{keepRanges(lead.title)}</Link>
                </h3>
                <p className="home-publication-byline">
                  By{" "}
                  {lead.authors.map((name, index) => {
                    const author = authorByName(name);
                    return (
                      <span key={name}>
                        {index > 0 && ", "}
                        {author ? <Link href={`/authors/${author.slug}`}>{name}</Link> : name}
                      </span>
                    );
                  })}
                </p>
                <div className="home-publication-actions">
                  <Link className="home-read-link" href={"/research/" + lead.slug}>
                    Read the report <ArrowIcon />
                  </Link>
                  {leadAsset && (
                    <a className="home-pdf-link" href={leadAsset.file} download>
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </article>
          ) : (
            <p>No research has been published yet.</p>
          )}
        </div>
        <aside className="home-upcoming" aria-labelledby="process-heading">
          <h2 id="process-heading">Work you can use and reference</h2>
          <ol className="home-upcoming-list">
            {process.map((step, index) => (
              <li key={step.title}>
                <span className="home-topic-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p className="home-step-detail">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="home-upcoming-note">
            The research stays connected to its author, sources and publication details.
          </p>
        </aside>
      </section>
      <section className="home-work" aria-label="Student work and professional author profiles">
        <div>
          <h2>Work worth sharing.</h2>
          <p>
            A paper should have somewhere to go after the grade. Tharros is designed for strong
            undergraduate work across disciplines, with clear authorship, sound sources and
            something to contribute.
          </p>
          <ul className="home-work-types">
            {eligibleWork.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
          <Link className="home-read-link" href="/submit#eligible-work">
            Prepare work for the showcase <ArrowIcon />
          </Link>
        </div>
        <div className="home-package">
          <h2>Your work, connected to you.</h2>
          <p>
            A simple, LinkedIn-style referencing profile brings an author’s work together in one
            professional home. Readers can follow the name behind a paper and explore what else they
            have written.
          </p>
          <ul>
            <li>Authored works together on a dedicated profile</li>
            <li>Publication pages with stable links and recommended citations</li>
            <li>Original PDFs, abstracts, sources and publication dates</li>
            <li>Links you can include in résumés, applications and portfolios</li>
          </ul>
          <Link className="home-read-link" href="/authors">
            See the author profiles <ArrowIcon />
          </Link>
        </div>
      </section>
      <section className="home-explore" aria-label="Explore Tharros">
        <Link href="/submit">
          <span>Showcase your work</span>
          <ArrowIcon />
        </Link>
        <Link href="/how-it-works">
          <span>See how Tharros works</span>
          <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
