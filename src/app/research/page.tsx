import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { Suspense } from "react";
import { ResearchArchive, ResearchArchiveWithUrl } from "@/components/research-archive";
import { publications, publicationTypes } from "@/data/publications";
import { buildArchiveDocs } from "@/lib/archive";
import { researchAreas } from "@/lib/research-areas";
import { publicationCounts } from "@/lib/metrics";
import { reportAsset, reportText } from "@/lib/reports";
import "./research.css";

export const metadata: Metadata = pageMetadata({
  title: "Research",
  description:
    "Published Tharros Canada research and data notes on trade, defence, energy, industry, technology and public data across Canada and Europe, searchable in full text.",
  path: "/research",
});

export default async function ResearchPage() {
  // Built at build time: metadata plus each PDF's extracted text, so search reaches inside reports.
  const docs = buildArchiveDocs(publications, reportAsset, reportText);
  const counts = await publicationCounts();
  const archive = { docs, areas: researchAreas, types: publicationTypes, counts };

  return (
    <>
      <header className="research-banner">
        <h1>Published research.</h1>
        <div className="research-banner-deck">
          <p>
            Find a question. Follow its evidence. Search the reports and explore the sources and
            limitations behind each one.
          </p>
          <Link href="/methodology" className="research-method-link">
            How the research is made <ArrowIcon />
          </Link>
        </div>
      </header>
      <section className="archive-page" aria-label="Research">
        {/* Without JavaScript (or before hydration) the default view renders; the URL-aware tool takes over after. */}
        <Suspense fallback={<ResearchArchive {...archive} />}>
          <ResearchArchiveWithUrl {...archive} />
        </Suspense>
      </section>
    </>
  );
}
