import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { ResearchArchive } from "@/components/research-archive";
import { publications, publicationTypes } from "@/data/publications";
import { researchAreas } from "@/lib/research-areas";

export const metadata: Metadata = {
  title: "Research Archive",
  description:
    "Independent Tharros Canada research on Canada–Europe trade, defence, energy, industry and technology.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <>
      <header className="research-hero">
        <div className="research-hero-copy">
          <p>Research archive</p>
          <h1>Canada–Europe research.</h1>
          <p>Browse published work by area, format and date.</p>
        </div>
        <div className="research-hero-manifest">
          <span>Each publication carries</span>
          <ol>
            <li>Named authorship</li>
            <li>Executive summary</li>
            <li>Methodology</li>
            <li>Sources & limitations</li>
            <li>Stable URL</li>
          </ol>
        </div>
      </header>
      <section className="archive-principle">
        <p>Search titles, summaries and tags, or filter by area, format and date.</p>
        <Link href="/methodology">
          Methodology <ArrowIcon />
        </Link>
      </section>
      <section className="section section--compact archive-page">
        <ResearchArchive
          publications={publications}
          areas={researchAreas}
          publicationTypes={publicationTypes}
        />
      </section>
      <section className="closing-cta">
        <h2>Need research on a specific question?</h2>
        <Link className="button-primary" href="/request-research">
          Commission research <ArrowIcon />
        </Link>
      </section>
    </>
  );
}
