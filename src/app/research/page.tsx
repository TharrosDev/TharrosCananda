import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { Suspense } from "react";
import { ResearchArchive, ResearchArchiveWithUrl } from "@/components/research-archive";
import { allPublications, publicationTypes } from "@/data/publications";
import { buildArchiveDocs } from "@/lib/archive";
import { researchAreas } from "@/lib/research-areas";
import { reportAsset, reportText } from "@/lib/reports";

export const metadata: Metadata = pageMetadata({
  title: "Canada–Europe Research Archive",
  description:
    "Independent Tharros Canada research on Canada–Europe trade, defence, energy, industry and technology, searchable in full text.",
  path: "/research",
});

export default function ResearchPage() {
  // Built at build time: metadata plus each PDF's extracted text, so search reaches inside reports.
  const docs = buildArchiveDocs(allPublications, reportAsset, reportText);
  const archive = { docs, areas: researchAreas, types: publicationTypes };

  return (
    <>
      <header className="research-hero">
        <div className="research-hero-copy">
          <p>Research archive</p>
          <h1>Canada–Europe research.</h1>
          <p>Search every report in full, or browse by area, format and year.</p>
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
        <p>Every report records its sources, retrieval dates and limitations.</p>
        <Link href="/methodology">
          Methodology <ArrowIcon />
        </Link>
      </section>
      <section className="section section--compact archive-page">
        {/* Without JavaScript (or before hydration) the default view renders; the URL-aware tool takes over after. */}
        <Suspense fallback={<ResearchArchive {...archive} />}>
          <ResearchArchiveWithUrl {...archive} />
        </Suspense>
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
