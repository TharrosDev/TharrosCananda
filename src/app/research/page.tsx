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
  title: "Publications",
  description:
    "Explore published work at Tharros Undergraduate Publishing. Search full-text publications, inspect their sources and download the original PDFs.",
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
        <h1>Publications.</h1>
        <div className="research-banner-deck">
          <p>
            Read the work. Follow its evidence. Search full-text publications and explore the
            sources and limitations behind each one. Our existing reports remain available as we
            prepare to welcome undergraduate work across disciplines.
          </p>
          <Link href="/submit" className="research-method-link">
            Prepare your own work <ArrowIcon />
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
