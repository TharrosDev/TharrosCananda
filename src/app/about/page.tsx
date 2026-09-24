import type { Metadata } from "next";
import { formatLongDate, pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ROUTE } from "@/components/atlantic-map";
import { ArrowIcon } from "@/components/icons";
import { organization } from "@/data/organization";
import { publications } from "@/data/publications";
import { publicSources } from "@/data/sources";
import { researchEmail } from "@/lib/contact";
import { researchAreas } from "@/lib/research-areas";
import { doesNotProvide, provides, services } from "@/lib/services";
import "./about.css";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Tharros Canada is an independent research institute studying the trade, policy, industry and organizations that connect Canada and Europe, and the public data behind them.",
  path: "/about",
});

export default function AboutPage() {
  const contactEmail = researchEmail();
  const { lead, legal, profiles } = organization;
  // Until accountability details are verified, contact sits with Independence rather than in a near-empty section of its own.
  const hasAccountability = Boolean(lead || legal || profiles.length);
  const latest = [...publications].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0];
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

  const principles = [
    {
      title: "Start with the decision.",
      body: "The deliverable, source route, exclusions, timing and price are agreed in writing before research begins.",
      check: { label: "How commissions work", href: "/how-it-works" },
    },
    {
      title: "Separate fact from inference.",
      body: "Material facts are sourced and dated. Interpretation is identified. Unresolved uncertainty remains visible.",
      check: { label: "Human verification", href: "/methodology#human-research" },
    },
    {
      title: "Make the work inspectable.",
      body: "Public research identifies authorship, publication date, methodology, sources and material limitations.",
      // Changes with each new publication, so visual tests mask it (data-volatile).
      volatile: true,
      check: latest
        ? { label: latest.reference, href: `/research/${latest.slug}` }
        : { label: "Research archive", href: "/research" },
    },
    {
      title: "Stay relevant.",
      body: "Research is organized around the question, not the volume of material collected.",
      check: { label: "Research services", href: "/research-services" },
    },
  ];

  return (
    <>
      <header className="about-masthead">
        <h1>Independent research focused on Canada and Europe.</h1>
        <p className="about-deck">
          Tharros studies the trade, policy, industry and organizations connecting both markets, and
          tests the public data behind them.
        </p>
        <figure className="about-route">
          {/* The same great-circle route as the homepage map, cropped to a masthead rule. */}
          <svg viewBox="40 168 610 80" role="img" aria-labelledby="about-route-title">
            <title id="about-route-title">
              The 5,674 km great-circle route from Ottawa to Brussels
            </title>
            <path d={ROUTE} pathLength={1} />
            <circle cx="67.1" cy="235.5" r="3" />
            <circle cx="616.2" cy="186.4" r="3" />
          </svg>
          <p className="about-route-end is-ottawa" aria-hidden="true">
            <strong>Ottawa</strong> 45.42°N 75.70°W
          </p>
          <p className="about-route-distance" aria-hidden="true">
            5,674 km · the great-circle route between the two capitals
          </p>
          <p className="about-route-end is-brussels" aria-hidden="true">
            <strong>Brussels</strong> 50.85°N 4.35°E
          </p>
        </figure>
      </header>

      <section className="about-section" aria-labelledby="record-title">
        <div className="about-section-head ruled ruled-strong">
          <h2 id="record-title">The institute, on the record.</h2>
          <p>What exists today, counted from this site&rsquo;s own records.</p>
        </div>
        <dl className="about-ledger">
          <div>
            <dt>Published research</dt>
            {/* Both change with each publication; visual tests mask data-volatile. */}
            <dd className="about-count" data-volatile="">
              {publications.length}
            </dd>
            <dd data-volatile="">
              {latest ? (
                <>
                  Latest: <Link href={`/research/${latest.slug}`}>{latest.reference}</Link>, a{" "}
                  {latest.type} published {formatLongDate(latest.publishedAt)}.
                </>
              ) : (
                "The first publications are in preparation."
              )}
            </dd>
          </div>
          <div>
            <dt>Research areas</dt>
            <dd className="about-count">{researchAreas.length}</dd>
            <dd>
              The archive&rsquo;s fields: {researchAreas.map((area) => area.name).join(" · ")}.
            </dd>
          </div>
          <div>
            <dt>Sources in the register</dt>
            <dd className="about-count">{publicSources.length}</dd>
            <dd>
              Public routes the research can draw on, in Canada and the EU. A listing is not an
              endorsement. <Link href="/methodology#atlas-title">See the register</Link>.
            </dd>
          </div>
          <div>
            <dt>Research services</dt>
            <dd className="about-count">{services.length}</dd>
            <dd>
              {services.map((service) => service.name).join(" · ")}. No published prices; each is
              scoped in writing.
            </dd>
          </div>
        </dl>
      </section>

      <section className="about-section" id="principles" aria-labelledby="principles-title">
        <div className="about-section-head ruled ruled-strong">
          <h2 id="principles-title">Research principles.</h2>
          <p>Where each one shows on this site.</p>
        </div>
        <ol className="about-principles">
          {principles.map((principle, index) => (
            <li key={principle.title} id={index === 0 ? "method" : undefined} className="ruled">
              <h3>{principle.title}</h3>
              <div>
                <p>{principle.body}</p>
                <Link
                  className="about-check"
                  href={principle.check.href}
                  data-volatile={principle.volatile ? "" : undefined}
                >
                  {principle.check.label} <ArrowIcon />
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-section" id="independence" aria-labelledby="independence-title">
        <div className="about-independence-lead">
          <h2 id="independence-title">Independent from the sources it studies.</h2>
          <p>
            Tharros Canada is an independent research institute, not a government body. Naming a
            public source identifies it; it never implies endorsement or affiliation.
          </p>
          {!hasAccountability && (
            <div className="about-contact" id="contact">
              {contactLine}
            </div>
          )}
        </div>
        <div className="boundary">
          <div className="boundary-inside">
            <h3>Tharros provides</h3>
            <ul>
              {provides.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="boundary-outside">
            <h3>Outside the boundary</h3>
            <ul>
              {doesNotProvide.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>Endorsement by, or affiliation with, the sources it names</li>
            </ul>
          </div>
        </div>
      </section>

      {hasAccountability && (
        <section className="about-section about-accountability" id="contact">
          <div className="about-section-head ruled ruled-strong">
            <h2>{lead ? "Who is accountable." : "Contact."}</h2>
          </div>
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
