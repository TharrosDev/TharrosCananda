import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "About Tharros Canada's independent research on Canada–Europe relations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <header className="about-hero"><p>About Tharros Canada</p><h1>Independent research focused on Canada and Europe.</h1><div><p>Tharros studies the trade, policy, industry and organizations connecting both markets.</p><Link href="#principles">Research principles <span aria-hidden="true">↓</span></Link></div></header>
      <section className="about-thesis" id="relationship"><div><span>CA</span><i aria-hidden="true" /><span>EU</span></div><p>The work brings together public data, policy, procurement and company records from both regions.</p></section>
      <section className="section about-principles" id="principles">
        <div className="about-principles-lead"><h2>Research principles.</h2><p>Sources, interpretation and limitations remain visible.</p></div>
        <ol>
          <li id="method"><span>01</span><h3>Start with the decision.</h3><p>The deliverable, source route, exclusions, timing and price are agreed in writing before research begins.</p></li>
          <li><span>02</span><h3>Separate fact from inference.</h3><p>Material facts are sourced and dated. Interpretation is identified. Unresolved uncertainty remains visible.</p></li>
          <li id="accountability"><span>03</span><h3>Make the work inspectable.</h3><p>Public research identifies authorship, publication date, methodology, sources and material limitations.</p></li>
          <li><span>04</span><h3>Stay relevant.</h3><p>Research is organized around the question, not the volume of material collected.</p></li>
        </ol>
      </section>
      <section className="about-independence" id="independence"><div><p>Independence</p><h2>Independent from the sources it studies.</h2></div><div><p>Tharros Canada is not a government body or think tank. Source names do not imply endorsement or affiliation.</p><p>Tharros does not provide legal, tax, regulatory, lobbying or investment advice.</p>{contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}</div></section>
      <section className="closing-cta">
        <h2>Have a question that needs research?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
