import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { eligibleWork, publishing } from "@/data/publishing";
import { reportAsset } from "@/lib/reports";
import { formatLongDate, pageMetadata } from "@/lib/site";
import "./home.css";

const homeTitle = `${publishing.name} | Publish beyond the classroom`;
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
  { title: "Submit", detail: "Start with original undergraduate work you’re proud of." },
  { title: "Review", detail: "An editorial decision considers quality, sourcing and suitability." },
  { title: "Refine", detail: "Complete any requested revisions. Payment follows acceptance." },
  {
    title: "Publish",
    detail: "Give your work a publication page, a PDF and a citation you can share.",
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
            Tharros is preparing to publish strong undergraduate work across disciplines, starting
            with Canadian university students. Give a paper a place in your portfolio, on LinkedIn,
            or alongside a résumé, internship or graduate-school application.
          </p>
          <Link className="home-read-link" href="/submit">
            Submission guidelines <ArrowIcon />
          </Link>
          <p className="home-launch-note">
            Submissions opening soon. Publication fee to be announced.
          </p>
        </div>
      </section>
      <section className="home-issue" aria-label="Published work and the publication process">
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
        <aside className="home-upcoming" aria-labelledby="process-heading">
          <h2 id="process-heading">From paper to publication</h2>
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
            Planned process. Screening comes before payment; submission does not guarantee
            acceptance.
          </p>
        </aside>
      </section>
      <section className="home-work" aria-label="Eligible work and the publication package">
        <div>
          <h2>Work worth sharing.</h2>
          <p>
            Political science, economics, history, philosophy, business, science, communications,
            environmental studies and beyond. The starting point is genuine undergraduate work with
            a clear argument and sound sources.
          </p>
          <ul className="home-work-types">
            {eligibleWork.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
          <Link className="home-read-link" href="/submit#eligible-work">
            Check the requirements <ArrowIcon />
          </Link>
        </div>
        <div className="home-package">
          <h2>A publication you can point to.</h2>
          <p>The planned publication package gives accepted work a professional home:</p>
          <ul>
            <li>A dedicated publication page and stable URL</li>
            <li>A professionally prepared PDF</li>
            <li>Your author name and publication date</li>
            <li>An abstract, references and recommended citation</li>
            <li>A shareable page for your portfolio</li>
            <li>An author profile with the details you choose to provide</li>
          </ul>
        </div>
      </section>
      <section className="home-explore" aria-label="Explore Tharros">
        <Link href="/submit">
          <span>Prepare your submission</span>
          <ArrowIcon />
        </Link>
        <Link href="/how-it-works">
          <span>See how publishing works</span>
          <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
