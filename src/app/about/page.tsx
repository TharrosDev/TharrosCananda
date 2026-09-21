import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { researchEmail } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About",
  description: "Tharros Canada is an independent commercial research and intelligence company focused on Canada–Europe relations.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const contactEmail = researchEmail();

  return (
    <>
      <PageHero
        variant="document"
        title="Independent commercial research between Canada and Europe."
        description="Tharros Canada is built to assemble scattered public evidence into concise, decision-oriented commercial research without pretending that public indicators establish more than they do."
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
          <p>Commercial questions across Canada and Europe cut across trade agreements, procurement systems, industrial strategies, company activity and public data held by different institutions. Tharros focuses on that relationship rather than presenting itself as a general-purpose consultancy.</p>

          <h2 id="method">How the work is done</h2>
          <p>Evidence is assembled from public datasets, procurement notices, company records, policy documents and sector sources on both sides of the Atlantic. Material facts are sourced and dated; interpretation is labelled as interpretation.</p>
          <p>Commissioned work starts from a written scope you approve. The deliverable, source approach, exclusions, price and timing are agreed before research begins.</p>

          <h2 id="accountability">Research accountability</h2>
          <p>Public research is structured to carry named authorship when a piece is released. Commissioned work identifies responsibility in the approved scope. The site does not publish invented team profiles, client logos, testimonials or institutional affiliations to imply scale that has not been verified.</p>
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
