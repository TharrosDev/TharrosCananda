import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
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
      <header className="research-hero">
        <div className="research-hero-copy"><p>Tharros research</p><h1>A living index of work that exists.</h1><p>Independent research on the commercial, economic, industrial, technological and strategic ties between Canada and Europe—released only when it is ready to be inspected.</p></div>
        <div className="research-hero-manifest">
          <span>Each publication carries</span>
          <ol><li>Named authorship</li><li>Executive summary</li><li>Methodology</li><li>Sources & limitations</li><li>Stable URL</li></ol>
        </div>
      </header>
      <section className="archive-principle"><p>Search titles, summaries and tags. Filter by research area, publication type and date. Cite the stable record.</p><Link href="/methodology">Read the research standard <ArrowIcon /></Link></section>
      <section className="section section--compact archive-page">
        <ResearchArchive publications={publications} areas={researchAreas} publicationTypes={publicationTypes} />
      </section>
      <section className="closing-cta">
        <h2>Need an answer before it appears in the archive?</h2>
        <Link className="button-primary" href="/request-research">Commission research <ArrowIcon /></Link>
      </section>
    </>
  );
}
