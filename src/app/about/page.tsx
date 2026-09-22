import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "Tharros Canada is an independent commercial research and intelligence business focused on Canada–Europe relations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <header className="about-hero"><p>About Tharros Canada</p><h1>Focused enough to know where to look. Independent enough to show the limits.</h1><div><p>Tharros is a commercial research operation built for questions that sit between Canada and Europe—where public evidence is abundant, fragmented and rarely organized around one decision.</p><Link href="#principles">How the work holds up <span aria-hidden="true">↓</span></Link></div></header>
      <section className="about-thesis" id="relationship"><div><span>CA</span><i aria-hidden="true" /><span>EU</span></div><p>Trade agreements, procurement systems, industrial strategies, company activity and official data do not live in one place. Tharros follows the relationship rather than pretending to cover every market.</p></section>
      <section className="section about-principles" id="principles">
        <div className="about-principles-lead"><h2>The operating principles.</h2><p>The work is designed to be useful, attributable and honest about what public evidence can—and cannot—establish.</p></div>
        <ol>
          <li id="method"><span>01</span><h3>Start with the decision.</h3><p>The deliverable, source route, exclusions, timing and price are agreed in writing before research begins.</p></li>
          <li><span>02</span><h3>Separate fact from inference.</h3><p>Material facts are sourced and dated. Interpretation is identified. Unresolved uncertainty remains visible.</p></li>
          <li id="accountability"><span>03</span><h3>Make the work inspectable.</h3><p>Public research identifies authorship, publication date, methodology, sources and material limitations.</p></li>
          <li><span>04</span><h3>Stay commercially useful.</h3><p>Research is organized around the decision, not the volume of material collected.</p></li>
        </ol>
      </section>
      <section className="about-independence" id="independence"><div><p>Independence</p><h2>No borrowed authority.</h2></div><div><p>Tharros Canada is not a government body or think tank. Public-institution names identify sources only and never imply endorsement, affiliation or access to non-public information.</p><p>Tharros does not provide legal, tax, regulatory, lobbying or investment advice.</p>{contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}</div></section>
      <section className="closing-cta">
        <h2>Have a question that needs research?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
