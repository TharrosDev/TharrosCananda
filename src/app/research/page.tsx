import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ResearchArchive } from "@/components/research-archive";
import { publications, publicationTypes } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";

export const metadata: Metadata = {
  title: "Research Archive",
  description: "Independent Tharros Canada research on Canada–Europe trade, defence, energy, industry and technology.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <PageHero
        variant="document"
        title="Research archive."
        description="Independent Tharros Canada insights, briefs, data notes and reports are indexed here as they are released."
      />
      <section className="section section--compact archive-page">
        <div className="archive-intro">
          <p>Publications are added only when the underlying research is complete and ready to source, date and attribute.</p>
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
