import type { Metadata } from "next";
import Link from "next/link";
import { formatLongDate, pageMetadata } from "@/lib/site";
import { ArrowIcon } from "@/components/icons";
import { AboutContact } from "@/components/about-contact";
import { EditorialImageSlot } from "@/components/editorial-image-slot";
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

const sections = [
  { id: "fields", label: "Research fields" },
  { id: "principles", label: "Research principles" },
  { id: "independence", label: "Independence" },
  { id: "contact", label: "Contact" },
] as const;

const contactRoutes = [
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
];

export default function AboutPage() {
  const contactEmail = researchEmail();
  const { lead, legal, profiles } = organization;
  const hasAccountability = Boolean(lead || legal || profiles.length);
  const published = [...publications].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
    <div className="about-portrait">
      <header className="about-masthead">
        <h1>A student research project. Following Canada–Europe questions.</h1>
        <p className="about-deck">
          Tharros Canada publishes independent research on the policies and industries connecting
          Canada and Europe, and examines the public evidence behind them.
        </p>
        <div className="about-opening-actions">
          <Link className="button-primary" href="/research">
            Read the research <ArrowIcon />
          </Link>
          <a className="about-check" href="#contact">
            Contact the project <ArrowIcon />
          </a>
        </div>
        <nav className="about-contents" aria-label="About sections">
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <section className="about-on-record" aria-labelledby="about-record-title">
        <div className="about-project-record">
          <h2 id="about-record-title">The project on the record.</h2>
          <dl className="about-ledger">
            <div>
              <dt>Published research</dt>
              <dd data-volatile="">
                <Link href="/research">
                  {publications.length} published {publications.length === 1 ? "report" : "reports"}
                </Link>
              </dd>
            </div>
            <div>
              <dt>Research areas</dt>
              <dd>
                <a href="#fields">{researchAreas.length} fields of inquiry</a>
              </dd>
            </div>
            <div>
              <dt>Sources in the register</dt>
              <dd>
                <Link href="/methodology#atlas-title">
                  {publicSources.length} public publishers
                </Link>
              </dd>
            </div>
          </dl>
          <p className="about-record-note">
            Each report credits its author and identifies its sources, methods and material
            limitations. The work establishes the project&rsquo;s record.
          </p>
        </div>
        <div className="about-published" data-volatile="">
          <h2>Published so far.</h2>
          {published.length > 0 ? (
            <ol className="about-publication-index">
              {published.map((publication) => (
                <li key={publication.reference}>
                  <h3>
                    <Link href={`/research/${publication.slug}`}>
                      {publication.title} <ArrowIcon />
                    </Link>
                  </h3>
                  <p className="about-publication-record">
                    {publication.reference}{" "}
                    <span>
                      · {publication.type} · {formatLongDate(publication.publishedAt)}
                    </span>
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p>No publications yet.</p>
          )}
        </div>
      </section>

      <section className="about-fields" id="fields" aria-labelledby="fields-title">
        <div className="about-field-guide-head">
          <h2 id="fields-title">The questions behind the research.</h2>
          <p>
            Select a subject to explore its questions and evidence. These fields describe the
            project&rsquo;s scope; each one shows whether work has been published yet.
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
                  <span className="about-field-status" data-volatile="">
                    {count > 0
                      ? `${count} published ${count === 1 ? "report" : "reports"}`
                      : "No published reports yet"}
                  </span>
                  <span className="about-disclosure" aria-hidden="true">
                    <svg viewBox="0 0 20 20">
                      <path d="M3 10h14" />
                      <path className="about-disclosure-vertical" d="M10 3v14" />
                    </svg>
                  </span>
                </summary>
                <div className="about-field-body">
                  <p className="about-field-scope">{area.scope}</p>
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
          Published work is counted from the archive. An open research question is not a claim that
          a report already exists.
        </p>
      </section>

      <section className="about-editorial" aria-labelledby="independence-title">
        <div className="about-independence" id="independence">
          <h2 id="independence-title">Independent from the sources it studies.</h2>
          <p>
            Tharros Canada is an independent student research project, not a government body. Naming
            a public source identifies it; it never implies endorsement or affiliation.
          </p>
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
          <Link className="about-check" href="/methodology#source-selection">
            Inspect the source-selection rules <ArrowIcon />
          </Link>
          <EditorialImageSlot slot="about" className="about-editorial-image" />
        </div>
        <div className="about-standards" id="principles">
          <h2 id="principles-title">Research you can inspect.</h2>
          <p className="about-standards-intro">
            Four principles, with a route back to the evidence, the method or the report.
          </p>
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

      <section className="about-contact-section" id="contact" aria-labelledby="contact-title">
        <header className="about-contact-lead">
          <h2 id="contact-title">An open line to the project.</h2>
          <p>
            Ask a question, identify an error or propose a contribution. Write directly to the
            editorial contact, or choose a subject below.
          </p>
          <AboutContact email={contactEmail} />
        </header>
        <ul className="about-contact-routes">
          {contactRoutes.map((route) => (
            <li key={route.title}>
              <h3>{route.title}</h3>
              <p>{route.body}</p>
              <a
                className="about-check"
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(route.subject)}`}
              >
                {route.action} <ArrowIcon />
              </a>
            </li>
          ))}
        </ul>
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
    </div>
  );
}
