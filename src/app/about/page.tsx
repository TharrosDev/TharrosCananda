import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
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
      <PageHero
        variant="document"
        title="Independent commercial research between Canada and Europe."
        description="Tharros Canada assembles scattered public evidence into concise, decision-oriented commercial research across trade, defence, energy, industry and strategic technology."
        index={[
          { label: "Why Canada–Europe", href: "#relationship" },
          { label: "How the work is done", href: "#method" },
          { label: "Research accountability", href: "#accountability" },
          { label: "Independence", href: "#independence" },
        ]}
      />
      <section className="section about-story">
        <div>
          <h2 id="relationship">Why Canada–Europe</h2>
          <p>Commercial questions across Canada and Europe cut across trade agreements, procurement systems, industrial strategies, company activity and public data held by different institutions. Tharros focuses on that relationship rather than operating as a general-purpose consultancy.</p>

          <h2 id="method">How the work is done</h2>
          <p>Evidence is assembled from public datasets, procurement notices, company records, policy documents and sector sources on both sides of the Atlantic. Material facts are sourced and dated; interpretation and unresolved uncertainty are kept distinct from verified facts.</p>
          <p>Commissioned work starts from a written scope. The deliverable, source approach, exclusions, price and timing are agreed before research begins.</p>

          <h2 id="accountability">Research accountability</h2>
          <p>Public Tharros research identifies authorship, publication date, sources, methodology and material limitations. Internally initiated work is presented as independent Tharros research; commissioned work is described as such only where that is factually accurate and publication is permitted.</p>
        </div>
        <aside id="independence">
          <strong>Independent of government.</strong>
          <p>Tharros Canada is a commercial research operation. References to public institutions identify sources only and do not imply endorsement, affiliation or access to non-public information.</p>
          <p>Tharros does not provide legal, tax, regulatory, lobbying or investment advice.</p>
          {contactEmail && <p><a href={`mailto:${contactEmail}`}>{contactEmail}</a></p>}
        </aside>
      </section>
      <section className="closing-cta">
        <h2>Have a question that needs research?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
