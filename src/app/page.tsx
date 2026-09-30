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
        <div className="home-introduction">
          <h1 id="home-title">
            Tharros
            <span>
              Canada<span className="home-title-stop">.</span>
            </span>
          </h1>
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
        <div className="home-connections" aria-hidden="true">
          <svg viewBox="0 0 720 420" focusable="false">
            <image href="/atlantic-map.svg" width="720" height="420" />
            <g className="home-connection-base">
              <path d="M67 235 C240 80 470 80 616 186" />
              <path d="M67 235 C240 185 470 170 616 186" />
              <path d="M67 235 C240 315 470 290 616 186" />
            </g>
            <g className="home-connection-drawing">
              <path pathLength="1" d="M67 235 C240 80 470 80 616 186" />
              <path pathLength="1" d="M67 235 C240 185 470 170 616 186" />
              <path pathLength="1" d="M67 235 C240 315 470 290 616 186" />
            </g>
            <circle className="home-connection-node" cx="67" cy="235" r="5" />
            <circle className="home-connection-node" cx="616" cy="186" r="5" />
          </svg>
          <div className="home-connection-labels">
            <span>Canada</span>
            <span>Europe</span>
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
