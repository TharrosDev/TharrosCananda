import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { upcomingResearch } from "@/data/upcoming-research";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, pageMetadata } from "@/lib/site";
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
const keepRanges = (title: string) => title.replace(/(\d)-(\d)/g, "$1‑$2");

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
              Independent research on the policies, industries and ideas connecting Canada and Europe.
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
      <section className="home-issue" aria-label="Latest and upcoming research">
        <div className="home-release">
          <h2 id="release-heading">Latest release</h2>
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
        <aside className="home-upcoming" aria-labelledby="upcoming-heading">
          <h2 id="upcoming-heading">Upcoming research</h2>
          <ol className="home-upcoming-list">
            {upcomingResearch.map((topic, index) => (
              <li key={topic.id}>
                <span className="home-topic-number" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  {topic.status && <span className="home-topic-status">{topic.status}</span>}
                  <h3>{topic.title}</h3>
                </div>
              </li>
            ))}
          </ol>
          <p className="home-upcoming-note">Draft topics. Titles and scope may change.</p>
        </aside>
      </section>
      <section className="home-explore" aria-label="Explore Tharros">
        <Link href="/methodology">
          <span>Check out our methodology</span>
          <ArrowIcon />
        </Link>
        <Link href="/research-areas">
          <span>Check out our research areas</span>
          <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
