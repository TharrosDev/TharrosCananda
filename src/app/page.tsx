import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AtlanticMap } from "@/components/atlantic-map";
import { ArrowIcon } from "@/components/icons";
import { publications } from "@/data/publications";
import { reportAsset } from "@/lib/reports";
import { researchAreas } from "@/lib/research-areas";
import { services } from "@/lib/services";
import { formatMonthYear, pageMetadata } from "@/lib/site";

const homeTitle = "Tharros Canada | Independent Canada–Europe research";
export const metadata: Metadata = {
  ...pageMetadata({
    title: homeTitle,
    description:
      "Independent research firm for organizations working between Canada and Europe: custom research, market assessments and buyer and partner research on trade, defence, energy, industry and technology.",
    path: "/",
  }),
  title: { absolute: homeTitle },
};

export default function HomePage() {
  // Newest first; a `featured` report leads regardless of date.
  const researchToShow = [...publications]
    .sort(
      (a, b) =>
        Number(!!b.featured) - Number(!!a.featured) || b.publishedAt.localeCompare(a.publishedAt),
    )
    .slice(0, 3);
  const [lead, ...earlier] = researchToShow;
  const leadCover = lead && reportAsset(lead.slug)?.cover;

  return (
    <>
      <section className="home-intro">
        <div className="home-intro-grid">
          <div className="home-intro-copy">
            <h1>Independent Canada–Europe research.</h1>
            <p className="home-intro-deck">
              Custom research, market assessments and buyer and partner research on trade, defence,
              energy, industry and technology between Canada and Europe.
            </p>
            <div className="hero-actions">
              <Link className="button-primary" href="/request-research">
                Commission research <ArrowIcon />
              </Link>
              <Link className="text-link" href="/research">
                View research <ArrowIcon />
              </Link>
            </div>
          </div>
          <AtlanticMap />
        </div>
        <div className="home-intro-foot">
          <p>Canada ↔ Europe</p>
          <Link href="#start">
            Start with a question <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </section>

      <section className="section home-services" id="start">
        <div className="home-section-lead">
          <h2>Start with a question.</h2>
          <p>Every engagement is scoped and priced per case, in writing, before work begins.</p>
          <Link className="text-link" href="/research-services">
            All services <ArrowIcon />
          </Link>
        </div>
        <ul className="service-catalogue" aria-label="Research services">
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

      <section className="expertise-spread">
        <div className="expertise-spread-inner">
          <div className="expertise-statement">
            <p>Research areas</p>
            <h2>Five connected fields.</h2>
            <p>Work may span more than one area.</p>
          </div>
          <div className="expertise-ledger">
            {researchAreas.map((area, index) => (
              <div key={area.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{area.name}</h3>
                <p>{area.scope}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="research-threshold">
        <div>
          <p>Recent Publications</p>
          <h2>{lead ? "Recent Releases." : "Public research."}</h2>
        </div>
        <div>
          {lead ? (
            <>
              <article className="release-lead">
                {leadCover && (
                  <Link
                    href={`/research/${lead.slug}`}
                    className="release-cover"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image src={leadCover} alt="" width={160} height={207} />
                  </Link>
                )}
                <div>
                  <p className="release-meta">
                    {lead.type} ·{" "}
                    <time dateTime={lead.publishedAt}>{formatMonthYear(lead.publishedAt)}</time>
                  </p>
                  <h3>
                    <Link href={`/research/${lead.slug}`}>{lead.title}</Link>
                  </h3>
                  <p className="release-summary">{lead.summary}</p>
                  <Link className="text-link" href={`/research/${lead.slug}`}>
                    Read the report <ArrowIcon />
                  </Link>
                </div>
              </article>
              {earlier.length > 0 && (
                <ul className="release-earlier">
                  {earlier.map((publication) => (
                    <li key={publication.slug}>
                      <Link href={`/research/${publication.slug}`}>
                        <strong>{publication.title}</strong>
                        <span>
                          {publication.type} · {formatMonthYear(publication.publishedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              <p>
                The first publications are in preparation. Each will carry named authorship,
                methodology, sources and limitations.
              </p>
              <div className="threshold-links">
                <Link className="text-link" href="/research/example-report">
                  See how a report is published <ArrowIcon />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="closing-cta">
        <h2>Have a research question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
