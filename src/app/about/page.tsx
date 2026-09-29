import type { Metadata } from "next";
import Link from "next/link";
import { formatLongDate, pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { AboutContact } from "@/components/about-contact";
import { organization } from "@/data/organization";
import { publications } from "@/data/publications";
import { publicSources } from "@/data/sources";
import { researchEmail } from "@/lib/contact";
import { researchAreas } from "@/lib/research-areas";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Tharros Canada is an independent student research project publishing sourced reports on Canada–Europe policy, industry and the public evidence behind them.",
  path: "/about",
});

const principles = [
  {
    title: "Start with the question.",
    body: "Each report defines the question it can answer and the evidence needed to investigate it.",
    label: "Research archive",
    href: "/research",
  },
  {
    title: "Separate fact from inference.",
    body: "Material facts are sourced and dated. Interpretation is identified. Unresolved uncertainty remains visible.",
    label: "Human verification",
    href: "/methodology#human-research",
  },
  {
    title: "Make the work inspectable.",
    body: "Public research identifies authorship, publication date, methodology, sources and material limitations.",
    label: "A worked source trace",
    href: "/methodology#trace-caption",
  },
  {
    title: "Stay relevant.",
    body: "Research is organized around the question, not the volume of material collected.",
    label: "Fitness for use",
    href: "/methodology#fitness",
  },
];

export default function AboutPage() {
  const contactEmail = researchEmail();
  const { lead, legal, profiles } = organization;
  const hasAccountability = Boolean(lead || legal || profiles.length);
  const latest = [...publications].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
  const profileLinks = (items: { label: string; url: string }[]) => (
    <p className="about-links">
      {items.map((link, index) => (
        <span key={link.url}>
          {index > 0 && " · "}
          <a href={link.url} target="_blank" rel="noreferrer">
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </span>
      ))}
    </p>
  );

  return (
    <>
      <header className="about-masthead">
        <h1>
          A student research project.
          <br />
          Canada and Europe,
          <br />
          question by question.
        </h1>
        <div className="about-introduction">
          <p className="about-deck">
            Tharros Canada is an independent student research project. It publishes reports on the
            policies and industries connecting Canada and Europe, and examines the public evidence
            behind them.
          </p>
          <div className="about-opening-actions">
            <Link className="button-primary" href="/research">
              Read the research <ArrowIcon />
            </Link>
            <a className="about-check" href="#fields">
              Explore the questions <ArrowIcon />
            </a>
          </div>
        </div>
        <dl className="about-ledger" aria-label="The project on the record">
          <div>
            <dt>Published research</dt>
            <dd className="about-count" data-volatile="">
              {publications.length}
            </dd>
            <dd data-volatile="">
              {latest ? (
                <>
                  Latest: <Link href={`/research/${latest.slug}`}>{latest.reference}</Link> ·{" "}
                  {formatLongDate(latest.publishedAt)}
                </>
              ) : (
                "No publications yet."
              )}
            </dd>
          </div>
          <div>
            <dt>Research areas</dt>
            <dd className="about-count">{researchAreas.length}</dd>
            <dd>
              <a href="#fields">Explore the fields below</a>
            </dd>
          </div>
          <div>
            <dt>Sources in the register</dt>
            <dd className="about-count">{publicSources.length}</dd>
            <dd>
              <Link href="/methodology#atlas-title">Inspect the public-source register</Link>
            </dd>
          </div>
        </dl>
      </header>

      <nav className="about-contents" aria-label="About sections">
        <span>On this page</span>
        <ul>
          <li>
            <a href="#fields">Research fields</a>
          </li>
          <li>
            <a href="#principles">Research principles</a>
          </li>
          <li>
            <a href="#independence">Independence</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
      </nav>

      <section className="about-section about-fields" id="fields" aria-labelledby="fields-title">
        <div className="about-section-head">
          <h2 id="fields-title">The questions behind the research.</h2>
          <p>
            Five fields, each with its own questions and evidence. Open a field to explore what it
            can investigate.
          </p>
        </div>
        <div className="about-field-register">
          {researchAreas.map((area, index) => {
            const count = publications.filter(
              (publication) => publication.area === area.slug,
            ).length;
            return (
              <details
                className="about-field"
                key={area.slug}
                open={index === 0}
                id={`field-${area.slug}`}
              >
                <summary>
                  <h3>{area.name}</h3>
                  <p>{area.scope}</p>
                  <span className="about-disclosure" aria-hidden="true">
                    <svg viewBox="0 0 20 20">
                      <path d="M3 10h14" />
                      <path className="about-disclosure-vertical" d="M10 3v14" />
                    </svg>
                  </span>
                </summary>
                <div className="about-field-body">
                  <div className="about-field-questions">
                    <h4>Questions this field can investigate</h4>
                    <ul>
                      {area.questions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="about-field-evidence">
                    <h4>Evidence it can draw on</h4>
                    <ul>
                      {area.evidence.map((evidence) => (
                        <li key={evidence}>{evidence}</li>
                      ))}
                    </ul>
                    <Link className="about-check" href="/methodology#atlas-title">
                      How sources are selected <ArrowIcon />
                    </Link>
                  </div>
                  <div className="about-field-publications" data-volatile="">
                    <p>
                      {count > 0
                        ? `${count} published ${count === 1 ? "report" : "reports"} in this field.`
                        : "No published research in this field yet."}
                    </p>
                    <Link
                      className="about-check"
                      href={count > 0 ? `/research?area=${area.slug}` : "/research"}
                    >
                      {count > 0 ? `Read ${area.name} research` : "Browse the research archive"}{" "}
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        <p className="about-register-note">
          These fields describe the project&rsquo;s scope. Published work is counted from the
          archive; an open research question is not a claim that a report already exists.
        </p>
      </section>

      <section className="about-standards band" id="principles" aria-labelledby="principles-title">
        <div className="about-standards-inner">
          <div className="about-standards-lead">
            <h2 id="principles-title">Research you can inspect.</h2>
            <p>
              Research principles matter when a reader can see them in the work. Each one has a
              route back to the evidence, the method or the report.
            </p>
            <Link className="about-check" href="/methodology">
              Read the methodology <ArrowIcon />
            </Link>
          </div>
          <ol className="about-principles">
            {principles.map((principle, index) => (
              <li key={principle.title} id={index === 0 ? "method" : undefined}>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
                <Link className="about-check" href={principle.href}>
                  {principle.label} <ArrowIcon />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="about-section about-independence"
        id="independence"
        aria-labelledby="independence-title"
      >
        <div className="about-independence-lead">
          <h2 id="independence-title">Independent from the sources it studies.</h2>
          <p>
            Tharros Canada is an independent student research project, not a government body. Naming
            a public source identifies it; it never implies endorsement or affiliation.
          </p>
        </div>
        <div className="about-boundaries">
          <div>
            <h3>What Tharros publishes</h3>
            <ul>
              <li>Reports on Canada–Europe policy and industry questions</li>
              <li>Data notes on the fitness of public evidence</li>
              <li>Sources, methods and material limitations alongside each report</li>
            </ul>
          </div>
          <div>
            <h3>Outside the boundary</h3>
            <ul>
              <li>Legal, tax, regulatory, lobbying or investment advice</li>
              <li>Endorsement by, or affiliation with, the sources it names</li>
            </ul>
          </div>
        </div>
      </section>

      <section
        className="about-section about-contact-section"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="about-contact-lead">
          <h2 id="contact-title">An open line to the project.</h2>
          <p>
            Questions, corrections and collaboration belong in the same conversation as the
            research.
          </p>
          <AboutContact email={contactEmail} />
        </div>
        <div className="about-contact-routes">
          {[
            {
              title: "Ask about the research",
              body: "Name the report or research question you would like to discuss.",
              subject: "Research question",
              action: "Email a question",
            },
            {
              title: "Flag a correction",
              body: "Include the report reference, page or passage, and a source for the correction.",
              subject: "Research correction",
              action: "Email a correction",
            },
            {
              title: "Explore a collaboration",
              body: "Describe the topic, your proposed contribution and the evidence available.",
              subject: "Research collaboration",
              action: "Email about collaboration",
            },
          ].map((route) => (
            <div key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <a
                className="about-check"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(route.subject)}`}
              >
                {route.action} <ArrowIcon />
              </a>
            </div>
          ))}
        </div>
        {hasAccountability && (
          <div className="about-accountability">
            <h3>Project accountability</h3>
            {lead && (
              <div className="about-lead">
                <h4>{lead.name}</h4>
                <p className="about-lead-role">{lead.role}</p>
                <p>{lead.bio}</p>
                {lead.links.length > 0 && profileLinks(lead.links)}
              </div>
            )}
            {legal && (
              <dl className="company-details">
                <div>
                  <dt>Legal name</dt>
                  <dd>{legal.legalName}</dd>
                </div>
                {legal.jurisdiction && (
                  <div>
                    <dt>Jurisdiction</dt>
                    <dd>{legal.jurisdiction}</dd>
                  </div>
                )}
                {legal.registration && (
                  <div>
                    <dt>Registration</dt>
                    <dd>{legal.registration}</dd>
                  </div>
                )}
                {legal.address && (
                  <div>
                    <dt>Address</dt>
                    <dd>{legal.address}</dd>
                  </div>
                )}
              </dl>
            )}
            {profiles.length > 0 && profileLinks(profiles)}
          </div>
        )}
      </section>
    </>
  );
}
