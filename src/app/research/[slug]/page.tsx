import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { ReportViewer } from "@/components/report/report-viewer";
import { reportAsset } from "@/lib/reports";
import { allPublications, publicationBySlug } from "@/data/publications";

export function generateStaticParams() {
  return allPublications.map((publication) => ({ slug: publication.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const publication = publicationBySlug(slug);
  if (!publication) return {};
  return {
    title: publication.title,
    description: publication.summary,
    alternates: { canonical: `/research/${publication.slug}` },
    openGraph: {
      type: "article",
      title: publication.title,
      description: publication.summary,
      publishedTime: publication.publishedAt,
      authors: publication.authors,
    },
  };
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publication = publicationBySlug(slug);
  if (!publication) notFound();

  // Placeholder until the report page is rebuilt around the PDF viewer (plan Task 6).
  const asset = reportAsset(publication.slug);
  return (
    <>
      <PageHero variant="document" title={publication.title} description={publication.summary} />
      {asset && <ReportViewer file={asset.file} pages={asset.pages} title={publication.title} />}
    </>
  );
}
