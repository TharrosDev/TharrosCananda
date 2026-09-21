import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ResearchArchive } from "@/components/research-archive";
import { publications, publicationTypes } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";

export const metadata: Metadata = {
  title: "Research Archive",
  description: "The Tharros Canada research archive for Canada–Europe trade, defence, energy, industry and technology research.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        variant="document"
        title="Research archive."
        description="A permanent index for Tharros Canada papers, briefs, data notes and sector analyses as verified work is published."
      />
      <section className="section archive-page">
        <div className="archive-intro">
          <p>
            The archive is intentionally empty until the first public research is complete. No placeholder reports, invented
            findings or synthetic publications are listed as evidence.
          </p>
          <Link href="/methodology" className="text-link">Research standards and sources <ArrowIcon /></Link>
        </div>
        <ResearchArchive publications={publications} areas={researchAreas} publicationTypes={publicationTypes} />
      </section>
      <section className="closing-cta">
        <h2>Need an answer before it appears in the archive?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
