import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { organization } from "@/data/organization";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "About Tharros Canada's independent research on Canada–Europe relations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();
  const { lead, legal, profiles } = organization;
  // Until accountability details are verified, contact sits with Independence rather than in a near-empty section of its own.
  const hasAccountability = Boolean(lead || legal || profiles.length);
  const contactLine = (
    <p>
      Research questions and requests: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
    </p>
  );
  const links = (items: { label: string; url: string }[]) => (
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
      <header className="about-hero">
        <p>About Tharros Canada</p>
        <h1>Independent research focused on Canada and Europe.</h1>
        <div>
          <p>
            Tharros studies the trade, policy, industry and organizations connecting both markets.
          </p>
          <Link href="#principles">
            Research principles <span aria-hidden="true">↓</span>
          </Link>
        </div>
      </header>
      <section className="about-thesis" id="relationship">
        <div>
          <span>CA</span>
          <i aria-hidden="true" />
          <span>EU</span>
        </div>
        <p>
          The work brings together public data, policy, procurement and company records from both
          regions.
        </p>
      </section>
      <section className="section about-principles" id="principles">
        <div className="about-principles-lead">
          <h2>Research principles.</h2>
          <p>Sources, interpretation and limitations remain visible.</p>
        </div>
        <ol>
          <li id="method">
            <span>01</span>
            <h3>Start with the decision.</h3>
            <p>
              The deliverable, source route, exclusions, timing and price are agreed in writing
              before research begins.
            </p>
          </li>
          <li>
            <span>02</span>
            <h3>Separate fact from inference.</h3>
            <p>
              Material facts are sourced and dated. Interpretation is identified. Unresolved
              uncertainty remains visible.
            </p>
          </li>
          <li id="accountability">
            <span>03</span>
            <h3>Make the work inspectable.</h3>
            <p>
              Public research identifies authorship, publication date, methodology, sources and
              material limitations.
            </p>
          </li>
          <li>
            <span>04</span>
            <h3>Stay relevant.</h3>
            <p>Research is organized around the question, not the volume of material collected.</p>
          </li>
        </ol>
      </section>
      <section className="about-independence" id="independence">
        <div>
          <p>Independence</p>
          <h2>Independent from the sources it studies.</h2>
        </div>
        <div>
          <p>
            Tharros Canada is not a government body or think tank. Source names do not imply
            endorsement or affiliation.
          </p>
          <p>Tharros does not provide legal, tax, regulatory, lobbying or investment advice.</p>
          {!hasAccountability && (
            <div className="about-contact" id="contact">
              {contactLine}
            </div>
          )}
        </div>
      </section>
      {hasAccountability && (
        <section className="about-independence about-accountability" id="contact">
          <div>
            <p>Accountability</p>
            <h2>{lead ? "Who is accountable." : "Contact."}</h2>
          </div>
          <div>
            <div className="about-contact">
              {lead && (
                <div className="about-lead">
                  <h3>{lead.name}</h3>
                  <p className="about-lead-role">{lead.role}</p>
                  <p>{lead.bio}</p>
                  {lead.links.length > 0 && links(lead.links)}
                </div>
              )}
              {contactLine}
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
              {profiles.length > 0 && links(profiles)}
            </div>
          </div>
        </section>
      )}
      <section className="closing-cta">
        <h2>Have a question that needs research?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
